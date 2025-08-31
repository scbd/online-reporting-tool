<template>
    <CNavItem >
        <!-- isActve{{ route.path }} {{ to }} @click="useNavigateAppTo(to)" href="#" -->        
        <km-link class="nav-link" :to="to" :class="{'active' : route.path === to}" :target="target" :title="title">
            <slot name="icon">
                <CIcon v-if="icon && ~icon.indexOf('cil-')" :icon="icon" class="nav-icon" /> 
                <font-awesome-icon  v-if="icon && ~icon.indexOf('fa-')" class="menu-icon" :icon="'fa-solid ' + icon" />
            </slot>
            {{title}}
        </km-link> 
    </CNavItem>
</template>
<script lang="ts">
//@ts-nocheck
import {useRoute } from 'vue-router';

export default defineComponent({
    props: {
        title: { type:String, required :true},
        to   : { type:String, required :false, default:'#'},
        icon : { type:String },
        target : { type:String }
    },
    setup(props) {
        const route = useRoute();
        const localePath  = useLocalePath();

        const to = computed(()=>{

            if(/http(s)?\:\/\//.test(props?.to))
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
    },
})
</script>
<style scoped>
    .menu-icon{
        margin-right: 5px;
    }
</style>