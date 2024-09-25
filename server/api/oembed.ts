import _ from 'lodash';
import { HTTP_STATUS } from '~/utils';
export default defineEventHandler((event)=>{
    
    const {url}     = getQuery(event)    
    const parsedUrl = new URL(url);

    if(!/cbd.int$/.test(parsedUrl.hostname) && !/cbddev.xyz$/.test(parsedUrl.hostname)){
        return setResponseStatus(event, HTTP_STATUS.BAD_REQUEST,'Only ORT domain is allowed.');
    }

    let params  = {
                    type         : parsedUrl.searchParams.get('type'),
                    recordTypes  : parsedUrl.searchParams.get('recordTypes'),
                    globalTargets: parsedUrl.searchParams.get('globalTargets'),
                    globalGoals  : parsedUrl.searchParams.get('globalGoals'),
                    countries    : parsedUrl.searchParams.get('countries'),
                    regions      : parsedUrl.searchParams.get('regions'),
                    share  : parsedUrl.searchParams.get('share'),
                }
    params      = _.omitBy(params, e => e == null);

    // if param is not provided then the widget script will not render so fallback to geneal iframe 
    // widget script will set the height of the iframe to the height of the page
    if(!params.type)
        return;
    
    const oEmbedResponse = {
        url,
        ...params
    }

    const attributes =  Object.keys(params).map(e=>{
        return params[e] ? `data-${_.kebabCase(e)}="${params[e]}"` : undefined
    }).map(e=>e)

    oEmbedResponse.resources = [{src:`${parsedUrl.origin}/embed-widget.js`, type:'javascript'}]
    oEmbedResponse.html      = `<div class="scbd-ort-embed" width="100%" ${attributes.join(' ')}>ORT embed is missing resources</div>`;

    return oEmbedResponse;

});