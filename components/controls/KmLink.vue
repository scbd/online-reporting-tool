<template>
    <NuxtLink :to="to" :class="{'active' : route.path === to, 'disabled': $attrs.disabled}" 
        :target="target">
        <slot>
            <CIcon v-if="icon && ~icon.indexOf('cil-')" :icon="icon" class="nav-icon" /> 
            <font-awesome-icon  v-if="icon && ~icon.indexOf('fa-')" class="nav-icon" :icon="'fa-solid ' + icon" />
            {{title}}
        </slot>
    </NuxtLink> 
</template>
<script lang="ts">
//@ts-nocheck
import {useRoute } from 'vue-router';

export default defineComponent({
    props: {
        title   : { type:String, required :false, default:''},
        to      : { type:String, required :true},
        icon    : { type:String, default:null },
        target  : { type:String, default:null }
    },
    setup(props) {
        const localePath  = useLocalePath();
        const route = useRoute();
        
        const to = computed(()=>{
            
            if(typeof props.to == 'string' && props.to?.startsWith('http'))
                return props.to;

            return localePath(props.to)
        });

        const title = computed(()=>props.title);
        const icon = computed(()=>props.icon);
        const isRouteActive = ()=>route.path === props.to;

        return {
            to,
            title,
            icon,
            target: props.target,
            isRouteActive,
            route
        }
    }
})
</script>
<style scoped>
    .menu-icon{
        margin-right: 5px;
    }
</style>