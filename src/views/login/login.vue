<template>
	<div class="login">
<!-- 		<mt-header :title="title" v-if="!isDingDing">
		    <mt-button slot="left" @click="goBack()"><i class="iconfont icon-back" style="font-weight: 600;font-size:20px;"></i></mt-button>
		</mt-header> -->
		<div class="ding-title">
			<h1>手机验证</h1>
			<p>为了能更好的服务于您，</p>
			<p>请输入你的手机号码，进行验证</p>
		</div>		
		<div class="form">		
			<div class="phone">
				<!-- <label>手机号码</label> -->
				<input type="text" name="phone" v-validate="{rules: { required: true, regex : /^[1][34578][0-9]{9}$/,max:11}}" v-model="phone" placeholder="输入手机号码" maxlength="11" />
			</div>
			<div class="code">
				<!-- <label>验证码</label> -->
				<input type="text" name="code" v-model="msmcode" v-validate="{rules: { required: true,digits:6,max:6}}" placeholder="输入验证码" maxlength="6"/>
				<button class="getcode" @click="getsmsCode()" :class="{'disabled text-disabled':errors.has('phone') || !loginStatus.cangetSms || !phone}">{{loginStatus.getSmsText}}</button>
			</div>
		</div>
		<button class="confirm" @click="login()" :class="{'disabled':errors.has('code') || errors.has('phone') || !phone || !msmcode || !loginStatus.canLogin}">确定</button>
	</div> 
