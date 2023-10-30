<template>
    <CCard>
        <CCardHeader>Settings</CCardHeader>
        <CCardBody>

            <CCard>
                <CCardBody>
                    <CCardTitle>Browser Cache</CCardTitle>
                    <CCardText>
                        The ORT caches some information in your browser cache for faster performance.
                        Incase if you are facing issues, it is recommended to clear this cache.
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
                                            <button class="ms-2 btn btn-danger btn-sm" @click="clearCache(cache)">Clear All {{ cache.cache }}</button>
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
                                            <button class="ms-2 btn btn-danger btn-sm"  @click="clearCache(cache, recKey)">Clear {{recKey}} cache</button>
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

<script setup lang="ts">
import { useStorage } from '@vueuse/core'

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