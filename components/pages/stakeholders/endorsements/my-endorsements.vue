<template>
    <CCard>
        <CCardHeader>
          {{t('endorsements')}}
        </CCardHeader>
        <CCardBody>
            <CRow>
                <CCol col="12" md="6" lg="3">
                    <CCallout color="success" :title="t('endorsed')">
                        <small class="text-muted me-2">{{t('endorsed')}}</small>
                        <strong class="h4 float-end">{{endorsedCount}}</strong>
                    </CCallout>
                </CCol>
                <CCol col="12"  md="6" lg="3">
                    <CCallout color="warning" :title="t('renounced')">
                        <small class="text-muted me-2">{{t('renounced')}}</small>
                        <strong class="h4 float-end">{{renouncedCount}}</strong>
                    </CCallout>
                </CCol>
                <CCol col="12"  md="6" lg="3">
                    <CCallout color="danger" :title="t('awaitingAction')">
                        <small class="text-muted me-2">{{t('awaitingAction')}}</small>
                        <strong class="h4 float-end">{{ awaitingActionCount }}</strong>
                    </CCallout>
                </CCol> 
                <CCol col="12"  md="6" lg="3">
                    <CCallout color="info" :title="t('autoApproved')">
                        <small class="text-muted me-2">{{t('autoApproved')}}</small>
                        <strong class="h4 float-end">{{ autoApprovedCount }}</strong>
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
            
            <endorsement-list v-if="myEndorsements?.length"
                        :endorsements="myEndorsements"
                        @on-status-change="onStatusChange"></endorsement-list>
            
        </CCardBody>
    </CCard>
</template>

<i18n src="@/i18n/dist/components/pages/stakeholders/commitments/my-endorsements.json"></i18n>
<script setup lang="ts">

    import KmStakeholderCommitmentApi from '~/api/km-stakeholder-commitment';
import type { EAuthUser } from '~/types/schemas/base/EAuthUser';
import type { CountryCommitmentStatus } from '~/types/schemas/ECountryCommitmentStatus';
import { formatDate } from '~/utils/filters';
    
    const kmStakeholderCommitmentApi = new KmStakeholderCommitmentApi({});
    const { t, locale } = useI18n();
    const { user } = useAuth();
    const myEndorsements = ref<CountryCommitmentStatus[]>([]);

    const endorsedCount = computed(()=>myEndorsements.value.filter((e:CountryCommitmentStatus)=>e.endorsed===true).length)
    const renouncedCount = computed(()=>myEndorsements.value.filter((e:CountryCommitmentStatus)=>e.endorsed===false).length)
    const awaitingActionCount = computed(()=>myEndorsements.value.filter((e:CountryCommitmentStatus)=>e.endorsed===undefined).length)
    const autoApprovedCount = computed(()=>myEndorsements.value.filter((e:CountryCommitmentStatus)=>e.endorsed===true && e.meta.updatedByInfo.firstName === 'SYSTEM' ).length)

    async function loadMyEndorsements(){
         
        myEndorsements.value = await kmStakeholderCommitmentApi.getEndorsements({ government : user.value.government }, { length : 500});

    }
    async function onStatusChange(identifier:string, endorsed:boolean){
        const countryStatus = myEndorsements.value.find((e:CountryCommitmentStatus)=>e.identifier == identifier)
        if(countryStatus){
            countryStatus.endorsed = endorsed
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
        loadMyEndorsements();
    });
</script>

<style scoped></style>