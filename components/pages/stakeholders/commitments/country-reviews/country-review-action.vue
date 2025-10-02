<template>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <CButton :disabled="isBusy" color="secondary" size="sm"  @click="endorse()" v-if="!endorsed">
            <font-awesome-icon icon="fa-thumbs-up" /> {{t('review')}}
        </CButton>
        <CButton :disabled="isBusy" color="secondary" size="sm" v-if="endorsed"
            @click="renounce()">
            <font-awesome-icon icon="fa-thumbs-down" /> {{t('return')}}
        </CButton>        
    </div>
</template>

<i18n src="@/i18n/dist/components/pages/stakeholders/commitments/country-reviews/country-review-action.json"></i18n>

<script setup lang="ts">
import { defineEmits, defineProps} from 'vue';
import KmStakeholderCommitmentApi from '~/api/km-stakeholder-commitment';

    const kmStakeholderCommitmentApi = new KmStakeholderCommitmentApi({});

    const { t} = useI18n();
    const isBusy = ref(false);

    const props = defineProps({
        identifier: { type : String, required:true},
        endorsed: { type: Boolean, required:true}    
    })
    const emit = defineEmits(['onStatusChange'])

    async function endorse(){
        isBusy.value = true
        try{
            await kmStakeholderCommitmentApi.reviewCountryCommitment(props.identifier)
            emit('onStatusChange', true)
        }
        catch(e:any){
            useLogger().error(e, `${t('endorseError')} ` + props.identifier);
        }
        isBusy.value = false
    }

    async function renounce(){
        isBusy.value = true
        try{
            await kmStakeholderCommitmentApi.returnCountryCommitment(props.identifier)
            emit('onStatusChange', false)
        }
        catch(e:any){
            useLogger().error(e, `${t('renounceError')} ` + props.identifier);
        }
        isBusy.value = false
    }
</script>

<style scoped>

</style>