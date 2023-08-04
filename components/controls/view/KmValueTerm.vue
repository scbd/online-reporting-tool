<template>
    <div id="km-term"> 
        <div :class="`input-group input-lang-${locale}`">    
            <div class="form-control km-value" 
                :dir="direction(term && term.title, locale)" aria-describedby="basic-addon1">
                <km-term :value="value" :locale="locale" @on-term-load="onTermLoad(term)"></km-term>
            </div>
            <span class="input-group-text" id="basic-addon1" style="cursor:default">
                {{ lstringLocale(term && term.title, locale).toUpperCase() }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import KmTerm from './KmTerm.vue';
    
    const props = defineProps({
        value  : {type:Object, required:true },
        locale : {type:String, required:true },
    })
    const { value, locale } = toRefs(props);
    const term = ref({});

    const onTermLoad = function(term){
        term.value = term
    }
</script>

<style scoped>

</style>