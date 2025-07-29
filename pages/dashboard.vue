<template>
   
  <div>
    <on-boarding v-if="onBoardingSteps" teleport-to="#takeTourTeleport" :steps="onBoardingSteps"
        :page-title="t('tourTitle')" @on-tour-start="onTourStart" @on-tour-end="onTourEnd"></on-boarding>
    <tour-dummy-user-profile v-if="!user && tourStarted"></tour-dummy-user-profile>
    <user-profile-info class="mb-2" id="userProfile"></user-profile-info>
    <div class="d-none" ></div>
    <CCard class="mb-2" :class="!hasWorkflowRequest ? 'visually-hidden' : ''" v-if="user?.userID">
        <CCardHeader>{{t('workflowRequestsTitle')}}</CCardHeader>
        
        <CCardBody>
            <div class="alert alert-info">
                {{ t('workflowAlert') }}
            </div>
            <workflow-requests @on-load="onWorkflowRequestsLoad"></workflow-requests>
        </CCardBody>
    </CCard>
    <CRow >
      <!-- <template> -->
        <CCol md="12" id="recentlyPublished" >
          <div class="alert alert-success" role="alert">
            <div  v-if="publishedRecords?.length">
                <h4 class="alert-heading">{{t('recentPublish')}}</h4>
                <p>
                <strong>{{publishedRecords[0].country}}</strong> {{t('recentlyPublished')}} {{ publishedRecords[0].type }}.
                </p>
                <hr />
            </div>
            <p class="mb-0">
                {{t('countryRepresentative')}}
              <km-link :to="appRoutes.NATIONAL_TARGETS_MY_COUNTRY">{{t('clickHere')}}</km-link> {{t('toBegin')}}
            </p>
          </div>
        </CCol>       
        <CCol lg="12" xl="6" v-if="!true">
            <km-link :to="appRoutes.NATIONAL_REPORTS_NR7" class="unset-anchor">
                <div class="card">
                    <div class="card-header content-center text-white p-2 bg-success">
                    <span height="52" class="my-4">{{t('7Nr')}}</span>
                    </div>
                    <div class="card-body row text-center">
                    <div class="col">
                        <div class="text-value-lg">{{nr7Count}}</div>
                        <div class="text-uppercase text-muted small">
                            {{t('7Nr')}}
                        </div>
                    </div>
                    <div
                        class="c-vr text-value-lg"
                        style="width: unset; background-color: unset"
                    >
                    {{t('by')}}
                    </div>
                    <div class="col">
                        <div class="text-value-lg">{{nr7CountryCount}}</div>
                        <div class="text-uppercase text-muted small">{{t('countries')}}</div>
                    </div>
                    </div>
                </div>
            </km-link>
        </CCol>
        <CCol lg="12" xl="6">
            
                <div class="card">
                    <div class="card-header content-center text-white p-2 bg-success">
                        <span height="52" class="my-4">{{t('nationalTargets')}}</span>

                        <km-link title="Analyzer" :to="`${appRoutes.NATIONAL_TARGETS}`" 
                            class="btn btn-secondary btn-sm ms-1 float-end">
                            <font-awesome-icon icon="fa-search"></font-awesome-icon>
                        </km-link>
                        <km-link title="Analyzer" :to="`${appRoutes.NATIONAL_TARGETS_ANALYZER}`" class="btn btn-secondary btn-sm ms-1 float-end">
                            <font-awesome-icon icon="fa-chart-pie"></font-awesome-icon>
                        </km-link>
                    </div>
                    <div class="card-body row text-center">
                        <p>{{t('inAlignmentWithKMGBF')}}</p>
                        <div class="col">
                            <div class="text-value-lg">{{nr7TargetCount}}</div>
                            <div class="text-uppercase text-muted small">
                                {{t('nationalTargets')}}
                            </div>
                        </div>
                        <div
                            class="c-vr text-value-lg"
                            style="width: unset; background-color: unset"
                        >
                        {{t('by')}}
                        </div>
                        <div class="col">
                            <div class="text-value-lg">{{ nr7TargetCountryCount }}</div>
                            <div class="text-uppercase text-muted small">{{t('countries')}}</div>
                        </div>
                    </div>
                    <div class="card-body row text-center">
                        <hr/>
                        <km-link :to="appRoutes.NATIONAL_TARGETS_ANALYZER" class="unset-anchor">
                            <government-facet-map :query="nationalTargetsFacetQuery">
                                <template #title>{{t('nationalTargets')}}</template>
                            </government-facet-map>
                        </km-link>
                    </div>
                </div>
        </CCol>
        <CCol lg="12" xl="6">

            
                <div class="card">
                    <div class="card-header content-center text-white p-2 bg-success">
                        <span height="52" class="my-4">{{t('nbsapsFull')}}</span>
                        <km-link title="Analyzer" :to="`${appRoutes.NATIONAL_REPORTS_NBSAP}`" 
                            class="btn btn-secondary btn-sm ms-1 float-end">
                            <font-awesome-icon icon="fa-search"></font-awesome-icon>
                        </km-link>
                        <km-link title="Analyzer" :to="`${appRoutes.NATIONAL_REPORTS_NBSAP_ANALYZER}`" 
                            class="btn btn-secondary btn-sm ms-1 float-end">
                            <font-awesome-icon icon="fa-chart-pie"></font-awesome-icon>
                        </km-link>
                    </div>
                    <div class="card-body row text-center">
                        <p>{{t('inAlignmentWithKMGBF')}}</p>
                        <div class="col">
                            <div class="text-value-lg">{{nbsapCount}}</div>
                            <div class="text-uppercase text-muted small">
                                {{t('nbsaps')}}
                            </div>
                        </div>
                        <div class="c-vr text-value-lg" style="width: unset; background-color: unset">
                            {{t('by')}}
                        </div>
                        <div class="col">
                            <div class="text-value-lg">{{nbsapCountryCount}}</div>
                            <div class="text-uppercase text-muted small">{{t('countries')}}</div>
                        </div>
                    </div>
                    <div class="card-body row text-center">
                        <hr/>
                        <km-link :to="appRoutes.NATIONAL_REPORTS_NBSAP_ANALYZER" class="unset-anchor">
                            <government-facet-map :query="nbsapFacetQuery">
                                <template #title>{{t('nbsapsFull')}}</template>
                            </government-facet-map>
                        </km-link>
                    </div>
                </div>
        </CCol>
        
      <!-- </template> -->
    </CRow>
    <CRow class="mt-3">
      <CCol md="12">
        <CCard>
          <CCardHeader> {{t('latestRecords')}} </CCardHeader>
          <CCardBody>
            <CTable hover>
                <CTableHead>
                    <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">{{t('title')}}</CTableHeaderCell>
                    <CTableHeaderCell scope="col">{{t('country')}}</CTableHeaderCell>
                    <CTableHeaderCell scope="col">{{t('type')}}</CTableHeaderCell>
                    <CTableHeaderCell scope="col">{{t('publishedOn')}}</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    <CTableRow v-for="(record, $index) in publishedRecords" :key="record.identifier">
                        <CTableHeaderCell scope="row">{{ $index+1 }}</CTableHeaderCell>
                        <CTableDataCell>
                            <km-link :to="record.url" target="_blank">
                                {{record.title}}
                            </km-link>
                        </CTableDataCell>
                        <CTableDataCell>{{record.country}}</CTableDataCell>
                        <CTableDataCell>{{record.type}}</CTableDataCell>
                        <CTableDataCell>{{ formatDate(record.publishedOn) }}</CTableDataCell>
                    </CTableRow>
                </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>
