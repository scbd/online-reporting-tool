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

                  <CNav variant="tabs" role="tablist">
                    <CNavItem active>
                        <CNavLink
                            :disabled="loading"
                            href="javascript:void(0);"
                            :active="tabPaneActiveKey === 1"
                            @click="loadSectionData(1)"
                        >
                             {{t('sectionI')}} 
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            :disabled="loading"
                            href="javascript:void(0);"
                            :active="tabPaneActiveKey === 2"
                            @click="loadSectionData(2)"
                        >
                             {{t('sectionII')}}
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            :disabled="loading"
                            href="javascript:void(0);"
                            :active="tabPaneActiveKey === 3"
                            @click="loadSectionData(3)"
                        >
                            {{t('sectionIII')}}
                            <strong v-if="tabPaneActiveKey === 3">({{ sectionCount }})</strong>
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            :disabled="loading"
                            href="javascript:void(0);"
                            :active="tabPaneActiveKey === 4"
                            @click="loadSectionData(4)"
                        >
                            {{t('sectionIV')}}
                            <strong v-if="tabPaneActiveKey === 4">({{ sectionCount }})</strong>
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            :disabled="loading"
                            href="javascript:void(0);"
                            :active="tabPaneActiveKey === 5"
                            @click="loadSectionData(5)"
                        >
                            {{t('sectionV')}}
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            :disabled="loading"
                            href="javascript:void(0);"
                            :active="tabPaneActiveKey === 6"
                            @click="loadSectionData(6)"
                        >{{t('indicatorData')}} 
                            <strong v-if="tabPaneActiveKey === 6">({{ sectionCount }})</strong>
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            :disabled="loading"
                            href="javascript:void(0);"
                            :active="tabPaneActiveKey === 7"
                            @click="loadSectionData(7)"
                        >{{t('binaryIndicatorData')}}   
                            <strong v-if="tabPaneActiveKey === 7">({{ sectionCount }})</strong>
                        </CNavLink>
                    </CNavItem>
                </CNav>
                <div class="row mt-2" v-if="loading">
                    <div class="col-12">
                        <div  class="alert alert-info">
                            <i class="fa fa-spin fa-spinner"></i> {{ t('processing') }}
                        </div>
                    </div>
                </div>
                <div class="row mt-2" v-if="downloadDocs">
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
                                                <span v-else-if="Array.isArray(row[field.key])">
                                                    <ul class="p-0 list-inline">
                                                        <li v-for="item in row[field.key]" :key="item">
                                                            <span v-html="formatString(item?.url|| item)"></span>
                                                        </li>
                                                    </ul>
                                                </span>
                                                <span v-else>
                                                    {{ row[field.key] }}
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
            <CModalFooter  class="d-flex justify-content-between">
                <div class="float-start">
                    <button type="button" class="btn btn-secondary float-start" :aria-label="t('customFields')" :disabled="loading"
                        @click="showCustomFieldsDialog()">{{ t('customFields') }}</button>
                </div> 
                <div class="float-end">                
                    <button type="button" class="btn btn-secondary " aria-label="Close" :disabled="loading"
                        @click="closeDialog()">{{ t('cancel') }}</button>
                    <button type="button" class="btn btn-primary ms-1" aria-label="Download"
                        @click="exportRecords({ listType: 'all', format: downloadFormat})" :disabled="loading" id="downloadDataFile">

                        {{ t('download') }} {{ t(sectionMapping[tabPaneActiveKey]) }} 
                    </button>
                </div>
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
                        <tr v-for="field in schemaFields" :key="field.key" >
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
<i18n src="@/i18n/dist/components/controls/search/nr7-export.json"></i18n>


