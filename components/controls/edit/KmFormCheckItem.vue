<template> 
        <div class="scbd-common km-form-check-item form-check " :class="{'form-check-inline' : $attrs.inline}">  
        <input  
            v-model="model"
            :type="type" 
            :id="$attrs.id"  
            :value="$attrs.value"
            :required="$attrs.required"
            :disabled="$attrs.disabled"
            :class="$attrs.class"
            :name="$attrs.name"
            class="form-check-input"
        />
        <label :for="$attrs.id" class="form-check-label">
            <slot name="label">{{ label }}</slot>
        </label> 
    </div>  
</template>

<script  setup> 
   
    const model = defineModel({
        type: [Array, Boolean ], // Arrays for handling checkboxes, and boolean for radio types
        required: true
    });

    const props = defineProps({
    label: { type: String, required: false },
    type: {
            type: String,
            required: true,
            validator: (value) => ['checkbox', 'radio'].includes(value) // Restrict to 'checkbox' or 'radio'
        }
    });

</script> 

<!-- <template>
    <div class="form-check" :class="{'form-check-inline' : attrs.inline}">
        <input @input="onCheck" :type="attrs.type" :name="attrs.name" :disabled="attrs.disabled"
        :id="attrs.id" class="form-check-input" :value="attrs.value" v-model="props.modelValue"/>
        <label :for="attrs.id" class="form-check-label">
            {{ label }}
        </label>
    </div>

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

</script> -->
