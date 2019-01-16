<template>
	<div class="user-index">
		<div class="content">
			<div class="login" @click="action()">
				<div class="img fl"><st-img :src="userInfo.imageUrl"></st-img></div>
				<span class="text-hide">{{userInfo.nickName?userInfo.nickName:phone?phone:'验证码登录'}}</span>
				<i class="iconfont icon-more fr"></i>
			</div>
			<div class="function">
				<ul>
					<li>
						<router-link :to="{name:'packageList',query:{'from':'self'}}">
							<i class="iconfont icon-wodefuwu" style="font-size:19px;"></i>
							<span>我的服务</span>
							<i class="iconfont icon-more fr"></i>
						</router-link>
					</li>				
				</ul>
			</div>
			<div class="other">
				<ul>
					<li @click="call()">
						<!-- <a href="tel:4008898112"> -->
							<i class="iconfont icon-tel1"></i>
							<span>联系客服</span>
							<i class="iconfont icon-more fr"></i>
							<span class="fr text">8:30~20:30</span>
						<!-- </a> -->
					</li>
					<li @click="toFeedback()">
						<i class="iconfont icon-suggestion"></i>
						<span>意见反馈</span>
						<i class="iconfont icon-more fr"></i>
					</li>
					<li>
						<router-link :to="{name:'userQuestion'}">
							<i class="iconfont icon-question"></i>
							<span>常见问题</span>
							<i class="iconfont icon-more fr"></i>
						</router-link>
					</li>
					<li @click="toTravelAgent()" v-if="isWaChatChannel">
						<img src="../../../assets/imgs/agent-icon.png">
						<span>成为代理</span>
						<i class="iconfont icon-more fr"></i>
					</li>								
				</ul>
			</div>
		</div>	
	</div>
</template>
<script>
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {auth} from '../../../common/auth';
import {utils} from '../../../common/utils';	
import {login} from '../../../common/login';	
import stImg from '../../../components/img/img';
export default{
	name:'userIndex',
	data(){
		return{
			isWaChat: utils.isWeixin(),
			isWaChatChannel: this.$route.query.we_appId === 'wgj9VCeGP',
			phone:utils.getCookie('phone'),
			userHead:utils.getCookie('userHead'),
			userInfo:{}
		}
	},
	components:{
		stImg
	},
	computed:{

	},	
	methods:{
		goBack(){
			utils.goBack();
		},
		call(){
			this.$messageBox({
				title:'提示',
				message:'<p>拨打电话</p><p>4008898112</p>',
				showConfirmButton:true,
				showCancelButton:true,
				confirmButtonText:'呼叫'
			}).then(action=>{
				if(action=='confirm'){
					window.location.href="tel:4008898112";
				}
			})
		},
		action(){
			var env=utils.getEnv();
			if(!login.isLogin()){
				if(env!='alipay_channel' && env!='weixin' && env !='dingding'){
		             this.$router.push({name:'login',query:{from:'chooseAddr'}})
		        }	
			}else{
				this.$router.push({name:'userInfo'})
			}
		},
		getInfo(){
			this.$indicator.open({
			  spinnerType: 'fading-circle'
			});				
			var u=service.common+'/app-background/users/userinfo.api';
			ajax.get(u,{
				params:{
					phone:utils.getCookie('phone')
				}
			}).then(res=>{
				this.$indicator.close();
				if(utils.getStatusCode(res.code)==200){
					this.userInfo=res.data;
				}else{
					this.$toast(res.message);		
				}
			}).catch(err=>{
				this.$indicator.close();
				this.$toast('网络连接失败，请重试');				
			})
		},		
		logout(){
			this.phone=null;
			utils.delCookie('userId');
			utils.delCookie('phone');
			utils.delCookie('Authorization');
			utils.delCookie('refreshToken');
			utils.delCookie('auth_mode');
			//如果当前选择的园区中有phone等信息也清除掉
			var selRegion=utils.getLocalStorage('we_selRegion');
			if(selRegion){
				selRegion.gender=null;
				selRegion.name=null;
				selRegion.phone=null;
				selRegion.tag=null;
				selRegion.enable=null;
			}
			utils.setLocalStorage('we_selRegion',selRegion)
			//重新拿匿名token
			auth.init();
		},
		toFeedback(){
			if(login.isLogin()){
				this.$router.push({name:'userFeedback'})
			}else{
				this.$toast('请先登录');
			}
		},
		toTravelAgent() {
			this.$router.push({name:'travelAgent'})
		}
	},
	mounted(){
		var phone=utils.getCookie('phone');
		if(phone && utils.checkPhone(phone) && utils.getCookie('userId')){
			this.getInfo();
		}
	}
}
</script>
<style lang="scss" scoped>
@import '../../../assets/styles/variables.scss';
@import './index';	
</style>