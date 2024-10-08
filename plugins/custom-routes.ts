

function resolveUrlParams(url:string, params){
    for (const param in params) {
        if (Object.prototype.hasOwnProperty.call(params, param)) {
            url = url.replace(param, params[param]);
        }
    }

    return url;
}

export default defineNuxtPlugin(async (nuxtApp) => {

    const { $appRoutes } = useNuxtApp()
    addRouteMiddleware("customRoutes", async (to, from) => {                
            const matchedRoute = findMatchingRoute($appRoutes, to, from);
            if(matchedRoute){
                
                return useNavigateAppTo(matchedRoute, { external: true });
            }
        }, 
        { global: true }
    )
})

function findMatchingRoute($appRoutes, to, from){
    const customUrlRegex = {
        registerNationalTargetsView : {
            regex  :  /register\/NT7\/([A-Za-z0-9_\-@]+)\/view/i,
            params : [':identifier'],
            url    : $appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_VIEW
        },
        registerNationalTargetsEdit : {
            regex  :  /register\/NT7\/([A-Za-z0-9_\-@]+)\/edit/i,
            params : [':identifier'],
            url    : $appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_EDIT
        },
        registerNationalTargetsMappingView : {
            regex  :  /register\/NT7\/([A-Za-z0-9_\-@]+)\/view/i,
            params : [':identifier'],
            url    : $appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_II_VIEW
        },
        registerNationalTargetsMappingEdit : {
            regex  :  /register\/NT7\/([A-Za-z0-9_\-@]+)\/edit/i,
            params : [':identifier'],
            url    : $appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_II_EDIT
        },
        databaseRecordView : {
            regex  :  /database\/record(\/([A-Za-z0-9_\-@]+))?/i,
            params : [':documentID'],
            query  : ['documentID'],
            url    : $appRoutes.DATABASE.replace(':identifier', ':documentID')
        },
        searchView : {
            regex  :  /search\/(\/([A-Za-z0-9]+))?/i,
            url    : $appRoutes.NATIONAL_TARGETS
        },
        workflowRequests : {
            regex  :  /\/management\/requests(\/([A-Za-z0-9]+))?/i,
            url    : $appRoutes.WORKFLOWS_REQUESTS
        },
    }
    
    for (const route in customUrlRegex) {
                
        const matchedRoute = customUrlRegex[route];

        if(matchedRoute.regex.test(to.path)){
            let identifier;
            const matches = to.path.match(matchedRoute.regex);
            
            const params = {};

            if(matchedRoute.query){
                for (const paramIndex in matchedRoute.query) {
                    const param = matchedRoute.query[paramIndex]
                    if (to.query[param]) {
                        params[`:${param}`] = to.query[param];
                    }
                }
            }
            if(matchedRoute.params){
                for (const param in matchedRoute.params) {
                    if (Object.prototype.hasOwnProperty.call(matchedRoute.params, param)) {
                        const element = matchedRoute.params[param];
                        if(matches[Number(param)+1])
                            params[element] = matches[Number(param)+1];
                    }
                }
            }

            const route = useRoute();
            const url = resolveUrlParams( matchedRoute.url, params);
            return {path:url, query: route.query, params:route.params};
            break;
        }
        // register/:schema/:identifier/edit
    }
}