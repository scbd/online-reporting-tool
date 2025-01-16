//@ts-nocheck

import { type ApiOptions } from "~/types/api/api-options";
import ApiBase from './api-base';

export default class ArticlesApi extends ApiBase
{
  constructor(options:ApiOptions) {
    super(options);
  }
  
  async queryArticleGroup(groupKey:string, params:object)  {
    return useAPIFetch(`/api/v2017/articles/grouping/${groupKey}`, {method:'GET', query:params })
  }

  async queryArticles(params:object)  {
    return useAPIFetch(`/api/v2017/articles`, {method:'GET', query:params })
  }

  async getArticleById(id:string)  {

    return useAPIFetch(`/api/v2017/articles/${id}`, {method:'GET'})
  }

  async getArticlesByTag(tag:string, options:object={})  {

    const q = { tag : tag };

    return this.queryArticles({...options, q, fo: 1 });
  }

  async getArticleAdminTags(params:object){

    const tags = await useAPIFetch(`/api/v2021/article-admin-tags`, {method:'GET', query: params })

    return tags
  }

}