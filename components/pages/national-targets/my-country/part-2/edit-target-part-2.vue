<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> National mapping with global Goal/Target</slot>
      </CCardHeader>
      <CCardBody>

            <div  v-if="isLoading">
                <km-spinner center></km-spinner>
            </div>           
            <km-form-workflow v-if="!isLoading && document?.header" :focused-tab="props.workflowActiveTab" :get-document="onGetDocument"
                :container="container" :on-pre-close="onClose" :on-post-save-draft="onPostSaveDraft">
                <template #submission>
                    <form name="editForm">                     
                        <km-form-group>
                            <CAccordion always-open id="mapping-accordion" class="mt-3 mb-3">                    
                                <CAccordionItem :visible="true">
                                    <CAccordionHeader id="generalAccordion">
                                        Government and Language(s) 
                                        <small class="text-muted float-end">(Click here to change the record language)</small>                       
                                    </CAccordionHeader>
                                    <CAccordionBody> 
                                        <km-form-group name="government" caption="Government" required>
                                            <km-government v-model="document.government" ></km-government>                           
                                        </km-form-group>   

                                        <km-form-group name="languages" caption="Please select in which language(s) you wish to submit this record" required>
                                            <km-languages v-model="document.header.languages"></km-languages>
                                        </km-form-group>   
                                    </CAccordionBody>
                                </CAccordionItem>
                            </CAccordion>
                        </km-form-group>         
                        <km-form-group v-if="nationalTargets?.length">
                            <CCard>
                                <CCardHeader>
                                    Linked national target(s)
                                </CCardHeader>
                                <CCardBody>
                                    <div  class="ps-2" v-for="(target, index) in nationalTargets" :key="target.identifier">
                                        {{index+1}}. {{lstring(target.title)}}
                                    </div>
                                </CCardBody>
                            </CCard>                            
                        </km-form-group>
                        <km-form-group>
                            <CCard>
                                <CCardHeader>
                                    Elements of the global targets
                                </CCardHeader>
                                <CCardBody>                      
                                    <km-form-group required caption="Elements of the global targets addressed by national targets (Please also include which aspects of the global targets have not been covered by the national targets)" 
                                        name="elementOfGlobalTargetsInfo" data-content="Please also include which aspects of the global targets have not been covered by the national targets">
                                        <km-input-rich-lstring v-model="document.elementOfGlobalTargetsInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>                                
                                </CCardBody>
                            </CCard>         
                        </km-form-group>
                        <km-form-group>
                            <CCard>
                                <CCardHeader>
                                    Reference Period
                                </CCardHeader>
                                <CCardBody>   
                                    <CCard class="mb-2" v-for="(indicator, index) in document.referencePeriod" :key="indicator.identifier">
                                        <CCardBody>
                                            <CCardTitle>{{lstring(getIndicator(indicator.headlineIndicator).title)}}</CCardTitle>
                                            <hr/>
                                            <CCardText>
                                                <table class="table" v-if="indicator.headlineIndicator">
                                                    <tr>
                                                        <td>   
                                                            
                                                            <km-form-group name="hasReferencePeriod" required caption="Is there a reference period which relates to the headline indicator?">
                                                                <km-form-check-group>
                                                                    <km-form-check-item inline type="radio" :name="'hasReferencePeriod' + indicator.headlineIndicator.identifier"  for="hasReferencePeriod" :id="'hasReferencePeriodYes'+ indicator.headlineIndicator.identifier"  :value="true"  v-model="indicator.hasReferencePeriod" label="Yes"/>
                                                                    <km-form-check-item inline type="radio" :name="'hasReferencePeriod' + indicator.headlineIndicator.identifier"  for="hasReferencePeriod" :id="'hasReferencePeriodNo' + indicator.headlineIndicator.identifier"  :value="false" v-model="indicator.hasReferencePeriod" label="No"
                                                                        @update:modelValue="()=>indicator.referencePeriodInfo=undefined"/>
                                                                </km-form-check-group>
                                                            </km-form-group> 

                                                            <km-form-group v-if="indicator.hasReferencePeriod" name="referencePeriodInfo" caption="Please explain" required>
                                                                <km-input-rich-lstring v-model="indicator.referencePeriodInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                                            </km-form-group>                                     
                                                        </td>
                                                    </tr> 
                                                </table>                                                
                                            </CCardText>

                                        </CCardBody>
                                    </CCard>                                
                                </CCardBody>
                            </CCard>         
                        </km-form-group>
                    </form>                   
                </template>
                <template #review>                    
                    <view-target :identifier="document.header.identifier" :document="cleanDocument"></view-target>
                </template>
            </km-form-workflow>
            <km-document-error v-if="!isLoading &&  documentLoadError" :document-error="documentLoadError"></km-document-error>        
      </CCardBody>
    </CCard>
  
