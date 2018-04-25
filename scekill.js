
let protocol = window.location.protocol;
let host = window.location.host;
var domainName = protocol + '//' + host; //获取域名
let spread = getUrl('spread'); //获取页面推广类型: app：app;1：app分享出去的页面;wb..:其他渠道

// 检测是否为测试环境
let javaurl = getUrl('javaurl');
let port = getUrl('port');
let httptype = getUrl('httptype');
let testEnvFlag = false;
if (javaurl && port && httptype) {
	testEnvFlag = true;
};

/**
 * 上拉无限加载触发器
 */
Vue.component('infinite-trigger', {
    template: '<div ref="infiniteTrigger" class="infinite_trigger"></div>',
    props: {
        isLoading: {
            type: Boolean,
            default: false
        },
        isNomore: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {

        }
    },
    methods: {
        scrollEvent: function () {
            var _this = this;
            var timeoutId;
            var infiniteTrigger = this.$refs.infiniteTrigger;
            var windowHeight = window.screen.height;
            function scrollCb() {
                var top = infiniteTrigger.getBoundingClientRect().top;
                if (top && top < windowHeight) {
                    if (!_this.isNomore && !_this.isLoading) {
                        _this.$emit('triggerr');
                    }
                }
            };
            $(window).on('scroll', function () {
                if (timeoutId) {
                    clearTimeout(timeoutId)
                };
                timeoutId = setTimeout(scrollCb, 50);
            }.bind(this));
        }
    },
    mounted: function () {
        this.scrollEvent();
    },
});


