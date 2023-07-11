<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> Global Goals/Target Mapping</slot>
      </CCardHeader>
      <CCardBody>
       
        <form>
                <!-- {{ document }} -->

            <km-form-workflow :current-tab="1">
                <template #submission>
                    <km-form-group>
                        <div class="card">
                            <div class="card-header bg-secondary">
                                General
                            </div>
                            <div class="card-body">  
                                <km-form-group name="government" caption="Government" required>
                                    <km-select
                                        v-model="document.government.identifier"
                                        class="validationClass"
                                        label="name"
                                        track-by="code"
                                        value-key="code"
                                        placeholder="Government"
                                        :options="countryList"
                                        :disabled="!security.role.isAdministrator">
                                    </km-select>                                
                                </km-form-group>   

                                <km-form-group name="languages" caption="Please select in which language(s) you wish to submit this record" required>
                                    <km-select
                                        v-model="document.header.languages"
                                        class="validationClass"
                                        label="title"
                                        track-by="code"
                                        value-key="code"
                                        placeholder="Language of record"
                                        :options="formatedLanguages"
                                        :multiple="true"
                                        :allow-empty="false"
                                    >
                                    </km-select>
                                    <small v-if="document.header.languages && document.header.languages.length == 1" class="text-danger form-text">
                                        Minimum of one language is mandatory, please select another language to remove the last language.
                                    </small>
                                </km-form-group>  
                            </div>
                        </div>
                    </km-form-group>

                    <km-form-group>
                        <div class="card">
                            <div class="card-header bg-secondary">
                                Elements of the global targets
                            </div>
                            <div class="card-body">
                                
                                <km-form-group>
                                    <label class="form-label" for="elementOfGlobalTargetsinfo">Elements of the global targets addressed by national targets</label>
                                    <km-input-rich-lstring v-model="document.elementOfGlobalTargetsinfo" :locales="document.header.languages"></km-input-rich-lstring>
                                </km-form-group>
                                <km-form-group name="hasReferncePeriod" caption="Is there a reference period and national target which relates to the headline indicator?">
                                    <km-form-check-group>
                                        <km-form-check-item inline type="radio" name="hasReferncePeriod"  for="hasReferncePeriod" id="hasReferncePeriodYes" :value="true"  v-model="document.hasReferncePeriod" label="Yes"/>
                                        <km-form-check-item inline type="radio" name="hasReferncePeriod"  for="hasReferncePeriod" id="hasReferncePeriodNo"  :value="false" v-model="document.hasReferncePeriod" label="No"/>
                                    </km-form-check-group>
                                </km-form-group> 

                                <km-form-group v-if="document.hasReferncePeriod" name="referencePeriodInfo" caption="Please explain">
                                    <!-- <label class="form-label" ></label> -->
                                    <km-input-rich-lstring v-model="document.referencePeriodInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                </km-form-group>
                            </div>
                        </div>
                    </km-form-group>

                </template>
                <template #review>
                    <view-target :identifier="document.header.identifier" :document="cleanDocument"></view-target>
                </template>
            </km-form-workflow>

            <div class="d-grid d-md-flex justify-content-md-end mt-5">
                <CButton @click="onSubmitDocument()" color="primary" class="me-md-2">Save</CButton> 
                <!-- <CButton @click="previewDocument()" color="primary" class="me-md-2">Preview</CButton> 
                <CButton @click="shareDocument()" color="dark" class="me-md-2">Share</CButton> 
                <CButton @click="printDocument()" color="dark" class="me-md-2">Print</CButton> 
                <CButton @click="onClose()" color="danger" class="me-md-2">Close</CButton> -->
            </div>
            <km-modal-spinner :visible="kmDocumentDraftStore.isBusy" v-if="kmDocumentDraftStore.isBusy"></km-modal-spinner>
        </form>

      </CCardBody>
    </CCard>
  
</template>

