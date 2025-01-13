<template>
    <div>
        <div data-v-45d6b13a="" class="card mb-2" id="userProfile">
            <div class="card-header">{{ t('userInfo') }}</div>
            <div class="card-body">
                <div>
                    <div class="row m-0 p-o py-1">
                        <div class="col-md-6 cp-header">
                            <table>
                                <tr>
                                    <td><label>{{ t('name') }}</label></td>
                                    <td class="fw-medium">{{ t('testUserForTourDemo') }}</td>
                                </tr>
                                <tr>
                                    <td><label>{{ t('primaryEmail') }}</label></td>
                                    <td class="fw-medium">: testuser@dummy.com</td>
                                </tr>
                                <tr id="userGovernment">
                                    <td><label>{{ t('countryAffiliation') }}</label></td>
                                    <td class="fw-medium">:
                                        <!-- <a class="text-decoration-none" rel="noopener" translation-url href="https://ch/countries/{{user.government | uppercase}}" ng-bind="userCountry|term"></a> --><span><!--v-if-->
                                            {{ t('haiti') }} </span></td><!--v-if-->
                                </tr>
                            </table>
                        </div>
                        <div class="col-md-6 cp-header">
                            <table>
                                <tr id="userRoles">
                                    <td><label>{{ t('role') }}</label></td>
                                    <td class="fw-medium">: <span class="comma"><span>{{ t('nationalFocalPoint') }} <span
                                                    href="#" class="helpinfoInline fa fa-info-circle color-litegrey"
                                                    data-bs-toggle="tooltip" data-html="true" data-container="body"
                                                    title="nationalFocalPointInfo"></span></span></span><span
                                            class="comma"><span>{{ t('publishingAuthority') }} <span href="#"
                                                    class="helpinfoInline fa fa-info-circle color-litegrey"
                                                    data-bs-toggle="tooltip" data-html="true" data-container="body"
                                                    title="publishingAuthorityInfo"></span></span></span><!--v-if--><!--v-if--><!--v-if-->
                                    </td>
                                    <td class="ps-2"></td>
                                </tr>
                                <tr>
                                    <td><label>{{ t('updateProfile') }}</label></td>
                                    <td>: <a class="text-decoration-none" rel="noopener" translation-url=""
                                            href="https://accounts.cbd.int/profile" target="_blank">
                                            accounts.cbd.int/profile </a></td>
                                </tr>
                                <tr>
                                    <td><label>{{ t('updatePassword') }}</label></td>
                                    <td>: <a class="text-decoration-none" rel="noopener" translation-url=""
                                            href="https://accounts.cbd.int/password" target="_blank">
                                            accounts.cbd.int/password </a></td>
                                    <td></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<i18n src="@/i18n/dist/components/tour-dummy-views/tour-dummy-user-profile.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
const {t} = useI18n();
</script>

<style scoped>

</style>