</template>

<script setup>
  
    import viewTarget               from "./view-target-part-2.vue";
    import { useRoute } from 'vue-router' 
    import { useStorage } from '@vueuse/core'
    import { EditFormUtility } from "@/services/edit-form-utility";
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";

    const props = defineProps({
        identifier         : {type:String, required:false},
        rawDocument        : {type: Object },
        globalGoalOrTarget : {type:String, required:true},
        headlineIndicators : {type:Array, required:true},
        workflowActiveTab  : {type:Number, default:1 },
        onClose            : {type:Function, required:false},
        onPostSaveDraft    : {type:Function, required:false},
    }) 

    const { user }        = useAuth();
    const route           = useRoute();
    const {$appRoutes:appRoutes }   = useNuxtApp();
    const container = useAttrs().container;
    const stateTargetWorkflow       = useStorage('ort-target-workflow', { batchId : undefined });
    
    const headlineIndicators = ref(null);
    const document = ref({});
    const isLoading = ref(false);
    const documentLoadError = ref(null);  

    const cleanDocument = computed(()=>{
        const clean = useKmStorage().cleanDocument({...document.value});
        
        // incase if national target record was modified and global target was removed after 
        // the mapping was submitted then filter such reference period
        if(clean.referencePeriod && headlineIndicators.value?.length){            
            const referencePeriod = clean.referencePeriod.filter(e=>{
                return headlineIndicators.value.find(indicator=>indicator.identifier == e.headlineIndicator.identifier);
            })
            clean.referencePeriod = referencePeriod.length ? referencePeriod : undefined;
        }
        else{
            clean.referencePeriod = []
            headlineIndicators.value.forEach(indicator => {
                clean.referencePeriod.push({
                    headlineIndicator   : { identifier : indicator.identifier},
                    hasReferencePeriod : false
                })
            });  
        }
        return clean
    });

    const nationalTargets = computed(()=>{
        return props.headlineIndicators[0].nationalTargets
    });

    onMounted(() => {
        init();
    })

    function onGetDocument(){
        return cleanDocument;
    }

    const onClose = async (document)=>{
        if(props.onClose)
            props.onClose(document)
    }
    const onPostSaveDraft = async (document)=>{
        if(props.onPostSaveDraft)
            props.onPostSaveDraft(document)
    }
    function emptyDocument(){
        
        return {
            header : {
                schema : SCHEMAS.NATIONAL_TARGET_7_MAPPING,
                identifier : useGenerateUUID(),
                languages  : EditFormUtility.getPreferredEditLanguages()
            },        
            government : {
                identifier : user.value?.government
            },
            globalGoalOrTarget : {
                identifier: props.globalGoalOrTarget
            },
            referencePeriod :   headlineIndicators.value?.map(indicator => {
                                    return {
                                        headlineIndicator  : { identifier : indicator.identifier},
                                        hasReferencePeriod : false
                                    }
                                })
        }
    }

    async function loadHeadlineIndicators(globalTarget){
        const indicators = await GbfGoalsAndTargets.loadGbfHeadlineIndicator(globalTarget);
        headlineIndicators.value = sortBy(indicators?.flat()||[], 'title')
    }

    function getIndicator(indicator){
        return headlineIndicators.value?.find(e=>e.identifier == indicator?.identifier)
    }

    async function init(){
        isLoading.value = true;
        const identifier = props.identifier || route?.params?.identifier;
        try{

            await loadHeadlineIndicators(props.globalGoalOrTarget)

            if(props.rawDocument){
                document.value = {...props.rawDocument};
            }
            else if(identifier){
                document.value = await EditFormUtility.load(identifier);                
            }
            else{
                document.value = emptyDocument();
                //validate if there is a mapping record for the given target and load it instead
            }
        }
        catch(e){
            if([404, 401, 403].includes(e.status)){
                documentLoadError.value = e.status;
                useLogger().error(e, `${t(e.status==404 ? 'notFound' : 'notAuthorized')} ` + identifier);
            }
            else
                useLogger().error(e, `${t('errorLoading')} ` + identifier);
            
        }

        isLoading.value = false;
    }
</script>
<style scoped>
.accordion-button small{
    display: none;
}
.accordion-button.collapsed small{
    display: block;
}
</style>
