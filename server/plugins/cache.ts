import { RenderResponse } from "nitropack"

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:response', (res: RenderResponse) => {
        res.headers['cache-control'] = `no-cache`
    })
})