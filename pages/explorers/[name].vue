<template>
    <iframe v-if="html" :srcdoc="html" sandbox="allow-scripts allow-popups allow-downloads allow-top-navigation"
        class="position-fixed top-0 start-0 w-100 h-100 border-0"></iframe>
</template>

<script setup lang="ts">
//@ts-nocheck
    definePageMeta({
        layout: false,
        auth: true,
        roles: ['ScbdStaff', 'Administrator'],
    });

    const { name } = useRoute().params;
    const html = ref(null);

    try {
        html.value = await $fetch(`/api/explorers/${name}`, { headers: authHeader() });
    }
    catch (e) {
        await useNavigateAppTo(e?.statusCode == 404 ? '/error/404' : '/error/403');
    }
</script>