<script setup>
  
    import { KmInputRichLstring, KmSelect, KmFormGroup,
        KmFormCheckGroup, KmFormCheckItem, KmInputLstring,KmModalSpinner, KmFormWorkflow
    } from "~/components/controls";
    import viewTarget               from "./view-target-part-2.vue";
    import { mapStores }            from 'pinia'
    import { languages }            from '@/app-data/languages'
    import { degreeOfAlignments }   from '@/app-data/degreeOfAlignments';
    import { useThesaurusStore }    from '@/stores/thesaurus';
    import { useCountriesStore }    from '@/stores/countries';
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useKmDocumentDraftsStore }    from '@/stores/kmDocumentDrafts';
    import { useRoute } from 'vue-router' 
    import {useToast} from 'vue-toast-notification';
    // import {lstring } from '@/util/filter'

    const { user }        = useAuth();
    const security        = useSecurity();
    const route           = useRoute();
    const {$appRoutes:appRoutes }   = useNuxtApp();
    const locale          = useI18n().locale
    const thesaurusStore  = useThesaurusStore ();
    const countriesStore  = useCountriesStore ();
    const realmConfStore  = useRealmConfStore();
    const kmDocumentDraftStore  = useKmDocumentDraftsStore();
    const $toast                = useToast();
        
    const showSpinnerModal = ref(false);
    const selectedLocale = ref(locale.value);

    await Promise.all([
        thesaurusStore.loadDomainTerms(THEASURUS.GBF_GLOBAL_TARGETS),
        thesaurusStore.loadDomainTerms(THEASURUS.GBF_GLOBAL_GOALS),
        thesaurusStore.loadDomainTerms(THEASURUS.GBF_HEADLINE_INDICATORS),
        thesaurusStore.loadDomainTerms(THEASURUS.GBF_COMPONENT_INDICATORS    ),
        thesaurusStore.loadDomainTerms(THEASURUS.GBF_COMPLEMENTARY_INDICATORS),
        thesaurusStore.loadDomainTerms(THEASURUS.GBF_TARGETS_CONSIDERATIONS  ),
        countriesStore.loadCountries()
    ]);

    if(route?.params?.identifier){
        await kmDocumentDraftStore.loadDraftDocument(route.params.identifier);
        if(!kmDocumentDraftStore.draftRecord){
            //TODO: show error that the record does not exists.
            await navigateTo(appRoutes.NBSAPS_TARGETS_NEW);
            // return;
        }        
    }

    const document =  ref(route?.params?.identifier ? kmDocumentDraftStore.draftRecord.body : emptyDocument() );
    
    const formatedLanguages     = computed(()=>Object.entries(languages).map(e=>{ return { code : e[0], title : e[1]}}));    
    const countryList                = computed(()=>{
        if(!countriesStore?.countries?.length)
            return [];

        const mapCountries = countriesStore.countries.map(e=>{
            return { name : e.name[useI18n().locale.value], code : e.code?.toLowerCase()}
        })

        return mapCountries;
    })
    
    const cleanDocument = computed(()=>{
        const clean = useStorage().cleanDocument({...document.value});
        return clean
    })

    onMounted(() => {
        if(user?.value?.isAuthenticated){
            document.value.government.identifier = document.value?.government?.identifier || user.value.government
        }
    })

    const onSubmitDocument = async ()=>{
        try{
            showSpinnerModal.value = true;            
            const lDocument = useStorage().cleanDocument({...document.value})

            await kmDocumentDraftStore.saveDraft(lDocument.header.identifier, lDocument);
            if(kmDocumentDraftStore.error?.length)
                $toast.error('Error saving draft record', {position:'top-right'});                
            else
                $toast.success('Draft record saved successfully', {position:'top-right'});
        }
        catch(e){
            console.error(e);
        }
        finally{
            showSpinnerModal.value = false;
        }
    }    
    const onClose = async ()=>{
        await navigateTo(appRoutes.NBSAPS_TARGETS_MY_COUNTRY_PART_II)
    }
    
    function emptyDocument(){
        return {
            header : {
                schema : SCHEMAS.NATIONAL_TARGET_7,
                identifier : useGenerateUUID(),
                languages  : [locale.value]
            },        
            government : {
                identifier : undefined
            }
        }
    }


</script>
