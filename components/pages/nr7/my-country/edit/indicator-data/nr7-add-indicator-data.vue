<template>
    
    <div class="d-flex justify-content-end mb-2">
        <!-- <span :id="`teleport-indicator-${indicator.identifier}`" class="me-1"></span> -->
        <CButton color="primary" size="sm" @click="showEditIndicatorData(target)" v-if="identifier" :disabled="disabled">
            {{ t('editIndicatorData') }}
        </CButton>
        <CButton color="primary" size="sm" @click="showEditIndicatorData(target)" v-if="!identifier" :disabled="disabled">
            {{ t('addIndicatorData') }}
        </CButton>
    </div>
    <CModal  class="show d-block" size="xl" alignment="center" backdrop="static" @close="() => {showEditIndicatorDataModal=false}" :visible="showEditIndicatorDataModal" >
        <CModalHeader :close-button="false">
            <CModalTitle>
                {{lstring(indicator.title)}}
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CCard>
                <CCardBody>

                    <div  v-if="isLoading">
                        <km-spinner></km-spinner>
                    </div>
                    <form v-if="!isLoading && document" name="editForm">
                    
                        <km-form-workflow :focused-tab="workflowActiveTab" :document="cleanDocument"
                            :container="container">
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
                                            <div class="alert alert-info">
                                                <strong>Please note that source of data selection is disabled since its still under development.</strong>
                                            </div>
                                            <km-form-check-group name="sourceOfData" required caption="Source of Data">
                                                <km-form-check-item type="radio" name="sourceOfData"  for="sourceOfData" id="sourceOfDataNational"         @update:modelValue="onSourceOfDataChange"  value="national"          v-model="document.sourceOfData" label="Use national data set " :disabled="!enabledNationalData[indicator.identifier]"/>
                                                <km-form-check-item type="radio" name="sourceOfData"  for="sourceOfData" id="sourceOfDataAvailableDataset" @update:modelValue="onSourceOfDataChange"  value="availableDataset"  v-model="document.sourceOfData" label="Use the available data (pre-populated data)" :disabled="!enabledGlobalData[indicator.identifier]"/>
                                                <km-form-check-item type="radio" name="sourceOfData"  for="sourceOfData" id="sourceOfDataNoData"           @update:modelValue="onSourceOfDataChange"  value="noData"            v-model="document.sourceOfData" label="No data available"/>
                                                <km-form-check-item type="radio" name="sourceOfData"  for="sourceOfData" id="sourceOfDataNotRelevant"      @update:modelValue="onSourceOfDataChange"  value="notRelevant"       v-model="document.sourceOfData" label="Not relevant"/>                                            
                                            </km-form-check-group>

                                            <div v-if="document.sourceOfData=='national'">
                                                <km-form-group name="sourceOfDataNational" required caption="National data set" >
                                                    <div class="alert alert-info" v-if="indicatorDataTemplates[indicator.identifier]">
                                                        <a :href="indicatorDataTemplates[indicator.identifier]">
                                                            Download sample template for the Indicator 
                                                            <font-awesome-icon icon="fa-download"></font-awesome-icon>
                                                        </a>
                                                    </div>
                                                    <input type="file" id="input" @change="uploadFile"/>                                                
                                                </km-form-group>                                                
                                            </div>
                                            <km-form-group name="sourceOfDataNational" required caption="National data set" v-if="document.sourceOfData=='availableDataset'">
                                        
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

                                            <div class="mt-3 mb-3" v-if="indicatorData?.data">
                                                <view-data :indicator-data="indicatorData" v-if="indicatorData"></view-data>
                                            </div>

                                            <km-form-group v-if="document.sourceOfData" name="comments" caption="Comments">
                                                <km-input-rich-lstring v-model="document.comments" :locales="document.header.languages"></km-input-rich-lstring>
                                            </km-form-group>         
                                        </div>
                                    </div> 
                                </div>                                 
                            </template>
                            <template #review>
                                <nr7-view-indicator-data :indicator-data="document">
                                </nr7-view-indicator-data>
                            </template>
                        </km-form-workflow>
                    </form>

                </CCardBody>
            </CCard>
        </CModalBody>   
    </CModal>
</template>

