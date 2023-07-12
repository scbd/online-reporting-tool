import { useThesaurusStore } from '@/stores/thesaurus';

class GBFGoalsAndTargets{

    defaultFields:Array<string> = [ 'identifier', 'title', 'narrowerTerms1', 
                                    'headlineIndicators', 'componentIndicators', 'complementaryIndicators']

    constructor(){

    }

    async loadGbfGoals(fields:Array<string> = this.defaultFields){
        const thesaurusStore  = useThesaurusStore();
        await thesaurusStore.loadDomainTerms(THEASURUS.GBF_GLOBAL_GOALS, {relations:true})

        const terms = thesaurusStore.getDomainTerms(THEASURUS.GBF_GLOBAL_GOALS);

        if(fields?.length){
            return mapFields(terms, fields);
        }

        return terms;
    }

    async loadGbfTargets(fields:Array<string> = this.defaultFields){
        const thesaurusStore  = useThesaurusStore();
        await thesaurusStore.loadDomainTerms(THEASURUS.GBF_GLOBAL_TARGETS, {relations:true})

        const terms = thesaurusStore.getDomainTerms(THEASURUS.GBF_GLOBAL_TARGETS);

        if(fields?.length){
            return mapFields(terms, fields);
        }

        return terms;
    }

    async loadGbfGoalsAndTargets(fields:Array<string> = this.defaultFields){
        const response = await Promise.all([ this.loadGbfGoals(fields), this.loadGbfTargets(fields) ])

        return [...response[0], ...response[1] ];

    }
    async loadGbfGoalsAndTargetsWithIndicators(fields:Array<string> = this.defaultFields){
        const response = await Promise.all([GbfGoalsAndTargets.loadGbfGoalsAndTargets([]),
                                GbfGoalsAndTargets.loadGbfHeadlineIndicator(''),
                                GbfGoalsAndTargets.loadGbfComponentIndicator(''),
                                GbfGoalsAndTargets.loadGbfComplementaryIndicator('')
                            ]);
        const goalsAndTargets = response[0];

        for (let i = 0; i < goalsAndTargets.length; i++) {
            const target = goalsAndTargets[i];
            target.headlineIndicators       = await this.loadGbfHeadlineIndicator(target.identifier)
            target.componentIndicators      = await this.loadGbfComponentIndicator(target.identifier)
            target.complementaryIndicators  = await this.loadGbfComplementaryIndicator(target.identifier)
        }

        if(fields?.length){
            return mapFields(goalsAndTargets, fields);
        }
        return goalsAndTargets;
    }

    async loadGbfHeadlineIndicator(goalOrTarget:string, fields:Array<string> = this.defaultFields){

        const indicators = await loadIndicators(THEASURUS.GBF_HEADLINE_INDICATORS, goalOrTarget)
        if(fields?.length){
            return mapFields(indicators, fields);
        }

        return indicators;
       
    }

    async loadGbfComponentIndicator(goalOrTarget:string, fields:Array<string> = this.defaultFields){
        
        const indicators = await loadIndicators(THEASURUS.GBF_COMPONENT_INDICATORS, goalOrTarget)
        if(fields?.length){
            return mapFields(indicators, fields);
        }

        return indicators;
    }

    async loadGbfComplementaryIndicator(goalOrTarget:string, fields:Array<string> = this.defaultFields){

        const indicators = await loadIndicators(THEASURUS.GBF_COMPLEMENTARY_INDICATORS, goalOrTarget)
        if(fields?.length){
            return mapFields(indicators, fields);
        }

        return indicators;
        
    }


}

function mapFields(list:Array<any>, fields:Array<string>){
    return list.map(target=>{
        let newItem = {};
        fields.forEach(field=>{
            if(target[field])
                newItem[field] = target[field]
        });

        return newItem;
    })
}
async function loadIndicators(code:string, goalOrTarget:string){

    const thesaurusStore  = useThesaurusStore();
    const headlinePromise = thesaurusStore.loadDomainTerms(code, {releations:true})
    const response = await Promise.all([ GbfGoalsAndTargets.loadGbfGoalsAndTargets([]), headlinePromise]);

    const indicators = thesaurusStore.getDomainTerms(code);
    const gbfGoalsAndTargets = response[0];
    if(goalOrTarget){
        const term = gbfGoalsAndTargets.find(e=> e.identifier == goalOrTarget);
        const termIndicators = indicators.filter(indicator=>{
            return term.narrowerTerms.includes(indicator.identifier)
        })
        
        return termIndicators;
    }

    return gbfGoalsAndTargets
}
export const GbfGoalsAndTargets = new GBFGoalsAndTargets();