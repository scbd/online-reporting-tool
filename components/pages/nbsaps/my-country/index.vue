<template>
    <country-record-type-overview
        :title="t('title')"
        :schema="SCHEMAS.NATIONAL_NBSAP"
        :view-route="appRoutes.NATIONAL_REPORTS_NBSAP_MY_COUNTRY_VIEW"
        :edit-route="appRoutes.NATIONAL_REPORTS_NBSAP_MY_COUNTRY_EDIT"
        :new-route="appRoutes.NATIONAL_REPORTS_NBSAP_MY_COUNTRY_NEW">
    </country-record-type-overview>
            
</template>

<i18n src="@/i18n/dist/components/pages/nbsaps/my-country/index.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
    const { t, locale }            = useI18n();

    const onBoardingSteps = [
        { attachTo: { element: '#tourWelcome' },               content: { title: t('tourWelcomeTitle')     , description: t('tourWelcomeContent') } },
        { attachTo: { element: '#partICountsTour' },           content: { title: t('partICountsTitle')     , description: t('partICountsContent') } },
        { attachTo: { element: '#partIGoToOverview' },             content: { title: t('partIGoToOverviewTitle')       , description: t('partIGoToOverviewContent') } },
        { attachTo: { element: '#partIRefreshTour' },               content: { title: t('partIRefreshTitle')         , description: t('partIRefreshContent') } },
        { attachTo: { element: '#partISubmitTour' },           content: { title: t('partISubmitTitle')     , description: t('partISubmitContent') } },
        { attachTo: { element: '.national-target-list #record' },        content: { title: t('partINationalTargetRecordTitle')  , description: t('partINationalTargetRecordContent') } },
        { attachTo: { element: '.national-target-list #linkedGbfTour' },        content: { title: t('partILinkedGbfTitle')  , description: t('partILinkedGbfContent') } },
        
        { attachTo: { element: '.national-target-list #recordStatusTour' },           content: { title: t('partIStatusTitle')     , description: t('partIStatusContent') } },
        { attachTo: { element: '.national-target-list #viewRecordTour' },           content: { title: t('partIViewTitle')     , description: t('partIViewContent') } },
        { attachTo: { element: '.national-target-list #editRecordTour' },           content: { title: t('partIEditTitle')     , description: t('partIEditContent') } },
        { attachTo: { element: '.national-target-list #deleteRecordTour' },           content: { title: t('partIDeleteTitle')     , description: t('partIDeleteContent') } },
        
        
    ];

   

</script>