
import ApiBase, { tryCastToApiError } from './api-base';

export default class ArticlesApi extends ApiBase
{
  constructor(options) {
    super(options);
  }
  
  async queryArticleGroup(groupKey, params)  {
    return $fetch.get(`/api/v2017/articles/grouping/${groupKey}`, { params })
                    .then(res => res.data)
                    .catch(tryCastToApiError);
  }

  async queryArticles(params)  {
    return $fetch.get(`/api/v2017/articles`, { params })
                    .then(res => res.data)
                    .catch(tryCastToApiError);
  }

  async getArticleById(id)  {

    return $fetch.get(`/api/v2017/articles/${id}`)
                    .then(res => res.data)
                    .catch(tryCastToApiError);
  }

  async getArticlesByTag(tag, options={})  {

    const q = { tag : tag };

    return this.queryArticles({...options, q, fo: 1 });
  }

  async getArticleAdminTags(params){

    const tags = await $fetch.get(`/api/v2021/article-admin-tags`, { params })
                              .then(res => res.data)
                              .catch(tryCastToApiError);

    return tags
  }

}