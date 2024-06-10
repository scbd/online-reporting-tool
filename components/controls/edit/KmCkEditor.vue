<template>
  <div>
    <div style="border: 1px solid #eee" v-if="editorConfig" class="vld-parent">
        <overlay-loading :active="isUploadingFile" 
        :can-cancel="false" background-color="rgb(9 9 9)"
        :is-full-page="false">
        <km-spinner size="lg" 
            :message="t('uploadingFile')"></km-spinner>
    </overlay-loading>

        <ckeditor
          tag-name="textarea"
          v-model="binding"
          :editor="editor"
          :config="editorConfig"
          :tagName="tagName"
          :disabled="disabled"        
          @ready="onEditorReady"
          @focus="onEditorFocus"
          @blur="onEditorBlur"
          @input="onEditorInput"
          @destroy="onEditorDestroy"
        ></ckeditor>
    </div>
    <p style="border: 1px solid #eee; border-top: none">
      {{ t('attachmentMessage') }}
      <span class="float-end" id="wordCountSec" style="padding-right: 5px">
        <strong>{{ t('wordCount') }}: {{ wordCount }}</strong></span
      >
    </p>
    <p style="border: 1px solid #eee; border-top: none" v-if="uploadErrors.length">
        <CAlert class="m-2" color="danger" dismissible @close="() => { uploadErrors = [] }">
            {{ t('uploadError') }} 
            <ul><li v-for="error in uploadErrors" :key="error">{{ error.file }}</li></ul>
        </CAlert>
    </p>
  </div>
</template>
<i18n src="@/i18n/dist/components/controls/edit/KmCkEditor.json"></i18n>
<script>

