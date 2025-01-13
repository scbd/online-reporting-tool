<template>
    <KmFormGroup v-bind="attrs" :name="name" :caption="caption"
        :is-valid-fn="isValidFn">
        <slot></slot>
    </KmFormGroup>            
</template>
<script lang="ts" setup>
//@ts-nocheck

import { makeUid }         from '@coreui/utils/src'
import { default as KmFormGroup } from '../KmFormGroup.vue';
const attrs = useAttrs()

const props = defineProps({
    name      : {type:String, default:makeUid()},
    caption   : {type:String  },
    isValidFn : {type:Function},
})

</script>
