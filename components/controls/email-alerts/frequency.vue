<template>
    <div>
        <div class="bold">
            {{ t('frequencyHeader') }}
        </div>
        <div>
            <small>{{ t('frequencyDescription') }}</small>
        </div>
        <div class="col-12 offset-1 offset-md-0 mt-2 text-secondary">
            <div class="btn-group">
                <CDropdown>
                    <CDropdownToggle color="primary" :disabled="updating">
                        <span v-if="!userSettings.alertFrequency">
                            {{t('frequencyDropdown') }}
                        </span>
                        <span v-if="userSettings.alertFrequency">{{ t(userSettings.alertFrequency) }}</span>
                    </CDropdownToggle>
                    <CDropdownMenu>
                        <CDropdownItem href="#" v-for="key in frequencies" :key="key" :class="{'active': userSettings.alertFrequency == key}"
                            @click="updateUserFrequency(key)">{{ t(key) }}
                        </CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>
            </div>
        </div>
    </div>
</template>
<i18n src="@/i18n/dist/components/controls/email-alerts/frequency.json"></i18n>
<i18n src="@/i18n/dist/app-data/frequency.json"></i18n>
<script setup lang="ts">
    import { frequencies } from '@/app-data/frequencies';
    const {t, locale } = useI18n();
    const realmConf    = useRealm();
    const { user }     = useAuth();
    const { $api }     = useNuxtApp();

    const userSettings = ref({});
    const updating     = ref(false);
    const userSettingKey = `${realmConf.realm}-${user.value?.userID}`;

    async function updateUserFrequency(frequency){
        if(!user.value?.userID)
            return;

        if(!userSettings.value){
            userSettings.value = {}
        }
        userSettings.value.alertFrequency = frequency;
        userSettings.value.userId         = userSettingKey;
        if(userSettings.value._id)
            await $api.userSetting.update(userSettingKey, userSettings.value);
        else
            await $api.userSetting.add(userSettings.value);
    }

    async function getUserFrequency(){
        const freq = await $api.userSetting.get(userSettingKey);
        if(freq)
            userSettings.value = freq;
    }

    onMounted(() => {
        if(user.value.isAuthenticated)
            getUserFrequency();
    })
</script>

<style scoped></style>