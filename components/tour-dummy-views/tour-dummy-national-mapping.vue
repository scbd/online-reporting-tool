<template>
    <div id="nationalMappingTour">
        <div class="accordion-item" visible="true">
            <div class="accordion-header" id="gbfTargetGBF-GOAL-A"><button type="button" aria-expanded="false"
                    class="accordion-button">{{ t('GBFGAEcosystems') }}</button></div>
            <div class="collapse show accordion-collapse" style="">
                <div class="accordion-body">
                    <div class="d-grid gap-1 d-md-flex justify-content-end mb-2"><button class="btn btn-primary btn-sm"
                            type="button"><svg class="svg-inline--fa fa-pen-to-square" aria-hidden="true"
                                focusable="false" data-prefix="fas" data-icon="pen-to-square" role="img"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path class="" fill="currentColor"
                                    d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z">
                                </path>
                            </svg> {{ t('editMapping') }}</button><!--v-if--><button class="btn btn-danger btn-sm"
                            type="button"><svg class="svg-inline--fa fa-trash" aria-hidden="true" focusable="false"
                                data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512">
                                <path class="" fill="currentColor"
                                    d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z">
                                </path>
                            </svg><span class="pl-1">{{ t('delete') }}</span></button><!----><!----></div>
                    <table class="table table-bordered table-hover">
                        <tbody>
                            <tr>
                                <td style="width: 40%;"><strong><span class="text">{{ t('nationalTarget') }}</span></strong></td>
                                <td colspan="2"><strong>{{ t('elementGlobalTargetsInformation') }}</strong>
                                    <div class="form-text text-muted">{{ t('addEditButton') }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 40%;">{{ t('nationalTarget1') }}</td>
                                <td colspan="2" rowspan="4"><label></label>
                                    <div id="km-value-ml" class="mt-2">
                                        <div class="input-group input-lang-en"><!--v-if-->
                                            <div class="form-control km-value km-value-ml-html ck-content" dir="ltr"
                                                aria-describedby="basic-addon1">
                                                <p>{{ t('updateTarget') }}</p>
                                                <p>{{ t('dsf') }}</p>
                                                <p>{{ t('dsf') }}</p>
                                            </div><span class="input-group-text" id="basic-addon1"
                                                style="cursor: default;"><!--teleport start--><!--teleport end--><span
                                                    class="d-inline-block" tabindex="0">EN</span></span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 40%;">{{ t('nationalTarget23EXAMPLE') }}</td><!--v-if-->
                            </tr>
                            <tr>
                                <td style="width: 40%;">{{ t('sudanNationalTarget1') }}</td><!--v-if-->
                            </tr>
                            <tr>
                                <td style="width: 40%;">{{ t('invasiveAlienSpecies') }}</td><!--v-if-->
                            </tr><!--v-if-->
                            <tr>
                                <td colspan="3"> &nbsp; </td>
                            </tr>
                            <tr>
                                <td style="width: 40%;"><strong>{{ t('headlineIndicators') }}</strong></td>
                                <td colspan="2"><strong>{{ t('referencePeriod') }}</strong>
                                    <div class="form-text text-muted">{{ t('addEditButton') }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 40%;">{{ t('a1RedListEcosystems') }} </td>
                                <td colspan="2">
                                    <div><!--v-if--><span class="badge bg-danger rounded-pill">{{ t('noReferencePeriod') }}</span><!--v-if--></div>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 40%;">{{ t('a2ExtentNaturalEcosystems') }}</td>
                                <td colspan="2">
                                    <div><!--v-if--><span class="badge bg-danger rounded-pill">{{ t('noReferencePeriod') }}</span><!--v-if--></div>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 40%;">{{ t('a3RedListIndex') }}</td>
                                <td colspan="2">
                                    <div><!--v-if--><span class="badge bg-danger rounded-pill">{{ t('noReferencePeriod') }}</span><!--v-if--></div>
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 40%;">{{ t('a4TheProportionPopulations') }} &gt; {{ t('fifthHundred') }}</td>
                                <td colspan="2">
                                    <div><!--v-if--><span class="badge bg-danger rounded-pill">{{ t('noReferencePeriod') }}</span><!--v-if--></div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3"><strong>{{ t('otherIndicators') }}</strong></td>
                            </tr>
                            <tr>
                                <td colspan="3">{{ t('ecosystemIntactnessIndex') }}</td>
                            </tr>
                            <tr>
                                <td colspan="3">{{ t('livingPlanetIndex') }}</td>
                            </tr>
                            <tr>
                                <td colspan="3">{{ t('changeInlandWaterEcosystems') }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<i18n src="@/i18n/dist/components/tour-dummy-views/tour-dummy-national-mapping.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
const {t} = useI18n();
</script>

<style scoped></style>