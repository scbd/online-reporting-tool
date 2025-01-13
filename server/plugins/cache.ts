//@ts-nocheck
import { RenderResponse } from "nitropack"

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:response', (res: RenderResponse, req) => {
        res.headers['cache-control'] = `no-cache`
    })
})