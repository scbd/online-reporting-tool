<template>
    <div class="row" v-if="loading">
        <div class="col-12">
            <div  class="alert alert-info">
                <i class="fa fa-spin fa-spinner"></i> {{ t('processing') }}
            </div>
        </div>
    </div>
    <div class="row" v-if="!loading">
        <div class="col-12">
            <div id="divTable" style="max-height:300px;overflow:scroll; ">
                <div>
                    <table id="datatable"
                        class="table table-striped table-bordered table-condensed">
                        <thead>
                            <tr>
                                <th v-for="field in selectedSchemaFields" :key="field.name">
                                    {{ field.title }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(record, index) in records" :key="index">
                                <td v-for="field in selectedSchemaFields" :key="field.name">
                                    {{ record[field.name] }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<i18n src="@/i18n/dist/components/controls/search/export-table.json"></i18n>        
<script setup lang="ts">

    defineProps<{
        loading: boolean;
        selectedSchemaFields: Array<{ name: string; title: string }>;
        records: Array<any>;
    }>()

    const { t } = useI18n();    
</script>