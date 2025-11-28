<template>
    <button :disabled="!element" type="button" class="btn btn-primary pdf-section-btn" 
        @click="onPdfDocument" >
        
        <font-awesome-icon icon="file-pdf"></font-awesome-icon> {{ t('pdf') }}
        <km-modal-spinner :visible="isGeneratingPdf" class="text-dark"
            :title="t('preparingPdfTitle')" :message="t('preparingPdfMessage')"></km-modal-spinner>

        <div id="advancePdf" class=" d-none h-0">
            <div class="cbd-user-pdf" v-if="isGeneratingPdf">
                <print-header></print-header>
                <div id="cbd-user-pdf-section" >
                    <div v-html="userPdfHtml"></div>
                </div>
                <print-footer></print-footer>
            </div>
        </div>
    </button>  

</template>
<i18n src="@/i18n/dist/components/common/pdf-section.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
    import  { pdfThis } from '~/libs/pdf-this.js';

    const props = defineProps({
        element : {type: String, required:true},
        title   : {type: String, required:true},
        fileName: {type: String, required:true},
    });

    const emit = defineEmits(['onPdfDocument', 'onAfterPdf', 'onBeforeGetContent',
                                'onBeforePdf']);

    const {t}             = useI18n();
    const { $recaptcha }  = useNuxtApp();

    const isGeneratingPdf      = ref(false);
    const userPdfHtml   = ref(null);

    const downloadFileName = computed(()=>{
        const fileName = 'scbd-ort-' + (props.fileName || props.title?.trim()?.replace(/[\W_]+/gi, '-').substr(0, 50));

        if(fileName.endsWith('.pdf'))
            return fileName

        return `${fileName}.pdf`;
    });

    const baseUrl = computed(()=>{

        const domain = window.location.hostname.replace(/[^\.]+\./, '');
        
        if(domain=='localhost')
            return 'https://ort.cbddev.xyz';

        return window.location.origin;
    })
    async function onPdfDocument(){
        emit('onPdfDocument');
        
        isGeneratingPdf.value = true;
        await sleep(200);
        userPdfHtml.value = document.querySelector(props.element).innerHTML;
        await sleep(200);

        const html = pdfThis('.cbd-user-pdf', {
            debug:false,
            pdfContainer:true,
            importCSS:true,
            importStyle : true,
            // pageTitle : $('title').text(),
            // loadCSS : '/app/css/pdf-friendly.css',
        });	
        // console.log(html);
        try{
            const captchaToken = await $recaptcha.getRecaptchaToken();

            //incase of production use api-direct endpoint for pdf
            let baseUrl = '';
            if(isProduction())
                baseUrl = useRuntimeConfig().public.API_DIRECT_URL||'';

            const res = await useAPIFetch(`${baseUrl}/api/v2017/generate-pdf/`, 
                { 
                    method:'POST', 
                    body : { html }, 
                    params : {
                        'attachment-name' : downloadFileName.value,
                        baseurl:baseUrl
                    },
                    responseType: "blob", 
                    headers:{
                        'x-captcha-v2-badge-token' : captchaToken
                    }
                })

                // Create a Blob from the response data
                const buffer = await res.arrayBuffer();
                const pdfBlob = new Blob([buffer], { type: "application/pdf" });

                // Create a temporary URL for the Blob
                const url = window.URL.createObjectURL(pdfBlob);

                // Create a temporary <a> element to trigger the download
                const tempLink = document.createElement("a");
                tempLink.href = url;
                tempLink.setAttribute("download", downloadFileName.value);

                tempLink.click();

                window.URL.revokeObjectURL(url);
        }
        catch(e){
            useLogger().error(e, `${t('pdfError')}`)
        }
        finally{
            userPdfHtml.value = null;
            isGeneratingPdf.value = false
            emit('onAfterPdf')
        }
    }

    defineExpose({
        pdfDocument : onPdfDocument
    });
    
</script>
<i18n src="@/i18n/dist/components/common/pdf-section.json"></i18n>
<style scoped>

    .h-0{
        display: block;
        height: 0px!important;
        overflow: scroll;
    }

    .cbd-user-pdf{
        padding:20px;
        background-color: #fff;
    }
</style>


