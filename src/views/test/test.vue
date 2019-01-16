<template>
		<!-- 下面链接实例 -->
		<div class="test">
			<p>当前所处环境：{{env}}</p>
			<p>userId:{{userId}}</p>
			<p>phone:{{phone}}</p>
			<p>openId:{{openId}}</p>
			<p>authMode:{{authMode}}</p>
			<p>Authorization:{{Authorization}}</p>
			<div>
				<mt-button @click="clearCache()">清理全部缓存</mt-button>
				<mt-button @click="clearPhone()">单独手机号</mt-button>
				<mt-button @click="clearUserId()">单独userId</mt-button>
				<mt-button @click="clearToken()">清除oAuth token</mt-button>
				<mt-button @click="clearUserData()">清除用户所有信息</mt-button>
				<mt-button @click="openDebugMode()">开启debug模式</mt-button>

			</div>
			<div>
				<label>手机号：</label>
				<input type="text" v-model="input_phone">
			</div>
			<div>
				<label>userId：</label>
				<input type="text" v-model="input_userId">
			</div>			
			<div>
				<label>openId：</label>
				<input type="text" v-model="input_openId">
			</div>	
			<mt-button @click="handLogin()">微信手动登录</mt-button>					
		</div>
</template>
<script>
import {utils} from '../../common/utils';	
import {ajax} from '../../common/ajax';
import {config,service} from '../../common/config';
import {mapActions,mapGetters} from 'vuex';
	export default{
		name:'test',
		data(){
			return{
				env:utils.getEnv(),
				userId:utils.getCookie('userId'),
				phone:utils.getCookie('phone'),
				openId:utils.getCookie('openId'),
				authMode:utils.getCookie('auth_mode'),
				Authorization:utils.getCookie('Authorization'),
				input_phone:utils.getCookie('phone'),
				input_openId:utils.getCookie('openId'),
				input_userId:utils.getCookie('userId'),
			}
		},
		watch:{
		  	useRegion:{
		  		handler:function(newV){
					 this.useJson=JSON.stringify(newV);
		  		},
		  		deep:true
		  	},		  	
		  	nearPlaces:{
		  		handler:function(newV){
					 this.listJson=JSON.stringify(newV);
		  		},
		  		deep:true
		  	},
		  	autoRegion:{
		  		handler:function(newV){
					 this.autoJson=JSON.stringify(newV);
		  		},
		  		deep:true
		  	},
		  	selServiceRegion:{
		  		handler:function(newV){
 					this.selJson=JSON.stringify(newV);
		  		},
		  		deep:true
		  	}  			  				
		},
	  	computed:{
	   	...mapGetters({
	          'useRegion':'useRegion',
	          'autoRegion':'autoRegion',
	          'selServiceRegion':"selServiceRegion",
	          'nearPlaces':'nearPlaces'
	      })
	  	},
		methods:{
			openDebugMode(){
				var	oneDay=24*60*60;
				if(this.$route.query.debugMode=='open'){
					utils.setCookie('we_debug_mode',true,oneDay,service.domain)
				}
			},
			clearCache(){
				utils.clearAllStoarge();
				utils.clearCookie();
				this.userId=utils.getCookie('userId');
				this.phone=utils.getCookie('phone');
				this.openId=utils.getCookie('openId');
				this.Authorization=utils.getCookie('Authorization');
			},
			clearPhone(){
				utils.delCookie('phone')
			},			
			clearUserId(){
				utils.delCookie('userId')
			},
			clearToken(){
				utils.delCookie('Authorization')
			},
			clearUserData(){
				utils.delCookie('phone')
				utils.delCookie('userId')
				utils.delCookie('refreshToken')
			},
			autoLogin(phone){
			  var u = service.common+'/app-background/users/channelUserLogin.api',
			      data = {
			         phone:phone,
			         appId:utils.getCookie('we_appId'),
			         clientId:config.clientId,
			         clientSecret:config.clientSecret
			      };
			  ajax.post(u,data).then(res=>{
			      if(utils.getStatusCode(res.code)==200){
			            var secs=7*24*60*60;
			            utils.setCookie('phone',res.data.phone,secs,service.domain);
			            utils.setCookie('userId',res.data.id,secs,service.domain);               
			             //如果是在微信中，则要进行一次微信绑定操作
			            if(res.data.userToken){
			                utils.setCookie('Authorization',res.data.userToken.token_type + ' ' +res.data.userToken.access_token,res.data.userToken.expires_in,service.domain);
			                utils.setCookie('refreshToken',res.data.userToken.refresh_token,secs,service.domain);
			                utils.setCookie('auth_mode',config.mode,res.data.userToken.expires_in,service.domain);
			            }
			            utils.goBack();
			      }
			 }).catch(err=>{
			      utils.console('auto login error:',err)
			 })
			},
			handLogin(){
				var secs=7*24*60*60;
				utils.setCookie('phone',this.input_phone,secs,service.domain);
				utils.setCookie('openId',this.input_openId,secs,service.domain);
				utils.setCookie('userId',this.input_userId,secs,service.domain);
				this.autoLogin(this.input_phone) 				
			}			
		},
		mounted(){

		}
	}
</script>
<style lang='scss' scoped>
.test{
	font-size: 14px;
	padding-left:10px;
	padding-right:10px;
	p{
		padding:5px 0;
		word-break:break-all;
		margin-bottom:0.32rem;
	}
	input{
		width:200px;
		padding:5px;

	}
	div{
		margin-bottom:0.32rem;
	}
	label{
		display:inline-block;
		width:70px;
	}
	button{
		margin:5px;
	}
}
</style>