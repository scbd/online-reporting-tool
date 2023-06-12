import { checkUserAccess, getRouteComponentOptions } from '~/middleware/security';

export default (context, inject) => {
  const instance = new Security(context);

  inject('security', instance);
};

const routeOptions = {};
export class Security {
  constructor(ctx) {
    this.ctx = ctx;
  }

  isInRoles(roles) {
    const { ctx } = this;
    return roles.some((r) => ctx.$auth.hasScope(r));
  }

  async canAccessRoute(routeOrName) {
    const { ctx } = this;
    try {
      let options = undefined;

      if (typeof (routeOrName) === 'object'){
        options = getRouteComponentOptions(routeOrName, 'auth', 'roles', 'meta');
      }
      else if (typeof (routeOrName) === 'string') {
        
        options = routeOptions[routeOrName];

        if(!options){
          options = await this.loadRouteOptions(ctx, routeOrName)
        }
      }
      options = options || {};

      if (!options || options.length === 0) return false;

      return checkUserAccess(ctx.$auth, options, ctx.store);

    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async loadRouteOptions(ctx, routePath){
    
    if(routeOptions[routePath])
      return routeOptions[routePath];

    var route = ctx.app.router.options.routes.find(e=>e.path==routePath);
    const options = await route.component()
    routeOptions[routePath] = options; 

    return routeOptions[routePath];
    
  }
}
