<template>
    <div class="scbd-common km-link">
        <button type="button" class="btn btn-primary m-2" @click="addLink()" v-if ="props.allowLinks">
            <slot name="link-button-label">+ {{ t('addLink') }}  </slot>
        </button>  
       
        <select-file-button class="m-2" @on-file-selected="receiveFile"  :accept="allowFileTypes"  v-if="props.allowFiles"> 
            <slot name="file-button-label">
                + {{ t('addFiles') }}
            </slot>
        </select-file-button>    
             
       <file-upload-editor ref="fileEditorRef" @on-close="onFileUploadEditorClose"  v-if ="props.allowFiles">
            <template v-slot:modalTitle>
                <slot name="link-dialog-title"   >        
                    {{ t('fileUpload') }}     
                </slot>
            </template>       
        </file-upload-editor>

        <link-editor ref="linkEditorRef" @on-close="onLinkEditorClose" v-if ="props.allowLinks">       
            <template v-slot:modalTitle>
                <slot name="link-dialog-title"   >        
               {{ t('editlink') }}    
                </slot>
            </template>       
        </link-editor>
        <km-view-links :links="links"   @on-delete ="removeLink($event)"   @on-edit="editLink($event)"  v-if ="props.allowLinks || props.allowFiles " ></km-view-links>      
    </div>
</template>
<i18n src="@/i18n/dist/components/controls/edit/link/km-add-link-file.json"></i18n>
<script setup>

    const links = defineModel({type:Array, required:true, default:[]});

    const props = defineProps({
        allowLinks: { type: Boolean, require: false, default: true },
        allowFiles: { type: Boolean, require: false, default: true },
        mineTypes: { type: Array, require: false, default: undefined },    
        multiple: { type: Boolean, require: false, default: false },
        identifier: { type:String, required:true}
    });
    const {t} = useI18n();
    const { $api }         = useNuxtApp();
    const config          = useRuntimeConfig();
    const linkEditorRef   = shallowRef(null);
    let   editedLinkIndex = -1;
    const fileEditorRef   = shallowRef (null);
    let   editedFileIndex = -1;

    const allowFileTypes = computed(()=>{       
        return props.mineTypes || $api.kmStorage.attachments.mimeTypeWhitelist();  
   });  

    function addLink() {  
        editLink(-1);
    }      

    function editLink(index) {  
        if (index ==-1){
            editedLinkIndex = index;  
            linkEditorRef.value.show({});
            return; 
        }   
        if(links.value[index].url.includes(`${config.public.API_URL}/api/2013`,)){              
            // edit file
            editedFileIndex = index;  
            fileEditorRef.value.show(links.value[index] ||{}, false, {})    
        }
        else{
            // edit link
            editedLinkIndex = index;  
            linkEditorRef.value.show(links.value[index] ||{})    
        }
    }

    function removeLink(index) {  
        links.value.splice(index, 1);  
    }

    function onLinkEditorClose(newValue) {   
        if(Object.keys(newValue).length ==0) {     
            return;
        } 
        else{
            if(editedLinkIndex<0) {  
                links.value = [...links.value, newValue]; 
            } 
            else {        
                links.value[editedLinkIndex]=newValue;
            } 
            editedLinkIndex = -1;
        }       
    }
        
    function addFile(file) {        
        editedFileIndex = -1; 
        fileEditorRef.value.show({url:"http://api.cbd.int/api/2013",name:file.name, language:"en", tag:""}, true,file, props.identifier); 
    }      
 
    function onFileUploadEditorClose(newValue) {  
        if(!newValue) {
            return;
        } 
        else{   
            if(editedFileIndex<0) { 
                links.value = [...links.value, newValue];
            } 
            else {        
                links.value[editedFileIndex]=newValue;
            } 
            editedFileIndex = -1;
        }     
        
    }
 
    const receiveFile = (selectedFile) => {  
         addFile(selectedFile);            
    };

</script> 
