<template>
    <record-type-overview
        :title="t('title')"
        :schema="SCHEMAS.REFERENCE_STAKEHOLDER_CREDENTIAL"
        :view-route="appRoutes.STAKEHOLDER_MY_CREDENTIALS_VIEW"
        :edit-route="appRoutes.STAKEHOLDER_MY_CREDENTIALS_EDIT"
        :new-route="appRoutes.STAKEHOLDER_MY_CREDENTIALS_NEW"
        :filter-by-title="false">
        <template #actionButtons>
           <export :search-query="searchQuery" :schema="SCHEMAS.REFERENCE_STAKEHOLDER_CREDENTIAL"></export>
        </template>
    </record-type-overview>
            
</template>
<i18n src="@/i18n/dist/components/pages/stakeholders/credentials/my-credentials.json"></i18n>

<script setup lang="ts">
//@ts-nocheck

    import { andOr, queryIndex, escape, parseSolrQuery } from '@/services/solr'
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

   const searchQuery = ref({});
   const exportDialogRef = ref();
   const exportSelectedSchema = ref({identifier:SCHEMAS.REFERENCE_STAKEHOLDER_CREDENTIAL});
    const { user }     = useAuth();
        const security = useSecurity();

    searchQuery.value = {
        rowsPerPage: 1000,
        query: "schema_s:" + SCHEMAS.REFERENCE_STAKEHOLDER_CREDENTIAL,
        sort : "updatedDate_dt desc",
        start: 0        
    }
    if(user.value?.isAuthenticated && !security.role.isAdministrator()){
        searchQuery.value.query += ` AND _contributor_is:${user.value.userID}`;
    }
    const result = await queryIndex(parseSolrQuery(searchQuery.value, locale));
</script>