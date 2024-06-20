<template>
    <a :href="newArticleUrl" :target="target">
       <slot>
           <span v-if="!id"><i class="fa fa-plus"></i> Add Content</span>
           <span v-if="id" ><i class="fa fa-edit"></i> Edit Content</span>
           
       </slot>
   </a>
</template>

<script>
   export default {
       name:'cbdAddNewArticle',
       props: {
           tags      : { type: Array  , required: false, default:[]           },   // [] of tag id's
           customTags: { type: Array  , required: false, default:[]           },   // [] of customTag id's
           adminTags : { type: Array  , required: false, default:[]           },   // [] of adminTag text
           target    : { type: String , required: false, default: '_blank'    },
           id        : { type: String , required: false, default: undefined   },
       },
       computed: {
           newArticleUrl : function(){

               const domain = window.location.hostname.replace(/[^\.]+\./, '');
               let baseUrl = 'https://oasis.cbd.int'

               if(domain=='localhost' || domain == 'cbddev.xyz')
                   baseUrl = 'https://oasis.cbddev.xyz';

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
                   return `${baseUrl}/articles/new?${queryString.join('&')}`
               
               return  `${baseUrl}/articles/${encodeURIComponent(this.id)}/edit?${queryString.join('&')}`;
           }
       }
   }
</script>