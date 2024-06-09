<template>

    <div class="form-check" :class="{'form-check-inline' : attrs.inline}">     
        <label class="form-check-label">       
            <input class="form-check-input" :type="attrs.type" :name="attrs.name"
                :id="attrs.id" :value="attrs.value" v-model="props.modelValue" @click="onCheck" />
            {{label}}
        </label>
    </div>
</template>
<script lang="ts" setup>

const attrs = useAttrs()
const emit = defineEmits(['update:modelValue',])
const props = defineProps({
    modelValue: {},
    label     : {type:String, required:true },
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
