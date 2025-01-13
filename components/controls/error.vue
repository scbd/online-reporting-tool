<template>
    <CAlert color="danger" v-if="error">
        <CAlertHeading>
            <CIcon icon="cil-check-circle" class="flex-shrink-0 me-2" width="24" height="24" />{{t('error')}}
        </CAlertHeading>
        <p>
            {{t('sorryForError')}}
            {{t('weUnderstand')}}
        </p>

        <p>
            {{t('doNotHesitate')}} <a class="alert-link" href="mailto:secretariat@cbd.int">{{t('contact')}}</a>
            {{t('furtherQuestions')}}
        </p>

        <hr>

        <div>
            {{t('wouldLike')}} <a class="alert-link" href="#" @click.prevent="moreInfo()">{{t('moreInformation')}}</a>{{t('youCan')}} <a class="alert-link" href="#" @click.prevent="moreInfo()">{{t('clickHere')}}</a>.
        </div>

        <div v-if="showMoreInfo">
            <hr>
            <div v-if="error.code">
                {{t('error:')}} <b>{{ error.code }}</b>
            </div>
            <div>
                {{t('message:')}} {{ error.message }}
            </div>
        </div>
    </CAlert>
</template>
<i18n src="@/i18n/dist/components/controls/error.json"></i18n>
<script setup lang="ts">
//@ts-nocheck

    const props = defineProps({
        error : { type:Object, required:true}
    })
    const { t } = useI18n();
    const showMoreInfo = ref(false) 
    const moreInfo = ()=>{
        showMoreInfo.value = true;
    }
</script>

<style scoped>

</style>