let vm = new Vue({
    el: '#vueCon',
    data: {
        isApp: true,
        goodsList: [],
        type: 1,

        currentPage: 1,
        isLoadingInfiniteData: false,
        isNomoreInfiniteData: false,

        hasGetTodayStartTime: false,
        hasGetTomorroeStartTime: false,

        todayStartTime: 0,
        todayEndTime: 0,
        tomorrowStartTime: 0,

        countStatus: 0,
        countH: '--',
        countM: '--',
        countS: '--',

        countH2: '--',
        countM2: '--',
        countS2: '--',
    },
    created: function () {
        this.isAppFn();
        // this.initSceTime();
    },
    methods: {
        isAppFn(){
			let isAppParam = getUrl('spread');
			if (isAppParam != 'app') {
				this.isApp = false;
			};
			this.getGoodsList();
		},
        // 倒计时逻辑
        // initSceTime() {
        //     let nowDate = new Date();
        //     let Y = nowDate.getFullYear();
        //     let M = nowDate.getMonth() + 1;
        //     let D = nowDate.getDate();

        //     let todayStartTime = new Date(Y + '/' + M + '/' + D + ' 10:00').getTime();
        //     let todayEndTime = todayStartTime + 14 * 60 * 60 * 1000;

        //     this.tomorrowStartTime = todayStartTime + 24 * 60 * 60 * 1000;

        //     this.todayStartTime = todayStartTime;
        //     this.todayEndTime = todayEndTime;
        //     this.$nextTick(() => {
        //         this.setSceTime();
        //     })
        // },
        // setSceTime() {
        //     let nowTime = new Date().getTime();
        //     let todayStartTime = this.todayStartTime;
        //     let todayEndTime = this.todayEndTime;

        //     let intervalSeconds;
        //     if (todayStartTime > nowTime) {
        //         intervalSeconds = Math.floor((todayStartTime - nowTime) / 1000);
        //         this.countStatus = 1;
        //         this.startTodayStartCount(intervalSeconds);
        //     } else if (todayEndTime > nowTime) {
        //         intervalSeconds = Math.floor((todayEndTime - nowTime) / 1000);
        //         this.countStatus = 2;
        //         this.startTodayEndCount(intervalSeconds);
        //     } else {
        //         this.countStatus = 3;
        //     };

        //     let tomorrowStartTime = this.tomorrowStartTime;
        //     let intervalSeconds2 = Math.floor((tomorrowStartTime - nowTime) / 1000);
        //     this.startTomorrowStartCount(intervalSeconds2);
        // },

        initSceTime(type, time1, time2, time3) {

            if (type == 1) {
                this.todayStartTime = time2;
                this.todayEndTime = time3;
            };
            if (type == 2) {
                this.tomorrowStartTime = time2;
            };
            this.$nextTick(() => {
                this.setSceTime(type, time1);
            })
        },

        setSceTime(type, timeParams) {
            let nowTime = timeParams;

            if (type == 1) {
                let todayStartTime = this.todayStartTime;
                let todayEndTime = this.todayEndTime;
                let intervalSeconds;
                if (todayStartTime > nowTime) {
                    intervalSeconds = Math.floor((todayStartTime - nowTime) / 1000);
                    if(intervalSeconds >= 15*60){
                        this.countStatus = 1;
                    }else{
                        this.countStatus = 3; // 开始倒计时15分钟内
                    };
                    this.startTodayStartCount(intervalSeconds);
                } else if (todayEndTime > nowTime) {
                    intervalSeconds = Math.floor((todayEndTime - nowTime) / 1000);
                    this.countStatus = 2;
                    this.startTodayEndCount(intervalSeconds);
                } else {
                    this.countStatus = 99;

                };
            };
            if (type == 2) {
                let tomorrowStartTime = this.tomorrowStartTime;
                if(tomorrowStartTime - nowTime < 0){
                    return false;
                };
                let intervalSeconds2 = Math.floor((tomorrowStartTime - nowTime) / 1000);
                this.startTomorrowStartCount(intervalSeconds2);
            };
        },
        startTodayStartCount(interval) {
            let self = this;
            let timer1 = null;
            timer1 = setInterval(() => {
                interval--;
                if(interval == 15*60){
                    self.countStatus = 3; // 开始倒计时15分钟
                };
                if (interval == -1) {
                    clearInterval(timer1);
                    requestMsg('限时抢购开始啦~');
                    self.setSceTime(1,self.todayStartTime);
                } else {
                    self.countTime(interval, 1);
                }
            }, 1000)
        },

        startTodayEndCount(interval) {
            let self = this;
            let timer2 = null;
            timer2 = setInterval(() => {
                interval--;
                if (interval == -1) {
                    clearInterval(timer2);

                    requestMsg('今日限时抢购已结束');
                    self.countStatus = 99;

                    // setTimeout(()=>{
                    //     location.reload();
                    // },2000);
                } else {
                    self.countTime(interval, 1);
                }
            }, 1000)
        },

        startTomorrowStartCount(interval) {
            let timer3 = null;
            timer3 = setInterval(() => {
                interval--;
                if (interval == -1) {
                    clearInterval(timer3);
                } else {
                    this.countTime(interval, 2);
                }
            }, 1000)
        },

        addZero(n) {
            n = n * 1 < 10 ? '0' + n : n;
            return n + '';
        },

        countTime(count, type) {
            let h = Math.floor(count / 3600);
            let m = Math.floor((count % 3600) / 60);
            let s = count % 60;
            if (type != 2) {
                this.countH = this.addZero(h);
                this.countM = this.addZero(m);
                this.countS = this.addZero(s);
            } else {
                this.countH2 = this.addZero(h);
                this.countM2 = this.addZero(m);
                this.countS2 = this.addZero(s);
            }
        },

        // 业务逻辑开始

        getGoodsList() {
            this.isLoadingInfiniteData = true;
            let self = this;
            let page = this.currentPage;
            let type = this.type;

            let activityDay = 0;
            if (type == 2) {
                activityDay = 1;
            };
            $.ajax({
                url: '/proxy/fanbei-web/activity/getFlashSaleGoods',
                type: 'post',
                data: {
                    activityDay: activityDay,
                    pageNo: page
                },
                success: function (res) {
                    
                    if (res.success) {

                        if (!self.hasGetTodayStartTime && type == 1) {
                            self.initSceTime(1, res.data.currentTime, res.data.startTime, res.data.endTime);
                            hideLoading();
                            self.hasGetTodayStartTime = true;
                        };

                        if (!self.hasGetTomorroeStartTime && type == 2) {
                            self.initSceTime(2, res.data.currentTime, res.data.startTime);
                            self.hasGetTomorroeStartTime = true;
                        };

                        self.currentPage = page + 1;

                        res.data.goodsList.forEach((item) => {
                            // let leave = item.total - item.volume;
                            let leave = item.total;
                            item.leave = leave > 0 ? leave : 0;
                            item.sellP = (item.volume) * 100 / (item.total*1 + item.volume*1) + '%';
                        });

                        self.goodsList = self.goodsList.concat(res.data.goodsList);

                        self.isLoadingInfiniteData = false;

                        self.initLazy();

                        if (res.data.goodsList.length < 10) {
                            self.isNomoreInfiniteData = true;
                        }
                    } else {
                        self.isLoadingInfiniteData = false;
                        self.isNomoreInfiniteData = true;
                    }
                },
                error:function(){

                }
            });
        },
        loadInfiniteData() {
            if (this.isLoadingInfiniteData || this.isNomoreInfiniteData) {
                return;
            };
            this.getGoodsList();
        },
        typeClick(type) {
            if (this.type == type) {
                return;
            };
            var topFillBlock = this.$refs.topFillBlock;
            topFillBlock.scrollIntoView();

            this.type = type;

            this.currentPage = 1;
            this.isNomoreInfiniteData = false;

            this.goodsList = [];
            this.getGoodsList();
        },

        remind(data,index) {
            let self = this;
            if (data.subscribe * 1 == 1) {
                requestMsg('您已预约过，无需再预约');
            } else {
                $.ajax({
                    url: '/proxy/fanbei-web/reserveGoodsV2',
                    type: 'post',
                    data: { 
                        goodsId: data.goodsId,
                        activityId: data.activityId
                     },
                    success: function (res) {
                        if (res.success) {
                            requestMsg("预约商品抢购提醒成功");
                            self.$set(self.goodsList[index], 'subscribe', 1);
                        } else {
                            // window.location.href = res.url;
                            if (res.msg == '登陆之后才能进行查看') {
                                window.location.href = res.url
                            } else {
                                requestMsg(res.msg);
                            }
                        }
                    },
                    error:function(){
                        requestMsg('预约失败，请稍后再次预约');
                    }
                })
            }
        },
        checkGoods(data,index){
            let self = this;
            if(data.leave == 0){
                requestMsg('您来晚了，商品已抢完');
                return false;
            };
            // window.location.href = tonativegood(data.goodsId,'self');
            window.location.href = '/fanbei-web/opennative?name=GOODS_DETAIL_INFO&params={"privateGoodsId":"' + data.goodsId +'","lc":"limit_sale"}';
          
        },
        goodsClick(data,index) {
            if(!this.isApp){
                this.toLoadAppPage();
                return false;
            };
            if(this.type == 1){
                if(this.countStatus == 1){
                    // 去预约
                    this.remind(data,index)

                }else if(this.countStatus == 2){
                    // 去抢购
                    this.checkGoods(data,index);

                }else if(this.countStatus == 3){

                    // 开始15分钟内
                    requestMsg('抢购即将开始，搓搓手准备吧');
                }else{

                    // 结束
                    requestMsg('抢购已结束');
                }
            };
            if(this.type == 2){
                this.remind(data,index);
            };
        },

        initLazy() {
            this.$nextTick(function () {
                $("img.lazy").lazyload({
                    placeholder: "https://f.51fanbei.com/h5/common/images/bitmap1.png", //用图片提前占位
                    effect: "fadeIn", // 载入使用的效果
                    threshold: 200 // 提前开始加载
                });
            })
        },

        toLoadAppPage(){
            // maidianFnNew('toLoadApp');
            location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.alfl.www';
        }
    }
});



