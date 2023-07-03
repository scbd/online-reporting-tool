import { getUserToken } from "../utils";

export default defineNuxtPlugin(async (nuxtApp) => {
        console.log('auth define')
    // Skip plugin when rendering error page
    if (nuxtApp.payload.error) {
        return {};
    }
    
    let user = ref(null);
    const { authenticationToken:token, expiration } =  await getUserToken();  
    if(token){
        user.value  = await authUser(token);
    }
    const loggedIn: any = computed(() =>{
        console.log('loggedin', user.value)
        return !!user.value?.isAuthenticated
    });
    const reset = ()=>{
        console.log('auth reset')
        user.value = undefined;
        useAuth().user = undefined;
        useAuth().expiration = undefined;
        useAuth().token = undefined;
        console.log(useAuth())
    }
  /**
   * Add global route middleware to protect pages using:
   * 
   * definePageMeta({
   *  auth: true
   * })
   */
  // 

  addRouteMiddleware(
    "auth",
    async (to) => {
        console.log('auth middleware', to)
        const { checkUserAccess } = useSecurity()
      if (to.meta.auth){
        if(!loggedIn.value) {
            return authRedirectToLogin(to.path)
        }
        const userCanAccess = await checkUserAccess({...to.meta, path:to.path});
        if(!userCanAccess){
            return navigateTo('/page403');
        }
      }
    },
    { global: true }
  );

  const currentRoute = useRoute();

  if (process.client) {
    watch(loggedIn, async (loggedIn) => {
        console.log(loggedIn)
      if (!loggedIn && currentRoute.meta.auth) {
        await authRedirectToLogin(currentRoute.path);
      }
    });
  }
  
  if (loggedIn.value) {
    console.log(currentRoute.path, 'currentpath')
    await navigateTo(currentRoute.path  || "/");
  }

  const hasScope = (scope:string)=>{
    if(user.value?.isAuthenticated){
        return user.value.roles.includes(scope)
    }
    return false;
  }

  return {
    provide: {
      auth: {
        loggedIn,
        expiration,
        user,
        token,
        reset,
        hasScope
      },
    },
  };
});