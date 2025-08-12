<template>
    <div class="d-flex justify-content-end mb-2">
        <!-- <span :id="`teleport-indicator-${indicator.identifier}`" class="me-1"></span> -->
        <CButton color="primary" size="sm" @click="showEditIndicatorData(target)" v-show="identifier" :disabled="disabled">
            {{ t('editIndicatorData') }}
        </CButton>
        <CButton color="primary" size="sm" @click="showEditIndicatorData(target)" v-show="!identifier" :disabled="disabled">
            {{ t('addIndicatorData') }}
        </CButton>
    </div>
    <CModal  class="show d-block nr7-add-indicator-data-modal" size="xl" alignment="center" backdrop="static" :visible="showEditIndicatorDataModal" >
        <CModalHeader :close-button="false">
            <CModalTitle>
                <km-term v-if="indicatorType!='otherNationalIndicators'" :value="indicator?.identifier" :locale="locale"></km-term>
                <span v-if="indicatorType=='otherNationalIndicators'">{{ lstring(indicator?.title||indicator) }}</span>
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
                            <template #validation-errors="{onJumpTo}" v-if="validationReport?.errors">
                                <km-validation-errors 
                                    :report="validationReport" :container="container" @on-jump-to="onJumpTo">
                                </km-validation-errors>
                            </template>
                            
                            <template #submission>   
                                <div class="mb-3">
                                    <CAccordion always-open id="mapping-accordion" class="mt-3 mb-3">                    
                                        <CAccordionItem :visible="true">
                                            <CAccordionHeader id="generalAccordion">
                                                {{ t('general') }}                       
                                            </CAccordionHeader>
                                            <CAccordionBody> 
                                                <km-form-group name="government" :caption="t('government')" required>
                                                    <km-government v-model="document.government"></km-government>                           
                                                </km-form-group>   

                                                <km-form-group name="languages" :caption="t('pleaseSelectLanguage')" required>
                                                    <km-languages v-model="document.header.languages"></km-languages>
                                                </km-form-group>                                
                                            </CAccordionBody>
                                        </CAccordionItem>
                                    </CAccordion>   
                                    <div class="card">
                                        <div class="card-header bg-secondary">
                                            {{ t('data') }}
                                        </div>
                                        <div class="card-body">
                                            
                                            <km-form-check-group name="sourceOfData" required :caption="t('sourceOfData')">
                                                <km-form-check-item type="radio" name="sourceOfData"  for="sourceOfData" id="sourceOfDataNational"         @update:modelValue="onSourceOfDataChange"  value="national"          v-model="document.sourceOfData" label="Use national data set " />
                                                <km-form-check-item type="radio" name="sourceOfData"  for="sourceOfData" id="sourceOfDataAvailableDataset" @update:modelValue="onSourceOfDataChange"  value="availableDataset"  v-model="document.sourceOfData" label="Use the available data (pre-populated data)" />
                                                <km-form-check-item type="radio" name="sourceOfData"  for="sourceOfData" id="sourceOfDataNoData"           @update:modelValue="onSourceOfDataChange"  value="noData"            v-model="document.sourceOfData" label="No data available"/>
                                                <km-form-check-item type="radio" name="sourceOfData"  for="sourceOfData" id="sourceOfDataNotRelevant"      @update:modelValue="onSourceOfDataChange"  value="notRelevant"       v-model="document.sourceOfData" label="Not relevant"/>                                            
                                            </km-form-check-group>
                                            
                                            <km-form-group name="sourceOfDataInfo" :caption="t(document.sourceOfData =='noData' ? 'sourceOfDataInfoNoData' : 'sourceOfDataInfoNotRelevant')" v-if="showSourceOfDataInfo" required>                                  
                                                <km-input-lstring id="sourceOfDataInfo" :placeholder="t('sourceOfDataInfo')" 
                                                    v-model="document.sourceOfDataInfo" :locales="document.header.languages">
                                                </km-input-lstring>                                                       
                                            </km-form-group>  
                                            <div v-show="document.sourceOfData=='national'">
                                                <km-form-group name="data" required :caption="t('nationalDataSet')" >
                                                    <div class="alert alert-info">                                                    
                                                        <indicator-sample-data :indicator="indicator"
                                                        :indicator-type="indicatorType"></indicator-sample-data>
                                                        <strong class="d-block h-3">
                                                            {{ t('fileFormatMessage') }}
                                                        </strong>
                                                    </div>
                                                    <div class="alert alert-danger" v-if="fileError">
                                                        <strong>
                                                            {{ t(fileError.error, fileError.params) }}
                                                        </strong>
                                                    </div>
                                                    <!-- <input type="file" id="dataSetFile" ref="dataSetFile" @change="uploadFile"/>  -->
                                                    <national-indicator-data :indicators="[indicator]" @on-data-load="onDataLoad"
                                                        :indicator-type="indicatorType"></national-indicator-data>
                                                                                           
                                                </km-form-group> 
                                                                                 
                                            </div>

                                            <km-form-group name="availableDataset" required :caption="t('globalDataSet')" v-show="document.sourceOfData=='availableDataset'">
                                        
                                                <div class="mt-3" v-show="!isFetchingGlobalData && !wcmcIndicatorData.data?.charts?.length">
                                                    <CAlert color="info" class="d-flex align-items-center">
                                                        <font-awesome-icon icon="fa-solid fa-info" class="flex-shrink-0 me-2 fa-2x "/>
                                                          <strong>{{ t('noGlobalDataIndicator') }}</strong>
                                                          (<a :href="targetTrackerUrl" target="_blank">
                                                            {{ targetTrackerUrl }} 
                                                            <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square"/>
                                                          </a>)
                                                    </CAlert>
                                                </div>
                                                <div class="mt-3" v-show="isFetchingGlobalData">
                                                    <km-spinner></km-spinner>
                                                </div>
                                            </km-form-group>

                                            <km-form-group v-show="document.sourceOfData" name="comments" :caption="t('comments')">
                                                <km-input-rich-lstring v-model="document.comments" :locales="document.header.languages" :identifier="cleanDocument?.header?.identifier"></km-input-rich-lstring>
                                            </km-form-group>         
                                        </div>
                                    </div> 
                                </div>                                 
                            </template>
                            <template #review>
                                <nr7-view-indicator-data v-if="cleanDocument.indicator" :indicator-data="cleanDocument">
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
<script setup lang="ts">
//@ts-nocheck
    import { useToast } from 'vue-toast-notification';
    import { EditFormUtility } from "@/services/edit-form-utility";
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import readXlsxFile from 'read-excel-file';
    import {cloneDeep} from 'lodash';
    import { useCountriesStore } from '@/stores/countries';
    import { IndicatorsMappingData } from '~/app-data/indicators';
    import { nationalReport7Service } from '~/services/national-report-7-service';

    const props = defineProps({
        identifier         : {type:String, required:false},
        indicator          : {type:Object, required:true},
        indicatorType      : {type:String, required:true},
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
    const documentInfo               = ref({});
    const isLoading                  = ref(false);
    const showEditIndicatorDataModal = ref(false);
    const fileError                  = ref(null);
    const dataSetFile                = ref(null);       
      //TODO: Temp, move to service 
    const isFetchingGlobalData = ref(false);
    const wcmcTargets          = ref([]);
    const wcmcIndicatorData    = ref([])
    
    const showSourceOfDataInfo = computed(()=>{
        return ['noData', 'notRelevant'].includes(document.value.sourceOfData)
    });

    const targetTrackerUrl = computed(()=>{
        const country = countryStore.countries.find(e=>e.code == document.value.government?.identifier?.toUpperCase());
        if(country)
            return `https://target-tracker.org/en/country/${country.code3}`;

        return `https://target-tracker.org/en`;
    });

    const indicatorData = computed(()=>{
        const { data, globalDataSources, globalDescription, globalIndicatorProviders,indicator } = document.value
        return { data, globalDataSources, globalDescription, globalIndicatorProviders, indicator };        
    });
  
    const cleanDocument = computed(()=>{
        const clean = useKmStorage().cleanDocument({...document.value});
        
        clean.dataSources = undefined;
        clean.description = undefined;
        clean.indicatorProviders = undefined;
        return clean
    });

    const onPostClose = async (document)=>{
               
        documentInfo.value.body = document
        if(isEventDefined('onClose'))
            emit('onClose', documentInfo.value);

        showEditIndicatorDataModal.value = false;
    }

    const onPreSaveDraft = async (document)=>{
        return document;
    };

    const onPostSaveDraft = async (document)=>{
        //vue prepends 'on' to all events internally
        if(isEventDefined('onPostSaveDraft'))
            emit('onPostSaveDraft', document);
        
        documentInfo.value = document
    };

    const onPreReviewDocument = (document)=>{
        return document;
    }
    
    const onPostReviewDocument = (document, newValidationReport)=>{
        validationReport.value = cloneDeep(newValidationReport);
    }

    const onGetDocumentInfo = async ()=>{
        return documentInfo.value;
    }
    
    function onDataLoad(data){
        const { code } = nationalReport7Service.getIndicatorDataMapping(props.indicator as ETerm, props.indicatorType, locale.value) || {};        
        document.value.data = data[code];
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

                        if(globallyDerivedData.dataSources?.length)
                            document.value.globalDataSources =  globallyDerivedData.dataSources.map(e=>({name:e.title, url:e.link}));

                        if(globallyDerivedData.indicatorProviders?.length)
                            document.value.globalIndicatorProviders =  globallyDerivedData.indicatorProviders.map(e=>({name:e.title, url:e.link}))

                        document.value.globalDescription = globallyDerivedData.description
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
                documentInfo.value = await EditFormUtility.load(props.identifier, SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA)
                document.value = documentInfo.value.body;
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
        onPostClose,
        onGetDocumentInfo
    });

    provide("validationReview", {
        hasError : (name)=>validationReport.value?.errors?.find(e=>e.property == name)
    });

</script>
<style>
    
</style>

