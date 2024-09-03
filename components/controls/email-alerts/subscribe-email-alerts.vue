<template>
    <div id="email-alerts">
        <div class="search">
            <div class="row">
                <div col="col-12">
                    <CButton color="primary float-end mb-1" @click="editSubscription({})">{{t('addAlert')}}</CButton>
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Email alert</th>
                                <th width="10%"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="subscription in subscriptions" :key="subscription">
                                <td>
                                    {{ subscription.queryTitle }}
                                    <div>
                                        <span class="badge bg-dark me-1" v-for="filter in subscription.filters" :key="filter">
                                            {{ lstring(filter.name, locale) }}
                                        </span>
                                    </div>
                                    <!-- ({{ Object.keys(subscription.filters||{})?.length }} filters)                                     -->
                                </td>
                                <td>
                                    {{ subscription.sendEmail ? 'Yes' : 'No' }}
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-secondary me-1" @click="editSubscription(subscription)">
                                        <font-awesome-icon icon="edit"></font-awesome-icon> {{ t('edit') }}
                                    </button>
                                    <button class="btn btn-sm btn-danger" @click="deleteSubscription(subscription)">
                                        <font-awesome-icon icon="trash"></font-awesome-icon> {{ t('delete') }}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <km-spinner v-if="loading" center></km-spinner>
        </div>
    </div>
    <CModal class="show d-block" size="xl" alignment="center" backdrop="static" :visible="showModal" >
        <CModalHeader :close-button="false">
            <CModalTitle>{{t('modalTitle')}}</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <km-form-group name="title" :caption="t('title')" required>
                <input  id="title" class="form-control" :placeholder="t('title')" v-model="dirtySubscription.queryTitle" />
            </km-form-group>
            <search-filters @on-filter-change="onFilterChange" :update-url="false"
                :schema-types="recordTypes">
            </search-filters>
        </CModalBody> 
        <CModalFooter>
            <CButton color="secondary" @click="closeDialog">{{t('close')}}</CButton>
            <CButton color="primary" @click="save" :disabled="!canSave">
                <km-spinner v-if="loading" size="sm" variant="grow" aria-hidden="true" message=" "></km-spinner>
                {{t('save')}}
            </CButton>
        </CModalFooter>          
    </CModal>

    <CModal  class="show d-block" alignment="center" backdrop="static" :visible="showDeleteConfirmation" >
        <CModalHeader :close-button="false">
            <CModalTitle>
                {{ t('confirmDeleteTitle') }}
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <strong>{{ t('confirmDeleteTitleMessage') }}</strong>
            <div class="mt-2" v-if="loading">
                <CSpinner size="md" variant="grow"/><strong>{{ t('confirmDeleteProcessing') }}</strong>
            </div>
        </CModalBody>
        <CModalFooter>
            <CButton :disabled="loading" color="danger" @click="confirmDelete(true)">{{t('yes')}}</CButton>
            <CButton :disabled="loading" color="secondary" @click="confirmDelete(false)">{{t('no')}}</CButton>
        </CModalFooter>
    </CModal>
