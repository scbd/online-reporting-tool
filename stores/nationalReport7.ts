import { defineStore } from 'pinia'
import { EditFormUtility } from "@/services/edit-form-utility";

export const useNationalReport7Store = defineStore('nationalReport7', {
  state: () => {
    return {
      nationalReport: undefined as ENationalReport7 | undefined,
      nationalReportInfo: undefined as EDocumentInfo | undefined,
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
            if(!this.nationalReport){
                let nationalReport: EDocumentInfo | undefined = undefined;
                if(!identifier){
                    
                    const queryParams = {
                        $filter   : `(type eq '${SCHEMAS.NATIONAL_REPORT_7}')`,
                        $top      : 1,
                        $skip     : 0,
                        $orderby  : 'updatedOn desc',
                        body      : true
                    };
                    const existingDraft = await $api.kmStorage.drafts.query(queryParams);
                    if(existingDraft?.Items?.length){
                        nationalReport = this.updateNationalReport(existingDraft.Items[0]);
                        return;
                    }
                    const existingDocument = await $api.kmStorage.documents.query(queryParams);
                    if(existingDocument?.Items?.length){
                        nationalReport = this.updateNationalReport(existingDocument.Items[0]);
                        return;
                    }
                    
                    nationalReport = {
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
                            sectionIII : [],
                            sectionIV : [],
                            sectionV : {},
                            annex : {}
                        }
                    }          
                }
                else if(identifier){
                    nationalReport = await EditFormUtility.load(identifier, SCHEMAS.NATIONAL_REPORT_7);
                }
                if(nationalReport)
                    this.updateNationalReport(nationalReport);
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
        this.nationalReport = nationalReport.body;
        this.nationalReportInfo = nationalReport;
    }
    // async saveSectionI(header:Object, government:Object, sectionI:Object){
    //     this.nationalReportDraft.header = header;
    //     this.nationalReportDraft.government = government;
    //     this.nationalReportDraft.sectionI = sectionI;
    // }

  }
})