<template>
    <CButton class="float-end mr-1 mb-1 btn-xs" color="primary" size="sm" @click="toggleAccordion()" v-if="computedIndicators">
        <span v-if="!accordionOpen">{{ t('openAll') }}</span>
        <span v-if="accordionOpen" >{{ t('closeAll') }}</span>
    </CButton>
    <br>
    <br>
    <CAccordion always-open id="mapping-accordion" v-if="computedIndicators?.length">                    
        <CAccordionItem :item-key="index+1" :visible="true" v-for="(indicator, index) in computedIndicators" :key="indicator.identifier"  always-open>
            <CAccordionHeader :id="'gbTraget_'+indicator.identifier">
                {{lstring(indicator.title)}}                           
            </CAccordionHeader>
            <CAccordionBody> 
                <missing-data-alert v-if="!indicator.nationalData"></missing-data-alert>                        
                <add-indicator-data :indicator="indicator" :raw-document="indicator.nationalData" 
                    :identifier="((indicator.nationalData||{}).header||{}).identifier" :on-post-save-draft="onAddIndicatorDataClose"
                    ></add-indicator-data>
                <div v-if="indicator.nationalData">
                    <view-data :indicator-data="indicator.nationalData"></view-data>
                </div>
            </CAccordionBody>
        </CAccordionItem>
    </CAccordion>      
  <!-- :on-close="onAddIndicatorDataClose" -->
</template>
<script setup>
  
    import addIndicatorData from './add-data.vue';
    import MissingDataAlert from './missing-data-alert.vue';
    import ViewData from './view-data.vue';

    import { useAsyncState } from '@vueuse/core'
    import { useRealmConfStore }    from '@/stores/realmConf';
    import $ from 'jquery';
    import {cloneDeep} from 'lodash';

    const {t, locale }          = useI18n()

    const accordionOpen = ref(false);
    const props = defineProps({
        indicators         : {type:Object, default:[] },
        onClose            : {type:Function, required:false},
    }) 

    const {indicators} = toRefs(props);
    const lIndicators  = toRef([]);    
    lIndicators.value  = cloneDeep(indicators.value)
    const computedIndicators = computed(()=>lIndicators.value);

    function toggleAccordion(open){
        accordionOpen.value = open || !accordionOpen.value;
        const buttons = $('#mapping-accordion .accordion-header button.accordion-button');
        buttons.each(function(){
            const ariaExpanded = $(this)[0].ariaExpanded == "true";
            if((accordionOpen.value && ariaExpanded) || (!accordionOpen.value && !ariaExpanded))
                $(this).click();
        })
    }
    
    function onAddIndicatorDataClose(document){
        
        if(!document)
            return;

        let indicator = lIndicators.value.find(e=>e.identifier == document.body?.indicator?.identifier);
        indicator.nationalData = document.body;

    }
</script>
