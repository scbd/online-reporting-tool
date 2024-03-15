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
        <km-form-check-group v-if="question?.options" class="mb-0">
            <km-form-check-item v-for="option in question?.options" 
            :key="option.value" type="radio" 
            :name="'option_'+question.key"  
            :for="'option_'+question.key+'_'+option.value" 
            :id="'option_'+question.key+'_'+option.value" 
            :value="option.value"  
            v-model="model" :label="lstring(option.title, locale)" />
        </km-form-check-group>
        
      </CCardBody>
    </CCard>
</template>

<script setup lang="ts">
    const model = defineModel<String>();

    const props = defineProps({
        question : {type:Object as PropType<Question>}
    })
    const { locale} = useI18n()
</script>

<style lang="scss" scoped>


</style>