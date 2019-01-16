<template>
	<div id="app">
		<smap></smap>
		<!-- 渠道关闭-->
		<div class="close" v-if="isClose">
			<div class="c-logo">
				<img src="./assets/imgs/index_close_logo.png">
			</div>
			<div class="c-app">
				<img src="./assets/imgs/index_c_app.png">
			</div>
			<div class="c-slogan">
				<img src="./assets/imgs/index_c_slogan.png">
			</div>
			<div class="c-button" @click="downloadClient()">
				立即下载APP
			</div>
		</div>
		<!-- 渠道未关闭情况下展示的头，底部tab，以及子页面内容 -->
		<transition :name="routerTrans" v-if="!isClose">
			<keep-alive include="index,productList,userSelAddr,categories">
				<router-view class="child-view" :class="{'has-tab':!isClose && ($route.name=='index' || $route.name=='categories' || $route.name=='orderList' || $route.name=='userIndex') && showTab,'has-header':$route.meta.header!=false}"></router-view>
			</keep-alive>
		</transition>
		<mt-header :title="$route.meta.title" fixed v-if="!isClose && $route.meta.header!=false && (positionStatus!='定位中...' || !$route.meta.position)" v-show="!isClose">
				<mt-button slot="left" @click="goBack()"><i class="iconfont icon-back" style="font-weight: 600;font-size:20px;"></i></mt-button>
		</mt-header>
		<mt-tabbar :fixed="true" v-if="!isClose && (positionStatus!='定位中...' || !$route.meta.position) && $route.meta.tab && showTab" v-model="$route.name">
			<mt-tab-item :id="item.id" v-for="item in tabs">
					<img @click="toTabs(item)" slot="icon" :src="$route.name==item.id?item.activeIcon:item.icon">
					<span @click="toTabs(item)">{{item.name}}</span>
			</mt-tab-item>
		</mt-tabbar>
	</div>
