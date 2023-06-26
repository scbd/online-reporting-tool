<template>
  <div>{{ locales.indexOf(activeLocale) }} {{ locales }} {{ activeLocale }}
    <CTabs variant="tabs" :active-tab="locales.indexOf(activeLocale)" id="lstringTabs"  :fade="true"  @click.native="onTabActivate">
      <CTab :title="locale.toUpperCase()" v-for="locale in locales" :key="locale" :id="`lstringTab_${locale}`" >     
        {{ locale }}         
        <ckeditor
          editor="classic"
          tag-name="textarea"
          v-model="binding[activeLocale]"
          :editor="editor"
          :config="config"
          :tagName="tagName"
          :disabled="disabled"        
          @ready="onEditorReady"
          @focus="onEditorFocus"
          @blur="onEditorBlur"
          @input="onEditorInput"
          @destroy="onEditorDestroy"
        ></ckeditor>
        <p style="border: 1px solid #eee; border-top: none">
          Attach files by dragging & dropping or pasting from clipboard
          <span class="float-right" id="wordCountSec" style="padding-right: 5px">
            <strong>Word count: {{ wordCount }}</strong></span
          >
        </p>
      </CTab>
    </CTabs>    
  </div>
</template>

<script>
import { removeEmpty } from '@/util';
import $ from 'jquery';

let InlineEditor;
let CKEditor;

if (process.client) {
  // InlineEditor = require("@scbd/ckeditor5-build-inline-full/build/ckeditor.js");
    InlineEditor = require('@ckeditor/ckeditor5-build-classic')
  CKEditor = require("@ckeditor/ckeditor5-vue2");
} else {
  CKEditor = { component: { template: "<div></div>" } };
}


