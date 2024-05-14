<template>
    
    <div :id="$attrs.id" class="mb-2">
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
    </div>
</template>
<i18n src="@/i18n/dist/components/controls/edit/KmInputLstringML.json"></i18n>
<script setup lang="ts">
    import { isEmpty } from 'lodash';
    import { useI18n } from 'vue-i18n';
    const emptyItem = ()=> {
        return { value:{}, identifier : useGenerateUUID()}
    };
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
                return [{value:{}, identifier : useGenerateUUID()}]
            }
        },
        disabled: {
            type: Boolean,
            required: false,
        },
    });
    const attrs = useAttrs();
    const emit = defineEmits(['update:modelValue',])
    const binding = ref([emptyItem()]);

    function addItem(){
        binding.value.push(emptyItem());
    }

    function removeItem(item, index){
        binding.value?.splice(index, 1)
        emitChange();
    }

    function emitChange(value=undefined){
        const clean = removeEmpty(binding.value);
        emit('update:modelValue', clean?.map(mapItem));
        if(binding.value?.length){
            if(!binding.value.some(e=>isEmpty(e.value))){
                addItem()
            }
        }
    }

    onMounted(() => {
        if(props.modelValue) {
            binding.value = props.modelValue.map(mapItem)
        }
    })

    function mapItem(item:Object){
        if(attrs['generate-identifier']){
            return { identifier: item.identifier , value : item.value}
        }

        return item.value;
    }
</script>

<style scoped>

</style>