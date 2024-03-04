<template>
    
    <div class="d-grid justify-content-end mb-2">
        <CButton color="primary" size="sm" @click="showEditIndicatorData(target)" v-if="props.identifier" :disabled="props.disabled">
            {{ t('editIndicatorData') }}
        </CButton>
        <CButton color="primary" size="sm" @click="showEditIndicatorData(target)" v-if="!props.identifier" :disabled="props.disabled">
            {{ t('addIndicatorData') }}
        </CButton>
    </div>
    <CModal  class="show d-block" size="xl" alignment="center" backdrop="static" @close="() => {showEditIndicatorDataModal=false}" :visible="showEditIndicatorDataModal" >
        <CModalHeader :close-button="false">
            <CModalTitle>
                {{lstring(props.indicator.title)}}
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CCard>
                <CCardBody>

                    <div  v-if="isLoading">
                        <km-spinner></km-spinner>
                    </div>
                    <form v-if="!isLoading && document" name="editForm">
                    
                        <km-form-workflow :focused-tab="props.workflowActiveTab" :get-document="onGetDocument" :validation-report="validationReport" 
                            :container="container" :on-pre-close="onClose" :on-post-save-draft="onPostSaveDraft">
                            <template #submission>   
                                <div class="mb-3">
                                    <CAccordion always-open id="mapping-accordion" class="mt-3 mb-3">                    
                                        <CAccordionItem :visible="true">
                                            <CAccordionHeader id="generalAccordion">
                                                General                       
                                            </CAccordionHeader>
                                            <CAccordionBody> 
                                                <km-form-group name="government" caption="Government" required>
                                                    <km-government v-model="document.government"></km-government>                           
                                                </km-form-group>   

                                                <km-form-group name="languages" caption="Please select in which language(s) you wish to submit this record" required>
                                                    <km-languages v-model="document.header.languages"></km-languages>
                                                </km-form-group>                                
                                            </CAccordionBody>
                                        </CAccordionItem>
                                    </CAccordion>   
                                    <div class="card">
                                        <div class="card-header bg-secondary">
                                            Data
                                        </div>
                                        <div class="card-body">
                                            <km-form-group name="sourceOfData" required caption="Source of Data">
                                                <km-form-check-group>
                                                    <km-form-check-item type="radio" name="sourceOfData"  for="sourceOfData" id="sourceOfDataNational"         @update:modelValue="onSourceOfDataChange"  value="national"          v-model="document.sourceOfData.value" label="Use national data set "/>
                                                    <km-form-check-item type="radio" name="sourceOfData"  for="sourceOfData" id="sourceOfDataAvailableDataset" @update:modelValue="onSourceOfDataChange"  value="availableDataset"  v-model="document.sourceOfData.value" label="Use the available data (pre-populated data)"/>
                                                    <km-form-check-item type="radio" name="sourceOfData"  for="sourceOfData" id="sourceOfDataNoData"           @update:modelValue="onSourceOfDataChange"  value="noData"            v-model="document.sourceOfData.value" label="No data available"/>
                                                    <km-form-check-item type="radio" name="sourceOfData"  for="sourceOfData" id="sourceOfDataNotRelevant"      @update:modelValue="onSourceOfDataChange"  value="notRelevant"       v-model="document.sourceOfData.value" label="Not relevant"/>                                            
                                                </km-form-check-group>
                                            </km-form-group> 

                                            <km-form-group name="sourceOfDataNational" required caption="National data set" v-if="document.sourceOfData.value=='national'">
                                                <input type="file" id="input" @change="uploadFile"/>                                                
                                            </km-form-group>
                                            <km-form-group name="sourceOfDataNational" required caption="National data set" v-if="document.sourceOfData.value=='availableDataset'">
                                        
                                                <div class="mt-3" v-if="!isFetchingGlobalData && !wcmcIndicatorData.data?.charts?.length">
                                                    <CAlert color="danger" class="d-flex align-items-center">
                                                        <font-awesome-icon icon="fa-solid fa-info"/>
                                                        No global data found for this Indicator.
                                                    </CAlert>
                                                </div>
                                                <div class="mt-3" v-if="isFetchingGlobalData">
                                                    <km-spinner></km-spinner>
                                                </div>
                                            </km-form-group>

                                            <div class="mt-3" v-if="indicatorData?.data">
                                                <view-data :indicator-data="indicatorData" v-if="indicatorData"></view-data>
                                            </div>


                                            <km-form-group v-if="document.sourceOfData.value" name="comments" caption="Comments">
                                                <km-input-rich-lstring v-model="document.comments" :locales="document.header.languages"></km-input-rich-lstring>
                                            </km-form-group>         
                                        </div>
                                    </div> 
                                </div>                                 
                            </template>
                        </km-form-workflow>
                    </form>

                </CCardBody>
            </CCard>
        </CModalBody>   
    </CModal>
</template>

