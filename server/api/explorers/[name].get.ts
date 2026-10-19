//@ts-nocheck

const EXPLORERS = {
    'cop-17'       : 'COP-17-Explorer.html',
    'notifications': 'cbd-explorer.html',
    'meetings'     : 'cbd-meetings-explorer.html',
};

const ALLOWED_ROLES = ['scbdstaff', 'administrator'];

// Explorer pages cross-link with relative .html hrefs; point them at the authenticated routes.
const LINKS = Object.fromEntries(Object.entries(EXPLORERS).map(([slug, file]) => [file, `/explorers/${slug}`]));

export default defineEventHandler(async (event) => {

    const file = EXPLORERS[getRouterParam(event, 'name')];
    if (!file)
        throw createError({ statusCode: 404 });

    const authorization = getRequestHeader(event, 'authorization');
    if (!authorization)
        throw createError({ statusCode: 401 });

    const { API_URL, auth } = useRuntimeConfig(event).public;
    const userUrl = auth.strategies[auth.stratagey].endpoints.user.url;

    const user = await $fetch(`${API_URL}${userUrl}`, { headers: { authorization } }).catch(() => null);
    if (!user?.isAuthenticated)
        throw createError({ statusCode: 401 });

    if (!user.roles?.some(r => ALLOWED_ROLES.includes(r.toLowerCase())))
        throw createError({ statusCode: 403 });

    let html = await useStorage('assets:server').getItem(`explorers:${file}`);
    for (const [from, to] of Object.entries(LINKS))
        html = html.replaceAll(`href="${from}"`, `href="${to}" target="_top"`);

    setResponseHeader(event, 'content-type', 'text/html; charset=utf-8');
    setResponseHeader(event, 'cache-control', 'private, no-store');
    return html;
});
