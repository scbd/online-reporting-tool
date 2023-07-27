
export const buildTargetMatrix = (globalTargets: any[], nationalTargets: any[], nationalMappings: any[])=>{
    
    const matrix = [];

    for (let i = 0; i < globalTargets.length; i++) {
        const target = {...globalTargets[i]};
        
        target.nationalTargets = []

        const lNationalTargets  = [...nationalTargets.filter (e=>e.body?.gbfGoalsAndTargetAlignment?.map(g=>g.identifier)?.includes(target.identifier))];
        const lNationalMappings = {...nationalMappings.find(e=>e.body?.globalGoalOrTarget?.identifier  == target.identifier)};

        target.elementOfGlobalTargetsinfo = lNationalMappings?.body?.elementOfGlobalTargetsinfo;
        target.nationalMapping            = lNationalMappings?.body;
        target.nationalTargets = lNationalTargets.map(e=>{
            return { identifier : e.identifier, title : e.body?.title}
        });

        target.headlineIndicators.forEach(indicator => {
            indicator.nationalTargets = [...lNationalTargets.filter(e=>e.body.headlineIndicators?.find(e=>e.identifier == indicator.identifier))];
            indicator.referencePeriod = target.nationalMapping?.referencePeriod?.find(e=>e.headlineIndicator.identifier == indicator.identifier);
        });

        const otherIndicators = [...target.componentIndicators, ...target.complementaryIndicators];

        target.otherIndicators = otherIndicators.filter(indicator=>{
            
            const found = lNationalTargets.find(nationalTarget=>{
                return  nationalTarget.body.componentIndicators?.find(e=>e.identifier == indicator.identifier)||
                        nationalTarget.body.complementaryIndicators?.find(e=>e.identifier == indicator.identifier)
            });
            return found;
        })

        matrix.push(target);

    }

    return matrix;
}