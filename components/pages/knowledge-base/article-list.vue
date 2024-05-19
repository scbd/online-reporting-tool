<template>
    <div>
        <km-spinner v-if="loading" center></km-spinner>
        <cbd-add-new-view-article v-if="hasRightsToEdit" class="float-end btn btn-primary" :admin-tags="adminTags"></cbd-add-new-view-article>
        <div class="alert alert-info mt-5" v-if="!loading && !articles?.length">No articles available</div>

        <div class="row row-cols-1 row-cols-md-5 g-4" v-if="articles.length">
            <div class="col-2" v-for="article in articles" :key="article">
                <div class="card">
                    <nuxt-link :to="'/knowledge-base/articles/' + article._id">
                        <cbd-article-cover-image style="max-height: 200px;" :cover-image="article.coverImage" cover-image-size="200x300" v-if="article.coverImage" />
                    </nuxt-link>
                    <div class="card-body">
                        <h5 class="card-title">{{lstring(article.title)}}</h5>
                        <p class="card-text">{{ lstring(article.summary)?.substring(0, 100) }}</p>
                    </div>
                    <div class="card-footer">
                        <nuxt-link :to="'/knowledge-base/articles/' + article._id">                                    
                            <CButton color="primary float-end mb-2">View</CButton>
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

    import { useRealmConfStore } from '@/stores/realmConf';

    const {t} = useI18n();
    const realmConfStore  = useRealmConfStore();
    const { $api } = useNuxtApp()
    const security = useSecurity();
    const adminTags = ['knowledge-base','help','ort'];

    const articles  = ref([]);
    const loading   = ref(false)
    const hasRightsToEdit = ref(false); 

    const defaultCoverImages = [
        'https://attachments.cbd.int/238cb4417d12695712e35d17c2174d53/gbf-2020-1.jpg',
        'https://attachments.cbd.int/c7bfccac34698d41165fdb42cb51f1f9/gbf-2020-2.jpg',
        'https://attachments.cbd.int/a37da2bf96e6440ba926ab2f298ddb0c/gbf-2020-3.jpg',
        'https://attachments.cbd.int/5f5b16b2f3abdca3461546d5d1937aba/gbf-2020-4.jpg',
        'https://attachments.cbd.int/238cb4417d12695712e35d17c2174d53/gbf-2020-1.jpg'
    ]


    async function loadArticles(){
        try{
            loading.value = true;
            const realmConf = realmConfStore.realmConf;
            const ag = [];
            ag.push({
                "$match":{
                    "adminTags": { 
                        "$all" :
                            [   
                                'knowledge-base', 
                                encodeURIComponent(realmConf.realm.toLowerCase().replace(/(\-[a-zA-Z]{1,5})/, '')),
                            ]
                    }
                }
            });
            ag.push({"$project" : {"title":1, "summary":1, "_id":1, "coverImage":1}});
            

            const res = await $api.articles.queryArticles({ "ag" : JSON.stringify(ag)});
            
            articles.value = res?.map(e=>{
                
                if(!e?.coverImage){
                    const randomNumber = Math.abs(Math.floor(Math.random() * (0 - 4) ))
                    e.coverImage = {
                        url : defaultCoverImages[randomNumber]
                    }                    
                }
                return e;
            })

        }
        catch(e){
            useLogger().error(e, 'Error loading knowledge base articles');
        }
        finally{
            loading.value = false;
        }
    }

    onMounted(()=>{
        loadArticles();

        hasRightsToEdit.value = security.isInRoles(['oasisArticleEditor', 'Administrator']);
    })
</script>

<style scoped>

</style>