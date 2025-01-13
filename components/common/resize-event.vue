<script setup lang="ts">
//@ts-nocheck

    import {useRoute} from 'vue-router';
    const { query }  = useRoute();

    onMounted(async () => {
        if(query?.embed == 'true'){

            await sleep(500)
            let windowHeight:number;
            const documentElement : Element | null = document.querySelector('#page-content-wrapper')
            
            function sendIframeCommunication(){
                const height = documentElement?.clientHeight||0;
                if(windowHeight != height){
                    windowHeight = height;
                    const data = {
                        iframe  : query.iframe,
                        height  : windowHeight,
                        type    : 'setClientHeight'
                    };
                    window.parent.postMessage(JSON.stringify(data), '*');
                }
            }
            
            const resize_ob = new ResizeObserver(function(entries) {
                sendIframeCommunication();
            });
            
            if(documentElement)
                resize_ob.observe(documentElement);

            sendIframeCommunication();
        }
    });
    
</script>
