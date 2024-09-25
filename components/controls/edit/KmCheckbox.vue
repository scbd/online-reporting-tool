<template>

    <div class="form-check">
        <input @input="(event) => $emit('update:checked', event.target.checked)" type="checkbox" 
        :checked="checked" :id="id" class="form-check-input" />
        <label :for="id" class="form-check-label">            
            <slot>
                {{ label }}
            </slot>  
        </label>
    </div>
</template>
  
<script>
export default {
    props: {
        label: String,
        id: {
            type: String,
            required: true,
        },
        checked: {
            type: Boolean,
        },
    },
    emits:['update:checked']
};
</script>
  
<style></style>
  