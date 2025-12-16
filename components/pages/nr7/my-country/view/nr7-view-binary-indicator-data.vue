<template>
    <!-- {{indicator}} -->
     <!-- {{questions}} -->
    <div class="mb-3" v-for="(question, key) in processedQuestions" :key="question?.key">
        <!-- {{key}} {{question.visible}} -->
        <span v-if="!question?.key">{{ question }}</span>
        <div v-if="!question?.questions?.length && question.visible">
            <CCard>
                <CCardHeader>
                    <km-form-group class="mb-0">            
                        <template #caption>
                            <slot>{{question?.number}} {{question?.title}} </slot>
                        </template>
                    </km-form-group>
                </CCardHeader>
                <CCardBody>
                    <km-value v-if="(indicatorData?.responses||{})[question?.key]">
                        <span v-if="question.type == 'option'">
                            {{ question.options.find(e=>e.value == (indicatorData?.responses||{})[question?.key])?.title }}
                        </span>
                        <span v-else-if="question.type == 'checkbox'">
                                <div v-for="answer in (indicatorData?.responses||{})[question?.key]" :key="answer">
                                    {{ question.options.find(e=>e.value == answer)?.title }}
                                </div>
                        </span>
                        <span v-else-if="question.type == 'string'">
                            {{ (indicatorData?.responses||{})[question?.key] }}
                        </span>
                    </km-value>
                    <missing-data-alert v-if="!hideMissingResponse && !(indicatorData?.responses||{})[question?.key]" class="alert-sm">
                        <template #message>
                             {{t('binaryIndicatorQuestion')}}
                        </template>
                    </missing-data-alert>
                </CCardBody>
            </CCard>

        </div>
        <div v-if="question?.questions?.length  && question.visible">
            <CCard>
                <CCardHeader>
                    {{question?.number}} {{question?.title}}
                </CCardHeader>
                <CCardBody>
                    <nr7-view-binary-indicator-data :indicator-data="indicatorData" :is-recursive="true"
                        :questions="question.questions" :hide-missing-response="hideMissingResponse">
                    </nr7-view-binary-indicator-data>  
                </CCardBody>
            </CCard>          
        </div>
    </div>
    
    <km-form-group v-if="indicatorData?.comments && !isRecursive" :caption="t('comments')">        
        <km-lstring-value type="html" :value="indicatorData.comments"  :locale="locale"></km-lstring-value>
    </km-form-group>
</template>

<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/indicator-data/nr7-add-binary-indicator-data.json"></i18n>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/indicator-data/nr7-view-binary-indicator-data.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
const props = defineProps({
    indicator: { type: Object, required: true },
    indicatorData: { type: Object, required: true },
    questions : { type: Array, required: true },
    isRecursive : {type:Boolean, default:false},
    hideMissingResponse : {type:Boolean, default:false},
    documentLocale: { type:String }
});
const {locale, t} = useI18n();
const selectedLocale = computed(()=>props.documentLocale||locale.value);

const { indicatorData } = toRefs(props);

const processedQuestions = computed(()=>{
    if(!props.isRecursive){
        const flatQuestions = flattenQuestions(props.questions);
        const validationsMap= buildValidationMap(flatQuestions);

        const responses = indicatorData.value?.responses || {};
        flatQuestions
        .forEach(q=>{
            q.visible = true

            if(props.hideMissingResponse)
                q.visible = responses?.[q.key];

            if(q.visible && validationsMap[q.key]?.length){
                q.visible = validationsMap[q.key]
                                .some(v=>{
                                    return canEnableQuestion(v.baseQuestionKey, v, responses);
                                });
            }
        });   
    }  
    return props.questions;
});

function showQuestion(indicatorData, question){

    if(props.hideMissingResponse)
        return indicatorData?.responses && indicatorData?.responses[question?.key];

    return true;

}

function showQuestions(indicatorData, questions){
    if(!props.hideMissingResponse)  
        return true;
    
    return questions.some(question=>{

        if(!question.questions){
            if(props.hideMissingResponse)
                return indicatorData?.responses && indicatorData?.responses[question?.key];
        }

        return showQuestions(indicatorData, question.questions);
    })
}

    function flattenQuestions(questions){
        return questions.map(e=>{
            const lQuestions = [e];
            if(e?.questions?.length)
                lQuestions.push(...flattenQuestions(e.questions));

            return lQuestions;
        })
        .flat().filter(e=>e)        
    }

    function buildValidationMap(questions){
        const validationsMap = {}
        questions.forEach(q=>{
            if(q.validations?.length){
                q.validations.forEach(v=>{
                    validationsMap[v.question] = validationsMap[v.question] || [];
                    validationsMap[v.question].push({...v, baseQuestionKey: q.key});
                });
            }
        });
        return validationsMap;
    }

    function canEnableQuestion(questionKey:string, validation:any, flatAnswers:any):void {
        const questionAnswer = flatAnswers?.[questionKey];
        let validationPositive = false;
        
        if (questionAnswer) {
            if (validation.type === '@hasValues') {
                if (validation.values) {
                    if(Array.isArray(questionAnswer)){
                        validationPositive = questionAnswer.some(a=>validation.values.includes(a));
                    }
                    else{
                        validationPositive = validation.values.includes(questionAnswer);
                    }
                }
            }
        }

        return validationPositive;
    }
</script>