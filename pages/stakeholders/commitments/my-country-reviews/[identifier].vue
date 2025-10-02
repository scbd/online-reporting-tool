<template>
  <km-suspense>
    <div class="alert alert-danger" v-if="countryReview"
     style="border-color:#DDD; background-color: #f5f5f5;" role="alert">
      {{ t('countryReviewTitle') }}
      <country-review-action :identifier="countryReview.identifier" 
          :endorsed="countryReview.reviewed === true"
          @on-status-change="onStatusChange">
      </country-review-action>

    </div>
    
    <view-commitment v-if="document" :document="document" 
    :identifier="documentInfo?.identifier||''"
    @on-status-change="onStatusChange()"></view-commitment>
  
  </km-suspense>
  
</template>
<i18n src="@/i18n/dist/pages/stakeholders/commitments/my-country-reviews/[identifier].json"></i18n>
<script setup lang="ts">

import { SCHEMAS, ROLES } from '@/utils';
import KmStakeholderCommitmentApi from '~/api/km-stakeholder-commitment';
import type { EAuthUser } from '~/types/schemas/base/EAuthUser';
import type { EDocumentInfo } from '~/types/schemas/base/EDocumentInfo';
import type { ECommitmentCountryReview } from '~/types/schemas/ECommitmentCountryReview';
  const kmStakeholderCommitmentApi = new KmStakeholderCommitmentApi({});

  const { user } = useAuth();
  const { t }  = useI18n();
  const route       = useRoute();
  const isLoading   = ref(false);
  const documentInfo= ref<EDocumentInfo|undefined>(undefined);
  const countryReview = ref<ECommitmentCountryReview|undefined>(undefined);
  const document = computed(()=>{
    return documentInfo.value?.workingDocumentBody || documentInfo.value?.body
  })
  definePageMeta({
      auth:true,
      roles:[ROLES.NATIONAL_FOCALPOINT],
      breadcrumbs : {}
  });

  async function loadDocument() {
    isLoading.value = true;
    try {
        documentInfo.value  = await kmStakeholderCommitmentApi.getCountryCommitment(route.params?.identifier?.toString());

    } catch (e:any) {
      if ([404, 401, 403].includes(e.status)) {
        useLogger().error(e, `${t(e.status == 404 ? 'notFound' : 'notAuthorized')} ` + route.params.identifier);
      } else
        useLogger().error(e, `${t('errorLoading')} ` + route.params.identifier);
    }
    isLoading.value = false;
  }

  async function loadCountryReviews(){
    if(user.value.government)
    countryReview.value   = (await kmStakeholderCommitmentApi.getCountryReviews({identifier:route.params?.identifier?.toString(), government:user.value.government}))?.[0];
  }

  async function onStatusChange(){
    loadCountryReviews();
    //just to trigger update on the inner table.
    const lCopy = documentInfo.value;
    documentInfo.value = undefined;
    await sleep(100);
    documentInfo.value = lCopy;
  }

    // route.meta.breadcrumbs.replaceCrumb = [ {'nbsaps' : lstring(schema?.title, locale)} ];
  loadDocument()
  loadCountryReviews()

</script>