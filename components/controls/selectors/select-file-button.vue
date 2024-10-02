<template>
    <button    
      class="scbd-common select-file-button btn btn-primary"
      type="button"
      :id="$attrs.id"
      @click.prevent.stop="selectFile()">  
      <slot name="default" ></slot>
    </button> 
</template>
  
<script setup>
  const emit = defineEmits(['onFileSelected']);
  const props = defineProps({ 
    multiple: { type: Boolean, require: false, default: false },
    accept: { type: Array, require: false, default: ['*/*'] }
  })  
  
  const selectFile = () =>{   
    const fileInput = document.createElement('input');
   
    fileInput.type = 'file';
    fileInput.style.display = 'none';
  
    if (props.multiple) fileInput.setAttribute('multiple', props.multiple);
    if (props.accept && !props.accept?.includes('*/*')) fileInput.setAttribute('accept', props.accept?.join(', '));
  
    fileInput.addEventListener('click', ($event) => $event.stopPropagation());    
    fileInput.addEventListener('change', ({ target }) => { 
      const files = [...target.files]; 
      if (props.multiple)
        emit('onFileSelected', files);   
      else 
        emit('onFileSelected', files[0]);   
      
    }) 

    fileInput.click();   
  } 
</script>