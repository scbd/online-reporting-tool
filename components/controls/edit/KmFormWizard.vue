<template>
    <div class="km-nav-wizard">
        <div class="nav-header mb-2">

            <ul class="nav nav-pills nav-fill">
                <li @click.prevent.stop="selectTab(index)" 
                class="nav-item" :class="{ 'active': currentTab == index }" 
                v-for="(tab, index) in tabs" v-bind:key="`tab-${index}`">

                    <a class="nav-link" href="#">
                            <span class="tabStatus">{{index+1}} </span> 
                            <span class="tabLabel">{{tab.props.title}}</span>
                    </a>
                </li>
            </ul>
        </div>
        <div class="nav-body">
            <form>
                <slot></slot>
            </form>
        </div>
        <div class="nav-footer mt-2">
            <ul class="nav nav-pills nav-fill">
                <li @click.prevent.stop="selectTab(index)" 
                    class="nav-item" :class="{ 'active': currentTab == index }" 
                    v-for="(tab, index) in tabs" v-bind:key="`tab-${index}`">
                    <a class="nav-link" href="#">
                            <span class="tabStatus">{{index+1}} </span> 
                            <span class="tabLabel">{{tab.props.title}}</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        preselectTab : {type :Number, default : 0},
    },
    data(){
        return{
            tabs: [],
            totalTabs : 0,
            currentTab : 0
        }
    },
    mounted(){
            this.tabs = this.$slots.default().filter((child) => child.type.name === "tab-content");;
            this.totalTabs = this.tabs.length;
            this.currentTab = this.preselectTab ?  this.preselectTab : this.tabs.findIndex((tab) => tab.props.isActive === true);

            //Select first tab if none is marked selected
            if(this.currentTab === -1 && this.totalTabs > 0){  
                this.tabs[0].props.isActive = true;
                this.currentTab = 0;
            }
    },
    watch:{
        preselectTab : function(){
            this.currentTab = this.preselectTab
        }
    },
    methods:{        

        selectTab(index){            
            this._switchTab(index);            
        },
        _switchTab(index){
            //Disable all tabs
            this.tabs.forEach(tab => {
                tab.props.isActive = true;
            });

            this.currentTab = index;
            this.tabs[index].props.isActive = true;
            this.$emit('onChange', this.currentTab);
        }
    }
    
}
</script>
<style>
.km-nav-wizard ul.nav-pills>li {
    position: relative;
    overflow: visible;
    border-right: 15px solid transparent;
    border-left: 15px solid transparent
}

.km-nav-wizard ul.nav-pills>li+li {
    margin-left: 0
}

.km-nav-wizard ul.nav-pills>li:first-child {
    border-left: 0
}

.km-nav-wizard ul.nav-pills>li:first-child a {
    border-radius: 5px 0 0 5px
}

.km-nav-wizard ul.nav-pills>li:last-child {
    border-right: 0
}

.km-nav-wizard ul.nav-pills>li:last-child a {
    border-radius: 0 5px 5px 0
}

.km-nav-wizard ul.nav-pills>li a {
    border-radius: 0;
    background-color: #eee
}

.km-nav-wizard ul.nav-pills>li:not(:last-child) a:after {
    right: -20px;
    border-color: transparent transparent transparent #eee
}

.km-nav-wizard ul.nav-pills>li:not(:first-child) a:before,
.km-nav-wizard ul.nav-pills>li:not(:last-child) a:after {
    position: absolute;
    content: "";
    top: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 20px 0 20px 20px;
    z-index: 150
}

.km-nav-wizard ul.nav-pills>li:not(:first-child) a:before {
    left: -20px;
    border-color: #eee #eee #eee transparent
}

.km-nav-wizard ul.nav-pills>li:hover:not(:last-child) a:after {
    border-color: transparent transparent transparent #aaa
}

.km-nav-wizard ul.nav-pills>li:hover:not(:first-child) a:before {
    border-color: #aaa #aaa #aaa transparent
}

.km-nav-wizard ul.nav-pills>li:hover a {
    background-color: #aaa;
    color: #fff
}

.km-nav-wizard ul.nav-pills>li.active:not(:last-child) a:after {
    border-color: transparent transparent transparent #428bca
}

.km-nav-wizard ul.nav-pills>li.active:not(:first-child) a:before {
    border-color: #428bca #428bca #428bca transparent
}

.km-nav-wizard ul.nav-pills>li.active a {
    background-color: #428bca;
    color: #fff
}

.tabStatus {
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: .5rem;
    line-height: 1.5rem;
    color: #fff;
    text-align: center;
    background: rgba(0, 0, 0, .38);
    border-radius: 50%
}

.nav-pills .nav-item {
    margin: 0 10px
}

</style>