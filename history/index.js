 var vm = new Vue({
    el:'#app',
    data:{
     searchPanelShow:false,
     rankStatus: 1
    },
    mounted(){

    },
    methods:{
 
     showSearchPanel(){
      this.searchPanelShow = true;
     },
     hideSearchPanel(){
      this.searchPanelShow = false;
     },
     submitSearch(){
      this.hideSearchPanel();
     },
     changeRankStatus(i){
      this.rankStatus = i;
     }
    
    }
 })












    
    

