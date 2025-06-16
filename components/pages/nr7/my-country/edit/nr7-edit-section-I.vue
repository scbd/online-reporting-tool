<template>
    <CCard>
      <CCardHeader>
        <slot name="header">{{t('sectionI')}} {{t('sectionIDescription')}}</slot>
      </CCardHeader>
      <CCardBody>

        <div  v-if="nationalReport7Store.isBusy">
            <km-spinner center  ></km-spinner>
        </div>  
        <km-form-workflow v-if="!isBusy && !nationalReport7Store.isBusy && sectionIComputed"
            :focused-tab="props.workflowActiveTab" :document="cleanDocument" :admin-tags="['section-I']"
            :container="container" :validate-server-draft="true">
            <template #submission>
                <form  name="editForm">  
                    <km-form-group name="sectionI" class="visually-hidden">
                        <label class="form-label control-label" for="sectionI">
                            <span >{{ t('sectionMandatory') }}</span>                                            
                        </label>
                    </km-form-group>      
                
                    <div class="card mb-3" v-if="document?.header">
                        <div class="card-header bg-secondary">
                            {{t('general')}}
                        </div>
                        <div class="card-body">
                            <km-form-group name="government" :caption="t('government')" required>
                                <km-government v-model="document.government"></km-government>                           
                            </km-form-group>   

                            <km-form-group name="languages" :caption="t('selectLanguages')" required>
                                <km-languages v-model="document.header.languages" @update:modelValue="onLanguageChange"></km-languages>
                            </km-form-group>   
                        </div>
                    </div>
                    <div class="card" v-if="sectionIComputed">
                        <div class="card-body">       
                            <km-form-group required :caption="t('nationalAuthorities')" name="nationalAuthorities">
                                <km-input-rich-lstring v-model="sectionIComputed.nationalAuthorities" :locales="document.header.languages" :identifier="cleanDocument?.header?.identifier"></km-input-rich-lstring>
                            </km-form-group>  

                            <km-form-group required :caption="t('contactPerson')" name="contactPerson">                               
                                <km-input-lstring id="contactPerson" :placeholder="t('contactPerson')" v-model="sectionIComputed.contactPerson"
                                    :locales="document.header.languages"></km-input-lstring>
                            </km-form-group> 

                            <km-form-group required :caption="t('contactDetails')" name="contactDetails">
                                <km-input-lstring id="contactDetails" :placeholder="t('contactDetails')" v-model="sectionIComputed.contactDetails"
                                :locales="document.header.languages" :rows="3"></km-input-lstring>
                            </km-form-group>  

                            <km-form-group required :caption="t('preparationProcess')" name="processUndertaken">
                                <ul>
                                    <li>{{ t('coordination') }}</li>
                                    <li>{{ t('consultation') }}</li>
                                </ul>
                                <km-input-rich-lstring v-model="sectionIComputed.processUndertaken" :locales="document.header.languages" :identifier="cleanDocument?.header?.identifier"></km-input-rich-lstring>
                            </km-form-group>                                    
                        </div>
                    </div>
                </form>
            </template>
            <template #review>                
                <nr7-view-section-I :identifier="cleanDocument.header.identifier" :document="cleanDocument" :locales="cleanDocument.header.languages"></nr7-view-section-I>
            </template>
        </km-form-workflow>

        <km-modal-spinner :visible="showSpinnerModal" v-if="showSpinnerModal"></km-modal-spinner>
        

      </CCardBody>
    </CCard>
  
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-I.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
  
    import {cloneDeep } from 'lodash';
    import { useNationalReport7Store }    from '@/stores/nationalReport7';

    const props = defineProps({
        workflowActiveTab  : {type:Number, default:0 },
    }) 
    // These emits are used by base view when the form is 
    // open in a dialog mode form overview
    const emit  = defineEmits(['onClose', 'onPostSaveDraft'])

    const {t, locale }          = useI18n();     
    const nationalReport7Store  = useNationalReport7Store();
    const isBusy                = ref(true);
    const validationReport      = ref(null); 
    const container             = useAttrs().container;
    let document                = ref({});
    const isEventDefined        = useHasEvents();
    

    const sectionIComputed = computed(()=>document.value?.sectionI);

    const cleanDocument = computed(()=>{
        let clean = {...document.value};
        clean.sectionI = sectionIComputed.value;
        clean = useKmStorage().cleanDocument(clean);
        
        return clean;
    });

    const onPostClose = async (document)=>{
        
        if(isEventDefined('onClose'))
            emit('onClose', document);
        else{
            await useNavigateAppTo(appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_OVERVIEW);
        }
    }

    const onPreSaveDraft = async (document)=>{
        return document;
    };

    const onPostSaveDraft = async (document)=>{
        emit('onPostSaveDraft', document);
        nationalReport7Store.updateNationalReport(document);
    }

    const onPostReviewDocument = async(document, newValidationReport)=>{
        validationReport.value     = cloneDeep(newValidationReport);

        if(validationReport.value?.errors)
            validationReport.value.errors = validationReport.value?.errors?.filter(e=>e.parameters=='sectionI');


        return validationReport.value;
    }
    
    const onPreReviewDocument = (document)=>{
        return document;
    }
    const onGetDocumentInfo = async ()=>{
        return nationalReport7Store.nationalReportInfo;
    }

    const onLanguageChange = (languages)=>{
        console.log('onLanguageChange', document.value);
        console.log('onLanguageChange after', document.value);
        document.value =  removeUnusedLocales(document.value, languages);   
        console.log('onLanguageChange after', document.value);
    }

    function removeUnusedLocales(obj, locales){
        if(!obj || !locales) return obj;

        const isArray = Array.isArray(obj);
        if(isArray){
            return obj.map(item=>removeUnusedLocales(item, locales));
        }
        console.log(Object.keys(obj))
        Object.keys(obj).forEach(key=>{
            if(obj[key] && isLString(obj[key])){
                Object.keys(obj[key]).forEach(locale=>{
                    if(!locales.includes(locale)){
                        delete obj[key][locale];
                    }
                });                
            }
            else if(typeof obj[key] === 'object'){
                obj[key] = removeUnusedLocales(obj[key], locales);
            }
        });

        return obj;
    }

    async function init(){
        isBusy.value = true;

        try{
            await nationalReport7Store.loadNationalReport(undefined, true);
            

            if(!nationalReport7Store.nationalReport.sectionI){
                nationalReport7Store.nationalReport.sectionI = {};
            }                   
            document.value = cloneDeep(nationalReport7Store.nationalReport);
        }
        catch(e){
            useLogger().error(e,  'Error loading Section I')
        }

        isBusy.value = false;
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
    
    onMounted(()=>{
        // setTimeout(init, 200);
        init();
    })
</script>

