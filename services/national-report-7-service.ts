//@ts-nocheck

import type { EDocumentInfo } from "~/types/schemas/base/EDocumentInfo";
import type { ETerm } from "~/types/schemas/base/ETerm";
import type { ENationalReport7 } from "~/types/schemas/ENationalReport7";
import {KmDocumentsService} from "~/services/kmDocuments";
import {KmDocumentDraftsService} from "~/services/kmDocumentDrafts";
import { EditFormUtility } from "~/services/edit-form-utility";
import { GbfGoalsAndTargets } from "~/services/gbfGoalsAndTargets";
import { getAlignedGoalsOrTargets } from '~/components/pages/national-targets/my-country/part-2/util';
import { IndicatorsMappingData } from '~/app-data/indicators';
import { queryIndex, parseSolrQuery, escape } from '@/services/solr';

export interface NationalIndicator {
    identifier: string,
    value: ELstring,
    parentIndicator?: string,
    isDuplicate?: boolean
}

class NationalReport7Service {

    async loadNationalReport(identifier:string, force:boolean){
        
        this.isBusy = true;
        try{
            const { $api }        = useNuxtApp();
            const { user }        = useAuth();

            // let nationalReport: EDocumentInfo | undefined = undefined;
            // if(!identifier){
                
            //     let query = `(type eq '${SCHEMAS.NATIONAL_REPORT_7}')`
            //     if(user.value?.government)
            //         query += ` and owner eq 'country:${user.value.government}'` ;

            //     const queryParams = {
            //         $filter   : query,
            //         $top      : 1,
            //         $skip     : 0,
            //         $orderby  : 'updatedOn desc',
            //         body      : true
            //     };
            //     // Check if there is an existing draft or document
            //     const existingDraft = await $api.kmStorage.drafts.query({...queryParams});
            //     if(existingDraft?.Items?.length){
            //         nationalReport = existingDraft.Items[0];
            //     }
            //     else{
            //         const existingDocument = await $api.kmStorage.documents.query({...queryParams});
            //         if(existingDocument?.Items?.length){
            //             nationalReport = existingDocument.Items[0];
            //         }
            //     }

            //     if(!nationalReport){
            //         nationalReport = {
            //             body : {
            //                 header : {
            //                     schema : SCHEMAS.NATIONAL_REPORT_7,
            //                     identifier : useGenerateUUID(),
            //                     languages  : EditFormUtility.getPreferredEditLanguages()
            //                 },        
            //                 government : {
            //                     identifier : user.value?.government
            //                 },
            //                 sectionI : {},
            //                 sectionII : {},
            //                 sectionIII : [],
            //                 sectionIV : [],
            //                 sectionV : {},
            //                 sectionOtherInfo : {}
            //             }
            //         }          
            //     }
            // }
            // else if(identifier){
            //     nationalReport = await EditFormUtility.load(identifier, SCHEMAS.NATIONAL_REPORT_7);
            // }

            // console.log('nationalReport', nationalReport);
            // const nr7lastUpdatedOn = nationalReport.workingDocumentUpdatedOn||nationalReport.updatedOn;
            // const latestNT = await this.loadNationalTargets(1, 'updatedOn desc');
            
            const response = await Promise.all([
                                GbfGoalsAndTargets.loadGbfGoalsAndTargetsWithIndicators(),
                                this.loadIndicatorData(SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA),
                                this.loadIndicatorData(SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA),
                                this.loadNationalTargetIndicators()
                            ]);

            // if(latestNT?.length){
            //     const latestNTUpdatedOn = latestNT[0].updatedOn;
            //     //if targets were updated after the last national report update
            //     // update the national report with the latest targets
            //     if(nr7lastUpdatedOn < latestNTUpdatedOn || (!nationalReport?.body.sectionIII?.length || !nationalReport?.body.sectionIV?.length)){                    
            //         console.log('targetIndicators', response[3].targetIndicatorMapping);
            //     }
            // }
            // console.log('latestNT', latestNT);
            // if(nationalReport)
            //     this.updateNationalReport(nationalReport);
            
        }
        catch(e){
            throw e;
        }
        finally{
            this.isBusy = false
        }

    }

