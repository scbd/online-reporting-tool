<template>

    <div v-if="props.goalTargets">
        <ul class="list-group" v-if="globalTargets?.length">
            <li class="list-item" v-for="target in globalTargets" :key="target.identifier">
                <a v-if="target.identifier.startsWith('GBF-GOAL')" href="https://www.cbd.int/gbf/goals/" target="_blank">{{ target.shortIdentifier }}</a> 
                <a v-if="target.identifier.startsWith('GBF-TARGET')" 
                    :href="`https://www.cbd.int/gbf/targets/${getTargetNumber(target.identifier)}`" 
                    target="_blank">{{ target.shortIdentifier }}</a> 
            </li>
        </ul>
        <div class="mt-1 border-top" v-if="props.goalTargets?.length>5">
            <a class="text-decoration-none" rel="noopener" href="#" 
                v-if="!showAll && props.goalTargets?.length>5" 
                @click.prevent="showAll=true">{{t('showAll')}} ({{ props.goalTargets?.length }})
                <font-awesome-icon icon="caret-down" />
            </a>                            
            <a class="text-decoration-none" rel="noopener" href="#" v-if="showAll"
                @click.prevent="showAll=false">{{t('showLess')}}
                <font-awesome-icon icon="caret-up" />
            </a>
        </div>
    </div>
</template>
<i18n src="@/i18n/dist/components/pages/national-targets/my-country/goal-target-list.json"></i18n>
<script setup lang="ts">

    const props = defineProps({
        goalTargets : {type:Array<ETerm>, required:true}
    });

    const { t }   = useI18n();
    const showAll = ref(false);

    const globalTargets = computed(()=>{
        if(!showAll.value)
            return props.goalTargets?.filter((e,i)=> i < 5)

        return props.goalTargets;
    })

</script>

<style scoped>
    .list-item{
        list-style-type: none;
    }
</style>