<script setup lang="ts">
//@ts-nocheck
    import { downloadSchemas } from '~/app-data/download-schemas.js';
    import { queryIndex, parseSolrQuery } from '@/services/solr'
    
    const props = defineProps({
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
    const tabPaneActiveKey = ref(0);
    const sectionCount = ref()

    const sectionMapping = {
        1: 'sectionI',
        2: 'sectionII',
        3: 'sectionIII',
        4: 'sectionIV',
        5: 'sectionV',
        6: 'indicator-data',
        7: 'binary-indicator-data'
    }
    const schemaMapping = {
        'sectionI': SCHEMAS.NATIONAL_REPORT_7,
        'sectionII': SCHEMAS.NATIONAL_REPORT_7,
        'sectionIII': SCHEMAS.NATIONAL_REPORT_7,
        'sectionIV': SCHEMAS.NATIONAL_REPORT_7,
        'indicator-data': SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA,
        'binary-indicator-data': SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA
    }

    const selectedSchemaFields = computed(() => {
        return schemaFields.value.filter(f => f.selected);
    });

    const openExportModal = async (skipReset) => {
        showExportModal.value = true;
        if(!skipReset){
            loadSectionData(1);
        } else {
            exportRecords({ section: tabPaneActiveKey.value, listType: 'initial', format: 'json' });
        }
    }

    const loadSectionData = (section:number) => {
        if(loading.value === true || tabPaneActiveKey.value === section) return;
        tabPaneActiveKey.value = section;
        
        const fieldKey = `nationalReport7-${sectionMapping[section]}`;
        const schemaDef = downloadSchemasRef[fieldKey] || { default: {}, optional: {} };
        const defaultFields = schemaDef.default || {};
        const optionalFields = schemaDef.optional || {};
        
        schemaFields.value = [
            ...Object.keys(defaultFields).map(k => ({key: k, value: defaultFields[k], selected: true})),
            ...Object.keys(optionalFields).map(k => ({key: k, value: optionalFields[k], selected: false}))
        ];

        exportRecords({ section, listType: 'initial', format: 'json' });
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
            else{
                downloadDocs.value = [];
                sectionCount.value = undefined;
                lQuery.rowsPerPage = 25;
            }
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

            let mongoIdField = 'identifier';
            let solrIdField = 'identifier_s';    
            if(sectionMapping[tabPaneActiveKey.value] == 'sectionIII'){
                solrIdField = 'sectionIIIKey_s';
            }
            else if(sectionMapping[tabPaneActiveKey.value] == 'sectionIV'){
                solrIdField = 'sectionIVKey_s';
            }
            else if(sectionMapping[tabPaneActiveKey.value] == 'indicator-data'){
                mongoIdField = 'nr7IndicatorDataIdentifier';
                solrIdField = 'indicatorDataKey_s';
            }
            else if(sectionMapping[tabPaneActiveKey.value] == 'binary-indicator-data'){
                mongoIdField = 'nr7BinaryDataIdentifier';
                solrIdField = 'binaryIndicatorDataKey_s';
            }

            if(listType == 'all'){
                // config.responseType = "arraybuffer"
                config.responseType = "blob";
            }
            const fields = selectedSchemaFields.value.filter(f=>f.selected)
                            .reduce((obj, field) =>{
                                obj[field.key]=field.value
                                return obj
                            }, {});
                            
            // since the download api does not provide numFound, query index
            const downloadQuery = {
                method:'POST', 
                body : {
                    query:parseSolrQuery(lQuery, locale), 
                    fields,
                    newRowForArrayValues:false,
                    solrIdField,
                    mongoIdField
                },
                ...config,
                headers
            }
            const downloadRecordsPromise  = useAPIFetch(`/api/v2022/documents/schemas/${encodeURIComponent(props.schema)}/download`, downloadQuery);
            const downloadCountPromise  = listType == 'all' ? sectionCount.value : useAPIFetch(`/api/v2022/documents/schemas/${encodeURIComponent(props.schema)}/download`, {...downloadQuery, body : {...downloadQuery.body, count:true}});

            if(listType == 'all'){
                
                const response = await downloadRecordsPromise;
                
                // Create a Blob from the response data
                const buffer = await response.arrayBuffer();
                const pdfBlob = new Blob([buffer], { type:mimeTypes[format || 'json'] });

                // Create a temporary URL for the Blob
                const url = window.URL.createObjectURL(pdfBlob);
                const fileName = `scbd-ort-nr7-data-${sectionMapping[tabPaneActiveKey.value]}-${formatDate(new Date(), "DD-MMM-YYYY-HH-mm", true)}.${format}`;
                // Create a temporary <a> element to trigger the download
                const tempLink = document.createElement("a");
                tempLink.href = url;
                tempLink.setAttribute("download", fileName, true);

                tempLink.click();

                window.URL.revokeObjectURL(url);
                
                return
            }

            const recordCountPromise      = queryIndex(parseSolrQuery(props.searchQuery, locale))

            const result = await Promise.all([downloadRecordsPromise, recordCountPromise, downloadCountPromise]);
            downloadDocs.value = result[0];
            numFound.value = result[1].numFound
            sectionCount.value = result[2].count 
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