    async loadNationalTargets(rows:int = 300, sort:string = 'updatedOn desc'):Promise<EDocumentInfo[]>{
        
        const { user }        = useAuth();
        let query = `(type eq '${SCHEMAS.NATIONAL_TARGET_7}')`
        if(user.value?.government)
            query += ` and owner eq 'country:${user.value.government}'` ;

        const response = await KmDocumentsService.loadDocuments(query, rows, undefined, 0, true)

        // const targets = await Promise.all(response?.Items?.map(async e=>{
        //                     const headlineIndicators = await Promise.all(getAlignedGoalsOrTargets(e.body)?.map(e=>{return GbfGoalsAndTargets.loadGbfHeadlineIndicator(e.identifier)})||[]);
        //                     const binaryIndicators   = await Promise.all(getAlignedGoalsOrTargets(e.body)?.map(e=>{return GbfGoalsAndTargets.loadGbfBinaryIndicator(e.identifier)})||[]);
        //                     const componentIndicators       = await Promise.all(e.body?.componentIndicators    ?.map(e=>{return GbfGoalsAndTargets.loadIndicator(e.identifier)})||[]);
        //                     const complementaryIndicators   = await Promise.all(e.body?.complementaryIndicators?.map(e=>{return GbfGoalsAndTargets.loadIndicator(e.identifier)})||[]);
        //                     return {
        //                         identifier             : e.identifier,
        //                         title                  : e.title,
        //                         globalTargetAlignment  : e.body?.globalTargetAlignment,
        //                         componentIndicators    : componentIndicators    ?.flat(),
        //                         complementaryIndicators: complementaryIndicators?.flat(),
        //                         nationalIndicators     : e.body?.otherNationalIndicators||[],
        //                         headlineIndicators     : headlineIndicators?.flat(),
        //                         binaryIndicators       : binaryIndicators  ?.flat(),
        //                     }
        //                 }));      
        // return targets
        // .filter(e=>e.identifier == 'GBF-TARGET-11');

        return response?.Items;
    }

    async loadNationalTargetIndicators(){
        const nationalTargets = await this.loadNationalTargets(300, 'updatedOn desc');

        const targetIndicatorMapping = await Promise.all(nationalTargets?.map(async e=>{

            const headlineIndicators = await Promise.all(getAlignedGoalsOrTargets(e.body)?.map(e=>{return GbfGoalsAndTargets.loadGbfHeadlineIndicator(e.identifier)})||[]);
            const binaryIndicators   = await Promise.all(getAlignedGoalsOrTargets(e.body)?.map(e=>{return GbfGoalsAndTargets.loadGbfBinaryIndicator(e.identifier)})||[]);
            const componentIndicators       = await Promise.all(e.body?.componentIndicators    ?.map(e=>{return GbfGoalsAndTargets.loadIndicator(e.identifier)})||[]);
            const complementaryIndicators   = await Promise.all(e.body?.complementaryIndicators?.map(e=>{return GbfGoalsAndTargets.loadIndicator(e.identifier)})||[]);
            
            return {
                identifier             : e.identifier,
                title                  : e.title,
                globalTargetAlignment  : e.body?.globalTargetAlignment,
                globalGoalAlignment    : e.body?.globalGoalAlignment,
                componentIndicators    : componentIndicators    ?.flat(),
                complementaryIndicators: complementaryIndicators?.flat(),
                nationalIndicators     : e.body?.otherNationalIndicators||[],
                headlineIndicators     : headlineIndicators?.flat(),
                binaryIndicators       : binaryIndicators  ?.flat(),
            }

        }));     

        return { nationalTargets, targetIndicatorMapping };
    }

