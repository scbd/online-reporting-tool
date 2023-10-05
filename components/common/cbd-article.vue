
<template>
   <div style="border:none;margin-top:10px">
        <div v-if="!loading">
            <div v-if="!hideCoverImage && viewArticle && viewArticle.coverImage && viewArticle.coverImage.url">
                <cbd-viewArticle-cover-image cover-image="viewArticle.coverImage"></cbd-viewArticle-cover-image>
            </div>
        
            <!-- <div v-if="hasEditRights" class="pull-right">    
                <cbd-add-new-viewArticle :tags="tags" :admin-tags="adminTags" :custom-tags="customTags" :id="(viewArticle||{})._id" :target="target"
                    class="btn btn-default"></cbd-add-new-viewArticle>
                <br/>    
            </div> -->
            <div v-if="viewArticle" v-html="lstring(viewArticle.content, $locale)" class="ck-content"></div>
            <div v-if="!viewArticle" class="ck-content">
                <slot name="missingArticle">
                    No information is available for this section at the moment.
                </slot>
            </div>
        </div>
        <div v-if="loading">Loading section content<i class="fa fa-spinner fa-spin"></i></div>
    </div>

</template>

<script>

// import cbdAddNewArticle from './cbd-add-new-article.vue';

export default {
    name: 'cbdArticle',
    // components : { cbdAddNewArticle },
    props: {
        hideCoverImage  : { type: Boolean, required: false, default:false        },
        showEdit        : { type: Boolean, required: false, default:undefined    },
        article         : { type: Object,  required: false, default:undefined    },
        query           : { type: Object,  required: true                        },
        tags 		    : { type: Array  , required: false, default:[]           }, // [] of tag id's
        customTags 	    : { type: Array  , required: false, default:[]           }, // [] of customTag id's
        adminTags 	    : { type: Array  , required: false, default:[]           }, // [] of adminTag text
        target          : { type: String , required: false, default: '_self'     },
    },
    data() {
        return {
            returnUrl       : window.location.href,
            hasEditRights   : false,
            loading         : false,
            remoteArticle   : undefined
        }
    },
    computed:{
        viewArticle (){return this.article || this.remoteArticle }
    },
    mounted() {
        if(!this.viewArticle)
            this.loadArticle();
    },
    methods: {
        async loadArticle() {
            try{
                const { $api } = useNuxtApp()
                const security = useSecurity();
                this.loading = true;
                const query = this.query;
                const articles = await $api.articles.queryArticles(query)
     
                if(articles.length){
                    this.remoteArticle = articles[0];

                    this.preProcessOEmbed();

                    if(this.remoteArticle.coverImage?.url){
                        //sometime the file name has space/special chars, use new URL's href prop which encodes the special chars
                        const url = new URL(this.remoteArticle.coverImage.url)
                        this.remoteArticle.coverImage.url = url.href;

                        this.remoteArticle.coverImage.url_1200  = this.remoteArticle.coverImage.url.replace(/attachments\.cbd\.int\//, '$&1200x600/')
                    }

                    this.$emit('load', { ...this.remoteArticle });   
                }
                else {
                    this.$emit('load');
                }

                if(this.showEdit || this.showEdit == 'true' || this.hasOwnProperty(this.showEdit)){
                    this.hasEditRights = security.isInRoles(['oasisArticleEditor', 'Administrator']);
                }
            }
            catch(e){
                useLogger().error(e, 'Error loading article')
            }
            finally{
                this.loading = false;
            }
        },
        preProcessOEmbed() {

            this.$nextTick(function(){

                document.querySelectorAll( 'oembed[url]' )
                .forEach(async function(element) {
                    var url = element.attributes.url.value;
                    var params = {
                        url : encodeURI(url),
                    }

                    const response = await useAPIFetch('/api/v2020/oembed', {method:'GET', query:params});                    
                    var embedHtml = '<div class="ck-media__wrapper" style="width:100%">' + response.data.html +'</div>'
                    element.insertAdjacentHTML("afterend", embedHtml);
                    
                });

            })
        }
    }
}
</script>

<style>
   @import '@/libs/ckeditor/build/content-style.css'
</style>