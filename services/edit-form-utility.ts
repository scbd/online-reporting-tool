
import { useRealmConfStore }    from '@/stores/realmConf';

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

        return $kmStorageApi.drafts.get(identifier, { info: "" }).then(
            function(success) {
                return success;
            },
            function(error) {
                if (error.status == 404)
                    return $kmStorageApi.documents.get(identifier, { info: "" });
                throw error;
            }).then(
            function(success) {
                var info = success.data;

                if (expectedSchema && info.type!=expectedSchema)
                    throw { data: { error: "Invalid schema type" }, status:"badSchema"};

                var hasDraft = !!info.workingDocumentCreatedOn;
                var securityPromise = hasDraft ? $kmStorageApi.drafts.canUpdate(info.identifier, info.type)
                                                : $kmStorageApi.drafts.canCreate(info.identifier, info.type);

                return securityPromise.then(
                    function(isAllowed) {
                        if (!isAllowed)
                            throw { data: { error: "Not allowed" }, status: "notAuthorized" };

                        var documentPromise = hasDraft ? $kmStorageApi.drafts.get(identifier)
                                                        : $kmStorageApi.documents.get(identifier);

                        return documentPromise.then(success=>success.data);
                    });
            });
    }

    //==================================
    //
    //==================================
    async draftExists(identifier) {

        const { $api } = useNuxtApp();
        const $kmStorageApi = $api.kmStorage
        
        const { data, error} = await $kmStorageApi.drafts.get(identifier, { info: "" })
        if(!error.value)
            return true;
        
        if (error.value?.statusCode == 404)
                return false;

        throw error;
        
    }

    //==================================
    //
    //==================================
    saveDraft(document) {

        const { $api } = useNuxtApp();
        const $kmStorageApi = $api.kmStorage
        
        const identifier = document.header.identifier;
        const metadata   = this.getDocumentMetadata(document);

        return this.draftExists(identifier).then(
            function(hasDraft) {

                var securityPromise = hasDraft ? $kmStorageApi.drafts.canUpdate(identifier, { metadata })
                                               : $kmStorageApi.drafts.canCreate(identifier, { metadata });

                return securityPromise.then(
                    function({data, error}) {
                        if(error.value)
                            throw error;

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
            if (error.status == 404)
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
        var metadata   = {};

        if (document.government)
            metadata.government = document.government.identifier;

        // Check if document exists

        return this.documentExists(identifier).then(function(exists) {

            // Check user security on document

            var qCanWrite = exists ? $kmStorageApi.documents.canUpdate(identifier, schema, metadata)
                                    : $kmStorageApi.documents.canCreate(identifier, schema, metadata);

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
        var metadata   = {};

        if (document.government)
            metadata.government = document.government.identifier;

        // Check if doc & draft exists

        return this.draftExists(identifier).then(function(exists) {

            // Check user security on drafts

            var qCanWrite = exists ? $kmStorageApi.drafts.canUpdate(identifier, schema, metadata)
                                    : $kmStorageApi.drafts.canCreate(identifier, schema, metadata);

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

		return workflows.create(type.name, type.version, workflowData); // return workflow info
	}

    private getDocumentMetadata(document:any){

        const realmConfStore  = useRealmConfStore();
        const realmConf = realmConfStore.realmConf;

        const metadata   = {
            "schema": document.header.schema,
            "realm": realmConf.realm
        };

        if (document.government)
            metadata.government = document.government.identifier;

        return metadata;
    }

}

export const EditFormUtility = new editFormUtility()