<template>
    <CCol class="km-form-group mb-3" :class="{'has-error':hasError}">
        <CFormLabel class="mb-1 control-label" v-if="caption" :for="name" :name="name" :required="required ? true : null">{{caption}}</CFormLabel>
        <div>
            <slot></slot>
        </div>
    </CCol>
</template>
<script lang="ts" setup>
    import { makeUid }         from '@coreui/utils/src'
    

    const { $eventBus } = useNuxtApp();
    const props = defineProps({
        name      : {type:String, default:makeUid()},
        caption   : {type:String  },
        required  : {type:Boolean, default:false},
        isValidFn : {type:Function},
    });
    const { name, required } = toRefs(props);    
    const hasError = ref(false)

    if(name.value && required.value){
        $eventBus.on('onReviewError', (validationResponse)=>{
            hasError.value = validationResponse?.errors?.find(e=>e.property == props.name)!= undefined;            
        });
    }
</script>
<style scoped>
    .km-form-group label.required:after, .km-form-group label[required]:after {
        color: #e32;
        content: ' * ';
    }
</style>
