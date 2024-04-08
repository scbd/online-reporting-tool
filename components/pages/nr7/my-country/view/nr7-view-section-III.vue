<template>
    <CCard>
      <CCardHeader v-if="identifier">
        <slot name="header"> {{t('sectionI')}} </slot>
      </CCardHeader>
      <CCardBody>
        <div v-if="document.sectionII">
        
            <km-form-group  v-if="document.sectionII.hasRevisedNbsap">
                <div class="card">
                    <div class="card-body">  
                        <km-form-group v-if="document.sectionII.hasRevisedNbsap.value">
                            <label class="form-label" for="revisedNbsap">{{t('revisedNbsap')}}</label>                           
                            <km-value>{{ t(`${document.sectionII.hasRevisedNbsap.value}`) }}</km-value>        
                        </km-form-group>
                        <km-form-group v-if="document.sectionII.hasRevisedNbsap.additionalInformation">
                            <label class="form-label" for="indicateCompletionDate">{{t('indicateCompletionDate')}}</label>                           
                            <km-value>{{document.sectionII.hasRevisedNbsap.additionalInformation}}</km-value>        
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>
            <km-form-group  v-if="document.sectionII.hasStakeholderEngagement!=undefined">
                <div class="card">
                    <div class="card-body">  
                        <km-form-group>
                            <label class="form-label" for="stakeholderEngagement">{{t('stakeholderEngagement')}}</label>                           
                            <km-value>{{ document.sectionII.hasStakeholderEngagement ? t('yes') : t('no') }}</km-value>        
                        </km-form-group>
                        <km-form-group v-if="document.sectionII.stakeholders">
                            <label class="form-label" for="stakeholders">{{t('stakeholders')}}</label>             
                            <km-value-terms :value="document.sectionII.stakeholders" :locale="selectedLocale"></km-value-terms>     
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

            <km-form-group  v-if="document.sectionII.hasNbsapAdopted">
                <div class="card">
                    <div class="card-body">  
                        <km-form-group v-if="document.sectionII.hasNbsapAdopted.value">
                            <label class="form-label" for="hasNbsapAdopted">{{t('hasNbsapAdopted')}}</label>                           
                            <km-value>{{ t(`${document.sectionII.hasNbsapAdopted.value}`) }}</km-value>        
                        </km-form-group>
                        <km-form-group v-if="document.sectionII.hasNbsapAdopted.additionalInformation">
                            <label class="form-label" for="indicateAdoptionDate">{{t('indicateAdoptionDate')}}</label>                           
                            <km-value>{{document.sectionII.hasNbsapAdopted.additionalInformation}}</km-value>        
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

            <km-form-group  v-if="document.sectionII.policyInstrument">
                <div class="card">
                    <div class="card-body">  
                        <km-form-group v-if="document.sectionII.policyInstrument">
                            <label class="form-label" for="policyInstrument">{{t('policyInstrument')}}</label>             
                            <km-value-terms :value="document.sectionII.policyInstrument" :locale="selectedLocale"></km-value-terms>     
                        </km-form-group> 
                    </div>
                </div>
            </km-form-group>
        </div>
       
      </CCardBody>
    </CCard>
  
</template>

<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-III.json"></i18n>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/view/nr7-view-section-III.json"></i18n>

<script setup>
  
    import { KmFormGroup, KmSpinner, KmLstringValue,
        KmLocales, KmValueTerm, KmValueBool, KmValueTerms, KmValue
    } from "~/components/controls";
    import { mapStores }            from 'pinia'
    import { languages }            from '@/app-data/languages'
    import { degreeOfAlignments }   from '@/app-data/degreeOfAlignments';
    import { useThesaurusStore }    from '@/stores/thesaurus';
    import { useCountriesStore }    from '@/stores/countries';
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useRoute } from 'vue-router' 
    import { KmDocumentDraftsService}from "@/services/kmDocumentDrafts";
    import { KmDocumentsService } from "@/services/kmDocuments";
    

    const { user }                = useAuth();
    const security                = useSecurity();
    const route                   = useRoute();
    const {t, locale}             = useI18n();
    const thesaurusStore          = useThesaurusStore ();
    const countriesStore          = useCountriesStore ();
    const realmConfStore          = useRealmConfStore();
    const {$appRoutes:appRoutes } = useNuxtApp();
    const selectedLocale = ref(locale.value);

    const props = defineProps({
        document    : { type:Object, default : undefined},
        identifier  : { type:String, required:true}
    });

    const document = useKmStorage().cleanDocument({...props.document});

</script>