<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/indicator-data/nr7-add-indicator-data.json"></i18n>
<script setup>
    import { useToast } from 'vue-toast-notification';
    import { EditFormUtility } from "@/services/edit-form-utility";
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import readXlsxFile from 'read-excel-file';
    import ViewData from './nr7-view-indicator-data.vue';
    import {cloneDeep} from 'lodash';
    import { useCountriesStore } from '@/stores/countries';

    const props = defineProps({
        identifier         : {type:String, required:false},
        indicator          : {type:Object, required:true},
        workflowActiveTab  : {type:Number, default:1 },
        disabled           : {type:Boolean, default:false}
    });

    // These emits are used by base view when the form is 
    // open in a dialog mode form overview
    const emit  = defineEmits(['onClose', 'onPostSaveDraft']);

    const isEventDefined        = useHasEvents();

    const { user }        = useAuth();
    const security        = useSecurity();
    const route           = useRoute();
    const {$appRoutes:appRoutes }   = useNuxtApp();
    const {t, locale }          = useI18n()
    const $toast                = useToast();        
    const container = useAttrs().container;
    const countryStore = useCountriesStore();
    
    const selectedLocale             = ref(locale.value);
    const validationReport           = ref(null);
    const document                   = ref({});
    const isLoading                  = ref(false);
    const showEditIndicatorDataModal = ref(false);
      //TODO: Temp, move to service 
    const isFetchingGlobalData = ref(false);
    const wcmcTargets          = ref([]);
    const wcmcIndicatorData    = ref([])

    const enabledNationalData = {
        'GBF-INDICATOR-C.1' : true,
        'GBF-INDICATOR-D.1' : true,
    }
    const enabledGlobalData = {
        'GBF-INDICATOR-C.1' : true,
        'GBF-INDICATOR-D.1' : true,
        'GBF-INDICATOR-A.3' : true
    }

    const indicatorDataTemplates = {
        'GBF-INDICATOR-C.1' : '/excel-templates/GBF-INDICATOR-C.1.xlsx',
        'GBF-INDICATOR-D.1' : '/excel-templates/GBF-INDICATOR-D.1.xlsx'
    }
    

    const indicatorData = computed(()=>{
        const { data, globalDataSources, globalDescription, globalIndicatorProviders } = document.value
        return { data, globalDataSources, globalDescription, globalIndicatorProviders };        
    });
  
    const cleanDocument = computed(()=>{
        const clean = useKmStorage().cleanDocument({...document.value});
        
        clean.dataSources = undefined;
        clean.description = undefined;
        clean.indicatorProviders = undefined;
        return clean
    });

    const onPostClose = async (document)=>{
        
        if(isEventDefined('onClose'))
            emit('onClose', document);

        showEditIndicatorDataModal.value = false;
    }

    const onPreSaveDraft = async (document)=>{
        return document;
    };

    const onPostSaveDraft = async (document)=>{
        // console.log(document);
        //vue prepends 'on' to all events internally
        if(isEventDefined('onPostSaveDraft'))
            emit('onPostSaveDraft', document);
    };

    const onPreReviewDocument = (document)=>{
        return document;
    }
    
    const onPostReviewDocument = (document, newValidationReport)=>{
        validationReport.value = newValidationReport.value || {};
    }
    
    const uploadFile = async (event) => {
        try{
            const file = event.target.files[0];
            const rows = await readXlsxFile(file)
                // `rows` is an array of rows
                // each row being an array of cells.

                if(!rows[0].some(e=>['year', 'value'].includes(e.toLowerCase()))){
                    alert('invalid template, please use the system provided template');
                    return;
                }
                const data = [];
                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i];
                    data.push({
                        indicatorCode    : row[0],
                                      // : row[1] is indicator globalDescription
                        hasDisaggregation: row[2] == 'no' ? 'false' :  true,
                        disaggregation   : row[3],
                        year             : Number(row[4]),
                        unit             : row[5],
                        value            : parseFloat(row[6]),
                        footnote         : row[7]
                    })
                }
                
                document.value.data = data;
            
        }
        catch(e){
            useLogger().error(e)
            $toast.error('Error loading file details')
        }
    };

    function onSourceOfDataChange(value){
        document.value.data = undefined;
        document.value.globalDataSources = undefined;
        document.value.globalDescription = undefined;
        document.value.globalIndicatorProviders = undefined;
        if(value == 'availableDataset'){
            loadGlobalDataSet()
        }
    }

    function showEditIndicatorData(target){        
        showEditIndicatorDataModal.value = true;
        loadDocument()
    }

    async function loadGlobalDataSet(){
        try{
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
            if(indicator){
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
                                        indicatorCode : indicator?.cbdIndicator?.identifier?.replace(/gbf\-indicator\-/i, ''),//dataResponse?.data?.globallyDerivedData?.title,
                                        hasDisaggregation : e.dataGroupName != "Aggregated" ? false : true,
                                        disaggregation    : e.dataGroupName != "Aggregated" ? 'none' : '',
                                        year : Number(e.replace(/Baseline|\(|\)/g, '')),
                                        value: parseFloat(val),
                                        unit: dataResponse?.data?.globallyDerivedData?.valueSuffix
                                    }
                                });

                    
                    const globallyDerivedData = dataResponse?.data?.globallyDerivedData;
                    if(globallyDerivedData){

                        if(globallyDerivedData.globalDataSources?.length)
                            document.value.globalDataSources =  globallyDerivedData.globalDataSources.map(e=>({name:e.title, url:e.link}));

                        if(globallyDerivedData.globalIndicatorProviders?.length)
                            document.value.globalIndicatorProviders =  globallyDerivedData.globalIndicatorProviders.map(e=>({name:e.title, url:e.link}))

                        document.value.globalDescription = globallyDerivedData.globalDescription
                    }
                }
            }
        }
        isFetchingGlobalData.value = false;
        }
        catch(e){
            useLogger().error(e)
            $toast.error('Error loading document')
        }
        finally{
            isFetchingGlobalData.value = false;
        }
    }

    async function loadDocument(){
        try{
            isLoading.value = true;
            if(props.identifier){
                const documentInfo = await EditFormUtility.load(props.identifier, SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA)
                document.value = documentInfo.body;
            }
            else{
                document.value = EditFormUtility.buildEmptyDocument(SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA,
                {
                    indicator : {
                        identifier: props.indicator.identifier
                    }
                });
                //TODO:validate if there is a mapping record for the given target and load it instead
            }       
        }
        catch(e){
            useLogger().error(e)
            $toast.error('Error loading loadGlobalDataSet')
        }
        finally{
            isLoading.value = false;
        }
    }

    provide('kmWorkflowFunctions', {
        onPreReviewDocument,
        onPreSaveDraft,
        onPostSaveDraft,
        onPostReviewDocument,
        onPostClose
    });

    provide("validationReview", {
        hasError : (name)=>validationReport.value?.errors?.find(e=>e.property == name)
    });

</script>
<style>
    
</style>

