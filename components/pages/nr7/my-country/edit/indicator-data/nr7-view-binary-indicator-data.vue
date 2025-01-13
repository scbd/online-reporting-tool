<template>
    <!-- {{ indicatorData }} -->
    <div class="mb-3" v-for="question in questions" :key="question.key">
        <div v-if="!question.questions?.length && showQuestion(indicatorData, question)">
            <CCard>
                <CCardHeader>
                    <km-form-group class="mb-0">            
                        <template #caption>
                            <slot>{{question?.number}} {{question?.title}} </slot>
                        </template>
                    </km-form-group>
                </CCardHeader>
                <CCardBody>
                    <km-value v-if="(indicatorData?.responses||{})[question.key]">
                        <span v-if="question.type == 'option'">
                            {{ question.options.find(e=>e.value == (indicatorData?.responses||{})[question.key])?.title }}
                        </span>
                        <span v-if="question.type == 'checkbox'">
                                <div v-for="answer in (indicatorData?.responses||{})[question.key]" :key="answer">
                                    {{ question.options.find(e=>e.value == answer)?.title }}
                                </div>
                        </span>
                    </km-value>
                    <missing-data-alert v-if="!hideMissingResponse && !(indicatorData?.responses||{})[question.key]" class="alert-sm">
                        <template #message>
                             {{t('binaryIndicatorQuestion')}}
                        </template>
                    </missing-data-alert>
                </CCardBody>
            </CCard>

        </div>
        <div v-if="question.questions?.length && showQuestions(indicatorData, question.questions)">
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

    <km-form-group v-if="indicatorData.comments && !isRecursive" :caption="t('comments')">        
        <km-lstring-value type="html" :value="indicatorData.comments"  :locale="locale"></km-lstring-value>
    </km-form-group>
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/indicator-data/nr7-view-binary-indicator-data.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
const props = defineProps({
    indicatorData: { type: Object, required: true },
    questions : { type: Array, required: true },
    isRecursive : {type:Boolean, default:false},
    hideMissingResponse : {type:Boolean, default:false},
});
const {locale, t} = useI18n();

const { indicatorData } = toRefs(props);

function showQuestion(indicatorData, question){

    if(props.hideMissingResponse)
        return indicatorData?.responses && indicatorData?.responses[question.key];

    return true;

}

function showQuestions(indicatorData, questions){
    if(!props.hideMissingResponse)  
        return true;
    
    return questions.some(question=>{

        if(!question.questions){
            if(props.hideMissingResponse)
                return indicatorData?.responses && indicatorData?.responses[question.key];
        }

        return showQuestions(indicatorData, question.questions);
    })
}

</script>