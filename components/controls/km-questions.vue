<template>
    <div class="mb-3" v-for="question in questions" :key="question.key">
        <div v-if="!question.questions?.length">
            <km-question :question="question" v-model="question.answer" @update:modelValue="onAnswer"></km-question>
        </div>
        <div v-if="question.questions?.length">
            <CCard>
                <CCardHeader>
                    {{question?.number}} {{question?.title}}
                </CCardHeader>
                <CCardBody>
                    <km-questions :questions="question.questions" v-model="question.answers" @update:modelValue="onAnswer"></km-questions>  
                </CCardBody>
            </CCard>          
        </div>
    </div>
</template>

<i18n src="@/i18n/dist/components/controls/km-questions.json"></i18n>

<script setup lang="ts">
// 
    const model = defineModel<Array<Object>>({required:true});

    const props = defineProps({
        questions : {type:Object as PropType<Question[]>}
    });

    const { locale} = useI18n()

    const  onAnswer = function(val){
        model.value = getQuestionAnswer(props.questions);        
    }

    function getQuestionAnswer(questions : Question[] | undefined){
        return questions.map(e=>{
                let answers = [];
                if(e.answer)
                    answers.push({ question : e.key,  answer   : e.answer });

                if(e?.questions?.length){
                    const subAnswers = getQuestionAnswer(e.questions||[])
                    if(subAnswers.length)
                        answers = answers.concat(subAnswers);
                }
                return answers;

            }).flat()
    }
    
</script>

<style>

</style>