<template>
    <km-select
        v-model="selectedGovernment.identifier"
        class="validationClass"
        label="name"
        track-by="code"
        value-key="code"
        :placeholder="useAttrs().placeholder || t('government')"
        :options="countryList"
        :disabled="!countryList || !security.role.isAdministrator()"
        @update:modelValue="onChange" >
    </km-select>      
</template>

<i18n src="@/i18n/dist/components/controls/edit/KmGovernment.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
    import { KmSelect } from "~/components/controls";
    import { useCountriesStore }    from '@/stores/countries';

    const props = defineProps({
        modelValue: {
            type    : [ Object ],
            required: true,
            default() {
                return {identifier:undefined};
            },
        }
    });
    const emit  = defineEmits(['update:modelValue']);

    const security       = useSecurity();
    const countriesStore = useCountriesStore ();
    const {t, locale }   = useI18n();
    const selectedGovernment = ref({identifier:undefined});

    const countryList                = computed(()=>{
        if(!countriesStore?.countries?.length)
            return [];

        const mapCountries = countriesStore.countries.map(e=>{
            return { name : e.name[locale.value], code : e.code?.toLowerCase()}
        })

        return mapCountries;
    })

    onMounted(()=>{
        countriesStore.loadCountries()
        selectedGovernment.value = props.modelValue;
    })

    function onChange(code:string){
         emit('update:modelValue', { identifier : code })
    }
</script>

<style scoped>

</style>