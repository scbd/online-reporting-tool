
<template>
    <div id="printContentHeader" class="row my-4">
        <div class="row">
            <div class="col-4">
                <img class="unep-logo" src="https://absch.cbd.int/app//img/UNEP_logo.svg" />
            </div>
            <div class="col-4">
                <img src="https://absch.cbd.int/app//img/cbd-logo-black-en.svg" class="cbd-logo" />
            </div>
            <div class="col-4">
                <img class="un-logo" src="https://absch.cbd.int/app//img/Emblem_of_the_United_Nations.svg" />
            </div>
        </div>
        <div class="row text-center mt-3">
            <strong>
                <span class="col-12" >
                    <span>{{ realm.displayName }}</span> 
                    (<span>{{ realm.realm }}</span>)
                </span>
            </strong>
        </div>
        <br/>
    </div>
</template>
<script lang="ts" setup>

    import { useRealmConfStore } from '@/stores/realmConf';

    const realmConfStore  = useRealmConfStore();
    const realm           = realmConfStore.realmConf;

</script>

<style scoped>

    #printContentHeader .unep-logo {
        padding-top: 10px;
        height: 80px;
        display: block;
        margin: 0 auto;
    }

    #printContentHeader .cbd-logo {
        height: 70px;
        display: block;
        margin: 0 auto;
    }

    #printContentHeader .un-logo {
        height: 80px;
        padding-top: 10px;
        display: block;
        margin: 0 auto;
    }

    @media print {
        #printContentHeader .image-row {
            padding-top: 10px;
        }
        #printContentHeader .unep-logo {
            height: 60px;
        }
        #printContentHeader .cbd-logo {
            height: 50px;
        }
        #printContentHeader .un-logo {
            height: 60px;
        }
    }
    @media (max-width:768px) {
        #printContentHeader .unep-logo {
            height: 40px;
            padding-top: 0px;
        }
        #printContentHeader .cbd-logo {
            height: 40px;
        }
        #printContentHeader .un-logo {
            height: 40px;
        }
    }
    #printContentHeader .image-row{
        padding-bottom:10px;
        border-bottom:1px solid #ddd;   
        display: table;
        width: 100%;
        margin: auto;
    }
</style>