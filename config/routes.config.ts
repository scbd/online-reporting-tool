

export default defineNuxtConfig({
    hooks: {
        'pages:extend' (pages) {
            pages.push({
                name: 'database',
                path: '/custom-route',
                file: '~/pages/index.vue',

            });
        }
    }    
})