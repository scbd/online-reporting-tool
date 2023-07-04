<template>
    <CAlert color="warning" v-if="error">
        <CAlertHeading>
            <CIcon icon="cil-check-circle" class="flex-shrink-0 me-2" width="24" height="24" />Validation Error(s)!
        </CAlertHeading>
        
        <p>
            Please fix the validation errors.
        </p>
        <hr>
        <div v-for="error in errors" :key="error">
            <b>{{ error.code }}</b>
            Message: {{ error.message }}
        </div>
    </CAlert>
</template>

<script setup lang="ts">

    const props = defineProps({
        errors : { type:Array, required:true}
    })
    
</script>

<style scoped>

</style>