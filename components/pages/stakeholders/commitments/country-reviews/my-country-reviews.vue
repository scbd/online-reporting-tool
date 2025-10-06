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
            <!-- <button class="btn btn-danger btn-sm float-end" v-if="hasFilters" @click="clearFilters">{{ t('clearFilters') }}</button> -->
            <div id="filters" class="row">
                <!-- <div class="col-md-4"  v-if="recordTitles?.length">
                    <km-form-group :caption="t('filterByTitle')">
                        <km-select
                            v-model="selectedTitles"
                            class="validationClass"
                            label="title"
                            track-by="identifier"
                            value-key="identifier"
                            :options="recordTitles"
                            :multiple="true"
                            :close-on-select="false"
                            :custom-label="customLabel"
                            :custom-selected-item="customSelectedItem">
                        </km-select>
                    </km-form-group>
                </div>
                <div class="col-md-4" v-if="hasGbfObjectives">
                    <km-form-group :caption="t('filterByGlobalTargets')">
                        <gbf-targets v-model="selectedGlobalTargets" :multiple="true"></gbf-targets>
                    </km-form-group>
                </div>
                <div class="col-md-4" v-if="hasGbfObjectives">
                    <km-form-group :caption="t('filterByGlobalGoals')">
                        <gbf-goals v-model="selectedGlobalGoals" :multiple="true"></gbf-goals>
                    </km-form-group>
                </div> -->
            </div>
            
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
    const myCountryReviews = ref<ECommitmentCountryReview[]>([]);

    const publishedCount = computed(()=>myCountryReviews.value.filter((e:ECommitmentCountryReview)=>e.reviewed===true).length)
    const returnedCount = computed(()=>myCountryReviews.value.filter((e:ECommitmentCountryReview)=>e.reviewed===false).length)
    const awaitingActionCount = computed(()=>myCountryReviews.value.filter((e:ECommitmentCountryReview)=>e.reviewed===undefined).length)
    const autoPublishedCount = computed(()=>myCountryReviews.value.filter((e:ECommitmentCountryReview)=>e.reviewed===true && e.meta.updatedByInfo.firstName === 'SYSTEM' ).length)

    async function loadMyCountryReviews(){
         
        myCountryReviews.value = await kmStakeholderCommitmentApi.getCountryReviews({ government : user.value.government }, { length : 500});

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