<script setup>
  
    import { KmInputRichLstring, KmSelect, KmFormGroup, KmValidationErrors,KmGovernment, KmLanguages,
        KmFormCheckGroup, KmFormCheckItem, KmInputLstring,KmSpinner, KmFormWorkflow
    } from "~/components/controls";
    import { useToast } from 'vue-toast-notification';
    import { EditFormUtility } from "@/services/edit-form-utility";
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import readXlsxFile from 'read-excel-file';
    import ViewData from './nr7-view-indicator-data.vue';
    import {cloneDeep} from 'lodash';
    import { useCountriesStore } from '@/stores/countries';

    const props = defineProps({
        identifier         : {type:String, required:false},
        rawDocument        : {type: Object },
        indicator          : {type:Object, required:true},
        workflowActiveTab  : {type:Number, default:1 },
        onClose            : {type:Function, required:false},
        onPostSaveDraft    : {type:Function, required:false},
    }) 

    const { user }        = useAuth();
    const security        = useSecurity();
    const route           = useRoute();
    const {$appRoutes:appRoutes }   = useNuxtApp();
    const {t, locale }          = useI18n()
    const $toast                = useToast();        
    const container = useAttrs().container;
    const countryStore = useCountriesStore();
    
    const selectedLocale = ref(locale.value);
    const validationReport = ref(null);
    let document = ref({});
    let isLoading = ref(false);
    const showEditIndicatorDataModal = ref(false);
    //TODO: Temp, move to service 
    const isFetchingGlobalData = ref(false);
    const wcmcTargets = ref([]);
    const wcmcIndicatorData = ref([])
    

    const indicatorData = computed(()=>{
        const { data, dataSources, description, indicatorProviders } = document.value
        return { data, dataSources, description, indicatorProviders };        
    });
  
    if(props.rawDocument){
        document.value = cloneDeep({...props.rawDocument});
    }
    else{
        document.value = emptyDocument();
        //TODO:validate if there is a mapping record for the given target and load it instead
    }
    if(!document.value.sourceOfData)
        document.value.sourceOfData = {};

    const cleanDocument = computed(()=>{
        const clean = useKmStorage().cleanDocument({...document.value});
        
        return clean
    });

    function onGetDocument(){
        return cleanDocument;
    }

    const onClose = async (document)=>{
        if(props.onClose)
            props.onClose(document);

        showEditIndicatorDataModal.value = false;
    }

    const onPostSaveDraft = async (document)=>{
        if(props.onPostSaveDraft)
            props.onPostSaveDraft(document)
    }
    function emptyDocument(){        

        return {
            header : {
                schema : SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA,
                identifier : useGenerateUUID(),
                languages  : EditFormUtility.getPreferredEditLanguages()
            },        
            government : {
                identifier : user.value?.government
            },
            indicator : {
                identifier: props.indicator.identifier
            }
        }
    }

    const uploadFile = (event) => {
        const file = event.target.files[0];
        readXlsxFile(file).then((rows) => {
            // `rows` is an array of rows
            // each row being an array of cells.

            if(!rows[0].some(e=>['year', 'value'].includes(e.toLowerCase()))){
                alert('invalid template, please use the system provided template');
                return;
            }
            const data = [];
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                data.push({year : row[0], value: row[1]})
            }
            
            document.value.data = data;
        })
    };

    function onSourceOfDataChange(value){
        document.value.data = undefined;
        document.value.dataSources = undefined;
        document.value.description = undefined;
        document.value.indicatorProviders = undefined;
        if(value == 'availableDataset'){
            loadGlobalDataSet()
        }
    }

    function showEditIndicatorData(target){        
        showEditIndicatorDataModal.value = true;
    }

    async function loadGlobalDataSet(){
        wcmcIndicatorData.value = [];
        if(!document.value?.indicator?.identifier)
            return;

        isFetchingGlobalData.value = true;
        //1. get list of targets and its indicator https://tt-backend.new-web-supported-staging.linode.unep-wcmc.org/api/goalsTargets
        //2. map indicator with cbd indicator
        //3. get indicator data using iso3 country and indicator id https://tt-backend.new-web-supported-staging.linode.unep-wcmc.org/api/indicator/country
            //{
            //     "indicator": 2,
            // "country": "IND"
            // }
        
        //1
        if(!wcmcTargets.value.length){
            const targets = await useAPIFetch('/target-tracker/goals-targets');
            const cbdIndicators = await GbfGoalsAndTargets.loadGbfHeadlineIndicator();
            wcmcTargets.value = targets.data.map(e=>e.indicators).flat().map(e=>{
                const cbdIndicator = cbdIndicators.find(cbd=>cbd.title.en.trim() == e.title.trim());
                if(cbdIndicator)
                    return {
                        ...e,
                        cbdIndicator
                    }
                return e;
            });
        }
        const country = countryStore.countries.find(e=>e.code == document.value.government.identifier.toUpperCase());

        if(document.value?.indicator?.identifier){
            const indicator = wcmcTargets.value.find(e=>e.cbdIndicator?.identifier == document.value?.indicator?.identifier);
            const body ={
                indicator: indicator.indicatorId,
                country  : country.code3
            }
            const dataResponse = await useAPIFetch('/target-tracker/country-indicator-data', {body, method:'POST' });
            wcmcIndicatorData.value = dataResponse;

            const globalData = dataResponse?.data?.charts?.filter(e=>e.tabType == 'GloballyDerived')
            if(globalData?.length) {
                const chart = globalData[0];
                const valueData = chart.datasets.find(e=>e.derived == "Global");
                
                document.value.data = chart.labels.map((e, index)=>{
                                const val = valueData?.data[index]
                                return {
                                    year : e.replace(/Baseline|\(|\)/g, ''),
                                    value: val
                                }
                            });

                
                const globallyDerivedData = dataResponse?.data?.globallyDerivedData;
                if(globallyDerivedData){
                    document.value.dataSources = globallyDerivedData.dataSources;
                    document.value.description = globallyDerivedData.description
                    document.value.indicatorProviders = globallyDerivedData.indicatorProviders
                }
            }
        }
        isFetchingGlobalData.value = false;
    }

</script>
<style>
    
</style>

