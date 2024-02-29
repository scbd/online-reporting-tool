
import ApiBase, { tryCastToApiError } from './api-base';

export default class ArticlesApi extends ApiBase {
  constructor (options) {
    super(options);
  }

  async queryArticleGroup (groupKey, params) {
    return useAPIFetch(`/api/v2017/articles/grouping/${groupKey}`, { method: 'GET', query: params });
  }

  async queryArticles (params) {
    return useAPIFetch('/api/v2017/articles', { method: 'GET', query: params });
  }

  async getArticleById (id) {
    return useAPIFetch(`/api/v2017/articles/${id}`, { method: 'GET' });
  }

  async getArticlesByTag (tag, options = {}) {
    const q = { tag };

    return this.queryArticles({ ...options, q, fo: 1 });
  }

  async getArticleAdminTags (params) {
    const tags = await useAPIFetch('/api/v2021/article-admin-tags', { method: 'GET', query: params });

    return tags;
  }
}
