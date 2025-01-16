<template>
    <Suspense :timeout="0">
        <template #default>
            <slot></slot>
        </template>
        <template #fallback>
            <slot name="fallback">
                <km-spinner-suspense></km-spinner-suspense>
            </slot>
        </template>
    </Suspense>
</template>

<script setup lang="ts">
//@ts-nocheck
import KmSpinnerSuspense from './KmSpinnerSuspense.vue';

</script>

<style scoped>

</style>