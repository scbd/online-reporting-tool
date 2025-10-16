<template>
    <div class="km-input-lstring-ml mb-2">
        <CRow v-for="(item, index) in binding" :key="item" class="mb-1">
            <CCol md="11">
                <input v-model="item.value" @input="emitChange" class="form-control" :type="type" />
            </CCol>
            <CCol md="1">
                <button :disabled="binding.length==1" type="button" class="btn btn-danger" 
                @click="removeItem(item, index)" :title="t('remove')" >
                    <font-awesome-icon icon="fa-solid fa-trash"/>
                </button>     
            </CCol>
        </CRow>
        <button type="button" class="btn btn-outline-secondary btn-sm" @click="addItem()" :disabled="hasEmpty">
            <font-awesome-icon icon="fa-solid fa-plus"/> {{t('add')}}
        </button>
    </div>
</template>

<script setup lang="ts">

    import { removeEmpty } from '@/utils';
    import { isEmpty } from 'lodash';
    import type { KmInputListBindingType } from '@/types/controls/km-input-list';

    const props = defineProps({
        locales: {
            type: Array,
            required: true,
        },
        modelValue: {
            type: Array<string>,
            required: false,
            default(){
                return ['']
            }
        },
        disabled: {
            type: Boolean,
            required: false,
        },
        type: {
            type: String,
            required: false,
            default(){
                return 'text'
            }
        },
    });

    const emit = defineEmits(['update:modelValue']);
    const { t } = useI18n();

    const binding = ref<Array<KmInputListBindingType>>([{value:''}]);
    
    const hasEmpty = computed(()=>binding.value.some((e:KmInputListBindingType)=>isEmpty(e.value)));

    function addItem(){
        binding.value.push({value:''});
    }

    function removeItem(item:KmInputListBindingType, index:number){
        binding.value?.splice(index, 1)
    }

    function emitChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        
        const clean = removeEmpty(binding.value);
        emit('update:modelValue', clean?.map((e:KmInputListBindingType)=>e.value));
        if(binding.value?.length){
            if(!binding.value.some((e:KmInputListBindingType)=>isEmpty(e.value))){
                addItem()
            }
        }
    }

    onMounted(() => {
        if(props.modelValue) {
            binding.value = props.modelValue.map((e:string)=>{
                return { value : e }
            })
        }
    })
</script>

<style scoped>

</style>