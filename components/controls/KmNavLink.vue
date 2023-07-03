<template>
    <CNavItem >
        <!-- isActve{{ route.path }} {{ to }} @click="navigateTo(to)" href="#" -->
        <NuxtLink class="nav-link" :to="to" :class="{'active' : route.path === to}" :target="target">
            <CIcon v-if="icon" customClassName="nav-icon" :icon="icon" /> 
            {{title}}
        </NuxtLink> 
    </CNavItem>
</template>
<script lang="ts">

export default defineComponent({
    props: {
        title: { type:String, required :true},
        to   : { type:String, required :true},
        icon : { type:String },
        target : { type:String }
    },
    setup(props) {
        const route = useRoute();
        const to = computed(()=>props.to);
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
