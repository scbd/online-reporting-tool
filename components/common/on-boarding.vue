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
                    {{ t('takeTour')}}
                    <strong v-if="pageTitle">({{ pageTitle }})</strong>
                </span>
            </a></Transition>
        </Teleport>
    </div>
    <VOnboardingWrapper ref="wrapper" :steps="steps" @finish="onTourEnd" @exit="onTourEnd" />
</template>
<i18n src="@/i18n/dist/components/common/on-boarding.json"></i18n>
<script setup lang="ts">
    import { VOnboardingWrapper, useVOnboarding } from 'v-onboarding'
    import 'v-onboarding/dist/style.css';
    import tourDummyTable  from '@/components/tour-dummy-views/tour-dummy-table.vue'; 
    import tourDummyNationalMapping from '@/components/tour-dummy-views/tour-dummy-national-mapping.vue';
    import tourDummyUserProfile from '@/components/tour-dummy-views/tour-dummy-user-profile.vue';

    defineProps({
        steps : {type:Array, required:true},
        teleportTo: {type:String},
        pageTitle : {type:String}
    })
    const emit = defineEmits(['onTourStart','onTourEnd'])

    const isReady = ref(false);    
    const wrapper = ref(null)
    const { start, goToStep, finish } = useVOnboarding(wrapper);
    const { t } = useI18n();
    
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