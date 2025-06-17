<template>
    <CCard>
        <CCardHeader>{{ t('taxonomy') }}</CCardHeader>
        <CCardBody>
            <div class="text-center border-bottom-1">
                <h5>{{ t('welcomeToTaxonomy') }}</h5>
            </div>
            <div class="row">
                <div class="col-sm-4 mb-2">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">{{ t('gbfTaxonomy') }}</h5>
                            <p class="card-text">{{ t('gbfTaxonomyDescription') }}</p>
                            <km-link class="btn btn-primary" :to="appRoutes.TAXONOMY_GBF" :title="t('view')"></km-link>                            
                        </div>
                    </div>
                </div>
                <div class="col-sm-4 mb-2">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">{{ t('gbfGoals') }}</h5>
                            <p class="card-text">{{ t('gbfGoalsDescription') }}</p>
                            <km-link class="btn btn-primary" :to="appRoutes.TAXONOMY_GBF_GOALS" :title="t('view')"></km-link>                            
                        </div>
                    </div>
                </div>
                <div class="col-sm-4 mb-2">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">{{ t('gbfTargets') }}</h5>
                            <p class="card-text">{{ t('gbfTargetsDescription') }}</p>
                            <km-link class="btn btn-primary" :to="appRoutes.TAXONOMY_GBF_TARGETS" :title="t('view')"></km-link>                            
                        </div>
                    </div>
                </div>
                <!-- <div class="col-sm-4 mb-2">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">{{ t('gbfIndicators') }}</h5>
                            <p class="card-text">{{ t('gbfIndicatorsDescription') }}</p>
                            <km-link class="btn btn-primary" :to="appRoutes.TAXONOMY_GBF_INDICATORS" :title="t('view')"></km-link>                            
                        </div>
                    </div>
                </div> -->
            </div>
        </CCardBody>
    </CCard>

</template>

<script setup lang="ts">
const { t } = useI18n();

useHead({
    title: "Taxonomy",
});

definePageMeta({
    auth: false,
    roles: [],
});

</script>

<style scoped></style>