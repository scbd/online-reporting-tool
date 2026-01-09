<template>
    <div class="table-responsive">       
        <table class="table" v-if="countryReviews?.length">
            <thead>
                <tr>
                    <th scope="col">{{t('title')}}</th>
                    <th scope="col">{{t('government')}}</th>
                    <th scope="col">{{t('status')}}</th>
                    <th scope="col">{{t('updatedOn')}}</th>
                    <th scope="col">{{t('action')}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(countryReview) in countryReviews" :key="countryReview.identifier">
                    <td class="w-50">
                        <km-link :to="appRoutes.STAKEHOLDER_MY_COUNTRY_REVIEWS_VIEW.replace(':identifier', countryReview.identifier)" 
                            target="_blank" :title="lstring(countryReview.title, locale)"   
                            >
                        </km-link>
                    </td> 
                    <td>
                        <km-term :value="{identifier:countryReview.government}" :locale="locale"></km-term>
                    </td>                    
                    <td id="recordStatusTour">
                        <CBadge color="danger" v-if="countryReview.reviewed === undefined">
                            {{t('awaitingAction')}}
                        </CBadge>
                        <CBadge color="warning" v-if="countryReview.reviewed === false">
                            {{t('returned')}}
                        </CBadge>
                        <CBadge color="success" v-if="countryReview.reviewed === true">
                            {{t('published')}}
                        </CBadge>  
                        <CBadge class="ms-1" color="info" v-if="countryReview.reviewed === true && countryReview.meta.updatedByInfo?.firstName === 'SYSTEM'">
                            {{t('autoPublished')}}
                        </CBadge>                        
                    </td>
                    <td>
                        {{formatDate(countryReview.meta.updatedOn)}}<br/>
                        {{ countryReview.meta.updatedByInfo?.firstName }} {{ countryReview.meta.updatedByInfo?.lastName }}
                    </td>
                    <td>
                        <country-review-action v-if="countryReview.government == user.government"
                            :identifier="countryReview.identifier" :reviewed="countryReview.reviewed"
                            @on-status-change="onStatusChange(countryReview.identifier, $event)"></country-review-action>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<i18n src="@/i18n/dist/components/pages/stakeholders/commitments/country-reviews/country-review-list.json"></i18n>
<script setup lang="ts">


import KmStakeholderCommitmentApi from '~/api/km-stakeholder-commitment';
import type { EAuthUser } from '~/types/schemas/base/EAuthUser';
import type { ECommitmentCountryReview } from '~/types/schemas/ECommitmentCountryReview';
import { formatDate } from '~/utils/filters';
    
    const kmStakeholderCommitmentApi = new KmStakeholderCommitmentApi({});
    const { t, locale } = useI18n();
    const { user } = useAuth();
    
    const emit = defineEmits(['onStatusChange'])
    const props = defineProps({
        countryReviews : { type:Array<ECommitmentCountryReview>, required:true }
    })

    
    async function onStatusChange(identifier:string, reviewed:boolean){
        emit('onStatusChange', identifier, reviewed)
    }
</script>

<style scoped></style>