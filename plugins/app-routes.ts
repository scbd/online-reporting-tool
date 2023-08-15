const appRoutes = {

    DASHBOARD                   : '/dashboard',
    NATIONAL_TARGETS              : '/national-targets',

    NATIONAL_TARGETS_MY_COUNTRY             : '/national-targets/my-country',
    NATIONAL_TARGETS_MY_COUNTRY_PART_I      : '/national-targets/my-country/part-1',
    NATIONAL_TARGETS_MY_COUNTRY_PART_I_EDIT : '/national-targets/my-country/part-1/:identifier/edit',
    NATIONAL_TARGETS_MY_COUNTRY_PART_I_VIEW : '/national-targets/my-country/part-1/:identifier/view',
    NATIONAL_TARGETS_MY_COUNTRY_PART_I_NEW  : '/national-targets/my-country/part-1/new',
    NATIONAL_TARGETS_MY_COUNTRY_PART_II     : '/national-targets/my-country/part-2',
    NATIONAL_TARGETS_MY_COUNTRY_PART_II_EDIT: '/national-targets/my-country/part-2/:identifier/edit',
    NATIONAL_TARGETS_MY_COUNTRY_PART_II_VIEW: '/national-targets/my-country/part-2/:identifier/view',
    
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