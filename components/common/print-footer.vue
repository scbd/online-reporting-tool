<template>
    <div id="printContentFooter">
        <legend class="mt-0">{{ t('furtherInformation')}}</legend>
        <div class="row top-border">
            <div class="clearfix"></div>
            <div class="col-8 fs-small-8">
                {{ t('questionsAboutOrt')}}           
            </div>
            <div class="col-4 fs-small-8">
                <strong>{{ t('scbd')}}</strong>
                <br/> {{ t('saintJacques')}}
                <br/> {{ t('montreal')}}
                <br/> {{ t('canada')}}
                <br/> {{ t('fax')}}
                <br/> {{ t('email')}} secretariat@cbd.int

            </div>
        </div>
    </div>
</template>
<i18n src="@/i18n/dist/components/common/print-footer.json"></i18n>
<script  lang="ts" setup>
    const {t} = useI18n();
</script>