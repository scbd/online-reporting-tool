<template>
  <div :id="`${useAttrs().id || 'km-input-lstring-'+uid}`" class="km-input mb-2">   
    <slot></slot>    
    <CInputGroup class="mb-1" v-for="locale in locales" :key="locale" :class="`km-input-${locale}`" >
        <CFormInput aria-describedby="basic-addon2" v-model="binding[locale]" :dir="locale=='ar' ? 'rtl' : 'ltr'" 
            @update:modelValue="emitChange" v-if="!isTextArea"  />
        <CFormTextarea aria-describedby="basic-addon2" v-model="binding[locale]" :dir="locale=='ar' ? 'rtl' : 'ltr'" 
            @update:modelValue="emitChange" v-if="isTextArea"  />
            
        <CInputGroupText id="basic-addon2">
            <CTooltip :content="lstring(getTerm(locale).title)" trigger="hover">
                <template #toggler="{ on }">
                    <span v-on="on">{{locale.toUpperCase()}}</span>
                </template>
            </CTooltip>
        </CInputGroupText>
    </CInputGroup>    
  </div>
</template>

<script lang="ts">
//@ts-nocheck
import {without} from 'lodash';
import { useThesaurusStore }    from '@/stores/thesaurus';
import { CFormTextarea } from '@coreui/vue';

export default {
    name: "KmInputLstring",
    components: {
    },
    props: {
        locales: {
            type: Array,
            required: true,
        },
        modelValue: {
            type: Object,
            required: false,
            default(){
                return {}
            }
        },
        disabled: {
            type: Boolean,
            required: false,
        },
        rows: {
            type: Number,
            required: false,
            default(){
                return 1
            }
        },
    },
    data() {
        return {
            uid : useGenerateUUID()
        };
    },
    watch:{
        locales : function(newVal, oldVal){
            const deleted = without(oldVal, ...newVal)
            if(deleted?.length){      
                deleted.forEach(e=>{
                    this.binding[e] = undefined;
                })
                this.emitChange();
            }
            this.loadLanguages();
        }
    },
    computed:{
        userLocales : {
            get(){
                return this.locales
            }
        },
        binding: {
            get() {
                return this.modelValue||{};
            },
            set(value) {
                this.emitChange();
            }
        },
        isTextArea(){
            return this.rows > 1;
        },
    },
    methods: { 

        emitChange(value){
            this.$emit('update:modelValue', this.binding);
        },

        loadLanguages(){
            const thesaurusStore    = useThesaurusStore ();
            this.locales?.forEach(e=>{
                thesaurusStore.loadTerm(`lang-${e}`);
            });            
        },

        getTerm(term){

            const thesaurusStore    = useThesaurusStore ();
            return thesaurusStore.getTerm(`lang-${term}`)||{};
        }

    },
    mounted(){        
        this.binding = {...this.modelValue||{}};
        this.loadLanguages();
    },
    emits:['update:modelValue']
};
</script>
