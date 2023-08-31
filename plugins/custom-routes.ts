

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
                // databaseView : {
                //     regex  :  /database\/([A-Za-z0-9_\-@]+)/i,
                //     params : [':identifier'],
                //     url    : $appRoutes.DATABASE_VIEW
                // },
            }

            for (const route in customUrlRegex) {
                
                const matchedRoute = customUrlRegex[route];

                if(matchedRoute.regex.test(to.path)){
                    let identifier;
                    const matches = to.path.match(matchedRoute.regex);
                    
                    const params = {};

                    if(matchedRoute.params){
                        for (const param in matchedRoute.params) {
                            if (Object.prototype.hasOwnProperty.call(matchedRoute.params, param)) {
                                const element = matchedRoute.params[param];
                                params[element] = matches[Number(param)+1];
                            }
                        }
                    }

                    const route = useRoute();
                    const url = resolveUrlParams( matchedRoute.url, params);
                    return navigateTo({path:url, query: route.query, params:route.params})
                }
                // register/:schema/:identifier/edit
            }
            
        }, 
        { global: true }
    )
})