    async loadIndicatorData(indicatorType){

        const { user }        = useAuth();
        let query = `(type eq '${indicatorType}')`;
        if(user.value?.government)
            query += ` and owner eq 'country:${user.value.government}'` ;

        const result = await Promise.all([
                            KmDocumentDraftsService.loadDraftDocuments(query,500, 'updatedOn desc', 0, true),
                            KmDocumentsService.loadDocuments(query,500, 'updatedOn desc', 0, true)
                        ]);  

        return [...result[0].Items,
                ...result[1].Items.filter(e=>!result[0].Items?.find(draft=>draft.identifier == e.identifier))]

    }

    indicatorDataDTO(data:Object, type:string){
        const deletedIndicators = [
            'GBF-INDICATOR-151',
            'GBF-INDICATOR-269'
        ];
        const typeData = data?.[type]?.
                            filter(e=>!deletedIndicators?.includes(e.identifier))?.
                            map(e=>({indicator : { identifier : e.identifier}}));
        typeData?.forEach(e=>{            
            const indicatorData = data.indicators?.find(i=>i.identifier == e.indicator.identifier);

            if(indicatorData?.nationalData){
                e.data = {
                    identifier : indicatorData.nationalData?.header?.identifier,
                }
            }
        });

        return uniqueBy(typeData, e=>e.indicator.identifier);
    }

    uniqueIndicators(indicators:Array<ETerm>){
        const uniqueIndicators = indicators?.flat()?.reduce((acc, curr) => {
            if(!curr) return acc;
            const existing = acc.find(item => item.identifier === curr.identifier);
            if (!existing) {
                acc.push(curr);
            }
            return acc;
        }, []);
        return uniqueIndicators;
    }


    getIndicatorDataMapping(indicator:ETerm, indicatorType:string, locale:string):IndicatorMapping|undefined {
        if(indicatorType == 'otherNationalIndicators') {
            return {
                identifier: indicator.identifier,
                code: indicator.identifier,
                title: lstring(indicator.title, locale)
            }
        }
        return IndicatorsMappingData.find(e=>e.identifier == indicator.identifier);
    }


    async loadNationalIndicators(government:string):Promise<Array<NationalIndicator>>{
        if(!government) return [];
        
        const searchQuery = {
            fields          : 'nationalIndicators_s',
            query           : `hasOtherNationalIndicators_b:true AND government_s:(${escape(government)})`
        }
        
        const result = await queryIndex(parseSolrQuery(searchQuery))

        const indicators:Array<NationalIndicator> = (result?.docs || [])
        .filter(doc=>doc.nationalIndicators_s)
        .map(doc=>{
            return JSON.parse(doc.nationalIndicators_s)
        })
        .flat();


        // const indicatorsObject = arrayToObject(indicators);
        return indicators;
    }

    compareNationalIndicatorByTitle(indicator1:NationalIndicator, indicator2:NationalIndicator){
        const indicator1Title = indicator1?.value;
        const indicator2Title = indicator2?.value;
        if(!indicator1Title || !indicator2Title) {
            console.log('Indicator value is missing', indicator1, indicator2);
            return false;
        }
        return indicator1Title?.en?.toLowerCase()?.trim() == indicator2Title?.en?.toLowerCase()?.trim();
    }
    
    findUniqueNationalIndicators(nationalIndicators:Array<NationalIndicator>, nationalIndicatorData:Array<NationalIndicatorData>):Array<NationalIndicator>{
        const uniqueNationalIndicators = nationalIndicators.filter(e=>{
            const data = nationalIndicatorData.find(nid=>nid?.body?.indicator?.identifier == e.identifier);
            if(data) return true;

            const duplicateIndicators = nationalIndicators.filter(ir=>this.compareNationalIndicatorByTitle(ir, e) && !ir.isDuplicate)
            if(duplicateIndicators.length > 0){
                duplicateIndicators.forEach((di, index)=>{
                    if(index>0){
                         di.isDuplicate = true;
                         di.parentIndicator = duplicateIndicators[0].identifier;
                    }
                });
            }
            return duplicateIndicators.find(di=>!di.isDuplicate && di.identifier == e.identifier);
        });
        return uniqueNationalIndicators.filter(e=>!e.isDuplicate);
    }

}

export const nationalReport7Service = new NationalReport7Service();