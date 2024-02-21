<template>
<!-- {{ currentRoute }} <br> -->
<!-- - <br>{{ currentRoute2 }} -->
  <CBreadcrumb class="d-md-down-none me-auto mb-0"> 
    <NuxtLink v-for="item in crumbs" class="breadcrumb-item"
      :key="item"
      :href="item.active ? '' : item.to"
      :class="{'active' : item.active}">{{ item.text }}</NuxtLink>
  </CBreadcrumb>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { capitalCase } from 'change-case';
import { languages } from '@/app-data/languages'
const router = useRouter()
// import { useRoute as useRouteVue } from 'vue-router' 
// import { useRoute } from '#imports';
//TODO: verify when nuxt issue is fixed, temp use useRoute directly from vue instead of nuxt

    const localePath  = useLocalePath();
   // const route = useRoute();
    const crumbs =ref([]);
    function makeCrumbs (){ //eslint-disable-line
      
       const route = router.currentRoute.value
// console.log(route.href, localePath())
// console.log('===========', route?.href)
// console.log('===========', useRouteVue()?.href)

crumbs.value= [
        { text:'CHM', to:'https://chm.cbd.int' },
      ];
      if(route){
        console.log('=========== route.href', route.href)
        console.log('router',router)
        console.log('router.currentRoute',router.currentRoute.value.href)
        crumbs.value.push({ text:'ORT', to: localePath('/dashboard'), active: '/dashboard' === route.fullPath });
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

            crumbs.value.push(crumb);
          }
        }
      }
      console.log('crumbs',crumbs.value)
      console.log('router.currentRoute',router.currentRoute)
      

      return crumbs;
    }
    const breadcrumbs = computed(makeCrumbs)
    makeCrumbs ()
    // const currentRoute = computed(()=>route.fullPath)
    // const currentRoute2 = computed(()=>useRouteVue()?.fullPath)
    router.beforeEach(() => {
      makeCrumbs ()
        })
    router.afterEach(() => {
      makeCrumbs ()
        })
</script>
