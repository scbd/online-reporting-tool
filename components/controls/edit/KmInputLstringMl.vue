<template>
    <div :id="id" class="km-input-lstring-ml mb-2">
        <CRow v-for="(item, index) in binding" :key="item">
            <CCol md="11">
                <km-input-lstring v-model="item.value" :locales="props.locales" @update:modelValue="emitChange"></km-input-lstring>  
            </CCol>
            <CCol md="1">
                <button :disabled="binding.length==1" type="button" class="btn btn-danger btn-sm" @click="removeItem(item, index)" >
                    <font-awesome-icon icon="fa-solid fa-trash"/> {{ t('remove') }}
                </button>     
            </CCol>
        </CRow>
        <button type="button" class="btn btn-outline-secondary btn-sm" @click="addItem()" :disabled="hasEmpty">
            <font-awesome-icon icon="fa-solid fa-plus"/> {{t('add')}}
        </button>
    </div>
</template>
<i18n src="@/i18n/dist/components/controls/edit/KmInputLstringML.json"></i18n>
<script setup lang="ts">
    import { isEmpty } from 'lodash';
    import { makeUid } from '@coreui/utils/src'
    import KmInputLstring from './KmInputLstring.vue';
    import { CCol } from '@coreui/vue';
    const { t } = useI18n();
    const props = defineProps({
        locales: {
            type: Array,
            required: true,
        },
        modelValue: {
            type: Array<Object>,
            required: false,
            default(){
                return [{}]
            }
        },
        disabled: {
            type: Boolean,
            required: false,
        },
    });

    const emit = defineEmits(['update:modelValue',])
    const binding = ref([{value:{}}]);
    const id = computed(()=>useAttrs().id || makeUid());
    const hasEmpty = computed(()=>binding.value.some(e=>isEmpty(e.value)))
    function addItem(){
        binding.value.push({value:{}});
    }

    function removeItem(item, index){
        binding.value?.splice(index, 1)
    }

    function emitChange(value){
        const clean = removeEmpty(binding.value);
        emit('update:modelValue', clean?.map(e=>e.value));
        if(binding.value?.length){
            if(!binding.value.some(e=>isEmpty(e.value))){
                addItem()
            }
        }
    }

    onMounted(() => {
        if(props.modelValue) {
            binding.value = props.modelValue.map(e=>{
                return { value : e }
            })
        }
    })
</script>

<style scoped>

</style>