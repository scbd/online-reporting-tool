<template> 
    <div id="linkEditorModal" v-if="modalOpen" 
    class="scbd-common file-upload-editor modal fade show overflow-auto d-block scbd-controls link-editor" tabindex="-1" role="dialog" aria-labelledby="fileUploadEditor" >
        <div class="modal-dialog" role="document" >
            <div class="modal-content">
                <div class="modal-header">     
                    <h3 class="modal-title"><slot name="modalTitle">Uploading File</slot></h3>  
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"  @click="close" >
                    <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">                    
                        
                        <div v-if="isAddingNewFile" >   
                            <div class="alert alert-danger" role="alert" v-if="isUploadingError" >
                                <h4>An error has occured</h4>                              
                            </div>        
                            <km-spinner size="sm" variant="grow" aria-hidden="true" message=" "></km-spinner>
                            <label>Uploading <strong >{{ link.name }}</strong> </label>                                               
                        </div>  
                        <form>
                        
                        <div class="mb-3" >
                            <label for="name" class="col-form-label" >File name</label>
                            <input class="form-control" id="name" v-model="link.name" type="text"  placeholder="example:SCBD website" />
                        </div>
                        <div class="mb-3">
                            <label for="language" class="col-form-label">Language <span class="text-danger"> *</span></label>   
                                <select class="form-select"  name="language" id="language" v-model="link.language"> 
                                <option v-for="(language, key) in languages" :value="key" :key="key">{{ language }}</option> 
                            </select>                 
                        </div>
                        <div class="mb-3" >
                            <label for="tag" class="col-form-label" >Tags</label>
                            <input class="form-control" id="tag" v-model="link.tag" type="text"  placeholder="example: Biodiversity, Aichi target" />
                        </div>
                        </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" :disabled="isAddingNewFile" @click="close" >Cancel</button>
                    <button type="button" class="btn btn-primary  " :disabled="isAddingNewFile||isUploadingError" @click="save" >Save</button>  
                </div>    
            </div>        
        </div>
    </div>     
  </template>
  
  <script setup >
    import { defineEmits, ref, computed } from "vue"; 
    import { languages } from '@/app-data/languages';
    
    //TODO: use km-form-control when its available   
    //TODO: upload file, uploading process bar, error msg , showing file.size 
    
    const modalOpen = ref(false);
    const isAddingNewFile = ref(false);
    const isUploadingError = ref(false);
    const link = ref({});

    const emit = defineEmits(['onClose']);
    const { $api } = useNuxtApp();

    const show = async (linkToEdit, isNew, file, identifier) => {
        modalOpen.value = true;
        const { name, language, tag } = linkToEdit
        if(file){
            isAddingNewFile.value = isNew;
            link.value = { name, language, tag };

            const res = await $api.kmStorage.attachments.uploadTempFile(identifier, file, file.name)
                            .catch(function(error) {
                                uploadErrors.push({file:file.name })
                                useLogger().error(error);
                                throw error;
                            })
                            .finally(()=>{
                                isAddingNewFile.value = false;
                            });
            link.value.url = res?.url
        }
    }
    const close = () => {
        modalOpen.value = false;
        isAddingNewFile.value = false;
        isUploadingError.value = false;
        link.value = {};
        emit("onClose");
    }
    const save = () => {
        const { url, name, language, tag } = link.value;
        modalOpen.value = false;
        emit("onClose", { url,name,language,tag });
    }

    defineExpose({
        show
    })
  </script>
  