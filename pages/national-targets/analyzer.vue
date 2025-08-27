<template>
    <CCard>
      <CCardHeader>
          <font-awesome-icon icon="chart-simple" /> 
          {{ t('nationalTargetsAnalyzer') }} 
          <km-link class="float-end" v-if="query.embed" :to="realm.baseURL" target="_blank">
            <CTooltip :content="t('ortTip')" trigger="hover">
                <template #toggler="{ on }">
                    <span v-on="on"><strong>{{realm.displayName}}</strong></span>
                </template>
            </CTooltip>            
          </km-link>
          <button class="float-end btn btn-secondary btn-sm" @click="()=>showSharableSectionModal=true"
            v-if="!query.embed" :to="ShareAllUrl">
              <font-awesome-icon icon="share-nodes" /> 
              {{t('share')}}          
          </button>
      </CCardHeader>  
      <CCardBody>        
        <km-suspense>
            <national-targets-analyzer></national-targets-analyzer>
        </km-suspense>
      </CCardBody>
    </CCard>

    <CModal  class="show d-block" alignment="center" backdrop="static" 
        @close="closeDialog" :visible="showSharableSectionModal" >
        <CModalHeader :close-button="false">
            <CModalTitle>
                {{ t('shareAnalyzerHeader') }}
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div class="alert alert-info">{{t('shareMessage')}}</div>
            <ul class="list-group">
                <li class="list-group-item" v-for="(item, key) in sharableSections" :key="item">
                    <km-checkbox :id="key"  @update:checked="checkShareItem(key, $event)">{{ item }}</km-checkbox>
                </li>
            </ul>
            <div v-if="embedCode" class="mt-2 alert alert-secondary">
              <code>{{ embedCode }}</code>
            </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" @click="showEmbedCode">{{t('embedCode')}}</CButton>
            <km-link target="_blank" class="float-end btn btn-secondary" :to="ShareAllUrl">
                <font-awesome-icon icon="share-nodes" /> 
                {{t('getShareLink')}}
            </km-link>
            <CButton color="secondary" @click="closeDialog">{{t('close')}}</CButton>
        </CModalFooter>
    </CModal>  
  </template>
  <i18n src="@/i18n/dist/pages/national-targets/analyzer.json"></i18n>
  <script setup lang="ts">
//@ts-nocheck

    import {useRoute} from 'vue-router';
    import {stringifyQuery} from 'ufo'
    const { t }     = useI18n();
    const { query } = useRoute();
    const route     = useRoute();
    const realm     = useRealm()

    const showSharableSectionModal = ref(false);
    const sharableCheckedItems = ref([]);
    const embedCode            = ref();
    const sharableSections = {
        'general-count'          : t('general-count'),
        'target-progress-regions': t('target-progress-regions'),
        'target-progress-parties': t('target-progress-parties'),
        'monitoring-progress'    : t('monitoring-progress'),
        'relevance-progress'     : t('relevance-progress'),
        'section-c-progress'     : t('section-c-progress'),
        'non-state-progress'     : t('non-state-progress'),
        'party-count'            : t('party-count'),
    }
    
    definePageMeta({
        auth:false,
    })
    const ShareAllUrl = computed(()=>`${appRoutes.NATIONAL_TARGETS_ANALYZER}?embed=true&type=national-target-analyzer&share=${sharableCheckedItems.value}&${stringifyQuery(route.query||{})}`)


    function checkShareItem(item:string, checked:boolean){
        embedCode.value = null;
        if(checked)
          sharableCheckedItems.value.push(item)
        else
          sharableCheckedItems.value = sharableCheckedItems.value.filter(e=>e!= item);
    }
    
    function closeDialog(){
      showSharableSectionModal.value=false;
      sharableCheckedItems.value=[];
      embedCode.value = null;
    }

    async function showEmbedCode(){
      
      const config = useRuntimeConfig();
      const originUrl = config.public.API_URL.replace('api', 'ort');
      const url = `${originUrl}${ShareAllUrl.value}`;

      const oembedResponse = await useAPIFetch('/oembed', { query : {url}});
       embedCode.value = `
                          ${oembedResponse.resources?.map(e=>`<script asycn="true" type="text/javascript" src="${e.src}"><\/script>`)}
                          ${oembedResponse.html}
                        `
    }
    
  </script>

  <style>
    .embed .container-fluid{
      padding-right: 0px!important; 
      padding-left: 0px!important;
    }
    .embed  .body.flex-grow-1.px-3 {
      padding-right: 0px!important;
      padding-left: 0px!important;
    }
  </style>