<template>
    <div>
        <div class="justify-content-center">
            <div >
                <legend>Welcome to your country's National Targets submission section. please select option to proceed.</legend>
                <hr/>
            </div>  

            <CRow>
              <CCol :sm="6">
                <CCard>
                  <CCardBody>
                    <CCardTitle>Part I</CCardTitle>
                    <CCardText>Submit your national targets here</CCardText>
                    <div class="d-grid gap-1 d-flex">
                        <km-link :to="appRoutes.NBSAPS_TARGETS_MY_COUNTRY_PART_I" title="Go to Part I" 
                            role="button" class="btn btn-primary"></km-link>
                        <CButton @click="onValidatePartI()" color="secondary">Validate Part I</CButton>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol :sm="6">
                <CCard>
                  <CCardBody>
                    <CCardTitle>Part II</CCardTitle>
                    <CCardText>Submit your global golas/targets mapping information </CCardText>
                    <div class="d-grid gap-1 d-flex">
                        <km-link :to="appRoutes.NBSAPS_TARGETS_MY_COUNTRY_PART_II" title="Go to Part II" 
                            role="button" class="btn btn-primary"></km-link>
                        <CButton @click="onValidatePartII()" color="secondary">Validate Part II</CButton>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol class="mt-1" :sm="12">
                <CCard>
                  <CCardBody>
                    <div class=" float-end d-grid gap-1 d-flex">
                        <CButton @click="onPublish()" color="primary">Publish Part I and Part II</CButton>
                        <CButton @click="onValidateAll()" color="secondary">Validate Part I and Part II</CButton>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
                <CCol>
                    <validation ref="validationRef"></validation>
                </CCol>
            </CRow>
        </div>
    </div>
</template>

<script setup lang="ts">

    import { KmSuspense, KmLink, KmNavLink } from '@/components/controls'
    import validation from '@/components/pages/nbsap-targets/my-country/validation.vue';
    
    const validationRef = ref(null);
    const {$appRoutes:appRoutes} = useNuxtApp();


    async function onValidatePartI(){
        console.log('part II', validationRef)
        await validationRef.value.validatePartI();
    }
    async function onValidatePartII(){
        console.log('part I', validationRef);
        await validationRef.value.validatePartII();
    }
    function onValidateAll(){
        console.log('part all', validationRef)
        onValidatePartI();
        onValidatePartII();
    }

</script>

<style scoped>

</style>