    <template>
        <km-form-group>            
            <div class="alert alert-danger" v-if="fileError">
                <strong>
                    {{ t(fileError.error, fileError.params) }}
                </strong>
            </div>
            <input type="file" id="dataSetFile" ref="dataSetFile" @change="uploadFile" 
                @click="clearFileInput" v-if="indicators?.length"/>                                                
        </km-form-group> 
        
        <div class="card mt-3 mb-3" v-if="indicatorBadData['unused']">
            <div class="card-header">{{t('noLinkedData')}}</div>
            <div class="card-body">
                <div class="alert alert-danger">
                    {{t('noLinkedDataDescription')}}
                </div>
                <indicator-data-table :indicator-data="indicatorBadData['unused']" :indicator-type="indicatorType" :indicator-code="''"></indicator-data-table>
            </div>
        </div>
        <div class="card" v-for="(data, key) in indicatorDataToDisplay" :key="key">
            <div class="card-header">{{ t('indicatorCode') }} {{ key }}</div>
            <div class="card-body">
                <div class="mt-3 mb-3" v-if="indicatorBadData[key]?.length">
                    <div class="alert alert-danger">
                        {{t('failedValidation')}}
                    </div>
                    <indicator-data-table :indicator-data="indicatorBadData[key]" :indicator-type="indicatorType"  :indicator-code="key"></indicator-data-table>
                </div>
                <div class="mt-3 mb-3" v-if="data?.length">
                    <div class="alert alert-success">{{ t('validData') }}</div>
                    <indicator-data-table :indicator-data="data" :indicator-type="indicatorType"  :indicator-code="key"></indicator-data-table>
                </div>
            </div>
        </div>
    </template>

    <i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/indicator-data/national-indicator-data.json"></i18n>

    <script setup lang="ts">

    import { defineProps,defineEmits } from "vue";
    import readXlsxFile from 'read-excel-file';
    import { filter, isNumber } from 'lodash';
    import { nationalReport7Service } from '~/services/national-report-7-service';
    import { ETerm } from "~/types/schemas/base/ETerm";
    import type { IndicatorData, IndicatorMapping } from "~/types/controls/indicator-mapping";
    
        type FileError = { error: string; params: Record<string, any> } | null;

        const props = defineProps({
            indicators          : {type:Array<ETerm>, required:true},
            indicatorType       : {type:String, required:true },
            existingIndicatorData: {type: Array<IndicatorData> , default: () => ([])}
        });
        const emit = defineEmits(['onDataLoad'])

        const {$appRoutes:appRoutes }   = useNuxtApp();
        const {t, locale }          = useI18n()
        
        const selectedLocale             = ref(locale.value);
        const isLoading                  = ref(false);
        const fileError                  = ref<FileError>(null);
        const dataSetFile                = ref(null);   
        const indicatorData              = ref<Record<string, IndicatorData[]>>({});
        const indicatorBadData           = ref<Record<string, IndicatorData[]>>({});
        
        const indicatorDataToDisplay: ComputedRef<Record<string, IndicatorData[]>> = computed(()=>{
             if(Object.keys(indicatorData.value).length > 0)
                return indicatorData.value;

            const data:Record<string, IndicatorData[]>     = {};
            for(const indicator of props.indicators){
                const indicatorMapping = nationalReport7Service.getIndicatorDataMapping(indicator, props.indicatorType, locale.value);
                data[indicatorMapping.code] = filter(props.existingIndicatorData, (d)=>d.indicatorCode == indicatorMapping.code);
            }

            return data;
            
        });
        
        function clearFileInput() {
            // Clear the input's value to ensure the 'change' event fires on re-selection
            if (dataSetFile.value) {
                (dataSetFile.value as any).value = '';
            }
        }
        const uploadFile = async (event:Event) => {
            try{
                fileError.value = null;
                const target = event.target as HTMLInputElement;

                if (target.files && target.files.length > 0) {
                    const file = target.files[0];
                    const rows = await readXlsxFile(file)
                    // `rows` is an array of rows
                    // each row being an array of cells.
                    const columnKeys = {
                        'Indicator code' : 0, 
                        'Indicator' : 1, 
                        'Does this data row represent a disaggregation':2,
                        'Disaggregation' : 3, 
                        'Year' : 4, 
                        'Unit' : 5, 
                        'Value' : 6, 
                        'Footnote':7
                    };

                    const columns = Object.keys(columnKeys);
                                
                    if(rows[0].length != columns.length){
                        fileError.value = {
                            error : 'columnsMismatch',
                            params : {count:columns.length}
                        }
                        // alert('Your excel file is not following the template (column mismatch) expected columns are 8, please use the system provided template');
                        return;
                    }

                    for (let i = 0; i < columns.length; i++) {
                        if(rows[0][i].toString().toLowerCase() != columns[i].toLowerCase()){
                            fileError.value = {
                                error : 'columnsInvalid',
                                params : { colName:rows[0][i], colNo:i+1, colExpected : columns[i]}
                            }
                            // alert('Column name {rows[0][i]} is invalid at column no {i+1} expected name is {columns[i]}, please follow the sequence provided in the template');
                            return;
                        }
                    }
                    
                    const data:Record<string, IndicatorData[]>     = {};
                    const badData:Record<string, IndicatorData[]>  = {};

                    for(const indicator of props.indicators){
                        const indicatorMapping = nationalReport7Service.getIndicatorDataMapping(indicator, props.indicatorType, locale.value);

                        if(indicatorMapping == null)
                            continue;

                        const filteredData = rows.filter((row:object, index:number)=>index!=0).filter((e:any) =>e[0] == indicatorMapping?.code);
                        if(data[indicatorMapping.code] == null)
                            data[indicatorMapping.code] = [];
                        if(badData[indicatorMapping.code] == null)
                            badData[indicatorMapping.code] = [];

                        for (let i = 0; i < filteredData.length; i++) {
                            const row = filteredData[i];
                            //
                            if(!isNumber(row[columnKeys.Year]) || row[columnKeys.Unit] == null || row[columnKeys.Value] == null){
                                badData[indicatorMapping.code].push(formatRow(row));
                            }
                            else{
                                data[indicatorMapping.code].push(formatRow(row));
                            }
                        }
                    }  
                    
                    //add any rows that are not in good and bad data
                    const evaluatedData = [...Object.values(data).flat(), ...Object.values(badData).flat()]
                    const unUsedRows = rows
                        .filter((row:object, index:number)=>index!=0)
                        .filter((e:any) => !evaluatedData.find(d=>d.indicatorCode == e[0]))
                        .map(formatRow);
                    if(unUsedRows?.length){
                        badData['unused'] = unUsedRows;
                    }

                    indicatorData.value = data ;
                    indicatorBadData.value = badData;

                    emit('onDataLoad', data)
                    
                }
                
            }
            catch(e){
                useLogger().error(e as Error, 'Error loading file details');
            }
        };

        function formatRow(row:any):IndicatorData{
            return {
                indicatorCode    : row[0] as string,
                            // : row[1] is indicator name
                hasDisaggregation: row[2]?.toLowerCase() == 'no' ? false :  true as boolean,
                disaggregation   : row[3] as string,
                year             : Number(row[4]),
                unit             : row[5]?.toString(),
                value            : parseFloat(row[6] as string),
                footnote         : row[7] as string
            }
        }
    </script>
    <style>
        
    </style>

