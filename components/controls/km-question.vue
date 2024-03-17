<template>
    <CCard>
      <CCardHeader>
        <km-form-group>            
            <template #caption>
                <slot>{{question?.number}} {{question?.title}} </slot>
            </template>
        </km-form-group>
      </CCardHeader>
      <CCardBody>
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
            {{ model }}
            <km-multi-checkbox v-model="multiOptionModel" option-value-field="value"
                :options="question?.options">
            </km-multi-checkbox>
        </div>
        
      </CCardBody>
    </CCard>
</template>

<script setup lang="ts">
    const model = defineModel<String>();
    const multiOptionModel = computed({
        get(){
            return (model.value||[]).map(e=>{return {value : e }});
        },
        set(values){
            console.log(values)
            model.value = (values||[]).map(e=>e.value);
        }
    })
    const props = defineProps({
        question : {type:Object as PropType<Question>}
    })
    const { locale} = useI18n()
</script>

<style lang="scss" scoped>


</style>