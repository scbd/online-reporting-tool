import { checkUserAccess, getRouteComponentOptions } from '~/middleware/security';

export default (context, inject) => {
  console.log(context);
  const instance = new Security(context);

  inject('security', instance);
};

const routeOptions = {};

export class Security {
  constructor(ctx) {
    this.ctx = ctx;
    
    // get all routes options at start
    ctx.app.router.options.routes.forEach((route) => {
      route.component().then((options) => { routeOptions[route.name] = options; });
    });
  }

  isInRoles(roles) {
    const { ctx } = this;
    return roles.some((r) => ctx.$auth.hasScope(r));
  }

  canAccessRoute(routeOrName) {
    const { ctx } = this;
    try {
      let options = {};

      if (typeof (routeOrName) === 'object') options = getRouteComponentOptions(routeOrName, 'auth', 'roles', 'meta');

      if (typeof (routeOrName) === 'string') options = routeOptions[routeOrName];

      if (!options || options.length === 0) return false;

      return checkUserAccess(ctx.$auth, options, ctx.store);
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
