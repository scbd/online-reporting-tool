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