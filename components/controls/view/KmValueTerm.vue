<template>
    <div id="km-term"> 
        <div :class="`input-group input-lang-${locale}`">    
            <div class="form-control km-value" 
                :dir="direction(term && term.title, locale)" aria-describedby="basic-addon1">
                <km-term :value="value" :locale="locale" @on-term-load="onTermLoad(term)">
                    <template #help="{term}">
                        <slot name="help" :term="term">

                        </slot>
                    </template>
                </km-term>
            </div>
            <!-- <span class="input-group-text" id="basic-addon1" style="cursor:default">
                {{ lstringLocale(term && term.title, locale).toUpperCase() }}
            </span> -->
            <!-- {{lstring(getTerm(locale).title)}} -->
        </div>
    </div>
</template>

<script setup lang="ts">
    import KmTerm from './KmTerm.vue';
    // import { useThesaurusStore }    from '@/stores/thesaurus';
    
    const props = defineProps({
        value  : {type:Object, required:true },
        locale : {type:String, required:true },
    })
    const { value, locale } = toRefs(props);
    const term = ref({});
    // const thesaurusStore    = useThesaurusStore ();

    const onTermLoad = function(term){
        term.value = term
        // thesaurusStore.loadTerm(`lang-${term}`);
    }

    // function getTerm(term:string){
    //     return thesaurusStore.getTerm(`lang-${term}`)||{};
    // }
</script>

<style scoped>

</style>