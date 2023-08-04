<template>
    <div :id="id" class="km-input-lstring-ml mb-2">{{ binding }}
        <CRow v-for="(item, index) in binding" :key="item">
            <CCol md="11">
                <km-input-lstring v-model="item.value" :locales="props.locales" @update:modelValue="emitChange"></km-input-lstring>  
            </CCol>
            <CCol md="1">
                <button :disabled="binding.length==1" type="button" class="btn btn-danger btn-sm" @click="removeItem(item, index)" >{{ t('remove') }}</button>     
            </CCol>
        </CRow>
        <button type="button" class="btn btn-outline-secondary btn-sm" @click="addItem()">
            {{t('add')}}
        </button>
    </div>
</template>

<script setup lang="ts">

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

    function addItem(){
        binding.value.push({value:{}});
    }

    function removeItem(item, index){
        binding.value?.splice(index, 1)
    }

    function emitChange(value){
        const clean =binding.value
        //  useStorage().cleanDocument([....flat()]);
        emit('update:modelValue', clean?.map(e=>e.value));
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