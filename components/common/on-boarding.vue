<template>
    <div class="col-12" style="height:0px" id="tourWelcome">
        <!-- Dummy div to show a welcome message on each screen -->
    </div>
    <div  v-if="steps?.length && isReady" >
        <Teleport to="#takeTourTeleport">
            <Transition>
            <a class="text-dark me-md-1 d-none d-sm-block" rel="noopener" href="#" @click.prevent="startTour()">
                <font-awesome-icon icon="person-chalkboard" />
                <span class="ms-1">
                    Take a tour
                    <strong v-if="pageTitle">({{ pageTitle }})</strong>
                </span>
            </a></Transition>
        </Teleport>
    </div>
    <VOnboardingWrapper ref="wrapper" :steps="steps" @finish="onTourEnd" @exit="onTourEnd" />
</template>

<script setup lang="ts">
    import { VOnboardingWrapper, useVOnboarding } from 'v-onboarding'
    import 'v-onboarding/dist/style.css'

    defineProps({
        steps : {type:Array, required:true},
        teleportTo: {type:String},
        pageTitle : {type:String}
    })
    const emit = defineEmits(['onTourStart','onTourEnd'])

    const isReady = ref(false);    
    const wrapper = ref(null)
    const { start, goToStep, finish } = useVOnboarding(wrapper);

    function startTour(){
        emit('onTourStart')
        start();
    }

    function onTourEnd(){
        emit('onTourEnd')
    }

    onMounted(()=>{
        nextTick(()=>isReady.value = true);
    })
</script>

<style>
</style>