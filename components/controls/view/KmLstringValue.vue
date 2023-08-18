<template>
    <div id="km-value-ml">
        <div :class="`input-group input-lang-${locale}`">
    
            <div v-if="type=='string'" class="form-control km-value km-value-ml-string" 
                :dir="direction(valueLstring, locale)" aria-describedby="basic-addon1">
                {{ valueLstring }}
            </div>
            <div v-if="type=='html'" class="form-control km-value km-value-ml-html ck-content" 
                :dir="direction(valueLstring, locale)" aria-describedby="basic-addon1" v-html="valueLstring">                
            </div>
            <span class="input-group-text" id="basic-addon1" style="cursor:default">
               {{lstring(getTerm(valueLocale).title)}}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { direction, lstringLocale, lstring } from '@/utils';
import { useThesaurusStore }    from '@/stores/thesaurus';

    const props = defineProps({
        value  : {type:Object, required:true },
        locale      : {type:String, required:true },
        type        : {type:String, default:'string' },
    })
    const { value, locale, type } = toRefs(props);    
    const thesaurusStore    = useThesaurusStore ();

    const valueLocale   = computed(()=>lstringLocale(value.value, locale.value));
    const valueLstring  = computed(()=>lstring(value.value, locale.value));

    function getTerm(term:string){
        thesaurusStore.loadTerm(`lang-${term}`)
        return thesaurusStore.getTerm(`lang-${term}`)||{};
   
    }
    
</script>

<style>
   @import '@/libs/ckeditor/build/content-style.css'
</style>