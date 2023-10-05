<template>
    <CCol class="km-form-group mb-3" :class="{'has-error':hasError, 'has-help':content}">
        <CFormLabel class="mb-1 control-label" v-if="caption" :for="name" :name="name" :required="required ? true : null">
            {{caption}}            
        </CFormLabel>
        <km-help v-if="content" :title="title" :content="content" class="ms-1 me-1"></km-help>
        <div>
            <slot></slot>
        </div>
    </CCol>
</template>
<script lang="ts" setup>
    import { makeUid } from '@coreui/utils/src'
    import KmHelp      from './view/KmHelp.vue';
    

    const { $eventBus } = useNuxtApp();
    const props = defineProps({
        name      : {type:String, default:makeUid()},
        caption   : {type:String  },
        required  : {type:Boolean, default:false},
        isValidFn : {type:Function},
    });

    const attrs     = useAttrs();
    const title     = attrs['data-title']
    const content   = attrs['data-content']

    const { name, required } = toRefs(props);    
    const hasError = ref(false)

    const onReviewErrorHandler = (validationResponse)=>{
        hasError.value = validationResponse?.errors?.find(e=>e.property == props.name)!= undefined;            
    }
    if(name.value && required.value){
                            $eventBus.on('onReviewError', onReviewErrorHandler);
        onBeforeUnmount(()=>$eventBus.off('onReviewError', onReviewErrorHandler));
    }

</script>
<style scoped>
    .km-form-group label.required:after, .km-form-group label[required]:after {
        color: #e32;
        content: ' * ';
    }
    .km-form-group.has-help label.control-label{
        display: unset;
    }
</style>
