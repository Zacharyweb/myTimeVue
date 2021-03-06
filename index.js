 var vm = new Vue({
    el:'#app',
    data:{
        actList:[
           {icon:'./img/histrory.png',name:'工作',remark:'备注1，备注2'},
           {icon:'./img/histrory.png',name:'工作',remark:'备注1，备注2'},
           {icon:'./img/histrory.png',name:'工作',remark:'备注1，备注2'},
           {icon:'./img/histrory.png',name:'工作',remark:'备注1，备注2'},
           {icon:'./img/histrory.png',name:'工作',remark:'备注1，备注2'},
           {icon:'./img/histrory.png',name:'工作',remark:'备注1，备注2'},
           {icon:'./img/histrory.png',name:'工作',remark:'备注1，备注2'},
           {icon:'./img/histrory.png',name:'工作',remark:'备注1，备注2'},
           {icon:'./img/histrory.png',name:'工作',remark:'备注1，备注2'}
        ],
        countTarget:-1,
        countTimer:null,
        countH:'00',
        countM:'00',
        countS:'00',

        isInEditing:false,
        selectedActIndex:-1,
    },
    mounted(){
         this.count();
    },
    methods:{
        addZero(n) {
            n = n * 1 < 10 ? '0' + n : n;
            return n + '';
        },
        countTime(count) {
            var h = Math.floor(count / 3600);
            var m = Math.floor((count % 3600) / 60);
            var s = count % 60;
            // this.countH = this.addZero(h);
            // this.countM = this.addZero(m);
            // this.countS = this.addZero(s);
            console.log(this.addZero(h)+'：'+this.addZero(m)+'：'+this.addZero(s));
        },
        count(){
        	var nowDate = new Date();
        	var nowTime = nowDate.getTime();

        	var tomorrowDate = new Date(nowTime + 24*60*60*1000);

            var Y = tomorrowDate.getFullYear();
            var M = tomorrowDate.getMonth() + 1;
            var D = tomorrowDate.getDate();
           
     
            var todayEndTime = new Date(Y + '/' + M + '/' + D ).getTime();


            var interval = Math.ceil((todayEndTime - nowTime)/1000);
            // this.countH  = '00';
            // this.countM  = '00';
            // this.countS  = '00';
            this.countTimer = setInterval(() => {
                interval--;
                if (interval == -1) {
                    clearInterval(this.countTimer);
                } else {
                    this.countTime(interval);
                }
            }, 1000);
        },
        changeCountTarget(index){
            if(this.isInEditing){
                this.selectAct(index);
            }else{
                clearInterval(this.countTimer);
                if(this.countTarget == index){
                    this.countTarget = -1;
                    return;
                }
                this.countTarget = index;
                this.count();
            }
         },
         endCountTarget(index){
            clearInterval(this.countTimer);
            this.countTarget = -1;
         },


         addNewAct(){
            console.log('新增活动');
         },
         editAct(){

            this.isInEditing = !this.isInEditing;
            if(!this.isInEditing){
                this.selectedActIndex = -1;
            }
         },
         selectAct(index){
            this.selectedActIndex = index;
         }

    
    }
 })












    
    