</template>
<script>
import {config,service} from './common/config';
import {utils} from './common/utils';
import {ajax} from './common/ajax';
import {auth} from './common/auth';
import {login} from './common/login';
// 引入隐藏的地图插件
import smap from './views/common/map/map';
import {mapActions,mapGetters} from 'vuex'
export default {
	name: 'app',
	data(){
		return {
			appKey:'',
			clientId:'',
			access_token:'',
			routerTrans:'',
			isClose:false,
			tabs:[
				{
					id:'index',
					name:'首页',
					icon: require('./assets/imgs/icon_tab_home_n.png'),
					activeIcon:require('./assets/imgs/icon_tab_home_s.png')
				},
				{
					id:'categories',
					name:'分类',
					icon:require('./assets/imgs/tab_icon_all_n.png'),
					activeIcon:require('./assets/imgs/tab_icon_all_s.png')
				},
				{
					id:'orderList',
					name:'订单',
					icon:require('./assets/imgs/icon_tab_order_n.png'),
					activeIcon:require('./assets/imgs/icon_tab_order_s.png')
				},
				{
					 id:'userIndex',
					 name:'我的',
					 icon:require('./assets/imgs/icon_tab_personal_n.png'),
					 activeIcon:require('./assets/imgs/icon_tab_personal_s.png'),
				}
			]
		}
	},
	components:{
		smap
	},
	watch: { 
		$route (to, from) {
			var appId=this.$route.query.we_appId || utils.getCookie('we_appId'),
				appSecret=this.$route.query.we_appSecret || utils.getCookie('we_appSecret'),
				phone=this.$route.query.phone,
				userId=this.$route.query.userId,
				openId=this.$route.query.openId,
				broker = this.$route.query.from_share,
				title="旺管家生活服务";
			if(!phone){
					phone=this.$route.query.phoneNo;
			}
			if(appId=='wgjIw2bTA'){
				title='便民通-旺管家生活服务';
			}
			if(appId=='wgjHhQAs0'){
				title='合屋生活服务';
			}
			if(appId=='wgj5CImrS'){
				title='匠心服务窝心价';
			}
			document.title=title;
			//在有传手机号的情况下
			if(phone && utils.checkPhone(phone)){
				if(!utils.isWeixin() && (!login.isLogin() || utils.getCookie('phone')!=phone)){
					//不在微信中则直接使用自动登录
					this.autoLogin(phone,appId);
				}
			}
		    // 有房多多经济人id的情况下
		    if(broker){
		          utils.setSessionStorage('broker',broker)
		    }
			if(to.name!='index'){
				this.$store.dispatch('setTab',true)
			}			
			if((from.name=="orderList" && to.name=="submitOrder") || (from.name == to.name)){
					window.history.back();
					return;
			}
			if(to.name=='submitOrder' && !utils.getSessionStorage('we_createOrder')){
				//如果在确认订单页面，而且没有订单数据，那么去订单列表页面
				this.$router.push({name:'orderList'});
			}
			if(window.isBack){
				 this.routerTrans='slide-right';
				 window.isBack=false;
			}else{
				this.routerTrans='slide-left';
			}
			if((from.name=="productDetail" && to.name=='productList') || (from.name=="productDetail" && to.name=='categories')){
				window.isBack=true;
			}
		}
	},	
	computed:{
	...mapGetters({
	      positionStatus:'positionStatus',
	      showTab:'showTab'
	  })
	},	
	methods:{
		...mapActions([
			'setTab'
		]),		
		toTabs(item){
			if(this.$route.name==item.id){
				if(this.$route.name=='index'){
					document.documentElement.scrollTo(0,0);
				}
				return;
			}
			this.$router.push({name:item.id})
		},
		goBack(){
			utils.goBack();
		},		
		autoLogin(phone,appId){
			var u = service.common+'/app-background/users/channelUserLogin.api',
				data = {
					 phone:phone,
					 appId:appId,
					 clientId:config.clientId,
					 clientSecret:config.clientSecret
				};
				ajax.post(u,data).then(res=>{
					if(utils.getStatusCode(res.code)==200){
						var secs=7*24*60*60;
						utils.setCookie('phone',phone,secs,service.domain);
						utils.setCookie('userId',res.data.id,secs,service.domain);
						 //如果是在微信中，则要进行一次微信绑定操作
						if(res.data.userToken){
							utils.setCookie('Authorization',res.data.userToken.token_type + ' ' +res.data.userToken.access_token,res.data.userToken.expires_in,service.domain);
							utils.setCookie('refreshToken',res.data.userToken.refresh_token,secs,service.domain);
							utils.setCookie('auth_mode',config.mode,res.data.userToken.expires_in,service.domain);
						}
					}
			 }).catch(err=>{
					console.log('auto login error:',err)
			 })
		 },
		getIsClose(){
			let appId = utils.getCookie("we_appId");
			var url=window.location.href;
			if(!appId){
				this.isClose = true;
				if(url.indexOf('/wemall/clear')>=0){
					this.isClose = false;
					return;
				}
				return;
			}
			let u = service.common + '/app-background/channel/getChannel?appId=' + appId;
			this.$indicator.open({
				spinnerType: 'fading-circle'
			});			
			ajax.get(u).then(res=>{
				this.$indicator.close();
				if(res.code == config.successCode){
					if(res.data){
						this.isClose = false;
					}else{
						this.isClose = true;
					}
				}
			}).catch(err=>{
				this.$indicator.close();
				this.$toast('网络连接失败，请重试');
			})
		},
		downloadClient(){
			if(utils.isWeixin()){
				alert('请点击微信右上角按钮，然后点击在浏览器打开，即可安装')
			}else{
				// 判断在Android还是ios终端打开
				var u = navigator.userAgent;
				var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端
				var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
				if (isiOS) {
					window.location.href = 'https://itunes.apple.com/cn/app/wang-guan-jia/id975448569?mt=8';
				}else{
					window.location.href = 'http://sj.qq.com/myapp/detail.htm?apkName=com.ningstech.edjyun';
				}	
			}
			
		},			
	},
	mounted(){
			var env=utils.getEnv();

			//判断环境：京东 金融中加载京东文件
			if(env=='dingding'){
				utils.loadFile('https://g.alicdn.com/dingding/open-develop/1.9.0/dingtalk.js');
			}else{
				utils.loadFile('https://webapi.amap.com/maps?v=1.4.4&key=f951d49b08bbd89685f7d6e5761d20f6');
			}
			if(env=='jd'){
				utils.loadFile('https://m.jr.jd.com/crayfish/zui/jrap/1.0.0/jrap.js');
			}
			this.getIsClose();
			if(window.vmanagerBridge){
					var event = {};
					event['title'] = '商城';
					window.vmanagerBridge.sendMessage('setPageTitle', event, function(result) {
						
							if (result.errorcode == 0) {
									
							}
					})			
			}
				window.canPop=true;
				var secs=7*24*60*60;
				utils.setCookie('appversion','3.8.0',secs,service.domain);
				if(!utils.isTestEnv()){
						 var appId=this.$route.query.we_appId?this.$route.query.we_appId:utils.getCookie('we_appId');
						utils.sendMta('getAppId',{'appid':appId})
						window._mtac = {"senseQuery":1};
						(function() {
							var mta = document.createElement("script");
							mta.src = "https://pingjs.qq.com/h5/stats.js?v2.0.4";
							mta.setAttribute("name", "MTAH5");
							mta.setAttribute("sid", "500505091");
							mta.setAttribute("cid", "500505092");
							var s = document.getElementsByTagName("script")[0];
							s.parentNode.insertBefore(mta, s);
						})();
				}
	}
}
</script>

<style lang="scss">
@import './assets/styles/common.scss';
#app{
	height:100%;
}
[lazy="error"]{
    background:url(./assets/imgs/default@3x.png);
    background-size:cover;
}
.has-header{
	padding-top:44px;
}
.child-view {
	width:100%;
	transition: all .2s cubic-bezier(.55,0,.1,1);
}
.slide-left-enter, .slide-right-leave-active {
	opacity: 0;
	-webkit-transform: translate(50px, 0);
	transform: translate(50px, 0);
}
.slide-left-leave-active, .slide-right-enter {
	opacity: 0;
	-webkit-transform: translate(-50px, 0);
	transform: translate(-50px, 0);
}
.has-tab{
	padding-bottom:54px;
}
.close{
	display: block;
	height:100%;
	background: url("./assets/imgs/index_close_background.png");
	background-size: 100% 100%;
	.c-logo{
		padding-top: 0.32rem;
		padding-left: 0.453rem;
		img{
			width: 2.773rem;
		}
	}
	.c-app{
		margin-top: 0.773rem;
		text-align: center;
		img{
			width: 7.173rem;
		}
	}
	.c-slogan{
		margin-top: 20px;
		text-align: center;
		img{
			width: 3.653rem;
		}
	}
	.c-button{
		margin:  48px auto;
		width:5.733rem;
		height:1.6rem;
		line-height:1.4rem;
		background: url("./assets/imgs/index_c_button.png") no-repeat;
		background-size: cover;
		text-align: center;
		font-size: 18px;
		color: #fff;
		letter-spacing: 1px;
	}
}
</style>
