<template>
  <div>
    <user-profile-info class="mb-2"></user-profile-info>
    <CRow>
      <!-- <template> -->
        <CCol md="12">
          <div class="alert alert-success" role="alert">
            <div  v-if="publishedRecords?.length">
                <h4 class="alert-heading">Recent Publish!</h4>
                <p>
                <strong>{{publishedRecords[0].country}}</strong> recently published {{ publishedRecords[0].type }}.
                </p>
                <hr />
            </div>
            <p class="mb-0">
              Are you a country representative responsible for National Report submission,
              <km-link :to="appRoutes.NATIONAL_TARGETS_MY_COUNTRY">click here</km-link> to begin
            </p>
          </div>
        </CCol>
        <CCol md="3" sm="6">            
            <km-link :to="appRoutes.NATIONAL_REPORTS_NR6" class="unset-anchor" target="_blank">
                <div class="card">
                    <div class="card-header content-center text-white p-2 bg-success">
                    <span height="52" class="my-4">6th National Reports</span>
                    </div>
                    <div class="card-body row text-center">
                    <div class="col">
                        <div class="text-value-lg">{{nr6Count}}</div>
                        <div class="text-uppercase text-muted small">
                        6th National Reports
                        </div>
                    </div>
                    <div
                        class="c-vr text-value-lg"
                        style="width: unset; background-color: unset"
                    >
                        By
                    </div>
                    <div class="col">
                        <div class="text-value-lg">{{nr6CountryCount}}</div>
                        <div class="text-uppercase text-muted small">Countries</div>
                    </div>
                    </div>
                </div>
            </km-link>
        </CCol>
        <CCol md="3" sm="6">
            <km-link :to="appRoutes.NATIONAL_REPORTS_NR7" class="unset-anchor">
                <div class="card">
                    <div class="card-header content-center text-white p-2 bg-success">
                    <span height="52" class="my-4">7th National Reports</span>
                    </div>
                    <div class="card-body row text-center">
                    <div class="col">
                        <div class="text-value-lg">{{nr7Count}}</div>
                        <div class="text-uppercase text-muted small">
                        7th National Reports
                        </div>
                    </div>
                    <div
                        class="c-vr text-value-lg"
                        style="width: unset; background-color: unset"
                    >
                        By
                    </div>
                    <div class="col">
                        <div class="text-value-lg">{{nr7CountryCount}}</div>
                        <div class="text-uppercase text-muted small">Countries</div>
                    </div>
                    </div>
                </div>
            </km-link>
        </CCol>
        <CCol md="3" sm="6">
            <km-link :to="appRoutes.NATIONAL_TARGETS" class="unset-anchor">
                <div class="card">
                    <div class="card-header content-center text-white p-2 bg-success">
                    <span height="52" class="my-4">National targets</span>
                    </div>
                    <div class="card-body row text-center">
                    <div class="col">
                        <div class="text-value-lg">{{nr7TargetCount}}</div>
                        <div class="text-uppercase text-muted small">
                        National Targets
                        </div>
                    </div>
                    <div
                        class="c-vr text-value-lg"
                        style="width: unset; background-color: unset"
                    >
                        By
                    </div>
                    <div class="col">
                        <div class="text-value-lg">{{ nr7TargetCountryCount }}</div>
                        <div class="text-uppercase text-muted small">Countries</div>
                    </div>
                    </div>
                </div>
            </km-link>
        </CCol>
        <CCol md="3" sm="6">

            <km-link :to="appRoutes.NATIONAL_REPORTS_NBSAP" class="unset-anchor">
                <div class="card">
                    <div class="card-header content-center text-white p-2 bg-success">
                    <span height="52" class="my-4">National Biodiversity Strategies and Action Plans (NBSAPs)</span>
                    </div>
                    <div class="card-body row text-center">
                    <div class="col">
                        <div class="text-value-lg">{{nrCount}}</div>
                        <div class="text-uppercase text-muted small">
                            NBSAPs
                        </div>
                    </div>
                    <div
                        class="c-vr text-value-lg"
                        style="width: unset; background-color: unset"
                    >
                        By
                    </div>
                    <div class="col">
                        <div class="text-value-lg">{{nrCountryCount}}</div>
                        <div class="text-uppercase text-muted small">Countries</div>
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
          <CCardHeader> Latest records </CCardHeader>
          <CCardBody>
            <CTable hover>
                <CTableHead>
                    <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Country</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Published on</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    <CTableRow v-for="(record, $index) in publishedRecords" :key="record.identifier">
                        <CTableHeaderCell scope="row">{{ $index+1 }}</CTableHeaderCell>
                        <CTableDataCell>{{record.title}}</CTableDataCell>
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

<script setup>
import UserProfileInfo  from "@/components/common/user-profile-info.vue"
import { useRealmConfStore } from '@/stores/realmConf';
import { facets } from '@/services/solr';
import { KmLink } from "@/components/controls";


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
            sort: "updatedDate_dt desc"
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
                    schema:e.schema_s
                }
            })
        })

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