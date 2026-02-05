<template>
    <CCard>
        <CCardHeader>
          {{t('countryReviews')}}
        </CCardHeader>
        <CCardBody>
            <CRow>
                <CCol col="12" md="6" lg="3">
                    <CCallout color="success" :title="t('published')">
                        <small class="text-muted me-2">{{t('published')}}</small>
                        <strong class="h4 float-end">{{publishedCount}}</strong>
                    </CCallout>
                </CCol>
                <CCol col="12"  md="6" lg="3">
                    <CCallout color="warning" :title="t('returned')">
                        <small class="text-muted me-2">{{t('returned')}}</small>
                        <strong class="h4 float-end">{{returnedCount}}</strong>
                    </CCallout>
                </CCol>
                <CCol col="12"  md="6" lg="3">
                    <CCallout color="danger" :title="t('awaitingAction')">
                        <small class="text-muted me-2">{{t('awaitingAction')}}</small>
                        <strong class="h4 float-end">{{ awaitingActionCount }}</strong>
                    </CCallout>
                </CCol> 
                <CCol col="12"  md="6" lg="3">
                    <CCallout color="info" :title="t('autoPublished')">
                        <small class="text-muted me-2">{{t('autoPublished')}}</small>
                        <strong class="h4 float-end">{{ autoPublishedCount }}</strong>
                    </CCallout>
                </CCol> 
            </CRow>              
            
            <country-review-list v-if="myCountryReviews?.length"
                        :countryReviews="myCountryReviews"
                        @on-status-change="onStatusChange"></country-review-list>
            
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
    const realmConf = useRealm();
    const myCountryReviews = ref<ECommitmentCountryReview[]>([]);

    const publishedCount = computed(()=>myCountryReviews.value.filter((e:ECommitmentCountryReview)=>e.reviewed===true).length)
    const returnedCount = computed(()=>myCountryReviews.value.filter((e:ECommitmentCountryReview)=>e.reviewed===false).length)
    const awaitingActionCount = computed(()=>myCountryReviews.value.filter((e:ECommitmentCountryReview)=>e.reviewed===undefined).length)
    const autoPublishedCount = computed(()=>myCountryReviews.value.filter((e:ECommitmentCountryReview)=>e.reviewed===true && e.meta.updatedByInfo.firstName === 'SYSTEM' ).length)

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