//todo
// wx分享参数
var shareInfoLink = domainName + "/h5/asj/scekill/scekill.html?spread=" + spread;
if(testEnvFlag){
    shareInfoLink = shareInfoLink + "&javaurl=" + javaurl + "&port=" + port + "&httptype=" + httptype;
}

var shareInfo = {
	title: "限时抢购-爱上街",
	desc: "汇聚品质时尚好货，分期0利息，每天10点抢购～",
	link: shareInfoLink ,
	imgUrl: "https://f.51fanbei.com/h5/app/activity/2018/04/scekill_share_icon.png",
	success: function () {
		requestMsg("分享成功！");
	},
	error: function () {
		requestMsg("分享失败！");
	},
	cancel: function (res) {
		// 用户取消分享后执行的回调函数
		requestMsg("取消分享！");
	}
}

var shareInfoLink2 = domainName + "/h5/asj/scekill/scekill.html?spread=1";
if(testEnvFlag){
    shareInfoLink2 = shareInfoLink2 + "&javaurl=" + javaurl + "&port=" + port + "&httptype=" + httptype;
};

function alaShareData() {
	var dataObj = { // 分享内容
		"appLogin": "N", // 是否需要登录，Y需要，N不需要
		"type": "share", // 此页面的类型
		"shareAppTitle": "限时抢购-爱上街",  // 分享的title
		'shareAppContent': "汇聚品质时尚好货，分期0利息，每天10点抢购～",  // 分享的内容
		"shareAppImage": "https://f.51fanbei.com/h5/app/activity/2018/04/scekill_share_icon.png",  // 分享右边小图
		"shareAppUrl": shareInfoLink2,  // 分享后的链接
		"isSubmit": "Y", // 是否需要向后台提交数据，Y需要，N不需要
		"sharePage": "creditFest" // 分享的页面
	};
	var dataStr = JSON.stringify(dataObj);  // obj对象转换成json对象
	return dataStr;
};