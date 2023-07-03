const AppRoutes = {

    DASHBOARD                   : '/dashboard',
    NBSAPS_TARGETS              : '/nbsap-targets',
    NBSAPS_TARGETS_OVERVIEW     : '/nbsap-targets/overview',
    
    NATIONAL_REPORTS_NR6        : '/national-reports/nr6',

    NATIONAL_REPORTS_NR7   : '/national-reports/nr7',
    NATIONAL_REPORTS_NR7_EDIT   : '/national-reports/nr7/edit',

}

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.provide('appRoutes', AppRoutes);
})