<template>
        <!-- Overall Progress Card -->
        <div class="card shadow-sm mb-4 mt-2">
            <div class="card-body">
                <h2 class="h4 mb-4">{{t('sectionIIIProgress')}}</h2>
                
                <div class="row g-3 mb-4">
                    <div class="col-md-3">
                        <div class="card stat-card stat-primary h-100">
                            <div class="card-body">
                                <h3 class="display-5 fw-bold text-primary mb-0">{{ progressData.overallProgress.totalTargets }}</h3>
                                <small class="text-muted">{{ t('totalTargets') }}</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card stat-card stat-success h-100">
                            <div class="card-body">
                                <h3 class="display-5 fw-bold text-success mb-0">{{ progressData.overallProgress.fullyCompleted }}</h3>
                                <small class="text-muted">{{ t('fullyCompleted') }}</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card stat-card stat-warning h-100">
                            <div class="card-body">
                                <h3 class="display-5 fw-bold text-warning mb-0">{{ progressData.overallProgress.partiallyCompleted }}</h3>
                                <small class="text-muted">{{ t('inProgress') }}</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card stat-card stat-danger h-100">
                            <div class="card-body">
                                <h3 class="display-5 fw-bold text-danger mb-0">{{ progressData.overallProgress.notStarted }}</h3>
                                <small class="text-muted">{{ t('notStarted') }}</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="progress" style="height: 30px;">
                    <div 
                        class="progress-bar" 
                        :class="getProgressColorClass(progressData.overallProgress.overallPercentage)"
                        role="progressbar" 
                        :style="{ width: progressData.overallProgress.overallPercentage + '%' }"
                        :aria-valuenow="progressData.overallProgress.overallPercentage" 
                        aria-valuemin="0" 
                        aria-valuemax="100">
                        {{ progressData.overallProgress.overallPercentage.toFixed(1) }}%
                    </div>
                </div>
            </div>
        </div>

        <!-- Individual Targets -->

        <div class="alert alert-info">
            <font-awesome-icon icon="fa-solid fa-info-circle" class="text-info me-2"/>
            <strong>{{ t('info') }}:</strong> {{ t('infoMessage') }}
            <strong>{{ t('missingBinaryIndicator') }}</strong>
        </div>
        <div class="row g-4">
            <div v-for="(result, idx) in progressData.results" :key="idx" class="col-12">
                <div class="card shadow-sm progress-card">
                    <div class="card-header target-header" @click="toggleTarget(idx)">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="flex-grow-1">
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <h3 class="h5 mb-0">{{ result.targetTitle }}</h3>
                                    <span class="badge bg-secondary">{{ result.targetType }}</span>
                                </div>
                                <div class="progress" style="height: 10px;">
                                    <div 
                                        class="progress-bar" 
                                        :class="getProgressColorClass(result.percentage)"
                                        role="progressbar" 
                                        :style="{ width: result.percentage + '%' }"
                                        :aria-valuenow="result.percentage">
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex align-items-center gap-3 ms-3">
                                <div class="text-end">
                                    <small class="text-muted d-block">{{ result.totalCompleted }}/{{ result.totalMandatory }} fields</small>
                                    <span 
                                        class="badge"
                                        :class="result.isFullyComplete ? 'bg-success' : result.totalCompleted > 0 ? 'bg-warning text-dark' : 'bg-danger'">
                                        {{ result.percentage.toFixed(0) }}%
                                    </span>
                                </div>
                                <font-awesome-icon icon="fa-solid fa-chevron-up" v-if="expandedTargets[idx]" />
                                <font-awesome-icon icon="fa-solid fa-chevron-down" v-else />
                            </div>
                        </div>
                    </div>

                    <div v-if="expandedTargets[idx]" class="card-body bg-light">
                        <div class="row">
                            <div class="col-md-6 mb-3 mb-md-0">
                                <h4 class="h6 fw-bold text-secondary mb-3">{{ t('mainFields') }}</h4>
                                <div>
                                    <div v-for="(field, i) in result.mainFieldsStatus" :key="i" class="field-item d-flex align-items-center gap-2">
                                        <font-awesome-icon :icon="field.isComplete ? 'fa-circle-check' : 'fa-circle'" :class="field.isComplete ? 'text-success' : 'text-muted'"/>                                        
                                        <span :class="field.isComplete ? 'text-dark' : 'text-muted'">{{ startCase(field.field) }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <h4 class="h6 fw-bold text-secondary mb-3">{{ t('indicatorData') }}</h4>
                                <div>
                                    <div class="field-item">
                                        <div class="d-flex align-items-center gap-2 mb-1">
                                            <font-awesome-icon :icon="result.indicatorStatus.headlineComplete ? 'fa-circle-check' : 'fa-circle'" :class="result.indicatorStatus.headlineComplete ? 'text-success' : 'text-muted'"/>
                                            <span class="fw-medium" :class="result.indicatorStatus.headlineComplete ? 'text-dark' : 'text-muted'">
                                                {{ t('headlineIndicators') }}
                                            </span>
                                        </div>
                                        <small class="text-muted ms-4">
                                            {{ result.indicatorStatus.headlineWithData }}/{{ result.indicatorStatus.headlineCount }} items with data
                                            <span v-if="!result.indicatorStatus.hasHeadline" class="text-danger"> (Required - Missing)</span>
                                            <span v-else-if="!result.indicatorStatus.headlineComplete" class="text-warning"> (Some items missing data)</span>
                                        </small>
                                    </div>

                                    <div class="field-item">
                                        <div class="d-flex align-items-center gap-2 mb-1">
                                            <font-awesome-icon :icon="result.indicatorStatus.binaryComplete ? 'fa-circle-check' : 'fa-circle'" :class="result.indicatorStatus.binaryComplete ? 'text-success' : 'text-muted'"/>
                                            <span class="fw-medium" :class="result.indicatorStatus.binaryComplete ? 'text-dark' : 'text-muted'">
                                                {{ t('binaryIndicators') }}
                                            </span>
                                        </div>
                                        <small class="text-muted ms-4">
                                            {{ result.indicatorStatus.binaryWithData }}/{{ result.indicatorStatus.binaryCount }} items with data
                                            <span v-if="!result.indicatorStatus.hasBinary" class="text-danger"> ({{ t('requiredMissing') }})</span>
                                            <span v-else-if="!result.indicatorStatus.binaryComplete" class="text-warning"> ({{ t('someItemsMissingData') }})</span>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="alert alert-info">
                            <font-awesome-icon icon="fa-solid fa-info-circle" class="text-info me-2"/>
                            <strong>{{ t('info') }}:</strong> {{ t('infoMessage') }}
                            <strong>{{ t('missingBinaryIndicator') }}</strong>
                        </div>
                        <div v-if="!result.isFullyComplete" class="alert alert-warning mt-3 mb-0" role="alert">
                            <font-awesome-icon icon="fa-solid fa-exclamation-triangle" class="text-warning me-2"/>
                            <strong>{{ t('missing') }}:</strong> {{ getMissingFields(result) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-III.json"></i18n>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/section-III-progress.json"></i18n>


<script setup lang="ts">
import { escape, parseSolrQuery, queryIndex } from '~/services/solr';
import type { SectionIII } from '~/types/schemas/ENationalReport7';
import type { EDictionary } from '~/types/schemas/base/EDictionary';
import type { ELstring } from '~/types/schemas/base/ELstring';
import { startCase } from 'lodash';

    type ProgressResult = {
        targetId: string;
        targetType: string;
        mainFieldsStatus: {
            field: keyof SectionIII;
            isComplete: boolean;
        }[];
        indicatorStatus: {
            hasHeadline: boolean;
            hasBinary: boolean;
            headlineComplete: boolean;
            binaryComplete: boolean;
            headlineCount: number;
            binaryCount: number;
            headlineWithData: number;
            binaryWithData: number;
        };
        totalCompleted: number;
        totalMandatory: number;
        percentage: number;
        isFullyComplete: boolean;
    }

    const props = defineProps({
        sectionIII: { type: Array<SectionIII>, required: true }
    });
    const emit = defineEmits(['onProgressUpdated']);

    const { t, locale } = useI18n();
    const expandedTargets = ref<EDictionary<boolean>>({});    
    const progressData = computed(() => calculateProgress(props.sectionIII));
    let targets = [];
    
    if(props.sectionIII?.length){
        const queries:Array<String> = [];
        queries.push(`identifier_s:(${props.sectionIII?.map(e=>escape(e.target.identifier))?.join(' ')})`);
        const targetQuery = {
            query: queries,            
            rowsPerPage: props.sectionIII?.length,
            fields : 'identifier:identifier_s,title:title_EN_s'
        }
        targets = (await queryIndex(parseSolrQuery(targetQuery, locale.value)))?.docs || [];
    }

    const toggleTarget = (idx: number) => {
        expandedTargets.value[idx.toString()] = !expandedTargets.value[idx.toString()];
    };

    const calculateProgress = (sectionIII: SectionIII[]) => {
        const mandatoryFields: (keyof SectionIII)[] = [
            'target',
            'mainActionsSummary',
            'levelOfProgress',
            'progressSummary',
            'keyChallengesSummary',
            'actionEffectivenessSummary'
        ];

        const results = sectionIII?.map((entry, index) => {
            const mainFieldsStatus = mandatoryFields.map(field => {
                let isComplete = false;
                const value = entry[field] as any;

                if (field === 'target' || field === 'levelOfProgress') {
                    isComplete = !!(value?.identifier);
                } else {
                    isComplete = hasUNLanguageText(value as ELstring);
                }
                return { field, isComplete };
            });

            const hasHeadline = entry.indicatorData?.headline && entry.indicatorData.headline.length > 0;
            const hasBinary = entry.indicatorData?.binary && entry.indicatorData.binary.length > 0;

            const headlineComplete = hasHeadline && entry.indicatorData.headline.every(
                item => item.data?.identifier
            );
            
            const binaryComplete = hasBinary && entry.indicatorData.binary.every(
                item => item.data?.identifier
            );

            const indicatorStatus = {
                hasHeadline,
                hasBinary,
                headlineComplete,
                binaryComplete,
                headlineCount: entry.indicatorData?.headline?.length || 0,
                binaryCount: entry.indicatorData?.binary?.length || 0,
                headlineWithData: entry.indicatorData?.headline?.filter(item => item.data?.identifier).length || 0,
                binaryWithData: entry.indicatorData?.binary?.filter(item => item.data?.identifier).length || 0
            };

            const totalMandatory = 8;
            const completedMain = mainFieldsStatus.filter(f => f.isComplete).length;
            const completedIndicators = (headlineComplete ? 1 : 0) + (binaryComplete ? 1 : 0);
            const totalCompleted = completedMain + completedIndicators;

            return {
                targetId: entry.target?.identifier || `Target ${index + 1}`,
                targetTitle: targets.find((t: any) => t.identifier === entry.target?.identifier)?.title || `Target ${index + 1}`,  
                targetType: entry.targetType || 'unknown',
                mainFieldsStatus,
                indicatorStatus,
                totalCompleted,
                totalMandatory,
                percentage: (totalCompleted / totalMandatory) * 100,
                isFullyComplete: totalCompleted === totalMandatory
            };
        });

        const overallProgress = {
            totalTargets: sectionIII.length,
            fullyCompleted: results.filter(r => r.isFullyComplete).length,
            partiallyCompleted: results.filter(r => r.totalCompleted > 0 && !r.isFullyComplete).length,
            notStarted: results.filter(r => r.totalCompleted === 0).length,
            overallPercentage: results.length > 0 
                ? (results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
                : 0
        };

        emit('onProgressUpdated', {results, overallProgress});

        return { results, overallProgress };
    };
    const getProgressColorClass = (percentage:number) => {
        if (percentage === 100) return 'bg-success';
        if (percentage >= 70) return 'bg-primary';
        if (percentage >= 40) return 'bg-warning';
        return 'bg-danger';
    };

    const getMissingFields = (result: ProgressResult) => {
        const missing = [
            ...result.mainFieldsStatus.filter(f => !f.isComplete).map(f => startCase(f.field)),
            ...(!result.indicatorStatus.headlineComplete ? ['Headline indicators'] : []),
            ...(!result.indicatorStatus.binaryComplete ? ['Binary indicators'] : [])
        ];
        return missing.join(', ');
    };

    const hasUNLanguageText = (elStringValue: ELstring) => {
        return ['en', 'fr', 'es', 'ar', 'ru', 'zh'].some((lang)=>elStringValue?.[lang]?.trim() !== '');
    };

    
</script>


<style scoped>

</style>