
import { useRealmConfStore }    from '@/stores/realmConf';
import { useI18n } from 'vue-i18n';
import { useUserPreferencesStore }    from '@/stores/userPreferences';
import {uniq } from 'lodash';

class editFormUtility{

    schemasWorkflowTypes  = {
		"national"		: { name : "publishNationalRecord", version : "0.4" },
		"reference"		: { name : "publishReferenceRecord", version : undefined }
	};

    constructor(){
        
    }


    //==================================
    //
    //==================================
    load(identifier:string, expectedSchema:string) {

        const { $api } = useNuxtApp();
        const $kmStorageApi = $api.kmStorage

        const metadata   = this.getDocumentMetadata({});

        return $kmStorageApi.drafts.get(identifier, { info: "" })
            .then(success=>success,
                error=>{
                    if (error?.cause?.status == 404)
                        return $kmStorageApi.documents.get(identifier, { info: "" });
                    throw error;
            })
            .then(function(success) {
                var info = success;

                if (expectedSchema && info.type!=expectedSchema)
                    throw { data: { error: "Invalid schema type" }, status:"badSchema"};
                
                metadata.schema = info.type;
                var hasDraft = !!info.workingDocumentCreatedOn;
                var securityPromise = hasDraft ? $kmStorageApi.drafts.canUpdate(info.identifier,  {metadata })
                                                : $kmStorageApi.drafts.canCreate(info.identifier, {metadata });

                return securityPromise.then(
                    function(isAllowed) {
                        if (!isAllowed)
                            throw { data: { error: "Not allowed" }, status: "notAuthorized" };

                        var documentPromise = hasDraft ? $kmStorageApi.drafts.get(identifier)
                                                        : $kmStorageApi.documents.get(identifier);

                        return documentPromise;
                    });
            });
    }

    //==================================
    //
    //==================================
    async draftExists(identifier) {

        const { $api } = useNuxtApp();
        const $kmStorageApi = $api.kmStorage
        try {
            const data = await $kmStorageApi.drafts.get(identifier, { info: "" })
            if(data)
                return true;
            
        }
        catch(error){

            if (error?.cause?.status == 404)
                    return false;

            throw error;
        }
        
    }

    //==================================
    //
    //==================================
    saveDraft(document:Object) {

        const { $api } = useNuxtApp();
        const $kmStorageApi = $api.kmStorage
        
        const identifier = document.header.identifier;
        const metadata   = this.getDocumentMetadata(document);

        return this.draftExists(identifier).then(
            function(hasDraft) {

                var securityPromise = hasDraft ? $kmStorageApi.drafts.canUpdate(identifier, { metadata })
                                               : $kmStorageApi.drafts.canCreate(identifier, { metadata });

                return securityPromise.then(
                    function(data) {

                        if (!data?.isAllowed)
                            throw { error: "Not authorized to save draft" };

                        return $kmStorageApi.drafts.put(identifier, document, {schema:document.header.schema});
                    });
            });
    }

    //==================================
    //
    //==================================
    documentExists(identifier) {

        const { $api } = useNuxtApp();
        const $kmStorageApi = $api.kmStorage
        
        return $kmStorageApi.documents.get(identifier, { info: "" }).then(function() {
            return true;
        },function(error) {
            if (error?.cause?.status == 404)
                return false;
            throw error;
        });
    }

    //==================================
    //
    //==================================
    publish(document) {

        const { $api } = useNuxtApp();
        const $kmStorageApi = $api.kmStorage
        
        var identifier = document.header.identifier;
        var schema     = document.header.schema;
        const metadata = this.getDocumentMetadata(document);

        // Check if document exists

        return this.documentExists(identifier).then(function(exists) {

            // Check user security on document

            var qCanWrite = exists ? $kmStorageApi.documents.canUpdate(identifier,  { metadata })
                                    : $kmStorageApi.documents.canCreate(identifier, { metadata });

            return qCanWrite;

        }).then(function(canWrite) {

            if(!canWrite)
                throw { error : "Not allowed" };

            //Save document
            if(schema == 'contact')
                return $kmStorageApi.documents.put(identifier, document);	// return documentInfo

            //Incase of publish save draft and let the workflow publish the document.
            return $kmStorageApi.drafts
                .put(identifier, document)
                .then(function(draftInfo) {
                    return createWorkflow(draftInfo); // return workflow info
                });
        });
    }

