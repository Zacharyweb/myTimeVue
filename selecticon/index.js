 var vm = new Vue({
    el:'#app',
    data:{
      iconList:[
         {icon:'../img/histrory.png'},
         {icon:'../img/histrory.png'},
         {icon:'../img/histrory.png'},
         {icon:'../img/histrory.png'},
         {icon:'../img/histrory.png'},
         {icon:'../img/histrory.png'},
         {icon:'../img/histrory.png'},
         {icon:'../img/histrory.png'},
         {icon:'../img/histrory.png'},
         {icon:'../img/histrory.png'},
      ],
      selectedIconIndex:-1
    },
    mounted(){
       
    },
    methods:{
        selectIcon(index){
       	    if(this.selectedIconIndex == index){
       	    	return;
       	    };
       	    this.selectedIconIndex = index;
        }

    
    }
 })












    
    

