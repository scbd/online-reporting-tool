

export const useHasEvents =()=>{

    //Currently there is no other way but get it using currentInstance
    const currentVueInstance        = getCurrentInstance();

    return (eventName:string)=>{
        const props = Object.keys(currentVueInstance?.vnode.props||{})?.map(e=>e.toLowerCase());
        
         //vue prepends 'on' to all events internally
        return !!props?.includes(`on${eventName.toLowerCase()}`);
    }

}