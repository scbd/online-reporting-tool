<template>
  <CBreadcrumb :items="makeCrumbs()" class="border-0 m-0" />
</template>

<script>

import { CBreadcrumb } from '@coreui/vue';
import { capitalCase } from 'change-case';

export default {
  name      : 'KBreadCrumbs',
  components: { CBreadcrumb },
  methods   : { makeCrumbs },
};

function makeCrumbs (){ //eslint-disable-line

  const crumbs    = [
    { text:'CHM', to:'https:chm.cbd.int' },
    { text:'ORT', to:'/dashboard' }
  ];
  if(this.$route){
    const { path }  = this.$route.matched[0] || { path: '/' };
    const pathSplit = () => path.split('/').splice(1);
    if (!path) return [];

    for (const [index, routeName] of pathSplit().entries()) { // eslint-disable-line
      if (!routeName) continue; // eslint-disable-line no-continue

      const text  = capitalCase(routeName);
      const to    = index ? `/${pathSplit().splice(0, index + 1).join('/')}` : `/${routeName}`;
      
      const crumb = { text, to };

      crumbs.push(crumb);
    }
  }
  return crumbs;
}
</script>
