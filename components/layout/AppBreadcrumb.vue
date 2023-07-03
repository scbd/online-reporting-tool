<template>
  <CBreadcrumb class="d-md-down-none me-auto mb-0">    
    <NuxtLink v-for="item in breadcrumbs" class="breadcrumb-item"
      :key="item"
      :href="item.active ? '' : item.to"
      :class="{'active' : item.active}">{{ item.text }}</NuxtLink>
  </CBreadcrumb>
</template>

<script>
import { onMounted, ref } from 'vue'
import { capitalCase } from 'change-case';
import { languages } from '~/app-data/languages'
// import router from '@/router'

export default {
  name: 'AppBreadcrumb',
  setup() {
    const breadcrumbs = ref()
    const localePath  = useLocalePath();
    const $route = useRoute();
    const $router = useRouter();

    console.log($route, $router)
    
    function makeCrumbs (){ //eslint-disable-line
      const crumbs    = [
        { text:'CHM', to:'https:chm.cbd.int' },
        { text:'ORT', to: localePath('/dashboard'), active: '/dashboard' === $route.fullPath }
      ];
      if($route){
        const { path }  = $route.matched[0] || { path: '/' };
        const pathSplit = () => path.split('/').splice(1);
        if (!path) return [];

        for (const [index, routeName] of pathSplit().entries()) { // eslint-disable-line
          if (!routeName) continue; // eslint-disable-line no-continue
          if(!Object.keys(languages).includes(routeName)){

            const text  = capitalCase(routeName);
            const to    = index ? `/${pathSplit().splice(0, index + 1).join('/')}` : `/${routeName}`;
            
            const crumb = { text, to, active: to === $route.fullPath, };

            crumbs.push(crumb);
          }
        }
      }
      return crumbs;
    }

    onMounted(() => {
      breadcrumbs.value = makeCrumbs()
    })
    //TODO: find why route events are not raising.
    watch($route, ()=>{
      console.log('route change')
      breadcrumbs.value = makeCrumbs()
    }, {deep:true})
    watch($router, (a,v)=>{
      console.log(a,v, 'router change')
    })
    // onBeforeRouteLeave ((to, from)=> {
    //   const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
    //   if (!answer) return false
    // })

    // onBeforeRouteUpdate((to, from) => {
    //   console.log('onBeforeRouteUpdate', to, from)
    // })

    return {
      breadcrumbs,
      languages : {...languages}
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log('Route Leave')
  },
  onBeforeRouteLeave(to, from){
      console.log('onBeforeRouteLeave', to, from)
      const answer = window.confirm(
        'Do you really want to leave? you have unsaved changes!'
      )
      // cancel the navigation and stay on the same page
      if (!answer) return false
  },
  onBeforeRouteUpdate(to, from) {
    console.log('onBeforeRouteUpdate', to, from)
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      console.log(vm.validateRoute()) // works: '/search'
      vm.validateRoute()              // does not work: does nothing
    })
  },
  beforeEnter: function (to) {
    console.log('onBeforeRouteUpdate', to)
  }
}
</script>
