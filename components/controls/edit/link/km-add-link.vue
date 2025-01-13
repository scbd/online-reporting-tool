
<template>
  <button type="button" class="btn btn-primary" @click="addLink()">
    <slot name="link-button-label">+ {{ t('addLink') }} </slot>
  </button>  
  <link-editor ref="linkEditorRef" @on-close="onLinkEditorClose">
    <template v-slot:modalTitle>
      <slot name="link-dialog-title"   >        
        {{ t('editlink') }}       
      </slot>
     </template>       
  </link-editor>
  <slot name="links-view">
    <km-view-links v-model="links"   @on-delete = "removeLink($event)"   @on-edit = "editLink($event)"></km-view-links>  
  </slot>
</template>
<i18n src="@/i18n/dist/components/controls/edit/link/km-add-link.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
  const {t} = useI18n();
  const linkEditorRef= shallowRef(null); 
  let editedLinkIndex = -1;   
  const links = defineModel({type:Array, required:true, default:[]});
  const props = defineProps({
        identifier: { type:String, required:true}
    });
    function addLink() {  
        editLink(-1);
    }      

    function editLink(index) {  
        editedLinkIndex = index;  
        linkEditorRef.value.show(links.value[index] ||{})     
    }

    function removeLink(index) {  
        links.value.splice(index, 1);   
    }

    function onLinkEditorClose(newValue) {    
        if(Object.keys(newValue).length ==0) {// mean cacnel => return              
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
    
</script>
