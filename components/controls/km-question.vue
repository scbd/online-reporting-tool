<template>
    <!-- <CCard> -->
      <!-- <CCardHeader> -->
        <button class="btn btn-danger btn-sm float-end" v-if="model" 
            @click="model=undefined">{{t('clear')}}</button>
        <km-form-group :name="question?.key" required>            
            <template #caption>
                <slot>{{question?.number}} {{question?.title}} </slot>
            </template>
        </km-form-group>
      <!-- </CCardHeader> -->
      <!-- <CCardBody> -->
        <div class="question-options ms-3">
            <div v-if="question.type == 'option'">
                <km-form-check-group v-if="question?.options" class="mb-0">                
                    <km-form-check-item v-for="option in question?.options" 
                    :key="option.value" type="radio" 
                    :name="'option_'+question.key"  
                    :for="'option_'+question.key+'_'+option.value" 
                    :id="'option_'+question.key+'_'+option.value" 
                    :value="option.value"  
                    v-model="model" :label="lstring(option.title, locale)" />
                </km-form-check-group>
            </div>
            <div v-if="question.type == 'checkbox' && question?.options">
                <km-multi-checkbox v-model="multiOptionModel" option-value-field="value"
                    :options="question?.options">
                </km-multi-checkbox>
            </div>
        </div>
      <!-- </CCardBody>
    </CCard> -->
</template>
<i18n src="@/i18n/dist/components/controls/km-question.json"></i18n>
<script setup lang="ts">
    const model = defineModel<String>();

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