export default {
  name: "KmRichLstring",
  components: {
    ckeditor: CKEditor.component
  },
  props: {
    locales: {
      type: Array,
      required: true,
    },
    value: {
      type: Object,
      required: false,
      default(){
        return {}
      }
    },
    tagName: {
      type: String,
      required: false,
      default: "div",
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    config: {
      type: Object,
      required: false,
      default: function () {
        const self = this;
        return {
          toolbar: [
            "heading",
            "fontSize",
            "fontColor",
            "|",
            "bold",
            "italic",
            "link",
            "|",
            "indent",
            "outdent",
            "alignment",
            "|",
            "bulletedList",
            "numberedList",
            "blockQuote",
            "|",
            "highlight",
            "insertTable",
            "|",
            "imageInsert",
            "mediaEmbed",
            "|",
            "horizontalLine",
            "|",
            "removeFormat",
            "undo",
            "redo",
            "|",
            "pageBreak",
            "brBreak",
          ],
          alignment: {
            options: ["left", "right", "center", "justify"],
          },
          highlight: {
            options: [
              {
                model: "greenMarker",
                class: "marker-green",
                title: "Green marker",
                color: "var(--ck-highlight-marker-green)",
                type: "marker",
              },
              {
                model: "redPen",
                class: "pen-red",
                title: "Red pen",
                color: "var(--ck-highlight-pen-red)",
                type: "pen",
              },
            ],
          },
          fontColor: {
            colors: [
              {
                color: "hsl(0, 0%, 0%)",
                label: "Black",
              },
              {
                color: "hsl(0, 0%, 30%)",
                label: "Dim grey",
              },
              {
                color: "hsl(0, 0%, 60%)",
                label: "Grey",
              },
              {
                color: "hsl(0, 0%, 90%)",
                label: "Light grey",
              },
              {
                color: "hsl(0, 0%, 100%)",
                label: "White",
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
            styles: ["alignCenter", "alignLeft", "alignRight"],
            resizeOptions: [
              { name: "imageResize:original", label: "Original", value: null },
              { name: "imageResize:25", label: "25%", value: "25" },
              { name: "imageResize:50", label: "50%", value: "50" },
              { name: "imageResize:75", label: "75%", value: "75" },
            ],
            toolbar: [
              "imageTextAlternative",
              "toggleImageCaption",
              "|",
              "imageStyle:inline",
              "imageStyle:wrapText",
              "imageStyle:breakText",
              "imageStyle:side",
              "|",
              "resizeImage",
            ],
            insert: {
              integrations: ["insertImageViaUrl"],
            },
          },
          heading: {
            options: [
              {
                model: "paragraph",
                title: "Paragraph",
                class: "ck-heading_paragraph",
              },
              {
                model: "heading1",
                view: "h1",
                title: "Heading 1",
                class: "ck-heading_heading1",
              },
              {
                model: "heading2",
                view: "h2",
                title: "Heading 2",
                class: "ck-heading_heading2",
              },
              {
                model: "heading3",
                view: "h3",
                title: "Heading 3",
                class: "ck-heading_heading3",
              },
            ],
          },
          fontSize: {
            options: [8, 10, 12, 14, "default", 18, 20, 22],
            supportAllValues: true,
          },
          table: {
            contentToolbar: [
              "tableColumn",
              "tableRow",
              "mergeTableCells",
              "tableProperties",
              "tableCellProperties",
              "toggleTableCaption",
            ],
          },
          link: {
            addTargetToExternalLinks: false,
            defaultProtocol: "https://",
            decorators: [
              {
                mode: "manual",
                label: "Downloadable",
                attributes: {
                  download: "download",
                },
              },
              {
                mode: "manual",
                label: "Open in a new tab",
                attributes: {
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
              },
            ],
          },
          wordCount: {
            onUpdate: function (stats) {
              console.log(stats)
              self.wordCount = stats.words;
            },
          },
          mediaEmbed: {
            previewsInData: false,
            removeProviders: ["youtube"],
            extraProviders: [
              {
                name: "youtubePlaylist",
                url: [/^youtube\.com\/embed\/videoseries\?list=([\w-]+)/],
                html: (match) => {
                  const id = match[1];

                  return (
                    '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">' +
                    `<iframe src="https://www.youtube.com/embed/videoseries?list=${id}" ` +
                    'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
                    'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                    "</iframe>" +
                    "</div>"
                  );
                },
              },
              {
                name: "youtube",
                url: [
                  /^(?:m\.)?youtube\.com\/watch\?v=([\w-]+)/,
                  /^(?:m\.)?youtube\.com\/v\/([\w-]+)/,
                  /^youtube\.com\/embed\/([\w-]+)/,
                  /^youtu\.be\/([\w-]+)/,
                ],
                html: (match) => {
                  const id = match[1];

                  return (
                    '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">' +
                    `<iframe src="https://www.youtube.com/embed/${id}" ` +
                    'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
                    'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                    "</iframe>" +
                    "</div>"
                  );
                },
              },
              {
                name: "customEmbed",
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
                    "</a>" +
                    "	</oembed>" +
                    "</figure>"
                  );
                },
              },
            ],
          },
        };
      },
    },
  },
  data() {
    return {
      activeLocale : '',
      wordCount: 0,
      editor: InlineEditor,
      binding : {}
    };
  },
  watch:{
    locales : function(newVal){
      if(!newVal.includes(this.activeLocale)){
        this.activeLocale = newVal[0];
        
          this.$el.querySelector(`#lstringTab_${this.activeLocale}`)?.click()
      }
      console.log(this.activeLocale)
    }
  },
  computed:{
    userLocales : function(){
      return this.locales
    }
  },
  methods: {
    onEditorReady(ed) {
      // const self = this;

      // ed.plugins.get('FileRepository').createUploadAdapter = function(loader){
      // 	// var uploadAdapter = new UploadAdapter(loader);
      // 	// uploadAdapter.loader.on('change:uploaded' , onEditorImageUploaded);
      // 	// return uploadAdapter;
      // };

      ed.editing.view.document.on("paste", function (eventInfo, data) {
        // console.log('paste', eventInfo, data)
      });

      ed.editing.view.document.on("drop", function (eventInfo, data) {
        // if(data.dataTransfer){
        // 	self.isUploadingFile[lang] = true;
        // 	var fileUploads = _.map(data.dataTransfer.files, function(file, i){
        // 		var formData = new FormData();
        // 		var file = data.dataTransfer.files[i];
        // 		var fileType = file.type.substring( 0, 5 );
        // 		var mimeType = storage.attachments.getMimeType(file);
        // 		if(fileType == "image")
        // 			return;
        // 		if (storage.attachments.mimeTypeWhitelist.indexOf(mimeType) < 0) {
        // 			alert("File type not supported: " + mimeType + "(" + file.name + ")");
        // 			return;
        // 		}
        // 		formData.append('file', file);
        // 		return $http.post('/api/v2015/temporary-files', formData, {
        // 			headers: {'Content-Type': undefined}
        // 		})
        // 		.then(function(success) {
        // 			var viewFragment = ed.data.processor.toView('&nbsp;<a target="_blank" href="'+success.data.url+'">'+success.data.metadata.fileName+ '</a>' );
        // 			var modelFragment = ed.data.toModel(viewFragment);
        // 			ed.model.insertContent( modelFragment);
        // 			self.onFileUpload({data:success.data});
        // 		})
        // 	});
        // 	$q.all(fileUploads)
        // 	.finally(function(){
        // 		self.isUploadingFile[lang] = false
        // 	});
        // }
      });

      // ed.model.document.on("change:data", function (eventInfo, data) {
      //   // var binding = angular.copy(self.binding||{});
      //   // binding[lang] = ed.getData();
      //   // self.binding = binding;
      // });

      // function onEditorImageUploaded(eventInfo, name, value, oldValue){
      // 	if(value.url){
      // 		self.onFileUpload({data:value})
      // 	}
      // }
    },
    onTabActivate(event){
      const locale = event.target?.innerText?.toLowerCase();      
      if(this.locales.includes(locale)){
        this.activeLocale = locale;
        // this.binding[locale] = this.binding[locale] || '';
      }
      console.log(this.activeLocale, locale)
    },
    onEditorFocus( event, editor ) {
      // console.log( 'Editor focused.', { event, editor } );
    },
    onEditorBlur( event, editor ) {
      // console.log( 'Editor blurred.', { event, editor } );
    },
    onEditorInput( data, event, editor ) {
      // console.log( 'Editor data input.', this.value, this.binding );
      const newValue = removeEmpty(this.binding||{})
      this.$set(this.value, newValue);
      this.$emit('input', newValue)
    },
    onEditorDestroy( editor ) {
      // console.log( 'Editor destroyed.', { editor } );
    }
  },
  mounted(){
    // console.log('mounted', this.value, this.binding)
    this.activeLocale = this.locales[0];
    if(this.value){
      this.binding = {...this.value||{}};
    }
  }
};
</script>
<style>
@import url(https://cdn.jsdelivr.net/npm/@scbd/ckeditor5-build-inline-full@35.0.0/build/ckeditor.css);

.ck.ck-balloon-panel.ck-balloon-panel_visible {
  /* stylelint-disable-line */
  z-index: 10000 !important;
}
</style>


// class UploadAdapter {
  // 	constructor(loader) {
  // 		this.loader = loader;
  // 	}
  // 	upload() {
  // 		var loader = this.loader;
  // 		return this.loader.file.then(function(file){
  
  // 			var data = new FormData();
  // 			data.append('file', file);
  
  // 			return $http.post('/api/v2015/temporary-files', data, {
  // 				headers: {'Content-Type': undefined}
  // 			})
  // 			.then(function(success) {
  // 				loader.uploaded = success.data;
  // 				return success.data;
  // 			})
  // 			.catch(function(error) {
  // 				console.log(error);
  // 				throw error;
  // 			});
  
  // 		})
  // 	}
  // 	abort() {
  // 	}
  // }