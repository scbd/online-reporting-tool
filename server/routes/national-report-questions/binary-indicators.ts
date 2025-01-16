//@ts-nocheck

import {binaryIndicatorQuestions} from '@/app-data/binary-indicator-questions.js' 

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    if(query.flat){
        return binaryIndicatorQuestions
                .map(e=>{
                    const {questions, key:sectionKey, ...others} = e
                    const subQuestions = getQuestions(e);

                    //add main question props to all sub questions
                    return subQuestions.map(q=>{
                        return { ...others, sectionKey, ...q }
                    })
                })
                .flat();
    }
    return binaryIndicatorQuestions;    
})
  

function getQuestions(question:Question){
    let flatQuestions:Question[] = [];
    if(question.questions?.length){
        const subQuestions = question.questions.map(getQuestions).flat();
        flatQuestions = [...flatQuestions, ...subQuestions]
    }
    else{
        flatQuestions = [{...question}]
    }
    return flatQuestions;
}