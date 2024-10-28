<template>
    <div class="card mt-3">
        <div class="card-header bg-secondary" v-if="title">{{ title }}
            <strong :id="id + 'CountTour'">{{ t('one') }}</strong>
        </div>
        <div class="card-body"><!--v-if-->
            <div class="table-responsive national-target-list">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">{{ t('title') }}  </th>
                            <th scope="col">{{ t('GBFgoalsAndTargets') }}</th>
                            <th scope="col">{{ t('status') }}</th>
                            <th scope="col">{{ t('updatedOn') }}</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="" id="record">
                            <td class="w-50">{{ t('dummyRecordToShowcaseTourFunction') }}</td>
                            <td class="w-15" id="linkedGbfTour">
                                <div data-v-e9d13614="">
                                    <ul data-v-e9d13614="" class="list-group">
                                        <li data-v-e9d13614="" class="list-item"><!--v-if--><a data-v-e9d13614=""
                                                href="https://www.cbd.int/gbf/targets/18" target="_blank">{{ t('target18') }}</a>
                                        </li>
                                        <li data-v-e9d13614="" class="list-item"><!--v-if--><a data-v-e9d13614=""
                                                href="https://www.cbd.int/gbf/targets/19" target="_blank">{{ t('target19') }}</a>
                                        </li>
                                    </ul><!--v-if-->
                                </div>
                            </td>
                            <td id="recordStatusTour"><!--v-if--><!--v-if--><!--v-if-->
                                <div class="d-grid gap-1 km-record-status"><!--v-if--><!--v-if--><!--v-if-->
                                    <div class="success-status"><span class="badge bg-success">{{ t('published') }}</span></div>
                                </div>
                            </td>
                            <td>{{ t('publishedDate') }}<br> {{ t('blaiseFonseca') }}</td>
                            <td>
                                <div class="d-grid gap-2 d-md-flex justify-content-md-end"><button id="viewRecordTour"
                                        class="btn btn-secondary btn-sm" type="button"><svg
                                            class="svg-inline--fa fa-magnifying-glass" aria-hidden="true"
                                            focusable="false" data-prefix="fas" data-icon="magnifying-glass" role="img"
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path class="" fill="currentColor"
                                                d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z">
                                            </path>
                                        </svg> {{ t('view') }}</button>
                                    <button class="btn btn-secondary btn-sm" type="button" id="editRecordTour"><svg
                                            class="svg-inline--fa fa-pen-to-square" aria-hidden="true" focusable="false"
                                            data-prefix="fas" data-icon="pen-to-square" role="img"
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path class="" fill="currentColor"
                                                d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z">
                                            </path>
                                        </svg> {{ t('edit') }}</button><button id="deleteRecordTour" class="btn btn-danger btn-sm" type="button"><svg
                                            class="svg-inline--fa fa-trash" aria-hidden="true" focusable="false"
                                            data-prefix="fas" data-icon="trash" role="img"
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                            <path class="" fill="currentColor"
                                                d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z">
                                            </path>
                                        </svg><span class="pl-1">{{ t('delete') }}</span></button><!----><!---->
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</template>
<i18n src="@/i18n/dist/components/tour-dummy-views/tour-dummy-table.json"></i18n>
<script setup>
const {t} = useI18n();
    defineProps({
        title:String,
        id:String
    })
</script>

<style lang="scss" scoped>

</style>