<template>
	<div class="package-exchange">
		<div class="error" v-if="errorTip">
			<img src="../../../assets/imgs/icon_helplessman_index.png" alt="">
			<p>{{errorTip}}</p>	
		</div>
		<div class="normal" v-if="!errorTip">
			<mt-header :title="$route.meta.title" fixed>
				<div slot="left">
			    	<mt-button @click="close()">
			    		<i class="iconfont icon-close" style="font-weight: 600;font-size:20px;"></i>
			    	</mt-button>
				</div>
				<div slot="right">
					<router-link :to="{name:'packageList',query:{from:'self'}}">我的套餐</router-link>
				</div>
			</mt-header>		
			<div class="content" v-if="packageList">
				<div class="package-item" v-for="item in packageList">
					<div class="detail">
						<h2>{{item.name}}</h2>
						<ul>
							<li v-for="gItem in item.subscriptionGoods">
								<span class="fl">{{gItem.goodName}}</span>
								<span class="fr">{{gItem.goodNumber}}次</span>
							</li>															
						</ul>
					</div>
				</div>
	<!-- 			<div class="time">
					套餐使用有效期：xxxxxxxxx
				</div> -->			
				<div class="tips">
					<p>温馨提示：</p>
					<ul>
						<li>成功兑换后，请尽快预约套餐内服务~过期无法预约~~</li>
						<li>兑换的套餐将与登录手机号绑定，查看和使用套餐时请注意登录手机号是否正确。</li>
						<li>若已经兑换过，请点击页面右上角“我的套餐”免费预约服务。</li>
					</ul>
				</div>
			</div>
			<button  v-if="!errorTip" class="button" @click="action()">立即兑换</button>
		</div>
		<mt-popup
			class="input-modal"
			v-model="inputModal"
			:modal="true"
			:closeOnClickModal="true"
			popup-transition="popup-fade"
			position="center">
				<div class="input-box">
					<div class="box-header">
						<h1>请输入兑换卡密码</h1>
					</div>
					<div class="box-content">
<!-- 						<p>
							<label>帐&emsp;号：</label>
							<span>{{couponId}}</span>
						</p> -->
						<p>
							<label>密&emsp;码：</label>
							<input type="text" v-model="couponCode">
						</p>
					</div>
					<div class="box-footer">
						<button @click="toggleModal()">先等等</button>
						<button :class="{'dis disabled':!couponCode || noClick}" @click="confirm()">确定</button>
					</div>
				</div>
		  </mt-popup>
	</div>
</template>
<script>
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';
import {login} from '../../../common/login';
import {mapActions,mapGetters} from 'vuex'	
import wxImg from '../../../assets/imgs/wx-code.jpg';
export default{
	name:'selectCoupon',
	data(){
		return{
			inputModal:false,
			couponCode:'',
			// couponId:"f46d5dbe-f900-4b46-9978-245f4f580fb8",
			couponId:this.$route.query.couponId,
			packageList:null,
			errorTip:"",
			noClick:false
		}
	},
	filters:{
		dateFilter:function(v){
			var date=new Date(v),
				year=date.getFullYear(),
				month=date.getMonth()+1,
				day=date.getDate();
			month>=10?"":month='0'+month;
			day>=10?"":day='0'+day;
			return year+'-'+month+'-'+day;
		}
	},
	computed:{
		...mapGetters({
			"useRegion":'useRegion'
		}) 
	},	
	methods:{	
		goBack(){
			utils.goBack();
		},
		close(){
			try{
				utils.close();
			}catch(e){
				utils.goBack();
			}
		},
		toggleModal(){
			this.inputModal=!this.inputModal;
			if(this.inputModal){
				utils.sendMta('duihuantaocan',{'clickexchangebutton':'true'})
			}
		},
		action(){
			if(!login.isLogin()){
				if(!utils.isWeixin()){
		             this.$router.push({name:'login',query:{from:'exchange'}})
		        }	
			}else{
				this.toggleModal()
			}
			
		},
		confirm(){
			this.noClick=true;
			this.inputModal=false;
			this.$indicator.open({
			  	spinnerType: 'triple-bounce'
			});	
			var u = service.common + "/coupon/coupon/consumeGift",
				data = {
					couponId:this.couponId,
					couponCode:this.couponCode,
					phone:utils.getCookie('phone')
				};
			utils.sendMta('duihuantaocan',{'exchange':'true'})	
			ajax.post(u,data).then(res=>{
				this.$indicator.close();
				this.noClick=false;
				if(utils.getStatusCode(res.code)==200){	
					utils.sendMta('duihuantaocan',{'exchangeresult':'true'})	
					this.$messageBox({
						title:'',
						message:'<div class="exchange-box"><p class="input-box-tip">&emsp;兑换成功！</p><div><img class="wx-code" src="'+wxImg+'" /></div><p>下一步：长按识别二维码，关注旺管家公众号免费预约</p></div>',
						confirmButtonText:'去使用',
						confirmButtonClass:'to-use'
					}).then(res=>{
						this.$router.push({name:'packageList',query:{
							from:'self'
						}})
					})
				}else{
					this.$toast(res.message);
					// this.inputModal=true;
				}
			}).catch(err=>{
				this.$indicator.close()
				this.$toast('网络连接失败，请重试')		
				this.noClick=false;		
			})
		},
		getPackageInfo(){
			this.$indicator.open({
				spinnerType:'fading-circle'
			})
			var u = service.common + "/coupon/wechatCard/getServiceSubscriptionByCouponId",
				data = {
					couponId:this.couponId
				};
			ajax.get(u,{
				params:data
			}).then(res=>{
				this.$indicator.close()
				if(utils.getStatusCode(res.code)==200){
					this.packageList=res.data;
				}else{
					this.errorTip=res.message;
					this.$messageBox({
						title:'',
						message:'<p class="input-box-tip">&emsp;'+res.message+'</p>',
						confirmButtonText:'请重试',
						confirmButtonClass:'to-use'
					}).then(res=>{
						this.getPackageInfo();
					})					
				}
			}).catch(err=>{
				this.$indicator.close()
				this.$toast('网络连接失败，请重试')
				this.errorTip="网络连接失败"
			})
		}
	},
	mounted(){
		utils.sendMta('duihuantaocan',{'enterpackage':'true'})
		if(!this.$route.query.couponId){
			this.errorTip="请打开扫一扫，通过扫描二维码进入本页面";
			this.$messageBox({
				title:'提示',
				message:'请打开扫一扫，通过扫描二维码进入本页面',
				cancelButtonText:'确定'
			}).then(res=>{

			})
			return;
		}
		this.getPackageInfo();
	}
}
</script>
<style lang="scss">
@import '../../../assets/styles/variables.scss';
@import './exchange';	
</style>