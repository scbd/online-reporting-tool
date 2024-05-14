<template>
    <div  v-if="steps?.length && isReady">
        <Teleport to="#takeTourTeleport" >
            <a class="text-dark me-md-1" rel="noopener" href="#" @click.prevent="startTour()">
                <font-awesome-icon icon="person-chalkboard" />
                <span class="ms-1">Take a tour</span>
            </a>
        </Teleport>
    </div>
    <VOnboardingWrapper ref="wrapper" :steps="steps" />
</template>

<script setup lang="ts">
    import { VOnboardingWrapper, useVOnboarding } from 'v-onboarding'
    import 'v-onboarding/dist/style.css'

    defineProps({
        steps : {type:Array, required:true},
        teleportTo: {type:String}
    })

    const isReady = ref(false);    
    const wrapper = ref(null)
    const { start, goToStep, finish } = useVOnboarding(wrapper);

    function startTour(){
        start();
    }

    onMounted(()=>{
        sleep(2000).then(()=>isReady.value = true);
    })
</script>

<style>
</style>