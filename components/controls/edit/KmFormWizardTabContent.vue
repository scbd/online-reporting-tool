<template>
    <div v-if="isActive">
        <slot></slot>
    </div>
</template>

<script>
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
    data(){
        return{
            
        }
    },
    created(){
        // this.isActive = this.selected;
    }
}
</script>