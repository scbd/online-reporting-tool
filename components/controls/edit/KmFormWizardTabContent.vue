<template>
    <div v-if="isActive">
        <slot></slot>
    </div>
</template>

<script>
import { inject } from 'vue';
export default {
    name: 'tab-content',
    props:{
        isActive: {
            default: false,
        },
        title: {
            type: String,
            required: true
        }
    },
    mounted(){
        const addTab = inject('addFormWizardTabKey');

        addTab({
            title : this.title,
            isActive : this.isActive
        })
    }
}
</script>