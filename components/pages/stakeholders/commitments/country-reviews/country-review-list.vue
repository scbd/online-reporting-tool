<template>
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0" v-if="countryReviews?.length">
            <thead class="table-light">
                <tr>
                    <th class="text-uppercase small text-muted fw-semibold py-2 border-bottom">{{ t('title') }}</th>
                    <th class="text-uppercase small text-muted fw-semibold py-2 border-bottom">{{ t('organization') }}</th>
                    <th class="text-uppercase small text-muted fw-semibold py-2 border-bottom" 
                        v-if="!isNationalFocalPoint">{{ t('government') }}</th>
                    <th class="text-uppercase small text-muted fw-semibold py-2 border-bottom">{{ t('status') }}</th>
                    <th class="text-uppercase small text-muted fw-semibold py-2 border-bottom">{{ t('autoLinkCutoff') }}</th>
                    <th class="text-uppercase small text-muted fw-semibold py-2 border-bottom">{{ t('createdUpdated') }}</th>
                    <th class="text-uppercase small text-muted fw-semibold py-2 border-bottom text-end">{{ t('action') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="countryReview in countryReviews" :key="countryReview.identifier">
                    <td style="max-width:380px">
                        <km-link
                            :to="appRoutes.STAKEHOLDER_MY_COUNTRY_REVIEWS_VIEW.replace(':identifier', countryReview.identifier)"
                            target="_blank"
                            :title="lstring(countryReview.title, locale)"
                            class="fw-semibold text-decoration-none"
                        />
                    </td>

                    <td class="text-nowrap">
                        <div class="small text-muted">
                            {{ lstring(countryReview.organization, locale) }}
                            <span v-if="countryReview.organizationAcronym">({{ lstring(countryReview.organizationAcronym, locale) }})</span>
                        </div>
                    </td>
                    <td class="text-nowrap" v-if="!isNationalFocalPoint">
                        <km-term :value="{ identifier: countryReview.government }" :locale="locale" />
                    </td>
                    <td>
                        <span v-if="countryReview.reviewed === undefined" class="status-chip chip-danger">
                            <font-awesome-icon icon="fa-clock" />{{ t('awaitingReview') }}
                        </span>
                        <span v-else-if="countryReview.reviewed === false" class="status-chip chip-warning">
                            <font-awesome-icon icon="fa-rotate-left" />{{ t('returned') }}
                        </span>
                        <span v-else class="d-inline-flex gap-2 flex-wrap">
                            <span class="status-chip chip-success">
                                <font-awesome-icon icon="fa-check" />{{ t('published') }}
                            </span>
                            <span v-if="countryReview.meta._updatedBy?.firstName === 'SYSTEM'" class="status-chip chip-info">
                                <font-awesome-icon icon="fa-bolt" />{{ t('autoReviewed') }}
                            </span>
                        </span>
                    </td>
                    <td class="text-nowrap" style="min-width:160px">
                        <template v-if="countryReview.reviewed === undefined">
                            <div class="small fw-semibold">{{ formatDate(cutoffMap[countryReview.identifier].cutoff) }}</div>
                            <span v-if="cutoffMap[countryReview.identifier].label" class="status-chip mt-1" :class="cutoffMap[countryReview.identifier].chipClass">
                                <font-awesome-icon icon="fa-clock" />{{ cutoffMap[countryReview.identifier].label }}
                            </span>
                            <div class="cutoff-bar mt-1" :class="'bar-' + cutoffMap[countryReview.identifier].chipClass">
                                <div :style="{ width: cutoffMap[countryReview.identifier].progress + '%' }"></div>
                            </div>
                            <span v-if="cutoffMap[countryReview.identifier].failed" class="status-chip chip-danger mt-1">
                                <font-awesome-icon icon="fa-triangle-exclamation" />{{ t('autoLinkFailed') }}
                            </span>
                        </template>
                    </td>
                    <td class="text-nowrap">
                        <div class="small"><span class="text-muted me-1">{{ t('created') }}</span>{{ formatDate(countryReview.meta.createdOn) }}</div>
                        <div class="small" v-if="countryReview.meta.updatedOn"><span class="text-muted me-1">{{ t('updated') }}</span>{{ formatDate(countryReview.meta.updatedOn) }}</div>
                        <div class="small text-muted" v-if="countryReview.meta._updatedBy">{{ countryReview.meta._updatedBy?.firstName }} {{ countryReview.meta._updatedBy?.lastName }}</div>
                    </td>
                    <td>
                        <country-review-action v-if="countryReview.government == user?.government"
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
import type { ECommitmentCountryReview } from '~/types/schemas/ECommitmentCountryReview';
import { formatDate, lstring } from '~/utils/filters';

const { t, locale } = useI18n();
const { user } = useAuth();
const security = useSecurity();

const emit = defineEmits<{
    onStatusChange: [identifier: string, reviewed: boolean]
}>()

const props = defineProps<{
    countryReviews: ECommitmentCountryReview[]
}>()

const isNationalFocalPoint = computed(() => security.role.isNationalFocalPoint());

const AUTO_LINK_DAYS = 28;

const cutoffMap = computed(() => {
    const now = Date.now();
    return Object.fromEntries(props.countryReviews.map(countryReview => {
        const cutoff = new Date(countryReview.meta.createdOn);
        cutoff.setDate(cutoff.getDate() + AUTO_LINK_DAYS);

        //get time in days from now to cutoff for in days label.
        const days = Math.ceil((cutoff.getTime() - now) / (1000 * 60 * 60 * 24));
        const autoLinked = countryReview.reviewed === true && countryReview.meta._updatedBy?.firstName === 'SYSTEM';
        const failed = days <= 0 && !autoLinked && countryReview.reviewed === undefined;
        const chipClass = days <= 0 ? 'chip-danger' : days <= 3 ? 'chip-warning' : 'chip-info';
        const label = autoLinked && days <= 0 ? t('overdueAutoLinked')
                    : days <= 0  ? null
                    : days === 1 ? t('autoLinksTomorrow')
                    :              t('autoLinksInDays', { days });
        const progress = days <= 0 ? 100 : Math.round((AUTO_LINK_DAYS - days) / AUTO_LINK_DAYS * 100);
        return [countryReview.identifier, { cutoff, chipClass, label, progress, failed }];
    }));
});

async function onStatusChange(identifier:string, reviewed:boolean){
    emit('onStatusChange', identifier, reviewed)
}

</script>

<style scoped>
.status-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 20px;
    line-height: 1.4;
    white-space: nowrap;
}
.chip-danger  { background: rgba(229,83,83,.12);   color: #c93b3b; }
.chip-success { background: rgba(46,184,92,.15);   color: #1f8a44; }
.chip-info    { background: rgba(51,153,255,.15);  color: #1f7fe0; }
.chip-warning { background: rgba(249,177,21,.20);  color: #9a6c06; }
.cutoff-bar {
    height: 3px;
    border-radius: 2px;
    background: rgba(0,0,0,.08);
    overflow: hidden;
}
.cutoff-bar > div { height: 100%; border-radius: 2px; }
.bar-chip-danger  > div { background: #e55353; }
.bar-chip-warning > div { background: #f9b115; }
.bar-chip-info    > div { background: #3399ff; }
</style>
