import { defineStore } from 'pinia'
import { EditFormUtility } from "@/services/edit-form-utility";

export const useNationalReport7Store = defineStore('nationalReport7', {
  state: () => {
    return {
      nationalReport: undefined,
      nationalReportDraft: undefined,
      nationalReportDraftInfo:undefined,
      isBusy:false
    }
  },
  getters:{
    
  },
  actions:{
    async loadNationalReport(identifier:string){
        // if(!this.documents?.length){

        //   const { $api }  = useNuxtApp();
        //   const documents = await $api.kmStorage.documents.queryDocuments();
        //   this.documents = documents;
        // };
    },
    async loadNationalReportDraft(identifier:string){
        console.log('hello')
        this.isBusy = true;
        try{
            const { $api }        = useNuxtApp();
            const { user }        = useAuth();
            if(!identifier && !this.nationalReportDraft){
                
                const queryParams = {
                    $filter   : `(type eq '${SCHEMAS.NATIONAL_REPORT_7}')`,
                    $top      : 1,
                    $skip     : 0,
                    $orderby  : 'updatedOn desc',
                    body      : true
                };
                const existingDraft = await $api.kmStorage.drafts.query(queryParams);
                if(existingDraft?.Items?.length){
                    this.nationalReportDraftInfo = existingDraft.Items[0];
                    this.nationalReportDraft     = this.nationalReportDraftInfo.body;
                    return;
                }
                const existingDocument = await $api.kmStorage.documents.query(queryParams);
                if(existingDocument?.Items?.length){
                    this.nationalReportDraftInfo = existingDocument.Items[0];
                    this.nationalReportDraft     = this.nationalReportDraftInfo.body
                    return;
                }
                
                this.nationalReportDraft = {
                    header : {
                        schema : SCHEMAS.NATIONAL_REPORT_7,
                        identifier : useGenerateUUID(),
                        languages  : EditFormUtility.getPreferredEditLanguages()
                    },        
                    government : {
                        identifier : user.value?.government
                    },
                    sectionI : {},
                    sectionII : {},
                    sectionIII : {},
                    sectionIV : {},
                    sectionV : {},
                    annex : {}
                }          
            }
            else if(identifier){
                this.nationalReportDraftInfo = await EditFormUtility.load(identifier, SCHEMAS.NATIONAL_REPORT_7);
                this.nationalReportDraft     = this.nationalReportDraftInfo.body;
            }
        }
        catch(e){
            throw e;
        }
        finally{
            this.isBusy = false
        }

    },
    async saveDraft(){
        // if(!this.documents?.length){

        //   const { $api }  = useNuxtApp();
        //   const documents = await $api.kmStorage.documents.queryDocuments();
        //   this.documents  = documents;
        // };
    },

    // async saveSectionI(header:Object, government:Object, sectionI:Object){
    //     this.nationalReportDraft.header = header;
    //     this.nationalReportDraft.government = government;
    //     this.nationalReportDraft.sectionI = sectionI;
    // }

  }
})