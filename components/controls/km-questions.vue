<template>
    <div  v-if="answersInitialized && questions?.length" >
        <div class="mb-3" v-for="question in questions" :key="question?.key">           
            <div v-if="!question?.questions?.length">
                <km-question :enabled="question.enabled" :question="question" v-model="answers[question?.key]" @update:modelValue="onAnswer"></km-question>
            </div>
            <div v-if="question?.questions?.length">                
                <km-form-group>
                    <template #caption>
                        {{question?.number}} {{question?.title}}
                    </template>
                </km-form-group>
                <km-questions class="ms-3" :subQuestion="true" :questions="question?.questions" v-model="answers[question?.key]" @update:modelValue="onAnswer"></km-questions>  
            </div>
        </div>
    </div>
</template>

<i18n src="@/i18n/dist/components/controls/km-questions.json"></i18n>

<script setup lang="ts">
//@ts-nocheck
    import { flattenObject } from "~/utils/helpers";

    const model = defineModel<Array<Object>>({required:true});
    const props = defineProps({
        questions : {type:Object as PropType<Question[]>}
    });
    const { questions } = toRefs(props);

    const answersInitialized = ref(false);
    const answers = ref({});

    const  onAnswer = function(){
        const newVal = flattenObject(answers.value);     
        model.value = newVal;
    }

    const answerArrayToHierarchy = function (questions, answers){
        const hierarchy = {};
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            if(!question?.questions){
                hierarchy[question?.key] = answers[question?.key];
            }
            else{
                hierarchy[question.key] = answerArrayToHierarchy(question?.questions, answers);
            }
        }
        return hierarchy;
    }

    onMounted(()=>{       
        answers.value = answerArrayToHierarchy(questions.value, model.value||{});
        answersInitialized.value = true;
    })
</script>

<style>

</style>