const appRoutes = {

    DASHBOARD                   : '/dashboard',
    NBSAPS_TARGETS              : '/nbsap-targets',
    NBSAPS_TARGETS_OVERVIEW     : '/nbsap-targets/my-country',
    NBSAPS_TARGETS_NEW          : '/nbsap-targets/my-country/new',
    NBSAPS_TARGETS_EDIT         : '/nbsap-targets/my-country/:identifier/edit',
    NBSAPS_TARGETS_VIEW         : '/nbsap-targets/my-country/:identifier/view',
    
    NATIONAL_REPORTS            : '/national-reports',
    NATIONAL_REPORTS_NR6        : '/national-reports/nr6',

    NATIONAL_REPORTS_NR7        : '/national-reports/nr7',
    NATIONAL_REPORTS_NR7_EDIT   : '/national-reports/nr7/edit',

}

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.provide('appRoutes', appRoutes);
    return {
        provide : {
            appRoutes
        }
    }
})