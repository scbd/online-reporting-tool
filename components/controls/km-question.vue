<template>
    <template v-if="question">
    <!-- <CCard> -->
      <!-- <CCardHeader> -->
        <km-form-group :name="question?.key" required class="mb-0">            
            <template #caption>
                <slot>
                    {{question?.number}} {{question?.title}} 
                </slot>
                <button class="ms-3 btn btn-danger btn-sm float-end" v-if="model" 
                    @click="model=undefined">{{t('clear')}}</button>
            </template>
        </km-form-group>
      <!-- </CCardHeader> -->
      <!-- <CCardBody> -->
        <div class="question-options ms-3">
            <div v-if="question.type == 'option'">
                <km-form-group v-if="question?.options" class="mb-0">                
                    <km-form-check-item v-for="option in question?.options" 
                    :key="option.value" type="radio" 
                    :name="'option_'+question.key"  
                    :for="'option_'+question.key+'_'+option.value" 
                    :id="'option_'+question.key+'_'+option.value" 
                    :value="option.value"  
                    v-model="model" :label="lstring(option.title, locale)" />
                </km-form-group>
            </div>
            <div v-else-if="question.type == 'checkbox' && question?.options">
                <km-multi-checkbox v-model="multiOptionModel" option-value-field="value"
                    :options="question?.options">
                </km-multi-checkbox>
            </div>
            <div v-else-if="question.type == 'string'">
                <input :id="question?.key" :placeholder="question?.title" class="form-control"
                    v-model="model" type="textbox" />
            </div>
        </div>
      <!-- </CCardBody>
    </CCard> -->
    </template>
</template>
<i18n src="@/i18n/dist/components/controls/km-question.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
    const model = defineModel<String|Object>();

    const props = defineProps({
        question : {type:Object as PropType<Question>}
    })

    const multiOptionModel = computed({
        get(){
            if(Array.isArray(model.value))
                return model.value?.map(e=>{return {value : e }});

            return model.value
        },
        set(values){
            if(Array.isArray(values))
                model.value = values?.map(e=>e.value);
            else 
                model.value = values;
        }
    });

    const {t, locale} = useI18n()
</script>

<style scoped>
    .question-options{

    }

</style>