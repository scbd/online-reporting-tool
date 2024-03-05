<template>
    <toggle-accordion class="btn-xs m-1 float-end" v-if="computedIndicators" ref="accordionToggle" 
        :selector="'#' + componentId + '-mapping-accordion .accordion-header button.accordion-button'" >
    </toggle-accordion>    
    <CAccordion always-open :id="componentId + '-mapping-accordion'" v-if="computedIndicators?.length">                    
        <CAccordionItem :item-key="index+1" :visible="true" v-for="(indicator, index) in computedIndicators" :key="indicator.identifier"  always-open>
            <CAccordionHeader :id="'gbfTarget'+indicator.identifier">
                {{lstring(indicator.title||indicator)}}                           
            </CAccordionHeader>
            <CAccordionBody> 
                <missing-data-alert v-if="!indicator.nationalData && showMissingAlert"></missing-data-alert>    
     
                <div v-if="indicator.identifier.indexOf('KMGBF-INDICATOR-BIN')<0">     Hello  
                    <nr7-add-indicator-data :indicator="indicator" :raw-document="indicator.nationalData" 
                        :identifier="((indicator.nationalData||{}).header||{}).identifier" :on-post-save-draft="onAddIndicatorDataClose">
                    </nr7-add-indicator-data>       
                    <div v-if="indicator.nationalData">
                        <nr7-view-indicator-data :indicator-data="indicator.nationalData"></nr7-view-indicator-data>
                    </div>
                </div>      
                <div v-if="indicator.identifier.indexOf('KMGBF-INDICATOR-BIN')>=0" >   
                    <nr7-add-binary-indicator-data :indicator="indicator" :raw-document="indicator.nationalData" 
                        :identifier="((indicator.nationalData||{}).header||{}).identifier" :on-post-save-draft="onAddIndicatorDataClose">
                    </nr7-add-binary-indicator-data>       
                </div>
            </CAccordionBody>
        </CAccordionItem>
    </CAccordion>
  <!-- :on-close="onAddIndicatorDataClose" -->
</template>
<script setup>
    import MissingDataAlert from './missing-data-alert.vue';
    import { makeUid }         from '@coreui/utils/src'
    import {cloneDeep} from 'lodash';
    
    const {t, locale }          = useI18n()
    const props = defineProps({
        indicators         : {type:Object, default:[] },
        onClose            : {type:Function, required:false},
        showMissingAlert   : {type:String, default:false },
    }) 

    const componentId = makeUid()
    const {indicators, showMissingAlert} = toRefs(props);
    const lIndicators  = toRef([]);    
    const accordionToggle      = ref(null);
    lIndicators.value  = cloneDeep(indicators.value)
    
    const computedIndicators = computed(()=>lIndicators.value);
    
    function onAddIndicatorDataClose(document){
        
        if(!document)
            return;

        let indicator = lIndicators.value.find(e=>e.identifier == document.body?.indicator?.identifier);
        indicator.nationalData = document.body;

    }
    
    onMounted(()=>{
        nextTick(()=>accordionToggle.value.toggle(true))
    })
</script>
