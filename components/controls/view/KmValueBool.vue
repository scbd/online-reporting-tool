<template>
    <div id="km-value-bool"> 
        <div :class="`input-group input-lang-${locale}`">
            <div class="form-control km-value" :dir="direction(value, locale)" aria-describedby="basic-addon1">
                <span v-if="value" >{{t('yes')}}</span>		
		        <span v-if="!value">{{t('no')}}</span>
            </div>
            <span class="input-group-text" id="basic-addon1" style="cursor:default">
                {{ locale.toUpperCase() }}
            </span>

        </div>
    </div>
</template>
<i18n src="@/i18n/dist/components/controls/view/KmValueBool.json"></i18n>

<script setup lang="ts">
   
    const nuxtApp = useNuxtApp();
    const { t } = nuxtApp.$i18n;
    const props = defineProps({
        value   : {type:Boolean, required:true },
        locale  : {type:String, required:true }
    })
    const { value, locale } = toRefs(props);
    
</script>

<style scoped>
   
</style>