<template>
    <CCard>
        <CCardHeader>
          {{t('countryReviews')}}
        </CCardHeader>
        <CCardBody>
            <CRow v-if="security.role.isNationalFocalPoint()">
                <CCol col="12" class="">
                    <div class="alert alert-info">
                        <auto-approve-commitments/>
                    </div>
                </CCol>
            </CRow>
            <CRow>
                <CCol col="12" md="6" lg="2">
                    <CCallout color="secondary" :title="t('all')" @click="reviewFilter = 'all'"
                        :class="reviewFilter === 'all' ? 'bg-secondary' : ''" style="cursor:pointer">
                        <small class="text-muted me-2">{{t('all')}}</small>
                        <strong class="h4 float-end">{{allReviewsCount}}</strong>
                    </CCallout>
                </CCol>
                <CCol col="12" md="6" lg="2">
                    <CCallout color="success" :title="t('published')" @click="reviewFilter = 'published'"
                        :class="reviewFilter === 'published' ? 'bg-success' : ''" style="cursor:pointer">
                        <small class="text-muted me-2">{{t('published')}}</small>
                        <strong class="h4 float-end">{{publishedCount}}</strong>
                    </CCallout>
                </CCol>
                <CCol col="12"  md="6" lg="2">
                    <CCallout color="warning" :title="t('returned')" @click="reviewFilter = 'returned'"
                        :class="reviewFilter === 'returned' ? 'bg-warning' : ''" style="cursor:pointer">
                        <small class="text-muted me-2">{{t('returned')}}</small>
                        <strong class="h4 float-end">{{returnedCount}}</strong>
                    </CCallout>
                </CCol>
                <CCol col="12"  md="6" lg="2">
                    <CCallout color="danger" :title="t('awaitingAction')" @click="reviewFilter = 'awaitingAction'"
                        :class="reviewFilter === 'awaitingAction' ? 'bg-danger' : ''" style="cursor:pointer">
                        <small class="text-muted me-2">{{t('awaitingAction')}}</small>
                        <strong class="h4 float-end">{{ awaitingActionCount }}</strong>
                    </CCallout>
                </CCol> 
                <CCol col="12"  md="6" lg="2">
                    <CCallout color="info" :title="t('autoPublished')" @click="reviewFilter = 'autoPublished'"
                        :class="reviewFilter === 'autoPublished' ? 'bg-info' : ''" style="cursor:pointer">
                        <small class="text-muted me-2">{{t('autoPublished')}}</small>
                        <strong class="h4 float-end">{{ autoPublishedCount }}</strong>
                    </CCallout>
                </CCol> 
            </CRow>              
            
            <country-review-list v-if="myCountryReviewFiltered?.length"
                        :countryReviews="myCountryReviewFiltered"
                        @on-status-change="onStatusChange"></country-review-list>
            <div v-else-if="!myCountryReviews?.length && !reviewFilter" class="alert alert-info">
                {{t('noCountryReviews')}}
            </div>  
            <div v-else class="alert alert-info">
                {{t('noCountryReviewsFoundForFilter')}}
            </div>  
        </CCardBody>
    </CCard>
</template>

<i18n src="@/i18n/dist/components/pages/stakeholders/commitments/country-reviews/my-country-reviews.json"></i18n>
             
<script setup lang="ts">

    import KmStakeholderCommitmentApi from '~/api/km-stakeholder-commitment';
import type { EAuthUser } from '~/types/schemas/base/EAuthUser';
import type { ECommitmentCountryReview } from '~/types/schemas/ECommitmentCountryReview';
import { formatDate } from '~/utils/filters';
    
    const kmStakeholderCommitmentApi = new KmStakeholderCommitmentApi({});
    const { t, locale } = useI18n();
    const { user } = useAuth();
    const security      = useSecurity();
    const realmConf = useRealm();
    const security      = useSecurity();
    const myCountryReviews = ref<ECommitmentCountryReview[]>([]);
    const reviewFilter = ref<string>('all');

    const publishedCount = computed(()=>myCountryReviews.value.filter((e:ECommitmentCountryReview)=>e.reviewed===true).length)
    const returnedCount = computed(()=>myCountryReviews.value.filter((e:ECommitmentCountryReview)=>e.reviewed===false).length)
    const awaitingActionCount = computed(()=>myCountryReviews.value.filter((e:ECommitmentCountryReview)=>e.reviewed===undefined).length)
    const autoPublishedCount = computed(()=>myCountryReviews.value.filter((e:ECommitmentCountryReview)=>e.reviewed===true && e.meta.updatedByInfo.firstName === 'SYSTEM' ).length)
    const allReviewsCount = computed(()=>myCountryReviews.value.length)
    const myCountryReviewFiltered = computed(()=>{
        if(reviewFilter.value === 'all'){
            return myCountryReviews.value
        }
        if(reviewFilter.value === 'published'){
            return myCountryReviews.value.filter((e:ECommitmentCountryReview)=>e.reviewed===true)
        }
        if(reviewFilter.value === 'returned'){
            return myCountryReviews.value.filter((e:ECommitmentCountryReview)=>e.reviewed===false)
        }
        if(reviewFilter.value === 'awaitingAction'){
            return myCountryReviews.value.filter((e:ECommitmentCountryReview)=>e.reviewed===undefined)
        }
        if(reviewFilter.value === 'autoPublished'){
            return myCountryReviews.value.filter((e:ECommitmentCountryReview)=>e.reviewed===true && e.meta.updatedByInfo.firstName === 'SYSTEM' )
        }
        return myCountryReviews.value
    })   
    async function loadMyCountryReviews(){
         
        myCountryReviews.value = await kmStakeholderCommitmentApi.getCountryReviews({ government : user.value.government, realm: (realmConf as any).realm }, { length : 500});

    }
    async function onStatusChange(identifier:string, published:boolean){
        const countryStatus = myCountryReviews.value.find((e:ECommitmentCountryReview)=>e.identifier == identifier)
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

    onMounted(()=>{
        loadMyCountryReviews();
    });

</script>

<style scoped></style>