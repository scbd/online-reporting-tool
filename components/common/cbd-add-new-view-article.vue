<template>
    <a :href="newArticleUrl" :target="target">
       <slot>
           <span v-if="!id"><i class="fa fa-plus"></i> {{ t('addContent')}}</span>
           <span v-if="id" ><i class="fa fa-edit"></i> {{ t('editContent')}}</span>           
       </slot>
   </a>
</template>
<i18n src="@/i18n/dist/components/common/cbd-add-new-view-article.json"></i18n>
<script lang="ts">
//@ts-nocheck
   export default {
       name:'cbdAddNewArticle',
       props: {
           tags 		: { type: Array  , required: false, default:[]           }, // [] of tag id's
           customTags 	: { type: Array  , required: false, default:[]           }, // [] of customTag id's
           adminTags 	: { type: Array  , required: false, default:[]           }, // [] of adminTag text
           target      : { type: String , required: false, default: '_blank'    },
           id          : { type: String , required: false, default: undefined   },
       },
       setup(){
            const { t } = useI18n();
            return { t };
        },
       computed: {
           newArticleUrl : function(){

                const conf    = useRuntimeConfig();
                const oasisUrl= conf.public.API_URL.replace('api.', 'oasis.');

               const queryString = [];
               if(!this.id){
                   if(this.tags?.length)
                       queryString.push('tags='		+ this.tags.map(encodeURIComponent).join(','))
                   if(this.customTags?.length)
                       queryString.push('customTags='	+ this.customTags.map(encodeURIComponent).join(','))
                   if(this.adminTags?.length)
                       queryString.push('adminTags='	+ this.adminTags.map(encodeURIComponent).join(','))
               }

               queryString.push('returnUrl=' + encodeURI(window.location.href));

               if(!this.id)
                   return `${oasisUrl}/articles/new?${queryString.join('&')}`
               
               return  `${oasisUrl}/articles/${encodeURIComponent(this.id)}/edit?${queryString.join('&')}`;
           }
       }
   }
</script>