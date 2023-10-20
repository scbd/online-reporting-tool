<template>
  <div :id="`${useAttrs().id || 'km-input-lstring-'+uid}`" class="km-input mb-2">   
    <slot></slot>    
    <CInputGroup class="mb-1" v-for="locale in locales" :key="locale" :class="`km-input-${locale}`" >
        <CFormInput aria-describedby="basic-addon2" v-model="binding[locale]" :dir="locale=='ar' ? 'rtl' : 'ltr'" 
            @update:modelValue="emitChange" />
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

<script>
import { makeUid } from '@coreui/utils/src'
import {without} from 'lodash';
import { useThesaurusStore }    from '@/stores/thesaurus';

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
    },
    data() {
        return {
            uid : makeUid()
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
        }
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
    }
};
</script>
