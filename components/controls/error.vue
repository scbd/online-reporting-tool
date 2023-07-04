<template>
    <CAlert color="danger" v-bind:visible="true">
        <CAlertHeading>
            <CIcon icon="cil-check-circle" class="flex-shrink-0 me-2" width="24" height="24" />Error!
        </CAlertHeading>
        <p>
            We are sorry to inform you that an unexpected error has occurred on this page.
            We understand that this is very unfortunate and may have caused inconvenience to you.
        </p>

        <p>
            Please don't hesitate to <a class="alert-link" href="mailto:secretariat@cbd.int">contact the Secretariat</a>
            if you have any further questions or concerns.
        </p>

        <hr>

        <div>
            If you would like <a class="alert-link" href="#" @click.prevent="moreInfo()">more information about this
                message</a>, you can <a class="alert-link" href="#" @click.prevent="moreInfo()">click here</a>.
        </div>

        <div v-if="showMoreInfo">
            <hr>
            <div v-if="error.code">
                Error: <b>{{ error.code }}</b>
            </div>
            <div>
                Message: {{ error.message }}
            </div>
        </div>



    </div>
    </CAlert>
</template>

<script setup lang="ts">
    const showMoreInfo = ref(false) 
    const moreInfo = ()=>{
        showMoreInfo.value = true
    }
</script>

<style scoped>

</style>