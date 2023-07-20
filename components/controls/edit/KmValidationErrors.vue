<template>
    <div class="document-validation">
         <div v-if="report && report.isAnalyzing" class="alert alert-info">
             <i class="fa fa-cog fa-spin"></i> {{t('analyzingDocument')}}
         </div>
         <div v-if="report && report.isSaving" class="alert alert-info">
             <i class="fa fa-cog fa-spin"></i> {{t('savingDocument')}}
         </div>
         <div v-if="report && !report.isAnalyzing">
 
             <div v-if="report && report.schema && !report.errors" class="alert alert-success">
                 {{t('valid')}}
             </div>

             <div v-if="show && report && report.errors && report.errors.length" class="alert alert-warning">
                 <button type="button" class="position-absolute top-0 end-0 m-2 bg-transparent border-0 fs-5 text-secondary" 
                    @click="show=!show" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                 </button>
                 <strong>{{t('contains')}} <span v-bind="report && report.errors.length"></span> {{t('errors')}}</strong>
                 <ul>
                     <li v-for="error in report.errors" :title="error.parameters" :key="error">
                         <span>{{ t(getTranslation(error)) }}</span> /
                         <ul v-if="error.properties">
                             <li v-for="property in error.properties" :title="error.parameters" :key="property">					
                                <a class="text-decoration-none" rel="noopener" href="#" @click="jumpTo(property.property)">
                                    {{ getLabel(property.property) }}
                                </a>
                             </li>
                         </ul>
                         <span v-if="!error.properties">
                             <a class="text-decoration-none" rel="noopener" href="#" @click="jumpTo(error.property)">
                                {{ getLabel(error.property) }}
                            </a>
                         </span>
                     </li>
                 </ul>
             </div>
 
         </div>
     </div>
 </template>

 <i18n src="@/i18n/dist/components/controls/edit/kmValidationErrors.json"></i18n>
 
 <script setup lang="ts">
    
    import $ from 'jquery';
    

    const props =   defineProps({
                        report : { type:Object, required:true},                        
                    });
    const $emits = defineEmits(['onJumpTo'])
    const show       = ref(true)
    const { report } = toRefs(props);
    const { t }      = useI18n();
    const container = useAttrs().container ?? 'body,html';
    


    function getTranslation(error) {
        if (error?.code === null                       ) return 'unknown'
        if (error?.code == "Error.Mandatory"           ) return 'mandatory'
        if (error?.code == "Error.MandatoryAnyOf"      ) return 'mandatoryAnyOf'
        if (error?.code == "Error.InvalidValue"        ) return 'invalidValue'
        if (error?.code == "Error.InvalidProperty"     ) return 'invalidProperty'
        if (error?.code == "Error.UnspecifiedLocale"   ) return 'unspecifiedLocale'
        if (error?.code == "Error.UnexpectedTerm"      ) return 'unexpectedTerm'
        if (error?.code == "Error.InvalidType"         ) return 'invalidType'

        return error?.code;
    }

    function jumpTo(field:string) {
console.log(field)
        $emits('onJumpTo', field);

        // const qLabel = $('body').find("form[name='editForm'] label[for='" + field + "']:first");
        // const qBody  = $(container);

        // var scrollNum = qLabel.offset().top
        
        // if(container!= 'body,html'){
        //     //its a dialog calculate scrollTop
        //     var dialogContainer = $(container)
        //     scrollNum = scrollNum - dialogContainer.offset().top + dialogContainer.scrollTop();
        // }
        // else
        //     scrollNum -= 10; //forms 

        // qBody.stop().animate({
        //     scrollTop: scrollNum
        // }, 100);
    }

    function getLabel(field) {

        var qLabel = $(container).find("form[name='editForm'] label[for='" + field + "']:first");

        if (qLabel.length > 0)
            return qLabel.text();

        return field;
    };
 </script>
 
 <style scoped>
 
 </style>