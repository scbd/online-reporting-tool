import { RouteLocation } from "vue-router";



export const useNavigateAppTo = (to:RouteLocation, options: NavigateToOptions) =>{ 
    
    const localePath  = useLocalePath()
    
    if(typeof to === 'string'){
        return navigateTo(localePath(to), options)
    }
    
    to.path = localePath(to.path);    
    return navigateTo(to, options);

};