<template>
    <toggle-accordion class="btn-xs m-1 float-end" v-if="computedIndicators" ref="accordionToggle" 
        :selector="'#' + componentId + '-indicator-accordion .accordion-header button.accordion-button'" >
    </toggle-accordion>    
    <CAccordion always-open class="indicator-accordion" :id="componentId + '-indicator-accordion'" v-if="computedIndicators?.length">                    
        <CAccordionItem :item-key="index+1" :visible="true" class="indicator-accordion-item p-0"
            v-for="(indicator, index) in computedIndicators" :key="indicator.identifier"  always-open>
            <CAccordionHeader :id="'gbfTarget'+indicator.identifier">
                {{lstring(indicator.title||indicator)}}  
                <small v-if="indicator.type!='national'" class="fw-bold ms-1">({{ indicator?.identifier }})</small>
                
            </CAccordionHeader>
            <CAccordionBody  class="indicator-accordion-item-content"> 
                <div v-if="indicator.identifier?.indexOf('KMGBF-INDICATOR-BIN')<0">
                    
                    <missing-data-alert v-if="!Object.keys(indicator.nationalData||{})?.length && showMissingAlert"></missing-data-alert>   
                    <div class="float-end ms-1">
                        <km-delete-record  v-if="indicator.documentInfo" :document="indicator.documentInfo"
                            @on-delete="onRecordDelete($event, indicator)">
                        </km-delete-record>
                    </div>
                    <nr7-add-indicator-data :indicator="indicator" container=".nr7-add-indicator-data-modal"
                        :identifier="((indicator.nationalData||{}).header||{}).identifier" 
                        :indicator-type="indicatorType"
                        @on-post-save-draft="onAddIndicatorDataClose">
                    </nr7-add-indicator-data>       

                    <div v-if="indicator.nationalData">
                        <nr7-view-indicator-data :indicator-data="indicator.nationalData" :indicator-type="indicatorType"></nr7-view-indicator-data>
                    </div>
                </div>      
                <div v-if="indicator.identifier?.indexOf('KMGBF-INDICATOR-BIN')>=0" >  
                    <nr7-add-binary-indicator-data :indicator="indicator" container=".nr7-add-binary-indicator-data-modal"
                        :identifier="indicator?.nationalData?.header?.identifier" @on-post-save-draft="onAddBinaryIndicatorDataClose">
                    </nr7-add-binary-indicator-data>   
                    <div v-if="indicator.nationalData">
                        <nr7-view-binary-indicator-data :indicator-data="indicator.nationalData" :questions="indicator?.question?.questions">
                        </nr7-view-binary-indicator-data>
                    </div>    
                </div>
            </CAccordionBody>
        </CAccordionItem>
    </CAccordion>
  <!-- :on-close="onAddIndicatorDataClose" -->
</template>
<script setup lang="ts">
//@ts-nocheck
    import {cloneDeep} from 'lodash';
    
    const {t, locale }          = useI18n()
    const props = defineProps({
        indicators         : {type:Array<Object>, default:{} },
        onClose            : {type:Function, required:false},
        showMissingAlert   : {type:String, default:false },
        indicatorType      : {type:String, required:true }, 
    }) 
    const emit = defineEmits(['onRecordDelete'])

    const componentId        = useGenerateUUID();
    const accordionToggle    = shallowRef(null);
    // const canTeleport        = ref(false);
    const indicators         = ref(props.indicators)
    
    const computedIndicators = computed(()=>indicators.value);
    
    //TODO : do not update the props directly,
    // clone and modify the object.
    function onAddIndicatorDataClose(document){
        
        if(!document)
            return;

        let indicator = indicators.value.find(e=>e.identifier == document.body?.indicator?.identifier);
        indicator.nationalData = document.body;
        indicator.documentInfo = document;
    }

    function onAddBinaryIndicatorDataClose(document, indicator){
        //when binary data is updated, updates reference of all the indicators in the list
        indicators.value.forEach(indicator=>{
            if(document.body[indicator.question.key]){
                indicator.nationalData = {
                    government : indicator.nationalData.government,
                    header : indicator.nationalData.header,
                    ...(document.body[indicator.question.key]||{})
                }
            }
        })
    }

    function onRecordDelete({identifier, type}, indicator): void{

        let deletedIndicator = indicators.value.find(e=>e.identifier == indicator?.identifier);
        delete deletedIndicator.nationalData;
        delete deletedIndicator.documentInfo;

        emit('onRecordDelete', {identifier, type, indicator})
    }
    
    onMounted(()=>{
        nextTick(()=>{
            accordionToggle.value.toggle(true)
            // setTimeout(()=>canTeleport.value = true, 500)
            indicators.value = props.indicators;
        })
    })
</script>
<style scoped>

.indicator-accordion-item-content:hover, .indicator-accordion-tem-content:active{
    border: 3px solid#26638e;
}
</style>