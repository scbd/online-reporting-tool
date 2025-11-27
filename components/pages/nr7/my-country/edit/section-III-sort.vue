<template>
    <span>
        <button type="button" class="ms-1 btn btn-primary btn-sm text-decoration-none float-end" @click="openSortModal">
            <font-awesome-icon icon="fa fa-arrow-up-a-z"></font-awesome-icon>
            <slot name="sortTitle" >
                {{ t('sortButton') }}
            </slot>
        </button>
        <CModal class="show d-block" size="xl" :scrollable="true" alignment="center" 
            :visible="showSortModal"  @close="closeDialog" backdrop="static">
            <CModalHeader>
                <CModalTitle>{{t('dialogTitle')}}</CModalTitle>
            </CModalHeader>
            <CModalBody> 
                <div class="row">
                    <div class="col-12">
                        <div class="alert alert-info">
                            Use your cursor to drag and drop the national targets to reorder them as desired.
                        </div>
                        <button type="button" class="btn btn-primary float-end mb-1"  @click="sortByTitle()">
                            <font-awesome-icon :icon="sortOrder ? 'fa fa-arrow-down-a-z' : 'fa fa-arrow-up-z-a'"></font-awesome-icon>
                            {{ t('sortByTitle') }}
                        </button>
                    </div>
                </div>
                <draggable
                    class="list-group"
                    
                    v-model="nationalTargetList"
                    v-bind="dragOptions"
                    item-key="order"
                    @start="isDragging = true"
                    @end="isDragging = false"
                >
                    <template #item="{ element, index }">
                    <li class="list-group-item drag-item" key="element.order">
                        <strong>{{index + 1}}</strong>.
                        <font-awesome-icon icon="fa fa-bars"></font-awesome-icon>
                        {{ element.title }}
                    </li>
                    </template>
                </draggable>
                
            </CModalBody>
            <CModalFooter>
                <button type="button" class="btn btn-secondary float-end" 
                    @click="closeDialog()">{{ t('cancel') }}</button>
                <button type="button" class="btn btn-primary float-start" v-if="sortedList?.length"
                    @click="applySorting()" >{{ t('apply') }}
                </button>
            </CModalFooter>
        </CModal>
    </span>
</template>

<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/section-III-sort.json"></i18n>

<script setup lang="ts">
    import draggable from 'vuedraggable' 
    
    const props = defineProps({
        nationalTargets: { type: Array<any>, required: true }
    });
    const emit = defineEmits(['onSort']);

    const { nationalTargets } = toRefs(props);
    const { t, locale }   = useI18n();

    const showSortModal = ref(false);
    const isDragging = ref(false);
    const sortedList = ref<Array<any>>([]);
    const sortOrder  = ref(true);

    const dragOptions = {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
    };

    const nationalTargetList = computed({
        get(){
            const targetList = (sortedList.value?.length ? sortedList.value : nationalTargets.value || []) as Array<any>;
            return targetList?.map((target:any, index:number) => {
                return { title:target.title, 
                        order: target.order || index + 1, identifier: target.identifier};
            })
        },
        set(value){
            sortedList.value = value as any;
        }
    })

    const openSortModal = async () => {
        showSortModal.value = true  
        sortedList.value = [];            
    }
    
    const closeDialog = () => {
        showSortModal.value = false;
        sortedList.value = [];
    };

    const applySorting = ()=>{
        emit('onSort', sortedList.value);
        closeDialog();
    }

    const sortByTitle = ()=>{

        sortedList.value = nationalTargetList.value.sort((a,b)=>{
            if(sortOrder.value)
                return a.title.localeCompare(b.title)
            return b.title.localeCompare(a.title);
        }) as Array<any>;
        sortOrder.value = !sortOrder.value;
    }

</script>


<style scoped>
.drag-item {
    cursor: move; 
}

.drag-item:active {
    cursor: move;
}
</style>