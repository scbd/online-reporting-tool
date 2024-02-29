<template>
    <div class="m-3" v-for="question in questions" :key="question">
        <div v-if="!question.questions?.length">
            <km-question :question="question" v-model="question.answer"></km-question>
        </div>
        <div v-if="question.questions?.length">
            <km-questions :questions="question.questions"></km-questions>            
        </div>
    </div>
</template>

<script setup lang="ts">

    const model = defineModel<Array<Object>();

    const props = defineProps({
        questions : {type:Object as PropType<Question[]>}
    });

    const { locale} = useI18n()
    
</script>

<style>

</style>