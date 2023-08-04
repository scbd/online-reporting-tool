<template>

    <div class="form-check">
        <input @input="(event) => $emit('update:checked', event.target.checked)" type="checkbox" :checked="checked"
            :id="fieldId" class="form-check-input" />
        <label :for="fieldId" class="form-check-label">            
            {{ label }}
        </label>
    </div>
</template>
  
<script>
export default {
    props: {
        label: String,
        fieldId: {
            type: String,
            required: true,
        },
        checked: {
            type: Boolean,
        },
    },
};
</script>
  
<style></style>
  