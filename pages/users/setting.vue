<template>
    <CCard>
        <CCardHeader>{{t('settings')}}</CCardHeader>
        <CCardBody>

            <CCard>
                <CCardBody>
                    <CCardTitle>{{t('browserCache')}}</CCardTitle>
                    <CCardText>
                        {{t('cacheInfo')}} {{t('clearCacheInfo')}}
                    </CCardText>
                </CCardBody>
                <CCardBody>
                    <CRow>
                        <CCol>
                            <table class="table table-bordered">
                                <tbody v-for="(cache) in localStorageCache" :key="cache">
                                    <tr>
                                        <td>{{ cache.cache }}</td>
                                        <td></td>
                                        <td>
                                            <button class="ms-2 btn btn-danger btn-sm" @click="clearCache(cache)">{{t('clearAll')}} {{ cache.cache }}</button>
                                        </td>
                                    </tr>
                                    <tr v-for="(rec,recKey) in cache.data?._value" :key="recKey">
                                        <td class="ps-5"> {{ recKey }}</td>
                                        <td>
                                            <CBadge color="primary" shape="rounded-pill">
                                            {{ Object.keys(rec).length }}
                                            </CBadge>
                                        </td>
                                        <td class="ps-5">
                                            <button class="ms-2 btn btn-danger btn-sm"  @click="clearCache(cache, recKey)">{{t('clear')}} {{recKey}} {{t('cache')}}</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>                            
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

        </CCardBody>
    </CCard>
</template>
<i18n src="@/i18n/dist/pages/users/setting.json"></i18n>
<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const { t }  = useI18n();
const localStorageCache = [];

for (const cache in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, cache)) {
        const data = useStorage([cache], {});
        localStorageCache.push({cache, data});        
    }
}

function clearCache(cache, key){
    if(key)
        cache.data.value[key] = undefined;
    else
        cache.data = undefined;
}

</script>

<style scoped></style>