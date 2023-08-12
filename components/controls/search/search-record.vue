<template>
    <CCard class="mb-3 border-left-3 border-left-info">
        <CCardBody>
            <CCardTitle>1 National Target for Gender and Pollution</CCardTitle>
            <CCardText>
                    <strong class="text-muted">GBF-T07. The risks and impacts of all types of pollution have been reduced to levels that are not harmful, nutrients lost to the environment have been reduced by 50%, the risk from pesticides and high hazardous chemicals have been reduced by half and plastic pollution is being progressively eliminated</strong>
                | <strong class="text-muted">GBF-T22. Decision making is participatory, inclusive, representative and gender responsive and the rights of all people, including environmental human rights defenders, are respected</strong>
            </CCardText>
            <CCardText><small class="text-muted">{{document.government}}</small></CCardText>
        </CCardBody>
    </CCard>
</template>

<script setup lang="ts">
    const props = defineProps({
        document : {type:Object, required:true}
    })
</script>

<style scoped>

</style>