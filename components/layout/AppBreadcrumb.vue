<template>
  <CBreadcrumb class="d-md-down-none me-auto mb-0"> 
    <NuxtLink v-for="item in breadcrumbs" class="breadcrumb-item"
      :key="item"
      :href="item.active ? '' : item.to"
      :class="{'active' : item.active}">{{ item.text }}</NuxtLink>
  </CBreadcrumb>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { capitalCase } from 'change-case';
import { languages } from '@/app-data/languages'
import { useRoute } from 'vue-router' 
//TODO: verify when nuxt issue is fixed, temp use useRoute directly from vue instead of nuxt

    const localePath  = useLocalePath();
    const route = useRoute();

    function makeCrumbs (){ //eslint-disable-line

      const crumbs    = [
        { text:'CHM', to:'https:chm.cbd.int' },
        { text:'ORT', to: localePath('/dashboard'), active: '/dashboard' === route.fullPath }
      ];
      if(route){
        const { path }  = route.matched[0] || { path: '/' };
        const pathSplit = () => path.split('/').splice(1);
        if (!path) return [];

        for (const [index, routeName] of pathSplit().entries()) { // eslint-disable-line
          if (!routeName) continue; // eslint-disable-line no-continue
          if(!Object.keys(languages).includes(routeName)){

            const text  = capitalCase(routeName);
            const to    = index ? `/${pathSplit().splice(0, index + 1).join('/')}` : `/${routeName}`;
            
            const crumb = { text, to, active: to === route.fullPath, };

            crumbs.push(crumb);
          }
        }
      }
      return crumbs;
    }
    const breadcrumbs = computed(()=>{
      return makeCrumbs()
    })
      
</script>
