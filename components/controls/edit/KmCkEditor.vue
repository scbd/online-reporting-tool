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
      Attach files by dragging & dropping or pasting from clipboard
      <span class="float-end" id="wordCountSec" style="padding-right: 5px">
        <strong>Word count: {{ wordCount }}</strong></span
      >
    </p>
  </div>
</template>

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
      editorConfig : undefined
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
          var loader = this.loader;
          return this.loader.file.then(function(file){

            var data = new FormData();
            data.append('file', file);

            return self.$api.kmStorage.attachments
            //.upload(self.identifier, file, { headers: {'Content-Type': undefined}})
            .uploadTempFile(data, { headers: {'Content-Type': undefined}})
                        .then(function(success) {
                            success.urls = success.urls || [success.url];
                            loader.uploaded = success;
                            return success;
                        })
                        .catch(function(error) {
                            console.error(error);
                            throw error;
                        });
          })
        }
        abort() {
        }
      }
      ed.plugins.get('FileRepository').createUploadAdapter = function(loader){
      	var uploadAdapter = new UploadAdapter(loader);
      	uploadAdapter.loader.on('change:uploaded' , onEditorImageUploaded);
      	return uploadAdapter;
      };

      ed.editing.view.document.on('paste', function (eventInfo, data) {
        // console.debug('paste', eventInfo, data)
      })

      ed.editing.view.document.on('drop', async function (eventInfo, data) {
        console.debug('drop', eventInfo, data)
        if(data.dataTransfer){
        	self.isUploadingFile = true;
        	var fileUploads = data.dataTransfer.files.map(function(file, i){
        		var formData = new FormData();
        		var file = data.dataTransfer.files[i];
        		var fileType = file.type.substring( 0, 5 );
        		var mimeType = self.$api.kmStorage.attachments.getMimeType(file);

        		if(fileType == "image")
        			return;
        		if (self.$api.kmStorage.attachments.mimeTypeWhitelist().indexOf(mimeType) < 0) {
        			alert("File type not supported: " + mimeType + "(" + file.name + ")");
        			return;
        		}

        		formData.append('file', file);

        		return self.$api.kmStorage.attachments.uploadTempFile(formData, { headers: {'Content-Type': undefined}})
                    .then(function(success) {
                                            
                        var viewFragment = ed.data.processor.toView('<span class="me-2">&nbsp;<a rel="noopener noreferrer" target="_blank" href="'+success.url+'">'+success.metadata.fileName+ '</a>&nbsp;</span>' );
                        var modelFragment = ed.data.toModel(viewFragment);
                        ed.model.insertContent( modelFragment);
                        self.onFileUpload({data:success.data});
                    })
        	});

          try{
        	  await Promise.all(fileUploads)
          }
          catch(e){
            console.debug(e)
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
        console.log((eventInfo, name, value, oldValue))
        //TODO: check why url is not in event args
      	// if(value.url){
      	// 	self.onFileUpload({data:value})
      	// }
      }
    },
    onEditorFocus( event, editor ) {
      // console.debug( 'Editor focused.', { event, editor } );
    },
    onEditorBlur( event, editor ) {
      // console.debug( 'Editor blurred.', { event, editor } );
    },
    onEditorInput( data, event, editor ) {            
    },
    onEditorDestroy( editor ) {
      // console.debug( 'Editor destroyed.', { editor } );
    },
    onFileUpload(params){
    //   console.debug('file uploaded', params)
    },
    getEditorConfig(){
        const self = this;
        return {        
            language: {
            ui: this.locale,
            content: this.locale
            },          
            toolbar: [
            'heading',
            'fontSize',
            'fontColor',
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
            'mediaEmbed',
            '|',
            'horizontalLine',
            '|',
            'removeFormat',
            'undo',
            'redo',
            '|',
            'pageBreak'
            ],
            alignment: {
            options: ['left', 'right', 'center', 'justify'],
            },
            highlight: {
            options: [
                {
                model: 'greenMarker',
                class: 'marker-green',
                title: 'Green marker',
                color: 'var(--ck-highlight-marker-green)',
                type: 'marker',
                },
                {
                model: 'redPen',
                class: 'pen-red',
                title: 'Red pen',
                color: 'var(--ck-highlight-pen-red)',
                type: 'pen',
                },
            ],
            },
            fontColor: {
            colors: [
                {
                color: 'hsl(0, 0%, 0%)',
                label: 'Black',
                },
                {
                color: 'hsl(0, 0%, 30%)',
                label: 'Dim grey',
                },
                {
                color: 'hsl(0, 0%, 60%)',
                label: 'Grey',
                },
                {
                color: 'hsl(0, 0%, 90%)',
                label: 'Light grey',
                },
                {
                color: 'hsl(0, 0%, 100%)',
                label: 'White',
                hasBorder: true,
                },
            ],
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
            },
            },
            mediaEmbed: {
            previewsInData: false,
            removeProviders: ['youtube'],
            extraProviders: [
                {
                name: 'youtubePlaylist',
                url: [/^youtube\.com\/embed\/videoseries\?list=([\w-]+)/],
                html: (match) => {
                    const id = match[1]

                    return (
                    '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">' +
                    `<iframe src="https://www.youtube.com/embed/videoseries?list=${id}" ` +
                    'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
                    'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                    '</iframe>' +
                    '</div>'
                    )
                },
                },
                {
                name: 'youtube',
                url: [
                    /^(?:m\.)?youtube\.com\/watch\?v=([\w-]+)/,
                    /^(?:m\.)?youtube\.com\/v\/([\w-]+)/,
                    /^youtube\.com\/embed\/([\w-]+)/,
                    /^youtu\.be\/([\w-]+)/,
                ],
                html: (match) => {
                    const id = match[1]

                    return (
                    '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">' +
                    `<iframe src="https://www.youtube.com/embed/${id}" ` +
                    'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
                    'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                    '</iframe>' +
                    '</div>'
                    )
                },
                },
                {
                name: 'customEmbed',
                url: [
                    /cdn\.knightlab\.com\/libs\/timeline3\/.*/,
                    /uploads\.knightlab\.com\/storymapjs\/.*/,
                    /cdn\.knightlab\.com\/libs\/juxtapose\/.*/,
                    /uploads\.knightlab\.com\/scenevr\/.*/,
                    /cdn\.knightlab\.com\/libs\/storyline\/.*/,
                    /theydrawit\.mucollective\.co\/vis\/.*/,
                    /youtube\.com\/embed\/videoseries.*/,
                ],
                html: function (id) {
                    return (
                    '<figure class="media">' +
                    '	<oembed url="' +
                    id.input +
                    '">' +
                    '<a href="' +
                    id.input +
                    '">' +
                    id.input +
                    '</a>' +
                    '	</oembed>' +
                    '</figure>'
                    )
                },
                },
            ],
            },
        }
    }
  },
  computed:{
    binding: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
        this.$emit('onChange', value);
      }
    }
  },
  mounted(){
    this.editorConfig = {
        ...this.getEditorConfig(),
        ...this.config
    }    
  }
}
</script>
<style>

.ck.ck-balloon-panel.ck-balloon-panel_visible {
  /* stylelint-disable-line */
  z-index: 10000 !important;
}
</style>
