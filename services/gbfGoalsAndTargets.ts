import { useThesaurusStore } from '@/stores/thesaurus';

class GBFGoalsAndTargets{


    constructor(){

    }

    async loadGbfGoals(){
        const thesaurusStore  = useThesaurusStore();
        await thesaurusStore.loadDomainTerms(THEASURUS.GBF_GLOBAL_GOALS, {relations:true})

        return thesaurusStore.getDomainTerms(THEASURUS.GBF_GLOBAL_GOALS);
    }

    async loadGbfTargets(){
        const thesaurusStore  = useThesaurusStore();
        await thesaurusStore.loadDomainTerms(THEASURUS.GBF_GLOBAL_TARGETS, {relations:true})

        return thesaurusStore.getDomainTerms(THEASURUS.GBF_GLOBAL_TARGETS);
    }

    async loadGbfGoalsAndTargets(){
        const response = await Promise.all([ this.loadGbfGoals(), this.loadGbfTargets() ])

        return [...response[0], ...response[1] ];

    }

    async loadGbfHeadlineIndicator(goalOrTarget:string){

        const indicators = await loadIndicators(THEASURUS.GBF_HEADLINE_INDICATORS, goalOrTarget)
        return indicators;
       
    }

    async loadGbfComponentIndicator(goalOrTarget:string){
        
        const indicators = await loadIndicators(THEASURUS.GBF_COMPONENT_INDICATORS, goalOrTarget)
        return indicators;
    }

    async loadGbfComplementaryIndicator(goalOrTarget:string){

        const indicators = await loadIndicators(THEASURUS.GBF_COMPLEMENTARY_INDICATORS, goalOrTarget)
        return indicators;
        
    }


}
// 
async function loadIndicators(code:string, goalOrTarget:string){

    const thesaurusStore  = useThesaurusStore();
    const headlinePromise = thesaurusStore.loadDomainTerms(code, {releations:true})
    const response = await Promise.all([ GbfGoalsAndTargets.loadGbfGoalsAndTargets(), headlinePromise]);

    const indicators = thesaurusStore.getDomainTerms(code);
    const gbfGoalsAndTargets = response[0];
    
    const term = gbfGoalsAndTargets.find(e=> e.identifier == goalOrTarget);
    const termIndicators = indicators.filter(indicator=>{
        return term.narrowerTerms.includes(indicator.identifier)
    })
    
    return termIndicators;
}
export const GbfGoalsAndTargets = new GBFGoalsAndTargets();