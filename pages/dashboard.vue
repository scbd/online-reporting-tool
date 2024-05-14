<template>
   
  <div>
    <div class="col-12" style="height:0px" id="welcome"></div>
    <on-boarding v-if="onBoardingSteps" teleport-to="#takeTourTeleport" :steps="onBoardingSteps"></on-boarding>
    <user-profile-info class="mb-2" id="userProfile"></user-profile-info>
    <div class="d-none" ></div>
    <CRow >
      <!-- <template> -->
        <CCol md="12" id="recentlyPublished">
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
        <CCol md="3" sm="6">            
            <km-link :to="appRoutes.NATIONAL_REPORTS_NR6" class="unset-anchor" target="_blank">
                <div class="card">
                    <div class="card-header content-center text-white p-2 bg-success">
                    <span height="52" class="my-4">{{t('6Nr')}}</span>
                    </div>
                    <div class="card-body row text-center">
                    <div class="col">
                        <div class="text-value-lg">{{nr6Count}}</div>
                        <div class="text-uppercase text-muted small">
                            {{t('6Nr')}}
                        </div>
                    </div>
                    <div
                        class="c-vr text-value-lg"
                        style="width: unset; background-color: unset"
                    >
                    {{t('by')}}
                    </div>
                    <div class="col">
                        <div class="text-value-lg">{{nr6CountryCount}}</div>
                        <div class="text-uppercase text-muted small">{{t('countries')}}</div>
                    </div>
                    </div>
                </div>
            </km-link>
        </CCol>
        <CCol md="3" sm="6">
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
        <CCol md="3" sm="6">
            <km-link :to="appRoutes.NATIONAL_TARGETS" class="unset-anchor">
                <div class="card">
                    <div class="card-header content-center text-white p-2 bg-success">
                    <span height="52" class="my-4">{{t('nationalTargets')}}</span>
                    </div>
                    <div class="card-body row text-center">
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
                </div>
            </km-link>
        </CCol>
        <CCol md="3" sm="6">

            <km-link :to="appRoutes.NATIONAL_REPORTS_NBSAP" class="unset-anchor">
                <div class="card">
                    <div class="card-header content-center text-white p-2 bg-success">
                    <span height="52" class="my-4">{{t('nbsapsFull')}}</span>
                    </div>
                    <div class="card-body row text-center">
                    <div class="col">
                        <div class="text-value-lg">{{nrCount}}</div>
                        <div class="text-uppercase text-muted small">
                            {{t('nbsaps')}}
                        </div>
                    </div>
                    <div
                        class="c-vr text-value-lg"
                        style="width: unset; background-color: unset"
                    >
                    {{t('by')}}
                    </div>
                    <div class="col">
                        <div class="text-value-lg">{{nrCountryCount}}</div>
                        <div class="text-uppercase text-muted small">{{t('countries')}}</div>
                    </div>
                    </div>
                </div>
            </km-link>
        </CCol>
        
      <!-- </template> -->
    </CRow>
    <CRow class="mt-5">
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
<script setup>
import UserProfileInfo  from "@/components/common/user-profile-info.vue"
import { useRealmConfStore } from '@/stores/realmConf';
import { facets } from '@/services/solr';
import { KmLink } from "@/components/controls";

        const { t }  = useI18n();
        definePageMeta({
            auth:false
        })
      
        const realmConfStore  = useRealmConfStore();
        const realmConf = realmConfStore.realmConf;

        const { $appRoutes:appRoutes } = useNuxtApp();

        const searchQuery = {
            rows:10,
            q : `_state_s: public AND 
                    ((schema_s : (${SCHEMAS.NATIONAL_TARGET_7} ${SCHEMAS.NATIONAL_TARGET_7_MAPPING}) AND realm_ss:${realmConf.realm}) OR 
                    (schema_s : (${SCHEMAS.NATIONAL_REPORT_6} ${SCHEMAS.NATIONAL_REPORT}) AND realm_ss:${realmConf.realm.replace('ORT', 'CHM')}))`,
            facet: true,
            'facet.field': ['schema_s', 'government_EN_s'],
            'facet.pivot' : "government_EN_s,schema_s",
            sort: "updatedDate_dt desc",
            fl: "id, identifier_s,government_EN_t, title_EN_t, schema_EN_t,submittedDate_dt,schema_s, url_ss"
        }
        const searchFacets = await facets(searchQuery)
        const countryFacets = searchFacets.facetPivot['government_EN_s,schema_s'];


        const nr7Count       = computed(()=>countryFacets?.reduce((prevVal, currVal)=> prevVal + (schemaCount(currVal, SCHEMAS.NATIONAL_REPORT_7)), 0))
        const nr7TargetCount = computed(()=>countryFacets?.reduce((prevVal, currVal)=> prevVal + (schemaCount(currVal, SCHEMAS.NATIONAL_TARGET_7)), 0))
        const nr6Count       = computed(()=>countryFacets?.reduce((prevVal, currVal)=> prevVal + (schemaCount(currVal, SCHEMAS.NATIONAL_REPORT_6)), 0))
        const nrCount        = computed(()=>countryFacets?.reduce((prevVal, currVal)=> prevVal + (schemaCount(currVal, SCHEMAS.NATIONAL_REPORT)  ), 0))
              
        const nr7CountryCount       = computed(()=>countryFacets?.reduce((prevVal, currVal)=> prevVal + (schemaCount(currVal, SCHEMAS.NATIONAL_REPORT_7) > 0 ? 1 : 0), 0))
        const nr7TargetCountryCount = computed(()=>countryFacets?.reduce((prevVal, currVal)=> prevVal + (schemaCount(currVal, SCHEMAS.NATIONAL_TARGET_7) > 0 ? 1 : 0), 0))
        const nr6CountryCount       = computed(()=>countryFacets?.reduce((prevVal, currVal)=> prevVal + (schemaCount(currVal, SCHEMAS.NATIONAL_REPORT_6) > 0 ? 1 : 0), 0))
        const nrCountryCount        = computed(()=>countryFacets?.reduce((prevVal, currVal)=> prevVal + (schemaCount(currVal, SCHEMAS.NATIONAL_REPORT)   > 0 ? 1 : 0), 0))
      
        const publishedRecords = computed(()=>{ 
            return searchFacets.docs?.map(e=> {
                return {
                    country:e.government_EN_t, title: e.title_EN_t, type:e.schema_EN_t,
                    identifier: e.identifier_s, publishedOn:e.submittedDate_dt,
                    schema:e.schema_s,
                    url:e.url_ss?.length ? e.url_ss[0] : '/s' 
                }
            })
        })

        const onBoardingSteps = [
            { attachTo: { element: '#welcome' }, content: { title: t('tourWelcomeTitle'), description: t("tourWelcomeContent") } },
            { attachTo: { element: '#userProfile' },        content: { title: t('userInfoTitle'), description: t("userInfoContent") } },
            { attachTo: { element: '#userGovernment' },        content: { title: t('governmentTitle'), description: t("governmentContent") } },
            { attachTo: { element: '#userRoles' },        content: { title: t('rolesTitle'), description: t("rolesContent") } },
            { attachTo: { element: '#recentlyPublished' },        content: { title: t('recentlyPublishedTitle'), description: t("recentlyPublishedContent") } },
            { attachTo: { element: '#topNav' },        content: { title: t('topNavigationTitle'), description: t("topNavigationContent") } },
            { attachTo: { element: '#sideNav' },        content: { title: t('sidebarNavTitle'), description: t("sidebarNavContent") } },
            { attachTo: { element: '#languages' },        content: { title: t('languageChangeTitle'), description: t("languageChangeContent") } },
            { attachTo: { element: '#slaask-button-cross' },        content: { title: t('needHelpTitle'), description: t("needHelpContent") } }
                        
        ]

        function schemaCount(currVal, schema){
                return currVal.pivot.find(e=>e.value == schema)?.count||0
        }
</script>

<style scoped>
    .unset-anchor{
        text-decoration: unset;
        color: unset;
    }
</style>