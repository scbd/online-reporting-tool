const appRoutes = {

    DASHBOARD                   : '/dashboard',
    NBSAPS_TARGETS              : '/nbsap-targets',

    NBSAPS_TARGETS_MY_COUNTRY             : '/nbsap-targets/my-country',
    NBSAPS_TARGETS_MY_COUNTRY_PART_I      : '/nbsap-targets/my-country/part-1',
    NBSAPS_TARGETS_MY_COUNTRY_PART_I_EDIT : '/nbsap-targets/my-country/part-1/:identifier/edit',
    NBSAPS_TARGETS_MY_COUNTRY_PART_I_VIEW : '/nbsap-targets/my-country/part-1/:identifier/view',
    NBSAPS_TARGETS_MY_COUNTRY_PART_I_NEW  : '/nbsap-targets/my-country/part-1/new',
    NBSAPS_TARGETS_MY_COUNTRY_PART_II     : '/nbsap-targets/my-country/part-2',
    NBSAPS_TARGETS_MY_COUNTRY_PART_II_EDIT: '/nbsap-targets/my-country/part-2/:identifier/edit',
    NBSAPS_TARGETS_MY_COUNTRY_PART_II_VIEW: '/nbsap-targets/my-country/part-2/:identifier/view',
    
    NATIONAL_REPORTS            : '/national-reports',
    NATIONAL_REPORTS_NR6        : '/national-reports/nr6',

    NATIONAL_REPORTS_NR7        : '/national-reports/nr7',
    NATIONAL_REPORTS_NR7_EDIT   : '/national-reports/nr7/edit',

}

export default defineNuxtPlugin((nuxtApp) => {
    return {
        provide : {
            appRoutes
        }
    }
})