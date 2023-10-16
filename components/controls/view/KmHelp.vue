<template>
    <a href="#" ref="helpAnchor" class="show-pop" data-animation='pop'>
        <slot>
            <font-awesome-icon icon="fa-solid fa-circle-question" />
        </slot>
    </a>
</template>

<script setup>
let $;

if(process.client){
        import('webui-popover')
        import('webui-popover/dist/jquery.webui-popover.css')
    $ = import('jquery')
}

    const helpAnchor = ref(null);

    onMounted(()=>{
        
        const $attrs = useAttrs();

        const settings = {
            trigger: 'hover',
            title: $attrs.title || 'Online Reporting Tool - Help',
            closeable: true,
            dismissible: true,
            padding: true,
            backdrop: false,
            style: 'inverse',
            delay: {
                show: null,
                hide: 200
            },
            content: $attrs.content || ''
        };

        if($attrs.container && $attrs.container!='')
            settings.container = $attrs.container;

            
        $(helpAnchor.value)
            .webuiPopover('destroy')
            .webuiPopover(settings);

    });

    onUnmounted(()=>{
        $(helpAnchor.value).webuiPopover('destroy')
    })

</script>

<style lang="scss">
    .show-pop{
        color: unset;
        // text-decoration-style: dotted;
        text-decoration-color: rgb(93 136 221);    
        text-decoration-thickness: 3px;
    }
    .webui-popover-content {
        max-width: 500px;
        max-height: 300px;
    }
</style>