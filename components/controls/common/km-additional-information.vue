<template>
    <km-form-group>
        <div class="card">
            <div class="card-header">
                <slot></slot>
            </div>
            <div class="card-body">                      
                <km-form-group caption="" name="anyOtherInformation">
                    <km-input-rich-lstring v-model="model" :locales="locales" :identifier="identifier"></km-input-rich-lstring>
                </km-form-group>                                    
            </div>
        </div>
    </km-form-group>
</template>

<script setup lang="ts">
//@ts-nocheck
    import { defineProps } from 'vue';

    const model = defineModel({required:true, type:Object})

    const props = defineProps({
        locales : { type: Array<String>, required:true },
        identifier : { type: String, required:true }
    })

</script>

<style>

</style>