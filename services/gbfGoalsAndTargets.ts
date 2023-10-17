import { useThesaurusStore } from '@/stores/thesaurus';

class GBFGoalsAndTargets{

    defaultFields:Array<string> = [ 'identifier', 'title', 'narrowerTerms1', 
                                    'headlineIndicators', 'componentIndicators', 'complementaryIndicators']

    constructor(){

    }

    async loadGbfGoals(fields:Array<string> = this.defaultFields){
        const thesaurusStore  = useThesaurusStore();
        await thesaurusStore.loadDomainTerms(THESAURUS.GBF_GLOBAL_GOALS, {relations:true})

        const terms = thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_GOALS);

        if(fields?.length){
            return mapFields(terms, fields);
        }

        return terms;
    }

    async loadGbfTargets(fields:Array<string> = this.defaultFields){
        const thesaurusStore  = useThesaurusStore();
        await thesaurusStore.loadDomainTerms(THESAURUS.GBF_GLOBAL_TARGETS, {relations:true})

        const terms = thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_TARGETS);

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

        const goalPromise = goalsAndTargets?.map(async target=>{
            const response = await Promise.all([
                                this.loadGbfHeadlineIndicator(target.identifier),
                                this.loadGbfComponentIndicator(target.identifier),
                                this.loadGbfComplementaryIndicator(target.identifier),
                                this.loadGbfBinaryIndicator(target.identifier)
                            ])
            target.headlineIndicators       = response[0];
            target.componentIndicators      = response[1];
            target.complementaryIndicators  = response[2];
            target.binaryIndicators         = response[3];
        })

        await Promise.all(goalPromise);

        if(fields?.length){
            return mapFields(goalsAndTargets, fields);
        }
        return goalsAndTargets;
    }

    async loadGbfHeadlineIndicator(goalOrTarget:string, fields:Array<string> = this.defaultFields){

        const indicators = await loadIndicators(THESAURUS.GBF_HEADLINE_INDICATORS, goalOrTarget)
        if(fields?.length){
            return mapFields(indicators, fields);
        }

        return indicators;
       
    }
    async loadGbfBinaryIndicator(goalOrTarget:string, fields:Array<string> = this.defaultFields){

        const indicators = await loadIndicators(THESAURUS.GBF_BINARY_INDICATORS, goalOrTarget)
        if(fields?.length){
            return mapFields(indicators, fields);
        }

        return indicators;
       
    }

    async loadGbfComponentIndicator(goalOrTarget:string, fields:Array<string> = this.defaultFields){
        
        const indicators = await loadIndicators(THESAURUS.GBF_COMPONENT_INDICATORS, goalOrTarget)
        if(fields?.length){
            return mapFields(indicators, fields);
        }

        return indicators;
    }

    async loadGbfComplementaryIndicator(goalOrTarget:string, fields:Array<string> = this.defaultFields){

        const indicators = await loadIndicators(THESAURUS.GBF_COMPLEMENTARY_INDICATORS, goalOrTarget)
        if(fields?.length){
            return mapFields(indicators, fields);
        }

        return indicators;
        
    }

    async loadIndicator(code:string, fields:Array<string> = this.defaultFields){

        const thesaurusStore  = useThesaurusStore();
        await thesaurusStore.loadTerm(code);
    
        const indicator = thesaurusStore.getTerm(code);
        if(fields?.length){
            return mapFields([indicator], fields)[0];
        }

        return indicator;

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
    const headlinePromise = thesaurusStore.loadDomainTerms(code, {relations:true})
    const response = await Promise.all([ GbfGoalsAndTargets.loadGbfGoalsAndTargets([]), headlinePromise]);

    const indicators = thesaurusStore.getDomainTerms(code);
    const gbfGoalsAndTargets = response[0];
    if(goalOrTarget){
        const term = gbfGoalsAndTargets.find(e=> e.identifier == goalOrTarget);
        const termIndicators = indicators.filter((indicator: { identifier: any; })=>{
            return term && term.narrowerTerms.includes(indicator.identifier)
        })
        
        return termIndicators;
    }

    return indicators
}
export const GbfGoalsAndTargets = new GBFGoalsAndTargets();