</template>
<script>
import {config,service} from '../../common/config'
import {ajax} from '../../common/ajax'
import axios from 'axios';
import {utils} from '../../common/utils'
import {mapActions,mapGetters} from 'vuex'
export default{
	name:'login',
	data(){
		return {
			phone:'',
			msmcode:'',
			title:'',
			loginStatus:{
				cangetSms:true,
				canLogin:true,
				getSmsText:'获取验证码',
				codeTime:60	
			}
		}
	},
	mounted(){
		if(utils.getCookie('we_appId') =='wgjWcB7bG'){
			this.title = "手机验证";
		}else{
			this.title = "快捷登录";
		}
	},
	methods:{
		goBack(){
			utils.goBack(this);
		},
		sucBack(){
			if(this.$route.query.to){
				if(this.$route.query.to.indexOf('http')>=0){
					window.location.replace(decodeURIComponent(this.$route.query.to));
				}else{
					utils.goBack(this);
				}
			}else{
				utils.goBack(this);
			}
		},
		setCodeTime(){
			setTimeout(()=>{
				this.loginStatus.codeTime--;
				this.loginStatus.getSmsText="重新获取("+this.loginStatus.codeTime+")";
				this.loginStatus.cangetSms=false;
				if(this.loginStatus.codeTime==0){
					this.loginStatus.getSmsText="获取验证码";
					this.loginStatus.cangetSms=true;
				}else{
					this.setCodeTime();
				}
			},1000)
		},
		getsmsCode(){
			var _self=this;
			if(utils.checkPhone(this.phone)){
				this.loginStatus.cangetSms=false;
				this.loginStatus.codeTime=60;
				var e = service.common+"/sms-service/sms/sendSecurityCode";
				this.$indicator.open({
					spinnerType: 'triple-bounce'
				});				
				ajax.post(e,{phone:this.phone}).then((res)=>{
					this.$indicator.close();
					if(utils.getStatusCode(res.code)==200){
						this.$toast('发送验证码成功')
						this.setCodeTime();
					}else{
						this.$toast(res.message)							
					}
				}).catch((e)=>{
					this.$indicator.close();
					this.$toast('网络连接失败，请重试');
					this.loginStatus.cangetSms=true;
				})
			}
		},
		login(){
			var _self=this;
			var e = service.common+"/app-background/users/login.api";
			this.loginStatus.canLogin=false;
			this.$indicator.open({
				spinnerType: 'triple-bounce'
			});			
			ajax.post(e,{phone:this.phone,msmcode:this.msmcode,clientId:config.clientId,clientSecret:config.clientSecret}).then(res=>{
			    if(utils.getStatusCode(res.code)==200){
			    	 var env=utils.getEnv();
			         var secs=7*24*60*60;
			         if(env=='weixin' || env=='alipay_channel'){
			         	secs=2*60*60;
			         	if(this.$route.query.openId){
			         		utils.setCookie('openId',this.$route.query.openId,secs,service.domain);
			         	}
			         }			        
			         utils.setCookie('phone',this.phone,secs,service.domain);
			         utils.setCookie('userId',res.data.id,secs,service.domain);			         
           			 if(res.data.userToken){
           			 	utils.setCookie('Authorization',res.data.userToken.token_type + ' ' +res.data.userToken.access_token,res.data.userToken.expires_in,service.domain);
           			 	utils.setCookie('refreshToken',res.data.userToken.refresh_token,secs,service.domain);
           			 	utils.setCookie('auth_mode',config.mode,res.data.userToken.expires_in,service.domain);
           			 }
           			 //绑定不同的客户端ID区域
           			 
           			 if(env=='weixin' && utils.getCookie('openId')){
       			 		this.bindWX().then(ret=>{
       			 			this.$indicator.close();
       			 			this.$toast('登录成功！');
       			 			this.loginStatus.canLogin=true;
       			 			if(utils.getCookie('we_appId')){
	           			 		window.history.go(-2);
	           			 	}else{
           			 			_self.$router.push({name:'redirect'});
           			 		}
       			 		}).catch(err=>{
       			 			this.$indicator.close();
       			 			this.$toast('登录成功！');
       			 			this.loginStatus.canLogin=true;
       			 			this.bindWX().then(ret=>{
       			 				return;
       			 			})
       			 			if(utils.getCookie('we_appId')){
	           			 		window.history.go(-2);
	           			 	}else{
           			 			_self.$router.push({name:'redirect'});
           			 		}
       			 		})
           			 }else if(env=='alipay_channel' && utils.getCookie('openId')){
       			 		this.bindAlipay().then(ret=>{
       			 			this.$indicator.close();
       			 			this.$toast('登录成功！');
       			 			this.loginStatus.canLogin=true;
       			 			if(utils.getCookie('we_appId')){
	           			 		window.history.go(-2);
	           			 	}else{
	           			 		_self.$router.push({name:'redirect'});
	           			 	}
       			 		}).catch(err=>{
       			 			this.$indicator.close();
       			 			this.$toast('登录成功！');
       			 			this.loginStatus.canLogin=true;
		   			 		this.bindAlipay().then(ret=>{
		   			 			return;
		   			 		});       			 			
       			 			if(utils.getCookie('we_appId')){
	           			 		window.history.go(-2);
	           			 	}else{
	           			 		_self.$router.push({name:'redirect'});
	           			 	}
       			 		})           			 	
       			 	}else if(env=='dingding'  && utils.getCookie('openId')){
       			 		this.bindDingDing().then(ret=>{
       			 			this.$indicator.close();
       			 			this.$toast('登录成功！');
       			 			this.loginStatus.canLogin=true;
       			 			if(utils.getCookie('we_appId')){
	           			 		 window.history.go(-1);
	           			 	}else{
	           			 		 _self.$router.push({name:'redirect'});
	           			 	}
       			 		}).catch(err=>{
       			 			this.$indicator.close();
       			 			this.$toast('登录成功！');
       			 			this.loginStatus.canLogin=true;
		   			 		this.bindDingDing().then(ret=>{
		   			 			return;
		   			 		});       			 			
       			 			if(utils.getCookie('we_appId')){
	           			 		window.history.go(-1);
	           			 	}else{
	           			 		_self.$router.push({name:'redirect'});
	           			 	}
       			 		})  
       			 	}else{
       			 		this.$indicator.close();
       			 		this.$toast('登录成功！');
       			 		this.loginStatus.canLogin=true;
           			 	if(utils.getCookie('we_appId')){
           			 		this.sucBack();
           			 	}else{
           			 		_self.$router.push({name:'redirect'});
           			 	}
       			 	}
						
           		}else{
           			  this.$indicator.close();
					  this.$toast(res.message)
					  this.loginStatus.canLogin=true;
           		}	 
			}).catch(err=>{
				utils.console(err)
				this.$indicator.close();
				this.$toast('网络连接失败，请重试');
				this.loginStatus.canLogin=true;				
			})
		},
		bindWX(){
			var u =service.common + '/wechat-service/oauth2/bind',
				data = {
					appId:config.wxAppId,
					openId:this.$route.query.openId,
					phone:this.phone
				};
			return new Promise((resolve,reject)=>{				
				ajax.post(u,data)
				.then(res=>{
					resolve(res)
				}).catch(err=>{
					reject(err)
				})
			})	
		},
		bindAlipay(){
			var u =service.common + '/alipay-service/oauth2/bind',
				data = {
					appId:config.alipayAppid,
					openId:utils.getCookie('openId'),
					phone:this.phone,
					userId:utils.getCookie('userId')
				};
			return new Promise((resolve,reject)=>{				
				ajax.post(u,data)
				.then(res=>{
					resolve(res)
				}).catch(err=>{
					reject(err)
				})
			})		
		},
		bindDingDing(){
			var u = service.dingding + '/dingding-service/user/bind',
				data = {
					userId:utils.getCookie('userId'),
					corpId:utils.getCookie('corpId'),
					openId:utils.getCookie('openId'),
					phone:this.phone
				};
			return new Promise((resolve,reject)=>{				
				axios.post(u,data)
				.then(res=>{
					resolve(res.data)
				}).catch(err=>{
					reject(err)
				})
			})	
		}
	}	
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/variables';
@import './login';
</style>