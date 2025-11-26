<template>
        <button type="button" class="ms-1 btn btn-success btn-sm text-decoration-none" @click="openExportModal">
            <font-awesome-icon icon="fa fa-download"></font-awesome-icon>
            <slot name="exportTitle" >
                {{ t('exportButton') }}
            </slot>
        </button>
        <CModal class="show d-block global-target-modal" :size="container? 'lg' : 'xl'" scrollable="true" alignment="center" 
            :visible="showExportModal"  @close="closeDialog" backdrop="static" >
            <CModalHeader>
                <CModalTitle>{{t('dialogTitle')}}</CModalTitle>
            </CModalHeader>
            <CModalBody>               

                <div class="row">
                    <div class="col-8">
                        <div class="form-group color-black">
                            {{ t('downloadFormat') }}
                            <span class="radio" style="display: initial;">
                                <!-- <label class="radio-inline"><input type="radio" name="downloadFormatOption" value="xls"  v-model="downloadFormat" />{{$t('xls')}}</label>                    -->
                                <label class="radio-inline"><input type="radio" name="downloadFormatOption"
                                        value="xlsx" v-model="downloadFormat" /> {{ t('xlsx') }}</label>
                                <label class="radio-inline"><input type="radio" name="downloadFormatOption"
                                        value="csv" v-model="downloadFormat" /> {{ t('csv') }}</label>
                            </span>
                        </div>
                    </div>
                    <div class="col-4">
                        <span class="float-end" style="padding-top: 20px;">
                            {{ t('recordsFound') }}: <strong>{{ numFound }}</strong>
                        </span>
                    </div>
                </div>

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
                                    <thead class="table-dark">
                                        <tr>
                                            <th v-for="field in selectedSchemaFields" :key="field">{{ field.value }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(row, index) in downloadDocs" :key="row">
                                            <td v-for="(field) in selectedSchemaFields" :key="field.key">
                                                <span v-if="typeof row[field.key] == 'string'">
                                                    <span v-html="formatString(row[field.key]?.url||row[field.key])"></span>
                                                </span>
                                                <span v-if="Array.isArray(row[field.key])">
                                                    <ul class="p-0 list-inline">
                                                        <li v-for="item in row[field.key]" :key="item">
                                                            <span v-html="formatString(item?.url|| item)"></span>
                                                        </li>
                                                    </ul>
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <h3 class="color-red bold" v-if="!loading">{{ t('sampleMessage') }}</h3>
                        </div>
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <button type="button" class="btn btn-secondary float-start" :aria-label="t('customFields')" :disabled="loading"
                    @click="showCustomFieldsDialog()">{{ t('customFields') }}</button>
                <button type="button" class="btn btn-secondary float-end" aria-label="Close" :disabled="loading"
                    @click="closeDialog()">{{ t('cancel') }}</button>
                <button type="button" class="btn btn-primary float-start" aria-label="Download"
                    @click="exportRecords({ listType: 'all', format: downloadFormat})" :disabled="loading" id="downloadDataFile">

                    {{ t('download') }}
                </button>
            </CModalFooter>
        </CModal>

        <CModal class="show d-block custom-fields-modal" size="md" scrollable="true" alignment="center" 
            :visible="showCustomFieldsModal" backdrop="static" @close="closeCustomFieldsDialog">
            <CModalHeader>
                <CModalTitle>{{t('customFieldsTitle')}}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <table class="table table-striped table-bordered table-condensed">                                
                    <tbody>
                        <tr v-for="field in schemaFields" :key="field" >
                            <td>
                                <div class="form-check">
                                    <input type="checkbox" :id="field.key" :value="true" v-model="field.selected" class="form-check-input">
                                    <label :for="field.key" class="form-check-label">{{ field.value }}</label>
                                </div> 
                            </td>                   
                        </tr>
                    </tbody>
                </table>
            </CModalBody>
            <CModalFooter>
                <button type="button" class="btn btn-secondary float-end" :aria-label="t('cancel')"
                    @click="closeCustomFieldsDialog()">{{ t('cancel') }}</button>
                <button type="button" class="btn btn-primary float-start" :aria-label="t('apply')"
                    @click="applyCustomFields()">
                    {{ t('apply') }}
                </button>
            </CModalFooter>
        </CModal>
</template>

<i18n src="@/i18n/dist/components/controls/search/export.json"></i18n>
<i18n src="@/i18n/dist/app-data/download-schemas.json"></i18n>


<script setup lang="ts">
//@ts-nocheck
    import { downloadSchemas } from '~/app-data/download-schemas.js';
    import { queryIndex, parseSolrQuery } from '@/services/solr'
    
    const props = defineProps({
        fileName: { type: String },
        searchQuery : { type:Object, required:true},
        schema:      { type: String, required : true },
    });

    const downloadSchemasRef = downloadSchemas.schemas;

    const { t, locale }   = useI18n();
    const realm           = useRealm();

    const showExportModal = ref(false);
    const showCustomFieldsModal = ref(false);
    const downloadDocs    = ref([]);
    const numFound        = ref(0);
    const loading         = ref(false);
    const downloadFormat  = ref('xlsx');
    const schemaFields    = ref([]);

    const selectedSchemaFields    = computed(()=>{
        return schemaFields.value.filter(f=>f.selected);
    });

    const openExportModal = async (skipReset) => {
        if(!skipReset){
            const fields = {...(downloadSchemasRef[props.schema]||{})};
            schemaFields.value = Object.keys(fields).map((k,v)=>({key:k, value:fields[k], selected:true}));
        }
        
        showExportModal.value = true        
        await exportRecords({ listType: 'initial', format: 'json' });        
    }
    
    const closeDialog = () => {
        showExportModal.value = false;
        downloadDocs.value = [];
        numFound.value = 0;
        loading.value = false;
    };

    const showCustomFieldsDialog = ()=>{
        showCustomFieldsModal.value = true;
        showExportModal.value = false;
    }

    const closeCustomFieldsDialog = ()=>{
        showCustomFieldsModal.value = false;
        showExportModal.value = true;
    }
    const applyCustomFields = ()=>{
        showCustomFieldsModal.value = false;
        downloadDocs.value = [];
        openExportModal(true);
    }

    const formatString = (text) => {
        if (!text)
            return;

        if (text?.startsWith('http')) {
            if (text.length > 35)
                return `<a target="_blank" href="${text}">${text.substr(0, 35)}...</a>`

            return `<a target="_blank" href="${text}">${text}...</a>`
        }

        if (text?.length > 50 && !text.startsWith('<a'))
            return text.substr(0, 50) + '...';

        return text;
    }

    async function exportRecords({listType, format,schema}){
        loading.value = true;
        try {
                        
            const lQuery = {...props.searchQuery};

            if(listType == 'all'){
                lQuery.rowsPerPage = 10000;
            }
            else
                lQuery.rowsPerPage = 25;

            const mimeTypes = {
                xls : 'application/vnd.ms-excel',
                xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                json: 'application/json',
                csv : 'text/csv',
            }

            let headers = {
                'accept': mimeTypes[format || 'json'] 
            }; 
            let config = {};

            if(listType == 'all'){
                // config.responseType = "arraybuffer"
                config.responseType = "blob";
            }
            const fields = schemaFields.value.filter(f=>f.selected)
                            .reduce((obj, field) =>{
                                obj[field.key]=field.value
                                return obj
                            }, {});
                            
            // since the download api does not provide numFound, query index
            const downloadRecordsPromise  = useAPIFetch(`/api/v2022/documents/schemas/${encodeURIComponent(props.schema)}/download`, 
                                            {
                                                method:'POST', 
                                                body : {
                                                    query:parseSolrQuery(lQuery, locale), 
                                                    fields,
                                                    newRowForArrayValues:false
                                                },
                                                ...config,
                                                headers
                                            });

            if(listType == 'all'){
                
                const response = await downloadRecordsPromise;
                
                // Create a Blob from the response data
                const buffer = await response.arrayBuffer();
                const pdfBlob = new Blob([buffer], { type:mimeTypes[format || 'json'] });

                // Create a temporary URL for the Blob
                const url = window.URL.createObjectURL(pdfBlob);

                // Create a temporary <a> element to trigger the download
                const tempLink = document.createElement("a");
                tempLink.href = url;
                tempLink.setAttribute("download", props.fileName||`scbd-ort-data-${formatDate(new Date(), "DD-MMM-YYYY_HH:mm", true)}.${format}`);

                tempLink.click();

                window.URL.revokeObjectURL(url);
                
                return
            }

            const recordCountPromise      = queryIndex(parseSolrQuery(props.searchQuery, locale))

            const result = await Promise.all([downloadRecordsPromise, recordCountPromise]);
            downloadDocs.value = result[0];
            numFound.value = result[1].numFound
        }
        finally {
            loading.value = false;
        }
    }


    defineExpose({openExportModal})
</script>


<style scoped>
.radio label {
    padding: 20px;
}

.radio-inline {
    display: inline-block !important;
}

#datatable .tableexport-caption {
    display: none !important;
}
.custom-fields-modal .modal-body {
    height: 25rem; /* Fix the height in rem */
    overflow-y: auto; /* Allow scrolling only when content overflows */
}
</style>