import { defineStore } from 'pinia'
import { EditFormUtility } from "@/services/edit-form-utility";

export const useNationalReport7Store = defineStore('nationalReport7', {
  state: () => {
    return {
      nationalReport: undefined as EDocumentInfo | undefined,
    //   nationalReportDraft: undefined,
    //   nationalReportDraftInfo:undefined,
      isBusy:false
    }
  },
  getters:{
    
  },
  actions:{
    
    async loadNationalReport(identifier:string, force:boolean){
        
        this.isBusy = true;
        try{
            const { $api }        = useNuxtApp();
            const { user }        = useAuth();
            if(!identifier && !this.nationalReport){
                
                const queryParams = {
                    $filter   : `(type eq '${SCHEMAS.NATIONAL_REPORT_7}')`,
                    $top      : 1,
                    $skip     : 0,
                    $orderby  : 'updatedOn desc',
                    body      : true
                };
                const existingDraft = await $api.kmStorage.drafts.query(queryParams);
                if(existingDraft?.Items?.length){
                    this.nationalReport = existingDraft.Items[0];
                    return;
                }
                const existingDocument = await $api.kmStorage.documents.query(queryParams);
                if(existingDocument?.Items?.length){
                    this.nationalReport = existingDocument.Items[0];
                    return;
                }
                
                this.nationalReport = {
                    body : {
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
            }
            else if(identifier){
                this.nationalReport = await EditFormUtility.load(identifier, SCHEMAS.NATIONAL_REPORT_7);
            }
        }
        catch(e){
            throw e;
        }
        finally{
            this.isBusy = false
        }

    },
    updateNationalReport(nationalReport:EDocumentInfo){
        this.nationalReport = nationalReport;
    }
    // async saveSectionI(header:Object, government:Object, sectionI:Object){
    //     this.nationalReportDraft.header = header;
    //     this.nationalReportDraft.government = government;
    //     this.nationalReportDraft.sectionI = sectionI;
    // }

  }
})