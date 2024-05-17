<template>
    <CBreadcrumb class="d-md-down-none me-auto mb-0"> 
        <NuxtLink v-for="item in breadcrumbs" class="breadcrumb-item"
        :key="item"
        :href="item.active ? '' : item.to"
            :class="{'active' : item.active}">{{ item.text }}
        </NuxtLink>        
    </CBreadcrumb>
    
    <span class="float-end" id="takeTourTeleport"></span>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { capitalCase } from 'change-case';
import { languages } from '@/app-data/languages'
import { useRoute } from 'vue-router' 

//TODO: verify when nuxt issue is fixed, temp use useRoute directly from vue instead of nuxt

   

    const route = useRoute();
    const localePath  = useLocalePath();

    const breadcrumbs = computed(()=>{
        const crumbs    = [
            { text:'CHM', to:'https://chm.cbd.int' },
        ];
        if(route){
            
            crumbs.push({ text:'ORT', to: localePath('/dashboard'), active: '/dashboard' === route.fullPath });
            const {breadcrumbs : pageBreadcrumbsConf } = route.meta;
            

            let { path }  = route.matched[0] || { path: '/' };
            path          = path.replace('()', '').replace(/\?$/, '');
            const pathSplit = () => path.split('/').splice(1);
            if (!path) return [];

            const skipParams = pageBreadcrumbsConf?.skip?.map(e=>`:${e}`)
            for (const [index, routeName] of pathSplit().entries()) { // eslint-disable-line
                if (!routeName) continue; // eslint-disable-line no-continue
                if(!Object.keys(languages).includes(routeName)){

                    if(skipParams?.includes(routeName))
                    continue;

                    const paths = pathSplit().filter(e=>!skipParams?.includes(e))
                    let fullPath = route.fullPath;
                    
                    pageBreadcrumbsConf?.skip?.forEach(element => {
                    fullPath = fullPath.replace(`/${route.params[element]}`, '');
                    });
                    const text  = capitalCase(routeName);
                    const to    = index ? `/${paths.splice(0, index + 1).join('/')}` : `/${routeName}`;
                    
                    const crumb = { text, to, active: to === fullPath, };

                    crumbs.push(crumb);
                }
            }
        }
        return crumbs;
    })
</script>
