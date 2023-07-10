<template>
    <CCol class="km-form-group mb-3">
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
    required  : {type:Boolean, },
    isValidFn : {type:Function},
})
</script>
<style scoped>
    .km-form-group label.required:after, .km-form-group label[required]:after {
        color: #e32;
        content: ' * ';
    }
</style>
