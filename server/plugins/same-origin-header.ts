import { RenderResponse } from "nitropack"

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:response', (res: RenderResponse, req) => {
        const query = getQuery(req.event)
        if(query?.embed == 'true')
            res.headers['X-Frame-Options'] = 'ALLOW';
    })
})