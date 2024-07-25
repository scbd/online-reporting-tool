<template>
  <nav v-if="props.recordCount" aria-label="{{ t('pagination') }}" class="pagination d-flex justify-content-center text-center">
    <ul class="pagination pagination-lg1">

      <li v-if="props.firstLastButton" @click="setPage(1)" :class="{ 'disabled': internalCurrentPage === 1 }" class="page-item">
        <a class="page-link" href="#">{{ props.firstButtonText || t('first') }}</a>
      </li>
      
      <li @click="previousPage" :class="{ 'disabled': internalCurrentPage === 1 }" class="page-item">
        <a class="page-link" href="#">{{ props.prevText || t('prev') }}</a>
      </li>
      
      <li v-if="visiblePageNumbers[0] > 1" class="page-item" @click="setPage(visiblePageNumbers[0]-1)">
        <a class="page-link" href="#">...</a>
      </li>

      <li v-for="pageNumber in visiblePageNumbers" :key="pageNumber" @click="setPage(pageNumber)" :class="{ 'active': internalCurrentPage === pageNumber }" class="page-item">
        <a class="page-link" href="#">{{ pageNumber }}</a>
      </li>

      <li v-if="visiblePageNumbers[visiblePagelength - 1] < pageCount" class="page-item"
        @click="setPage(visiblePagelength+1)">
        <a class="page-link" href="#">...</a>
      </li>

      <li @click="nextPage" :class="{ 'disabled': internalCurrentPage === pageCount }" class="page-item">
        <a class="page-link" href="#">{{ props.nextText || t('next') }}</a>
      </li>

      <li @click="setPage(pageCount)" :class="{ 'disabled': internalCurrentPage === pageCount }" class="page-item">
        <a class="page-link" href="#">{{ props.lastButtonText || t('last') }}</a>
      </li>

      <li class="page-item d-none d-md-inline-block disabled">
            <a rel="noopener" class="page-link" disabled>
                <strong> 
                    <span>{{ currentPage }}</span> {{t('of')}}
                    <span>{{ pageCount }}</span>
                </strong>
            </a>
        </li>
        <li  class="page-item disabled">
          <a rel="noopener" class="page-link" >
                <strong> 
                    {{t('total')}} {{ recordCount }}
                </strong>
            </a>
        </li>
        <li class="page-item d-none1 d-md-inline-block1">
                <a rel="noopener" class="page-link" disabled data-title="Items per page" data-bs-toggle="tooltip">
                <!-- <span class="d-none d-lg-inline-block">{{t('itemsPerPage')}}</span> -->
                <select class="form-select1" v-model="rowsPerPage">
                    <option :selected="recordsPerPage == '25'" value="25">{{t('twentyFive')}}</option>
                    <option :selected="recordsPerPage == '50'" value="50">{{t('fifty')}}</option>
                    <option :selected="recordsPerPage == '100'" value="100">{{t('oneHundred')}}</option>
                    <option :selected="recordsPerPage == '200'" value="200">{{t('twoHundred')}}</option>
                    <option :selected="recordsPerPage == '300'" value="300">{{t('threeHundred')}}</option>
                </select>
            </a>
        </li>
    </ul>
  </nav>

</template>
<i18n src="@/i18n/dist/components/controls/common/pagination.json"></i18n>

<script setup>
const { t } = useI18n({ });

const props = defineProps({
  recordCount    : { type: Number, required: true },
  recordsPerPage : { type: Number, required: true },
  currentPage    : { type: Number, required: true },
  firstLastButton: { type: Boolean, default: true },
  firstButtonText: { type: String,  },
  lastButtonText : { type: String,  },
  prevText       : { type: String,  },
  nextText       : { type: String,  }
});

const emit = defineEmits(['onPageChange', 'onRecordsPerPageChanged']);

const internalCurrentPage = computed({
  get() {
    return props.currentPage;
  },
  set(page) {
    emit('onPageChange', page);
  }
});

const rowsPerPage = computed({
  get(){
    return props.recordsPerPage
  },
  set(rows){
    emit('onRecordsPerPageChanged', Number(rows));
  }
})

const setPage = (page) => {
  internalCurrentPage.value = page;
};

const pageCount = computed(() => Math.ceil(props.recordCount / props.recordsPerPage));

const visiblePageNumbers = computed(() => {
  const totalPages = pageCount.value;
  const currentPage = internalCurrentPage.value;
  const pageRange = 2;
  const visiblePages = [];

  let startPage = Math.max(1, currentPage - pageRange);
  let endPage = Math.min(totalPages, currentPage + pageRange);

  if (currentPage - pageRange <= 0) {
    endPage = Math.min(pageRange * 2 + 1, totalPages);
  }

  if (currentPage + pageRange >= totalPages) {
    startPage = Math.max(totalPages - pageRange * 2, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return visiblePages;
});

const previousPage = () => {
  if (internalCurrentPage.value > 1) {
    internalCurrentPage.value--;
  }
};

const nextPage = () => {
  if (internalCurrentPage.value < pageCount.value) {
    internalCurrentPage.value++;
  }
};
</script>

<style scoped>
</style>
