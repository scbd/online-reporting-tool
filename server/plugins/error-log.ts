// production error responses strip stacks; log render/API errors server-side
// so SSR failures are diagnosable from the server log
export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('error', (error, { event }) => {
        console.error(`[nitro error]${event ? ` ${event.path}` : ''}`, error);
    });
});
