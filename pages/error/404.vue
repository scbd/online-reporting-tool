<template>
    <div class="bg-light min-vh-50 d-flex flex-row align-items-center">
      <CContainer>
        <CRow class="justify-content-center">
          <CCol :md="6">
              <span class="clearfix">
                  <h1 class="float-start display-3 me-4">{{ t('errorCode') }}</h1>
                  <h4 class="pt-3">{{ t('errorHeading') }}</h4>
                  <p class="text-medium-emphasis float-start">
                      {{ t('errorMessage') }}
                  </p>
              </span>
            
              
              <button class="btn btn-secondary" @click="handleError">{{t('backHome')}}</button>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  </template>
  <i18n src="@/i18n/dist/pages/error/404.json"></i18n>
  <script setup>
      const { t } = useI18n();
      const handleError = () => clearError({ redirect: '/' })
  
  </script>
  