import '@/libs/ckeditor/build/ckeditor.js'//'@ckeditor/ckeditor5-build-classic'
import CKEditor     from '@ckeditor/ckeditor5-vue';
import OverlayLoading from 'vue3-loading-overlay';
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
import KmSpinner from '../KmSpinner.vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'KmCkEditor',
  components: {
    ckeditor: CKEditor.component,
    OverlayLoading,
    KmSpinner
  },
  props: {
    modelValue: {
      type: String,
      required: true,
      default:''
    },
    tagName: {
      type: String,
      required: false,
      default: 'div',
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    uploadUrl: {
      type: String,
      required: false,
    },
    locale: {
      type: String,
      required: false,
      default: 'en',
    },
    config: {
      type: Object,
      required: false,
      default: function () {},
    },
    identifier: {
      type: String,
      required: true,
    },
  },
  setup(){
    const  { t } = useI18n();

    return {
        t
    }
  },
  data() {
    return {
      wordCount: 0,
      editor: window.ClassicEditor,
      isUploadingFile:false,
      editorConfig : undefined,
      uploadErrors : []
    }
  },  
  methods: {
    onEditorReady(ed) {
      const self = this;
        
      class UploadAdapter {
        constructor(loader) {
          this.loader = loader;
        }
        upload() {
          const loader = this.loader;
          return this.loader.file.then(function(file){
            
            self.isUploadingFile = true;
            return self.$api.kmStorage.attachments.uploadTempFile(self.identifier, file, file.name)
                .then(function(success) {
                    //required by ckeditor
                    success.urls = {
                        "default": success.url 
                    }
                    loader.uploaded = success;
                    return success;
                })
                .catch(function(error) {
                    self.uploadErrors.push({file:file.name })
                    useLogger().error(error);
                    throw error;
                })
                .finally(()=>{
                    self.isUploadingFile = false;
                });
          })
        }
        abort() {
        }
      }
      ed.plugins.get('FileRepository').createUploadAdapter = function(loader){
      	const uploadAdapter = new UploadAdapter(loader);
      	uploadAdapter.loader.on('change:uploaded' , onEditorImageUploaded);
      	return uploadAdapter;
      };

      ed.editing.view.document.on('paste', function (eventInfo, data) {
        // console.debug('paste', eventInfo, data)
      })

      ed.editing.view.document.on('drop', async function (eventInfo, data) {
        if(data.dataTransfer){
        	self.isUploadingFile = true;

        	const fileUploads = data.dataTransfer.files.map(function(file, i){
        		const formData = new FormData();
        		const fileType = file.type.substring( 0, 5 );
        		const mimeType = self.$api.kmStorage.attachments.getMimeType(file);

        		if(fileType == "image")
        			return;
        		if (self.$api.kmStorage.attachments.mimeTypeWhitelist().indexOf(mimeType) < 0) {
        			alert("File type not supported: " + mimeType + "(" + file.name + ")");
        			return;
        		}

        		formData.append('file', file);
        		return self.$api.kmStorage.attachments.uploadTempFile(self.identifier, file, file.name)
                    .then(function(success) {
                        const viewFragment = ed.data.processor.toView('<span class="me-2">&nbsp;<a rel="noopener noreferrer" target="_blank" href="'+success.url+'">'+success.filename+ '</a>&nbsp;</span>' );
                        const modelFragment = ed.data.toModel(viewFragment);
                        ed.model.insertContent( modelFragment);
                        self.onFileUpload({file:success});
                    })
                    .catch(e=>{
                        self.uploadErrors.push({file:file.name })
                        useLogger().error(e)
                    })
        	});

            try{
                await Promise.all(fileUploads)
            }
            catch(e){
                useLogger().error(e)
            }
        	finally{
        		self.isUploadingFile = false
        	};
        }
      })

      ed.model.document.on('change:data', function (eventInfo, data) {
        // console.debug('change', eventInfo, data)
      })

      function onEditorImageUploaded(eventInfo, name, value, oldValue){
        // console.log((eventInfo, name, value, oldValue))
        //TODO: check why url is not in event args
      	if(value.url){
      		self.onFileUpload({file:value})
      	}
      }

      this.$emit('onEditorReady', ed);
    },
    onEditorFocus( event, editor ) {
      // console.debug( 'Editor focused.', { event, editor } );
        this.$emit('onEditorFocus', event, editor);
    },
    onEditorBlur( event, editor ) {
      // console.debug( 'Editor blurred.', { event, editor } );
        this.$emit('onEditorBlur', event, editor);
    },
    onEditorInput( data, event, editor ) {       
        this.$emit('onEditorInput', event, editor);     
    },
    onEditorDestroy( editor ) {
    //   console.debug( 'Editor destroyed.', { editor } );
        this.$emit('onEditorDestroy', editor);
    },
    onFileUpload(params){
        this.$emit('onFileUpload', params);
    },
    getEditorConfig(){
        const self = this;
        return { 
            removePlugins: ["MediaEmbedToolbar"],       
            language: {
            ui: this.locale,
            content: this.locale
            },          
            toolbar:{ 
                items: [
                'heading',
                'fontSize',
                '|',
                'bold',
                'italic',
                'link',
                '|',
                'indent',
                'outdent',
                'alignment',
                '|',
                'bulletedList',
                'numberedList',
                'blockQuote',
                '|',
                'highlight',
                'insertTable',
                '|',
                'imageInsert',
                '|',
                'horizontalLine',
                '|',
                'removeFormat',
                'undo',
                'redo',
                '|',
                'pageBreak'
                ],
                shouldNotGroupWhenFull: true
            },
            alignment: {
            options: ['left', 'right', 'center', 'justify'],
            },
            list: {
                properties: {
                    styles: true,
                    startIndex: true,
                    reversed: true,
                },
            },
            image: {
            styles: ['alignCenter', 'alignLeft', 'alignRight'],
            resizeOptions: [
                { name: 'imageResize:original', label: 'Original', value: null },
                { name: 'imageResize:25', label: '25%', value: '25' },
                { name: 'imageResize:50', label: '50%', value: '50' },
                { name: 'imageResize:75', label: '75%', value: '75' },
            ],
            toolbar: [
                'imageTextAlternative',
                'toggleImageCaption',
                '|',
                'imageStyle:inline',
                'imageStyle:wrapText',
                'imageStyle:breakText',
                'imageStyle:side',
                '|',
                'resizeImage',
            ],
            insert: {
                integrations: ['insertImageViaUrl'],
            },
            },
            heading: {
            options: [
                {
                model: 'paragraph',
                title: 'Paragraph',
                class: 'ck-heading_paragraph',
                },
                {
                model: 'heading1',
                view: 'h1',
                title: 'Heading 1',
                class: 'ck-heading_heading1',
                },
                {
                model: 'heading2',
                view: 'h2',
                title: 'Heading 2',
                class: 'ck-heading_heading2',
                },
                {
                model: 'heading3',
                view: 'h3',
                title: 'Heading 3',
                class: 'ck-heading_heading3',
                },
            ],
            },
            fontSize: {
            options: [8, 10, 12, 14, 'default', 18, 20, 22],
            supportAllValues: true,
            },
            table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells',
                'tableProperties',
                'tableCellProperties',
                'toggleTableCaption',
            ],
            },
            link: {
            addTargetToExternalLinks: false,
            defaultProtocol: 'https://',
            decorators: [
                {
                mode: 'manual',
                label: 'Downloadable',
                attributes: {
                    download: 'download',
                },
                },
                {
                mode: 'manual',
                label: 'Open in a new tab',
                attributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
                },
            ],
            },
            wordCount: {
                onUpdate: function(stats){
                    // console.log(stats)
                    self.wordCount = stats.words
                    self.$emit('onWordCountChange', stats.words);
                },
            }
        }
    },
  },
  computed:{
    binding: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  mounted(){
    this.editorConfig = {
        ...this.getEditorConfig(),
        ...this.config
    }    
  },
  emits:['update:modelValue','onEditorReady', 'onEditorFocus', 'onEditorBlur', 'onEditorInput', 
        'onFileUpload', 'onEditorDestroy', 'onWordCountChange']
}
</script>
<style>

.ck.ck-balloon-panel.ck-balloon-panel_visible {
  /* stylelint-disable-line */
  z-index: 10000 !important;
}
</style>
