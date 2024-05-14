<template>
    <CCard v-if="user?.isAuthenticated">
        <CCardHeader> {{t('title')}} </CCardHeader>
        <CCardBody>
            <div>
                <div class="row m-0 p-o py-1" >
                    <div class="col-md-6 cp-header">
                        <table>
                            <tr>
                                <td>
                                    <label>{{ t('name') }}</label>
                                </td>
                                <td class="fw-medium">: {{ user.name }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <label>{{ t('primaryEmail') }}</label>
                                </td>
                                <td class="fw-medium">: {{ user.email }}</td>
                            </tr>
                            <tr id="userGovernment">
                                <td>
                                    <label>{{ t('countryAffiliation') }}</label>
                                </td>
                                <td class="fw-medium" v-if="user.government" >: 
                                    <!-- <a class="text-decoration-none" rel="noopener" translation-url href="https://ch/countries/{{user.government | uppercase}}" ng-bind="userCountry|term"></a> -->
                                    <km-term :value="user.government" :locale="locale"></km-term>
                                </td>
                                <td class="fw-medium" v-if="!user.government">: 
                                    {{ t('none') }}
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-6 cp-header">
                        <table>
                            <tr  id="userRoles">
                                <td>
                                    <label>{{ t('roles') }}</label>
                                </td>
                                <td class="fw-medium">: 
                                    <span class="comma" v-if="security.role.isNationalFocalPoint()">
                                        <span>
                                            {{ t('nationalFocalPoint') }}
                                            <span href="#" class="helpinfoInline fa fa-info-circle color-litegrey"
                                                data-bs-toggle="tooltip" data-html="true" data-container="body"
                                                :title="t('nationalFocalPointInfo')"></span>
                                        </span>
                                    </span>

                                    <span class="comma" v-if="security.role.isPublishingAuthority()">
                                        <span>{{ t('publishingAuthority') }}
                                            <span href="#" class="helpinfoInline fa fa-info-circle color-litegrey"
                                                data-bs-toggle="tooltip" data-html="true" data-container="body"
                                                :title="t('publishingAuthorityInfo')"></span>
                                        </span>
                                    </span>

                                    <span class="comma" v-if="security.role.isNationalAuthorizedUser()">
                                        {{ t('nationalAuthorizedUser') }}
                                        
                                        <span href="#" class="helpinfoInline fa fa-info-circle color-litegrey"
                                            data-bs-toggle="tooltip" data-html="true" data-container="body"
                                            :title="t('absNAU')"></span>
                                    </span>

                                    <span class="comma"
                                        v-if="(security.role.isUser() && (!security.role.isNationalFocalPoint() 
                                        && !security.role.isPublishingAuthority() && !security.role.isNationalAuthorizedUser()))">
                                        {{ t('registeredUser') }}
                                        <span href="#" class="helpinfoInline fa fa-info-circle color-litegrey"
                                            data-bs-toggle="tooltip" data-html="true" data-container="body"
                                            :title="t('CBDSecretariat')"></span></span>
                                    <span class="comma" v-if="security.role.isAdministrator()">
                                        <strong class="color-pink">{{ t('admin') }}</strong>
                                    </span>

                                </td>
                                <td class="ps-2"></td>
                            </tr>
                            <tr>
                                <td>
                                    <label>{{ t('updateProfile') }}</label>
                                </td>
                                <td>: 
                                    <a class="text-decoration-none" rel="noopener" translation-url
                                        href="https://accounts.cbd.int/profile" target="_blank">
                                        accounts.cbd.int/profile
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>{{ t('updatePassword') }}</label>
                                </td>
                                <td>: 
                                    <a class="text-decoration-none" rel="noopener" translation-url
                                        href="https://accounts.cbd.int/password" target="_blank">
                                        accounts.cbd.int/password
                                    </a>
                                </td>
                                <td></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </CCardBody>
    </CCard>
</template>
<i18n src="@/i18n/dist/components/common/user-profile-info.json"></i18n>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { KmTerm } from '@/components/controls';

const { t, locale } = useI18n()
const { user } = useAuth();
    const security      = useSecurity();

</script>

<style scoped></style>