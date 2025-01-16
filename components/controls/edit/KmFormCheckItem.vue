<template>
    <div class="form-check" :class="{'form-check-inline' : attrs.inline}">
        <input @input="onCheck" :type="attrs.type" :name="attrs.name" :disabled="attrs.disabled"
        :id="attrs.id" class="form-check-input" :value="attrs.value" v-model="props.modelValue"/>
        <label :for="attrs.id" class="form-check-label">
            {{ label }}
        </label>
    </div>

    <!-- <div class="form-check" :class="{'form-check-inline' : attrs.inline}">                    
        <input class="form-check-input" :type="attrs.type" :name="attrs.name" :disabled="attrs.disabled"
           :id="attrs.id" :value="attrs.value" v-model="props.modelValue" @input="onCheck" />
        <label class="form-check-label">o {{label}}</label>
    </div> -->
</template>
<script lang="ts" setup>
//@ts-nocheck

const attrs = useAttrs()
const emit = defineEmits(['update:modelValue',])
const props = defineProps({
    modelValue: {},
    label     : {type:String, required:true },
})
defineOptions({
  inheritAttrs: false
})

const onCheck = ($evt:any)=>{
    //TODO: convert true/false number to native types
    let value = $evt.target.value;
    if(['true', 'false'].includes(value)){
        value = value == 'true' ? true : false
    }
    emit('update:modelValue', value)
}

</script>
