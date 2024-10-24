<template>    
    <div class="scbd-common km-add-file" >
        <select-file-button  @on-file-selected="receiveFile"> <slot name="file-button-label">+ {{ t('addFiles') }} </slot></select-file-button> 
              
        <file-upload-editor ref="fileEditorRef" @on-close="onFileUploadEditorClose">
            <template v-slot:modalTitle>
            <slot name="link-dialog-title"   >        
                {{ t('fileUpload') }}   
            </slot>
            </template>       
        </file-upload-editor>
        <slot name="links-view">
            <km-view-links v-model="links"   @on-delete = "removeLink"   @on-edit = "editLink"></km-view-links>  
        </slot>
    </div>
</template>
<i18n src="@/i18n/dist/components/controls/edit/link/km-add-file.json"></i18n>
<script setup lang="ts">  
 const {t} = useI18n();
    const links = defineModel({type:Array, required:true, default:[]});
    const props = defineProps({
        multiple: { type: Boolean, require: false, default: false },
        identifier: { type:String, required:true}
    });

    const config          = useRuntimeConfig();
    const fileEditorRef   = shallowRef (null);
    let   editedLinkIndex = -1;
    
    function addLink(file) {        
        editedLinkIndex = -1; 
        fileEditorRef.value.show({url:`${config.public.API_URL}/api/2013`,name:file.name, language:"en", tag:""}, true,file, identifier); 
    }      
    function editLink(index) {         
        editedLinkIndex = index;  
        fileEditorRef.value.show(links.value[index] ||{}, false, {})     
    }
    function removeLink(index) {  
        links.value.splice(index, 1);   
    }
    function onFileUploadEditorClose(newValue) {         
     
        if(!newValue) {// mean cacnel => return  
            return;
        } 
        else{   
            if(editedLinkIndex<0) { 
                links.value.push(newValue);
            } 
            else {        
                links.value[editedLinkIndex]=newValue;
            } 
            editedLinkIndex = -1;
        }       
    }

 
    const receiveFile = (selectedFile) => {  
         addLink(selectedFile);            
    };


</script> 
 