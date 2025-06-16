//@ts-nocheck
import { defineStore } from 'pinia'
import { EditFormUtility } from "@/services/edit-form-utility";

export const useNationalReport7Store = defineStore('nationalReport7', {
  state: () => {
    return {
      nationalReport: undefined as ENationalReport7 | undefined,
      nationalReportInfo: undefined as EDocumentInfo | undefined,
      isBusy:false,
      sectionIIIActiveAccordion: undefined as string | undefined,
    }
  },
  getters:{
    
  },
  actions:{
    
    async loadNationalReport(identifier:string, force:boolean){
        console.log('Loading National Report', identifier, force);
        this.isBusy = true;
        try{
            const { $api }        = useNuxtApp();
            const { user }        = useAuth();
            if(!this.nationalReport){
                let nationalReport: EDocumentInfo | undefined = undefined;
                if(!identifier){
                    
                    let query = `(type eq '${SCHEMAS.NATIONAL_REPORT_7}')`
                    if(user.value?.government)
                        query += ` and owner eq 'country:${user.value.government}'` ;
                    const queryParams = {
                        $filter   : query,
                        $top      : 1,
                        $skip     : 0,
                        $orderby  : 'updatedOn desc',
                        body      : true
                    };
                    const existingDraft = await $api.kmStorage.drafts.query({...queryParams});
                    if(existingDraft?.Items?.length){
                        this.updateNationalReport(existingDraft.Items[0]);
                        return;
                    }
                    const existingDocument = await $api.kmStorage.documents.query({...queryParams});
                    if(existingDocument?.Items?.length){
                        this.updateNationalReport(existingDocument.Items[0]);
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
                            sectionOtherInfo : {}
                        }
                    }          
                }
                else if(identifier){
                    nationalReport = await EditFormUtility.load(identifier, SCHEMAS.NATIONAL_REPORT_7);
                }
                if(nationalReport)
                    this.updateNationalReport(nationalReport);
                console.log('National Report loaded', this.nationalReport);
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
    },
    setSectionIIIActiveAccordion(identifier:string){
        this.sectionIIIActiveAccordion = identifier;
    },
    clearSectionIIIActiveAccordion(){
        this.sectionIIIActiveAccordion = undefined;
    },
    // async saveSectionI(header:Object, government:Object, sectionI:Object){
    //     this.nationalReportDraft.header = header;
    //     this.nationalReportDraft.government = government;
    //     this.nationalReportDraft.sectionI = sectionI;
    // }


  },
  persist: {
      storage: persistedState.localStorage,
      pick: ['sectionIIIActiveAccordion'],
  }
})