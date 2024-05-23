<template>
    <div>
        <km-spinner v-if="loading" center></km-spinner>
        <!-- <cbd-add-new-view-article class="float-end btn btn-primary" :admin-tags="adminTags"></cbd-add-new-view-article> -->
        <div class="alert alert-info mt-5" v-if="!loading && !articles?.length">No articles available</div>
        <div v-if="articles.length" class="mt-3">
            <!-- <CRow> -->
                <div class="grid" data-masonry>
                <div class="grid-sizer"></div>
                <div class="grid-item m-1" v-for="article in articles" :key="article">
                    <CCard>
                            <nuxt-link href="#" :to="'/knowledge-base/articles/' + article._id">
                                <cbd-article-cover-image :cover-image="article.coverImage"
                                 v-if="article.coverImage" cover-image-size="600x400" />
                            </nuxt-link>
                            <CCardBody >
                                <CCardTitle class="text-decoration-none">{{lstring(article.title)}}</CCardTitle>
                                <CCardText>{{ lstring(article.summary) }}</CCardText>                            
                            </CCardBody>
                            <CCardFooter>
                                <nuxt-link href="#" :to="'/knowledge-base/articles/' + article._id">                                    
                                    <CButton color="primary float-end mb-2" href="#">View</CButton>
                                </nuxt-link>
                            </CCardFooter>
                        <!--  -->
                    </CCard>
                </div></div>
            <!-- </CRow> -->
        </div>
    </div>
</template>

<script setup lang="ts">

    import { useRealmConfStore } from '@/stores/realmConf';
    import Masonry from 'masonry-layout'

    const {t} = useI18n();
    const realmConfStore  = useRealmConfStore();
    const { $api } = useNuxtApp()
    const security = useSecurity();
    const adminTags = ['knowledge-base','help','ort'];

    const articles  = ref([]);
    const loading   = ref(false)


    async function loadArticles(){
        try{
            loading.value = true;
            const realmConf = realmConfStore.realmConf;
            const ag = [];
            ag.push({
                "$match":{
                    "adminTags": { 
                        "$all" :
                            [   'knowledge-base', 
                                encodeURIComponent(realmConf.realm.toLowerCase().replace(/(\-[a-zA-Z]{1,5})/, '')),
                            ]
                    }
                }
            });
            ag.push({"$project" : {"title":1, "summary":1, "_id":1, "coverImage":1}});
            

            articles.value = await $api.articles.queryArticles({ "ag" : JSON.stringify(ag)});

            nextTick(()=>{
                const grid = document.querySelector("[data-masonry]");
                new Masonry(grid, {
                    itemSelector: '.grid-item',
                    // columnWidth: '.grid-sizer',
                    columnWidth: 50,
                    percentPosition: true,
                });
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
    })
</script>

<style scoped>

.grid-sizer,
.grid-item {
  width: 33.333%;
}

.grid-item {
  float: left;
}

.grid-item img {
  display: block;
  max-width: 100%;
}
</style>