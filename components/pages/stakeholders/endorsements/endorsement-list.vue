<template>
    <div class="table-responsive">       
        <table class="table" v-if="endorsements?.length">
            <thead>
                <tr>
                    <th scope="col">{{t('title')}}</th>
                    <th scope="col">{{t('country')}}</th>
                    <th scope="col">{{t('status')}}</th>
                    <th scope="col">{{t('updatedOn')}}</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(endorsement) in endorsements" :key="endorsement.identifier">
                    <td class="w-50">
                        <km-link :to="appRoutes.STAKEHOLDER_MY_ENDORSEMENTS_VIEW.replace(':identifier', endorsement.identifier)" 
                            target="_blank" :title="lstring(endorsement.title, locale)"   
                            >
                        </km-link>
                    </td> 
                    <td>
                        <km-term :value="{identifier:endorsement.government}" :locale="locale"></km-term>
                    </td>                    
                    <td id="recordStatusTour">
                        <CBadge color="danger" v-if="endorsement.endorsed === undefined">
                            {{t('awaitingAction')}}
                        </CBadge>
                        <CBadge color="warning" v-if="endorsement.endorsed === false">
                            {{t('renounced')}}
                        </CBadge>
                        <CBadge color="success" v-if="endorsement.endorsed === true">
                            {{t('endorsed')}}
                        </CBadge>  
                        <CBadge color="info" v-if="endorsement.endorsed === true && endorsement.meta.updatedByInfo?.firstName === 'SYSTEM'">
                            {{t('autoApproved')}}
                        </CBadge>                        
                    </td>
                    <td>
                        {{formatDate(endorsement.meta.updatedOn)}}<br/>
                        {{ endorsement.meta.updatedByInfo?.firstName }} {{ endorsement.meta.updatedByInfo?.lastName }}
                    </td>
                    <td>
                        <endorsement-action v-if="endorsement.government == user.government"
                            :identifier="endorsement.identifier" :endorsed="endorsement.endorsed === true"
                            @on-status-change="onStatusChange(endorsement.identifier, $event)"></endorsement-action>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<i18n src="@/i18n/dist/components/pages/stakeholders/commitments/my-endorsements.json"></i18n>
<script setup lang="ts">

import { defineEmits, defineProps} from 'vue';
import KmStakeholderCommitmentApi from '~/api/km-stakeholder-commitment';
import type { EAuthUser } from '~/types/schemas/base/EAuthUser';
import type { CountryCommitmentStatus } from '~/types/schemas/ECountryCommitmentStatus';
import { formatDate } from '~/utils/filters';
    
    const kmStakeholderCommitmentApi = new KmStakeholderCommitmentApi({});
    const { t, locale } = useI18n();
    const user:EAuthUser = useAuth().user;
    
    const emit = defineEmits(['onStatusChange'])
    const props = defineProps({
        endorsements : { type:Array<CountryCommitmentStatus>, required:true }
    })

    
    async function onStatusChange(identifier:string, endorsed:boolean){
        emit('onStatusChange', identifier, endorsed)
    }
</script>

<style scoped></style>