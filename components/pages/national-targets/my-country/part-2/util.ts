import {uniqBy} from 'lodash'

export const buildTargetMatrix = (globalTargets: any[], nationalTargets: any[], nationalMappings: any[])=>{
    
    const matrix = [];

    for (let i = 0; i < globalTargets.length; i++) {
        const target = {...globalTargets[i]};
        
        target.nationalTargets = []

        const lNationalTargets  = [...nationalTargets.filter (e=>getAlignedGoalsOrTargets(e.workingDocumentBody || e.body)?.map(g=>g.identifier)?.includes(target.identifier))];
        const lNationalMappings = {...nationalMappings.find(e=>(e.workingDocumentBody || e.body)?.globalGoalOrTarget?.identifier  == target.identifier)};

        target.elementOfGlobalTargetsInfo = (lNationalMappings?.workingDocumentBody || lNationalMappings?.body)?.elementOfGlobalTargetsInfo;
        target.nationalMapping            = (lNationalMappings?.workingDocumentBody || lNationalMappings?.body);
        target.nationalMappingInfo        = lNationalMappings
        target.nationalTargets = lNationalTargets.map(e=>{
            return { identifier : e.identifier, title : (e.workingDocumentBody || e.body)?.title}
        });

        target.headlineIndicators.forEach(indicator => {
            indicator.nationalTargets = [...lNationalTargets];
            indicator.referencePeriod = target.nationalMapping?.referencePeriod?.find(e=>e.headlineIndicator.identifier == indicator.identifier);
        });

        const otherIndicators = uniqBy([...target.componentIndicators, ...target.complementaryIndicators], 'identifier');

        target.otherIndicators = otherIndicators.filter(indicator=>{
            
            const found = lNationalTargets.find(nationalTarget=>{
                return  (nationalTarget?.workingDocumentBody || nationalTarget?.body)?.componentIndicators?.find(e=>e.identifier == indicator.identifier)||
                        (nationalTarget?.workingDocumentBody || nationalTarget?.body)?.complementaryIndicators?.find(e=>e.identifier == indicator.identifier)
            });
            return found;
        })

        matrix.push(target);

    }

    return matrix;
}

export function getAlignedGoalsOrTargets(document:ENationalTarget7|ENationalTarget7Mapping){

    if(document?.header.schema == SCHEMAS.NATIONAL_TARGET_7){
        return [
            ...(document.globalGoalAlignment ||[]),
            ...(document.globalTargetAlignment||[])
        ]
    }
    else if(document?.header.schema == SCHEMAS.NATIONAL_TARGET_7_MAPPING){
        return [document.globalGoalOrTarget]
    }

    return [];
}