<i18n src="@/i18n/dist/pages/dashboard.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
import UserProfileInfo  from "@/components/common/user-profile-info.vue"
import { useRealmConfStore } from '@/stores/realmConf';
import { facets,andOr,parseSolrQuery } from '@/services/solr';
import { KmLink } from "~/components/controls";

        const {user} = useAuth();
        const { t }  = useI18n();
        definePageMeta({
            auth:false
        })
        const realmConfStore  = useRealmConfStore();
        const realmConf = realmConfStore.realmConf;

        const { $appRoutes:appRoutes } = useNuxtApp();
        const tourStarted               = ref(false);
        const hasWorkflowRequest        = ref(false);
        const isLoading                 = ref(true);
        let countryFacets               = ref();
        let searchFacets                = ref();
        let nbsapFacets                 = ref();
        const nbsapFacetQuery           = andOr([`schema_s:${SCHEMAS.NATIONAL_NBSAP}`, `isGbfAligned_b:true`, `realm_ss:${realmConf.realm}`])
        const nationalTargetsFacetQuery = andOr([`schema_s:${SCHEMAS.NATIONAL_TARGET_7}`, `realm_ss:${realmConf.realm}`])
        

        const nr7Count       = computed(()=>countryFacets.value?.reduce((prevVal, currVal)=> prevVal + (schemaCount(currVal, SCHEMAS.NATIONAL_REPORT_7)), 0))
        const nr7TargetCount = computed(()=>countryFacets.value?.reduce((prevVal, currVal)=> prevVal + (schemaCount(currVal, SCHEMAS.NATIONAL_TARGET_7)), 0))
        const nr6Count       = computed(()=>countryFacets.value?.reduce((prevVal, currVal)=> prevVal + (schemaCount(currVal, SCHEMAS.NATIONAL_REPORT_6)), 0))
        const nbsapCount        = computed(()=>nbsapFacets.value?.facets?.schema_s?.nbsap)
              
        const nr7CountryCount       = computed(()=>countryFacets.value?.reduce((prevVal, currVal)=> prevVal + (schemaCount(currVal, SCHEMAS.NATIONAL_REPORT_7) > 0 ? 1 : 0), 0))
        const nr7TargetCountryCount = computed(()=>countryFacets.value?.reduce((prevVal, currVal)=> prevVal + (schemaCount(currVal, SCHEMAS.NATIONAL_TARGET_7) > 0 ? 1 : 0), 0))
        const nr6CountryCount       = computed(()=>countryFacets.value?.reduce((prevVal, currVal)=> prevVal + (schemaCount(currVal, SCHEMAS.NATIONAL_REPORT_6) > 0 ? 1 : 0), 0))
        const nbsapCountryCount     = computed(()=>Object.keys(nbsapFacets.value?.facets?.government_s||{})?.length)
      
        const publishedRecords = computed(()=>{ 
            return searchFacets.value?.docs?.map(e=> {
                return {
                    country:e.government_EN_t, title: e.title_EN_t, type:e.schema_EN_t,
                    identifier: e.identifier_s, publishedOn:e.submittedDate_dt,
                    schema:e.schema_s,
                    url:e.url_ss?.length ? e.url_ss[0] : '/s' 
                }
            })
        })

        const onBoardingSteps = [
            { attachTo: { element: '#tourWelcome' },            content: { title: t('tourWelcomeTitle'), description: t("tourWelcomeContent") } },
            { attachTo: { element: '#userProfile' },        content: { title: t('userInfoTitle'), description: t("userInfoContent") } },
            { attachTo: { element: '#userGovernment' },     content: { title: t('governmentTitle'), description: t("governmentContent") } },
            { attachTo: { element: '#userRoles' },          content: { title: t('rolesTitle'), description: t("rolesContent") } },
            { attachTo: { element: '#recentlyPublished' },  content: { title: t('recentlyPublishedTitle'), description: t("recentlyPublishedContent") } },
            { attachTo: { element: '#topNav' },             content: { title: t('topNavigationTitle'), description: t("topNavigationContent") } },
            { attachTo: { element: '#sideNav' },            content: { title: t('sidebarNavTitle'), description: t("sidebarNavContent") } },
            { attachTo: { element: '#languages' },          content: { title: t('languageChangeTitle'), description: t("languageChangeContent") } },
            { attachTo: { element: '#slaask-button-cross' },content: { title: t('needHelpTitle'), description: t("needHelpContent") } }
                        
        ]

        async function loadFacets(){
            try{
                const searchQuery = {
                    rowsPerPage:10,
                    q : `realm_ss:${realmConf.realm} AND 
                        (schema_s:(${SCHEMAS.NATIONAL_TARGET_7} ${SCHEMAS.NATIONAL_TARGET_7_MAPPING}))`,
                    facet: true,
                    facetMinCount: 1,
                    facetFields: ['schema_s', 'government_s'],
                    pivotFacetFields : ["government_s,schema_s" ],
                    sort: "updatedDate_dt desc",
                    fields: "id, identifier_s,government_EN_t, title_EN_t, schema_EN_t,submittedDate_dt,schema_s, url_ss"
                }
                //TODO remove second query
                const nbsapFacetQuery = {
                    rowsPerPage:0,
                    query : `_state_s: public AND realm_ss:${realmConf.realm} AND (schema_s : ${SCHEMAS.NATIONAL_NBSAP} AND isGbfAligned_b:true)`,
                    facet: true,
                    facetMinCount: 1,
                    facetFields: ['schema_s', 'government_s']
                }
                const [facetResult, nbsapFacetResult] = await Promise.all([await facets(parseSolrQuery(searchQuery)), await facets(parseSolrQuery(nbsapFacetQuery))])
                searchFacets.value  = facetResult;
                nbsapFacets.value   = nbsapFacetResult;
                if(searchFacets.value?.facetPivot)
                    countryFacets.value = searchFacets.value?.facetPivot['government_s,schema_s'];

            }
            catch(e){
                useLogger().error(e, 'Error loading home page facets')
            }
            finally{
                isLoading.value = false;
            }
        }

        function schemaCount(currVal, schema){
                return currVal.pivot.find(e=>e.value == schema)?.count||0
        }

        function onTourStart(){
            tourStarted.value = true
        }

        function onTourEnd(){
            tourStarted.value = false
        }

        function onWorkflowRequestsLoad(requests){
            hasWorkflowRequest.value = requests?.length ? true : false
        }

        onMounted(loadFacets)
</script>

<style scoped>
    .unset-anchor{
        text-decoration: unset;
        color: unset;
    }
</style>