</template>
<i18n src="@/i18n/dist/components/controls/email-alerts/subscribe-email-alerts.json"></i18n>
<script setup lang="ts">
    import { SCHEMAS } from '@/utils';
    import { andOr, queryIndex, escape, parseSolrQuery } from '@/services/solr'
    import { useRealmConfStore } from '@/stores/realmConf';
    import { useThesaurusStore } from '@/stores/thesaurus';
    import { cloneDeep, compact, flatten }        from 'lodash';
    

    provide('mapSelectedFilters', mapSelectedFilters);

    const { t, locale }  = useI18n();
    const { $api }       = useNuxtApp();
    const realmConfStore = useRealmConfStore();
    const thesaurusStore = useThesaurusStore();
    const realmConf      = realmConfStore.realmConf;
    
    const loading           = ref(false);
    const subscriptions     = ref({});
    const showModal         = ref(false);
    const dirtySubscription = ref(null);
    const showDeleteConfirmation = ref(false);
    const recordTypes       = [SCHEMAS.NATIONAL_TARGET_7, SCHEMAS.NATIONAL_TARGET_7_MAPPING];
    const filterMapping     = {
        recordTypes  : 'schema',
        globalTargets: 'target-keyword',
        globalGoals  : 'goal-keyword',
        countries    : 'country',
        regions      : 'region',
    }
    
    const canSave = computed(()=>{
        return dirtySubscription.value?.queryTitle?.length && dirtySubscription.value?.filters?.length
    })
    function mapSelectedFilters(filterKey){
        
        const currentSubscription = dirtySubscription.value;
        if(currentSubscription){
            const mappingKey = filterMapping[filterKey];
            if(mappingKey){
                const filters = currentSubscription.filters?.filter(e=>e.type == mappingKey)
                return filters?.map(e=>({identifier : e.id}));
            }
        }
    }


    async function loadSubscriptions(){
        loading.value = true
        const query = {
            realm : realmConf.realm
        }
        const data     = await $api.subscription.list(query)
        subscriptions.value = data;
        loading.value=false;
    }

    function editSubscription(subscription:Subcription){
        console.log(subscription)
        dirtySubscription.value = cloneDeep(subscription);
        showModal.value = true;
    }

    function deleteSubscription(subscription){
        dirtySubscription.value = subscription;
        showDeleteConfirmation.value=true;
    }

    async function confirmDelete(confirm:boolean){
        if(confirm){
            await $api.subscription.delete(dirtySubscription.value._id);
            loadSubscriptions();
        }

        showDeleteConfirmation.value = false;
        dirtySubscription.value = undefined
    }

    function buildFilter(type:string, items:Array<String>){
        return items.map(e=>{
            return {
                id       : e,
                name     : thesaurusStore.getTerm(e)?.title,
                type
            }
        })
    }

    function buildArrayQuery(field:string, items:Array<String>){
        if(items?.length){
            return `${field} : (${items.map(escape).join(' ')})`;
        }
    }
    function onFilterChange(newFilters:Object){
        const queries:Array<String> = [];
        let   filters = [];

        if(newFilters.recordTypes?.length){

            queries.push(buildArrayQuery('schema_s', newFilters.recordTypes));
            filters.push(  
                newFilters.recordTypes.map(schema=>({
                        id          : schema,
                        name        : realmConf.schemas[schema].title,
                        otherType   : realmConf.schemas[schema].type,
                        type        : 'schema',
                    })
                )
            );
        }
        if(newFilters.globalTargets?.length){
            queries.push(buildArrayQuery('globalTargetAlignment_ss', newFilters.globalTargets)); 
            // since ort does not have keywords like field, use subquery for targets, use dummy to show on screen
            filters.push(buildFilter(filterMapping['globalTargets'], newFilters.globalTargets));
        }
        if(newFilters.globalGoals?.length){
            queries.push(buildArrayQuery('globalGoalAlignment_ss', newFilters.globalGoals));
            // since ort does not have keywords like field, use subquery for goals, use dummy to show on screen
            filters.push(buildFilter(filterMapping['globalGoals'], newFilters.globalGoals));
        }
        if(newFilters.countries?.length){
            queries.push(buildArrayQuery('government_s', newFilters.countries)); 
            filters.push(buildFilter('country', newFilters.countries));            
        }
        if(newFilters.regions?.length){
            queries.push(buildArrayQuery('government_REL_ss', newFilters.regions)); 
            filters.push(buildFilter('region', newFilters.regions));
        }                               


        const searchQuery = {
            rowsPerPage: 0,
            query: andOr(compact(queries), 'AND'),
        }
        const query = parseSolrQuery(searchQuery, locale);
        filters     = flatten(compact(filters));
        
        dirtySubscription.value.filters     = filters;
        dirtySubscription.value.solrQuery   = query;
        
    }

    function closeDialog(){
        showModal.value = false;
        dirtySubscription.value=undefined;
    }

    async function save(){

        try{
            loading.value = true;
            const currentSubscription = dirtySubscription.value;

            console.log(currentSubscription)

            if(Object.keys(currentSubscription||{})?.length){

                if(!currentSubscription.queryTitle?.length)
                    return;

                currentSubscription.realm = realmConf.realm;
                currentSubscription.sendEmail = true;

                if(currentSubscription._id)
                    await $api.subscription.update(currentSubscription._id, currentSubscription)
                else
                    await $api.subscription.add(currentSubscription)

                loadSubscriptions();
            }  
        }
        catch(e){
            useLogger().error(e, 'Error saving subscription.');
        }
        loading.value = false;
        showModal.value = false;
        dirtySubscription.value=undefined;
    }

    onMounted(() => {
        loadSubscriptions()
    })
</script>

<style scoped>

</style>