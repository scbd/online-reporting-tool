<template>
    <CRow class="km-form-group" :class="$attrs.class">

        <CCol  :class="{'has-error':hasError(), 'has-help':content, 'mandatory':required}">
            
            <CFormLabel v-if="caption || $slots.caption" class="mb-1 control-label" 
                :for="name" :name="name" :required="required ? true : null">            
                <slot name="caption">{{caption}}</slot>
            </CFormLabel>
            <km-help v-if="content" :title="title" :content="content" class="ms-1 me-1"></km-help>
            <div>
                <slot></slot>
            </div>
        </CCol>
    </CRow>
</template>
<script lang="ts" setup>
    import { makeUid } from '@coreui/utils/src'
    import KmHelp      from './view/KmHelp.vue';

    const props = defineProps({
        name      : {type:String, default:makeUid()},
        caption   : {type:String  },
        required  : {type:Boolean, default:false}
    });

    const attrs     = useAttrs();
    const title     = attrs['data-title']
    const content   = attrs['data-content']

    const { name, required } = toRefs(props);

    let reviewError = inject('validationReview')

    const hasError    = ()=>{
        return props.name && props.required && reviewError?.hasError(props.name);
    }

</script>
<style scoped>

    .km-form-group.mandatory{
        border-left: 5px solid red;
        padding-left: 10px;
    }
    .km-form-group label.required:after, .km-form-group label[required]:after {
        color: #e32;
        content: ' * ';
    }
    .km-form-group.has-help label.control-label{
        display: unset;
    }
    .km-form-group .control-label{
        font-weight: 700;
    }
</style>
