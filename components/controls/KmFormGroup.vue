<template>
    <CCol class="mb-3">
        <CFormLabel class="mb-1" v-if="caption" :for="name" :name="name" :required="required">{{caption}}</CFormLabel>
        <div>
            <slot></slot>
        </div>
    </CCol>
</template>
<script lang="ts" setup>
import { makeUid }         from '@coreui/utils/src'

const props = defineProps({
    name      : {type:String, default:makeUid()},
    caption   : {type:String  },
    required  : {type:String, },
    isValidFn : {type:Function},
})
</script>
