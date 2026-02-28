<template>
    <CFormSwitch size="lg" :label="t('autoReviewCommitments')" id="autoReviewCommitments" 
        v-model="autoReviewCommitments"  v-if="security.role.isNationalFocalPoint()"
        @change="onAutoReviewCommitmentsChange"   />

    <CModal  class="show d-block" alignment="center" backdrop="static" @close="() => {showConfirmation=false}" :visible="showConfirmation" >
        <CModalHeader :close-button="false">
            <CModalTitle>
                {{ t('confirm') }}
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <strong>{{ autoReviewCommitments ? t('confirmYesMessage') : t('confirmNoMessage') }}</strong>
            <div class="mt-2" v-if="updating">
                <CSpinner size="md" variant="grow"/><strong>{{ t('processing') }}</strong>
            </div>
        </CModalBody>
        <CModalFooter>
            <CButton :disabled="updating" color="danger" @click="confirm(true)">{{t('yes')}}</CButton>
            <CButton :disabled="updating" color="secondary" @click="confirm(false)">{{t('no')}}</CButton>
        </CModalFooter>
    </CModal>
</template>
<i18n src="@/i18n/dist/components/controls/user-settings/auto-approve-commitments.json"></i18n>
<script setup lang="ts">
import type { EUserSettings } from '~/types/schemas/base/EAuthUser';

    const {t, locale } = useI18n();
    const realmConf    = useRealm();
    const { user }     = useAuth();
    const security      = useSecurity();
    const { $api }     = useNuxtApp();

    const userSettings = ref<EUserSettings>({});
    const updating     = ref(false);
    const autoReviewCommitments = ref(false);
    const showConfirmation = ref(false);
    const userSettingKey = `${(realmConf as any).realm}-${user.value?.userID}`;

    function onAutoReviewCommitmentsChange(){
        if(!user.value.isAuthenticated || !security.role.isNationalFocalPoint())
            return;
        showConfirmation.value = true;
    }

    async function confirm(confirmApprove:boolean){
        if(confirmApprove){
            if(!userSettings.value){
                userSettings.value = {
                    userId : userSettingKey
                }
            }
            try{
                updating.value = true;
                userSettings.value.autoReviewCommitments = confirmApprove;
                if(userSettings.value._id)
                    await $api.userSetting.update(userSettingKey, userSettings.value);
                else
                    await $api.userSetting.add(userSettings.value);
            }catch(e:any){
                useLogger().error(e, t('error'));
                autoReviewCommitments.value = !autoReviewCommitments.value;
            }
            finally{
                updating.value = false;
                showConfirmation.value = false;
            }
        }
        else{
            autoReviewCommitments.value = !autoReviewCommitments.value;
            showConfirmation.value = false;
        }
    }

    async function getUserSettings(){
        const settings = await $api.userSetting.get(userSettingKey);
        if(settings)
            userSettings.value = settings;
    }

    onMounted(() => {
        if(user.value.isAuthenticated && security.role.isNationalFocalPoint())
            getUserSettings();
    })
</script>

<style scoped></style>