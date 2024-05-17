
<template>
   <div style="border:none;margin-top:10px">
        <div v-if="!loading">
            <div v-if="!hideCoverImage && viewArticle && viewArticle.coverImage && viewArticle.coverImage.url">
                <cbd-article-cover-image :cover-image="viewArticle.coverImage" :cover-image-size="coverImageSize"></cbd-article-cover-image>
            </div>    
            <cbd-add-new-view-article v-if="hasEditRights" 
                :tags="tags" :admin-tags="adminTags" :custom-tags="customTags" :id="(viewArticle||{})._id" :target="target"
                class="btn btn-secondary float-end"></cbd-add-new-view-article>
            <div v-if="viewArticle" v-html="lstring(viewArticle.content, $locale)" class="ck-content"></div>
            <div v-if="!viewArticle" class="ck-content">
                <slot name="missingArticle">
                    {{t('noInformation')}}
                </slot>
            </div>
        </div>
        <div v-if="loading">
            <font-awesome-icon icon="spinner" spin></font-awesome-icon> {{t('loading')}}
        </div>
    </div>

</template>
<i18n src="@/i18n/dist/components/common/cbd-article.json"></i18n>
<script>

// import cbdAddNewArticle from './cbd-add-new-article.vue';

export default {
    name: 'cbdArticle',
    // components : { cbdAddNewArticle },
    props: {
        hideCoverImage  : { type: Boolean, required: false, default:false        },
        showEdit        : { type: Boolean, required: false, default:true         },
        article         : { type: Object,  required: false, default:undefined    },
        query           : { type: Object,  required: true                        },
        tags 		    : { type: Array  , required: false, default:[]           }, // [] of tag id's
        customTags 	    : { type: Array  , required: false, default:[]           }, // [] of customTag id's
        adminTags 	    : { type: Array  , required: false, default:[]           }, // [] of adminTag text
        target          : { type: String , required: false, default: '_self'     },
        coverImageSize   : { type: String, required: false, default: '800x800'   },
    },
    setup(){
        const { t } = useI18n();
        const {user} = useAuth();

        return { t };
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

        const security = useSecurity();
        if(!this.viewArticle)
            this.loadArticle();

        if(this.showEdit || this.showEdit == 'true' || this.hasOwnProperty(this.showEdit)){
            this.hasEditRights = security.isInRoles(['oasisArticleEditor', 'Administrator']);
        }
    },
    methods: {
        async loadArticle() {
            try{

                const { $api } = useNuxtApp()
                this.loading = true;
                const query = this.query;
                const articles = await $api.articles.queryArticles(query)
     
                if(articles.length){
                    this.remoteArticle = articles[0];

                    if(this.remoteArticle.coverImage?.url){
                        //sometime the file name has space/special chars, use new URL's href prop which encodes the special chars
                        const url = new URL(this.remoteArticle.coverImage.url)
                        this.remoteArticle.coverImage.url = url.href;

                        this.remoteArticle.coverImage.url_1200  = this.remoteArticle.coverImage.url.replace(/attachments\.cbd\.int\//, '$&1200x600/')
                    }

                    this.$emit('load', { ...this.remoteArticle });  
                    
                    setTimeout(() => {                        
                        this.preProcessOEmbed();
                    }, 1000);
                }
                else {
                    this.$emit('load');
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
                        url : encodeURI(url)                        
                    }

                    if(/app\.tango\.us\/app\/workflow\/.*/.test(url)){
                        params.height = '1500px'
                    }

                    const response = await useAPIFetch('/api/v2020/oembed', {method:'GET', query:params});                    
                    var embedHtml = '<div class="ck-media__wrapper" style="width:100%">' + response.html +'</div>'
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