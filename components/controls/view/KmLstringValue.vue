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
                <CTooltip :content="lstring(getTerm.title, locale)">
                    <template #toggler="{ on }">
                        <span class="d-inline-block" :tabindex="0" v-on="on">
                            {{ valueLocale?.toUpperCase() }}
                        </span>
                    </template>                            
                </CTooltip>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
//@ts-nocheck
    import { direction, lstringLocale, lstring } from '@/utils';
    import { useThesaurusStore }    from '@/stores/thesaurus';
    // import $ from 'jquery';

    const props = defineProps({
        value  : {type:Object, required:true },
        locale : {type:String, required:true },
        type   : {type:String, default:'string' },
    })
    const { value, locale, type } = toRefs(props);    
    const thesaurusStore    = useThesaurusStore ();
    
    const valueLocale   = computed(()=>lstringLocale(value.value, locale.value));
    const valueLstring  = computed(()=>{
        const localeValue = lstring(value.value, locale.value);
        if(type.value=='html')
            return processImageSrcset(localeValue);

        return localeValue;
    });

    const getTerm = computed(()=>{
        return thesaurusStore.getTerm(`lang-${valueLocale.value}`)||{};   
    })
    
    function processImageSrcset(localeValue:string){

        // ATTACHMENTS_API_REGEX
        const htmlContent = $('<div>').html(localeValue);
        const newHtml = htmlContent.find('img')
            .filter((index, element)=>!element.srcset)
            .filter((index, element)=>element.src && element.src.match(ATTACHMENTS_API_REGEX))
            .map((index, element)=>{
                let srcSets = Object.values({
                                'xs': 320,
                                'sm': 640,
                                'md': 768,
                                'lg': 1024,
                                'xl': 1280,
                                'xxl': 1536
                            });
                element.sizes  ="(max-width: 640px) 320px, (max-width: 768px) 640px, (max-width: 1024px) 768px, (max-width: 1280px) 1024px, 1280px" 
                element.srcset = srcSets.map(size=>{
                                    const src = new URL(element.src);
                                    src.searchParams.set('width', size);
                                    return `${src.toString()} ${size}w`      
                                }).join(', ')
            });
            
        return htmlContent.html();
            
    }

    await thesaurusStore.loadTerm(`lang-${valueLocale.value}`)

</script>

<style>
   @import '@/libs/ckeditor/build/content-style.css'
</style>