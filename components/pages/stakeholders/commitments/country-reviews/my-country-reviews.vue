<template>
  <div>
    <CCard>
        <CCardHeader class="d-flex align-items-center justify-content-between">
          <span>{{t('countryReviews')}}</span>
          <CButton v-if="myCountryReviewsStats?.organizationStats?.length || myCountryReviewsStats?.countryStats?.length"
            color="primary" variant="outline" size="sm" @click="scrollToBreakdown">
            <font-awesome-icon icon="fa-chart-bar" /> {{ t('viewStats') }}
          </CButton>
        </CCardHeader>
        <CCardBody>
            <div class="mb-3">
                <p class="text-muted small mb-1">{{ t('helpText') }}</p>
                <p class="text-muted small mb-2">
                    {{ t('helpAutoLinkPre') }}<a href="https://www.cbd.int/doc/decisions/cop-16/cop-16-dec-32-en.pdf" target="_blank" rel="noopener">{{ t('helpAutoLinkLabel') }}</a>{{ t('helpAutoLinkPost') }}
                </p>
                <div class="d-flex flex-wrap gap-3">
                    <span class="small"><span class="badge bg-danger-subtle text-danger-emphasis rounded-pill me-1">{{ t('awaitingReview') }}</span>{{ t('helpStatusAwaiting') }}</span>
                    <span class="small"><span class="badge bg-success-subtle text-success-emphasis rounded-pill me-1">{{ t('published') }}</span>{{ t('helpStatusLinked') }}</span>
                    <span class="small"><span class="badge bg-info-subtle text-info-emphasis rounded-pill me-1">{{ t('autoReviewed') }}</span>{{ t('helpStatusAutoLinked') }}</span>
                    <span class="small"><span class="badge bg-warning-subtle text-warning-emphasis rounded-pill me-1">{{ t('returned') }}</span>{{ t('helpStatusReturned') }}</span>
                </div>
            </div>
             <CRow v-if="security.role.isNationalFocalPoint()">
                <CCol col="12" class="">
                    <div class="alert alert-info">
                        <auto-approve-commitments/>
                    </div>
                </CCol>
            </CRow>
            <!-- Country reviews -->
            <div v-if="myCountryReviewsStats?.stats">
                <!-- Urgency banner -->
                <div v-if="myCountryReviewsStats.stats?.awaitingReview > 0"
                    class="d-flex align-items-center gap-3 p-3 rounded mb-3 border border-danger-subtle"
                    style="background: rgba(229,83,83,.07)">
                    <CBadge color="danger" shape="rounded-pill">{{ myCountryReviewsStats.stats.awaitingReview }}</CBadge>
                    <span class="small">
                        <strong>{{ myCountryReviewsStats.stats.awaitingReview }}</strong> {{ t('urgencyBanner') }}
                    </span>
                    <CButton color="danger" variant="ghost" size="sm" class="ms-auto fw-semibold p-1"
                        @click="applyFilter('awaitingReview')">
                        {{ t('reviewNow') }}
                    </CButton>
                </div>
                <CRow>
                    <CCol col="12" md="6" lg="2">
                        <CCallout color="secondary" :title="t('all')" @click="applyFilter('all')"
                            :class="reviewFilter === 'all' ? 'bg-secondary' : ''" style="cursor:pointer">
                            <small class="text-muted me-2">{{t('all')}}</small>
                            <strong class="h4 float-end">{{myCountryReviewsStats.stats.all}}</strong>
                        </CCallout>
                    </CCol>
                    <CCol col="12" md="6" lg="2">
                        <CCallout color="success" :title="t('published')" @click="applyFilter('reviewed')"
                            :class="reviewFilter === 'reviewed' ? 'bg-success' : ''" style="cursor:pointer">
                            <small class="text-muted me-2">{{t('published')}}</small>
                            <strong class="h4 float-end">{{myCountryReviewsStats.stats.reviewed}}</strong>
                        </CCallout>
                    </CCol>
                    <CCol col="12"  md="6" lg="2">
                        <CCallout color="warning" :title="t('returned')" @click="applyFilter('returned')"
                            :class="reviewFilter === 'returned' ? 'bg-warning' : ''" style="cursor:pointer">
                            <small class="text-muted me-2">{{t('returned')}}</small>
                            <strong class="h4 float-end">{{myCountryReviewsStats.stats.returned}}</strong>
                        </CCallout>
                    </CCol>
                    <CCol col="12"  md="6" lg="2">
                        <CCallout color="danger" :title="t('awaitingReview')" @click="applyFilter('awaitingReview')"
                            :class="reviewFilter === 'awaitingReview' ? 'bg-danger' : ''" style="cursor:pointer">
                            <small class="text-muted me-2">{{t('awaitingReview')}}</small>
                            <strong class="h4 float-end">{{myCountryReviewsStats.stats.awaitingReview}}</strong>
                        </CCallout>
                    </CCol> 
                    <CCol col="12"  md="6" lg="2">
                        <CCallout color="info" :title="t('autoReviewed')" @click="applyFilter('autoReviewed')"
                            :class="reviewFilter === 'autoReviewed' ? 'bg-info' : ''" style="cursor:pointer">
                            <small class="text-muted me-2">{{t('autoReviewed')}}</small>
                            <strong class="h4 float-end">{{myCountryReviewsStats.stats.autoReviewed}}</strong>
                        </CCallout>
                    </CCol> 
                </CRow>     
            
                <country-review-list v-if="myCountryReviews?.items?.length"
                    :countryReviews="myCountryReviews.items"
                    @on-status-change="onStatusChange"></country-review-list>                
                <div class="mt-3">
                     <pagination
                        v-if="myCountryReviews.totalCount > pageSize"
                        :record-count="myCountryReviews.totalCount"
                        :records-per-page="pageSize"
                        :current-page="currentPage"
                        @on-page-change="currentPage = $event; loadMyCountryReviews()"
                        @on-records-per-page-changed="pageSize = $event; currentPage = 1; loadMyCountryReviews()"
                    />
                </div>
            </div> 
            <!-- <div v-if="!loading && !myCountryReviews?.items?.length && !reviewFilter" class="alert alert-info">
                {{t('noCountryReviews')}}
            </div>   -->
            <div v-if="!loading && !myCountryReviews?.items?.length" class="alert alert-info">
                {{t('noCountryReviewsFoundForFilter')}}
            </div>  
            
            <km-spinner v-if="loading" center ></km-spinner>

        </CCardBody>
    </CCard>

    <!-- Breakdown card -->
    <CCard class="mt-4" ref="breakdownRef"
        v-if="myCountryReviewsStats?.organizationStats?.length || myCountryReviewsStats?.countryStats?.length">
        <CCardHeader class="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
                <div class="fw-semibold">{{ t('breakdown') }}</div>
                <div class="small text-muted">{{ t('breakdownSub') }}</div>
            </div>
            <div class="btn-group" role="group">
                <CButton size="sm" :color="breakdownGroup === 'org' ? 'primary' : 'secondary'"
                    :variant="breakdownGroup === 'org' ? undefined : 'outline'"
                    @click="breakdownGroup = 'org'">
                    {{ t('byOrganization') }}
                </CButton>
                <CButton size="sm" :color="breakdownGroup === 'country' ? 'primary' : 'secondary'"
                    :variant="breakdownGroup === 'country' ? undefined : 'outline'"
                    @click="breakdownGroup = 'country'">
                    {{ t('byCountry') }}
                </CButton>
            </div>
        </CCardHeader>
        <CCardBody class="p-0">
            <div class="d-flex flex-wrap gap-3 px-3 py-2 border-bottom bg-light">
                <span class="d-inline-flex align-items-center gap-2 small text-muted">
                    <i class="bd-swatch" style="background:#2eb85c"></i>{{ t('published') }}
                </span>
                <span class="d-inline-flex align-items-center gap-2 small text-muted">
                    <i class="bd-swatch" style="background:#3399ff"></i>{{ t('autoReviewed') }}
                </span>
                <span class="d-inline-flex align-items-center gap-2 small text-muted">
                    <i class="bd-swatch" style="background:#f9b115"></i>{{ t('returned') }}
                </span>
                <span class="d-inline-flex align-items-center gap-2 small text-muted">
                    <i class="bd-swatch" style="background:#e55353"></i>{{ t('awaitingReview') }}
                </span>
            </div>
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th class="text-uppercase small text-muted fw-semibold py-2">
                                {{ breakdownGroup === 'org' ? t('organization') : t('country') }}
                            </th>
                            <th class="text-uppercase small text-muted fw-semibold py-2 text-end">{{ t('total') }}</th>
                            <th class="text-uppercase small text-muted fw-semibold py-2" style="min-width:180px">{{ t('composition') }}</th>
                            <th class="text-uppercase small text-muted fw-semibold py-2 text-end">{{ t('published') }}</th>
                            <th class="text-uppercase small text-muted fw-semibold py-2 text-end">{{ t('autoReviewed') }}</th>
                            <th class="text-uppercase small text-muted fw-semibold py-2 text-end">{{ t('returned') }}</th>
                            <th class="text-uppercase small text-muted fw-semibold py-2 text-end">{{ t('awaitingReview') }}</th>
                        </tr>
                    </thead>
                    <tbody v-if="breakdownGroup === 'org'">
                        <tr v-for="row in myCountryReviewsStats.organizationStats" :key="lstring(row.organization, locale)">
                            <td>
                                <span class="fw-semibold small">{{ lstring(row.organization, locale) }}</span>
                                <span v-if="lstring(row.organizationAcronym, locale)" class="small text-muted ms-2">
                                    {{ lstring(row.organizationAcronym, locale) }}
                                </span>
                            </td>
                            <td class="text-end fw-bold">{{ row.count }}</td>
                            <td>
                                <div class="bd-stack">
                                    <div :style="{ width: bdPct(row.stats.reviewed - row.stats.autoReviewed, row.count) + '%', background: '#2eb85c' }"></div>
                                    <div :style="{ width: bdPct(row.stats.autoReviewed, row.count) + '%', background: '#3399ff' }"></div>
                                    <div :style="{ width: bdPct(row.stats.returned, row.count) + '%', background: '#f9b115' }"></div>
                                    <div :style="{ width: bdPct(row.stats.awaitingReview, row.count) + '%', background: '#e55353' }"></div>
                                </div>
                                <div class="small text-muted mt-1">
                                    <strong style="color:#1f8a44">{{ row.count ? Math.round(row.stats.reviewed / row.count * 100) : 0 }}%</strong> {{ t('published') }}
                                </div>
                            </td>
                            <td class="text-end small" :class="{ 'text-muted': !row.stats.reviewed }">{{ row.stats.reviewed }}</td>
                            <td class="text-end small" :class="{ 'text-muted': !row.stats.autoReviewed }">{{ row.stats.autoReviewed }}</td>
                            <td class="text-end small" :class="{ 'text-muted': !row.stats.returned }">{{ row.stats.returned }}</td>
                            <td class="text-end small" :class="{ 'text-muted': !row.stats.awaitingReview }">{{ row.stats.awaitingReview }}</td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr v-for="row in myCountryReviewsStats.countryStats" :key="row.country">
                            <td>
                                <km-term :value="{ identifier: row.country }" :locale="locale" class="fw-semibold small" />
                            </td>
                            <td class="text-end fw-bold">{{ row.stats.all }}</td>
                            <td>
                                <div class="bd-stack">
                                    <div :style="{ width: bdPct(row.stats.reviewed - row.stats.autoReviewed, row.stats.all) + '%', background: '#2eb85c' }"></div>
                                    <div :style="{ width: bdPct(row.stats.autoReviewed, row.stats.all) + '%', background: '#3399ff' }"></div>
                                    <div :style="{ width: bdPct(row.stats.returned, row.stats.all) + '%', background: '#f9b115' }"></div>
                                    <div :style="{ width: bdPct(row.stats.awaitingReview, row.stats.all) + '%', background: '#e55353' }"></div>
                                </div>
                                <div class="small text-muted mt-1">
                                    <strong style="color:#1f8a44">{{ row.stats.all ? Math.round(row.stats.reviewed / row.stats.all * 100) : 0 }}%</strong> {{ t('published') }}
                                </div>
                            </td>
                            <td class="text-end small" :class="{ 'text-muted': !row.stats.reviewed }">{{ row.stats.reviewed }}</td>
                            <td class="text-end small" :class="{ 'text-muted': !row.stats.autoReviewed }">{{ row.stats.autoReviewed }}</td>
                            <td class="text-end small" :class="{ 'text-muted': !row.stats.returned }">{{ row.stats.returned }}</td>
                            <td class="text-end small" :class="{ 'text-muted': !row.stats.awaitingReview }">{{ row.stats.awaitingReview }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </CCardBody>
    </CCard>
  </div>
</template>

<i18n src="@/i18n/dist/components/pages/stakeholders/commitments/country-reviews/my-country-reviews.json"></i18n>
             
<script setup lang="ts">

    import KmStakeholderCommitmentApi from '~/api/km-stakeholder-commitment';
import type { EAuthUser } from '~/types/schemas/base/EAuthUser';
import type { ECommitmentCountryReview, CommitmentReviewsStatsResponse } from '~/types/schemas/ECommitmentCountryReview';
import { formatDate, lstring } from '~/utils/filters';
import type { ApiListResponse } from '~/types/api/api-response';
    
    const kmStakeholderCommitmentApi = new KmStakeholderCommitmentApi({});
    const { t, locale } = useI18n();
    const breakdownGroup = ref<'org' | 'country'>('org');
    const breakdownRef = ref<HTMLElement | null>(null);

    function scrollToBreakdown() {
        (breakdownRef.value as any)?.$el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function bdPct(n: number, total: number) {
        return total ? Math.round(n / total * 100) : 0;
    }
    const { user } = useAuth();
    const realmConf = useRealm();
    const security      = useSecurity();
    const realmConf     = useRealm();
    const myCountryReviews = ref<ApiListResponse<ECommitmentCountryReview>>({items:[], totalCount:0, limit:0, offset:0, returnedCount:0});
    const myCountryReviewsStats = ref<CommitmentReviewsStatsResponse>();
    const reviewFilter = ref<string>('all');
    const currentPage = ref(1);
    const pageSize = ref(25);
    const loading = ref(false);

    async function loadMyCountryReviews(resetStats:boolean = false){
        loading.value = true;
        myCountryReviews.value.items = [];
        const data = await kmStakeholderCommitmentApi.getCountryReviews({ 
            government : user.value.government, 
            realm: (realmConf as any).realm,
            reviewStatus: reviewFilter.value
        }, 
        { 
            length : pageSize.value, 
            skip: (currentPage.value - 1) * pageSize.value, 
            sort: {"reviewed": 1, "meta.updatedOn": -1}
        });
        myCountryReviews.value = data;
        loading.value = false;
    }

    async function loadMyCountryReviewsStats(){
        const data = await kmStakeholderCommitmentApi.getCountryReviewStats({ 
            government : user.value.government, 
            realm: (realmConf as any).realm,
            reviewStatus: reviewFilter.value,
            countryStats: true,
            organizationStats: true
        });
        myCountryReviewsStats.value = data;
    }

    async function onStatusChange(identifier:string, published:boolean){
        if(myCountryReviews.value?.items){
            const countryStatus = myCountryReviews.value.items.find((e:ECommitmentCountryReview)=>e.identifier == identifier)
            if(countryStatus){
                countryStatus.reviewed = published
                countryStatus.meta.updatedBy = user.value.userID
                countryStatus.meta.updatedOn = new Date();
                countryStatus.meta.updatedByInfo = {
                    email : user.value.email,
                    firstName : user.value.name,
                    lastName : '',
                    userID : user.value.userID
                }
            }
        }
    }

    function applyFilter(filter:string){
        reviewFilter.value = filter;
        currentPage.value = 1;
        loadMyCountryReviews();
    }
    onMounted(()=>{
        loadMyCountryReviews(true);
        loadMyCountryReviewsStats();
    });

</script>

<style scoped>
.bd-swatch {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 3px;
    flex: none;
}
.bd-stack {
    display: flex;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    background: #eceef1;
    min-width: 140px;
}
.bd-stack > div {
    height: 100%;
    transition: width .3s;
}
</style>