    //==================================
    //
    //==================================
    publishRequest(document, additionalInfo) {

        const { $api } = useNuxtApp();
        const $kmStorageApi = $api.kmStorage
        
        var identifier = document.header.identifier;
        var schema     = document.header.schema;
        const metadata = this.getDocumentMetadata(document);

        // Check if doc & draft exists

        return this.draftExists(identifier).then(function(exists) {

            // Check user security on drafts

            var qCanWrite = exists ? $kmStorageApi.drafts.canUpdate(identifier,  { metadata })
                                    : $kmStorageApi.drafts.canCreate(identifier, { metadata });

            return qCanWrite;

        }).then(function(canWrite) {

            if(!canWrite)
                throw { error : "Not allowed" };

            //Save draft
            return $kmStorageApi.drafts.put(identifier, document);

        }).then(function(draftInfo) {
            return createWorkflow(draftInfo, additionalInfo); // return workflow info
        });
    }
    
    //==================================
    //
    //==================================
    deleteDocument(document, additionalInfo) {

        const { $api } = useNuxtApp();
        const $kmStorageApi = $api.kmStorage
        
        var draftInfo = {
            identifier 				: document.identifier,
            documentID			 	: document.documentID,
            workingDocumentTitle	: document.title,
            workingDocumentSummary	: document.summary,
            workingDocumentMetadata	: document.metadata
        };
        var workflowType = {
            name : 'deleteRecord', version : "0.4"
        }	
        
        return this.createWorkflow(draftInfo, additionalInfo, workflowType); // return workflow info

    }

    getPreferredEditLanguages(){
        let languages;

        try{
            const { locale } = useI18n();
            languages = [ locale.value ];            
        }
        catch(e){
            const { $i18n } = useNuxtApp()
            languages = [$i18n.locale.value]
        }

        const userPreferencesStore    = useUserPreferencesStore();
        if(userPreferencesStore.preferredEditLanguages?.length){
            languages = uniq([...languages, ...userPreferencesStore.preferredEditLanguages]);
        }

        return languages;
    }

	private createWorkflow(draftInfo, additionalInfo, type:string){

        const { $api } = useNuxtApp();
        const $kmStorageApi = $api.kmStorage
        
        const realmConfStore  = useRealmConfStore();
        const realmConf = realmConfStore.realmConf;
		const schema      = realmConf.schemas[draftInfo.type]

		if(!type)
		 	type = this.schemasWorkflowTypes[schema.type];

		if(!type)
			throw "No workflow type defined for this record type: " + draftInfo.type;

		const workflowData = {
			"realm"      		: realmConf.realm,
			"documentID" 		: draftInfo.documentID,
			"identifier" 		: draftInfo.identifier,
			"title"      		: draftInfo.workingDocumentTitle,
			"abstract"   		: draftInfo.workingDocumentSummary,
			"metadata"   		: draftInfo.workingDocumentMetadata,
			"additionalInfo"	: additionalInfo
		};

        var body = {
            type: type.name,
            version: type.version,
            data: workflowData
        };

        return useAPIFetch("/api/v2013/workflows",{ body, method:'POST'})
	}

    private getDocumentMetadata(document:any){

        const realmConfStore  = useRealmConfStore();
        const realmConf = realmConfStore.realmConf;

        const metadata   = {
            schema      : document?.header?.schema,
            realm       : realmConf.realm,
            government  : undefined
        };

        if (document.government)
            metadata.government = document?.government?.identifier;
        
        if(!metadata.government){
            const { user } = useAuth();
            metadata.government = user?.government;
        }

        return metadata;
    }

}

export const EditFormUtility = new editFormUtility()