<template>
    <div class="scbd-common km-view-links">
        <table class="table table-bordered" v-if="links?.length"> 
            <thead class="table-light">
                <tr>
                    <th>{{ t('language') }}  </th>
                    <th>{{ t('url') }}  </th>
                    <th>{{ t('tags') }}  </th>
                    <th v-if="canEdit"></th>
                </tr>
            </thead>
            <tbody>
                <tr  v-for="(item, index) in links" :key="index">  
                    <td  class="align-middle" >
                        <span> {{languages[item.language]}}  </span>    
                    </td>        
                    <td  class="align-middle" >    
                        <a :href="item.url" target="_blank" >
                            {{item.name||item.url}} 
                        </a>
                    </td>   
                    <td  class="align-middle" >                                   
                        <span v-if="item.tag">
                            ({{ item.tag }})
                        </span>            
                    </td>  
                    <td class="text-nowrap text-right align-middle" v-if="canEdit">   
                        <button type="button" class="btn btn-secondary me-1" @click="edit(index)"><font-awesome-icon icon="fa-edit" /> </button>
                        <button type="button" class="btn btn-secondary" @click="remove(index)"><font-awesome-icon icon="fa-trash" /> </button>
                    </td>      
                </tr>             
            </tbody>
        </table> 
    </div>
</template>
<i18n src="@/i18n/dist/components/controls/edit/link/km-view-links.json"></i18n>
<script setup lang="ts">
  import { defineEmits, computed } from 'vue'
  import { languages } from '@/app-data/languages'
    const {t} = useI18n();
    const model = defineProps({
        links   : {type:Array, required:true},
        canEdit : {type:Boolean, default:true}
    });

    const emit = defineEmits(['onDelete','onEdit']);    
 
    const remove = (index) =>{    
        emit("onDelete", index);        
    }

    const edit = (index) =>{    
        emit("onEdit", index);        
    }
</script>