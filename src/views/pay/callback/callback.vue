<template>
	<div class="pay-callback">
		<mt-header :title="title"></mt-header>
		<div class="status" :class="{'success':type!=0 || payStatus==1,'fail':payStatus==2,'waiting':payStatus==0}">
			<img v-if="payStatus==0" src="../../../assets/imgs/icon_wait_confirms@3x.png" alt="">
			<img v-if="payStatus==1 || type!=0" src="../../../assets/imgs/icon_end@3x.png" alt="">
			<img v-if="payStatus==2" src="../../../assets/imgs/icon_wrong@3x.png" alt="">
			<span v-if="type==0">
				<span v-if="payStatus==0">支付中...</span>
				<span v-if="payStatus==1">支付成功</span>
				<span v-if="payStatus==2">支付失败</span>
			</span>
			<span v-if="type==1">支付成功</span>
			<span v-if="type==2">预约成功</span>
			<span v-if="type==3">下单成功</span>
		</div>
		<div class="tip">
			<p v-if="type==0">
				<span v-if="payStatus==0">是否支付成功？</span>
				<span v-if="payStatus==1">感谢您的购买</span>
				<span v-if="payStatus==2">您的订单未完成支付！</span>
			</p>
			<p v-if="type==1">感谢您的购买</p>
			<p v-if="type==2">预约成功，请您在服务完成时在规定的时间内进行确认订单并付费，否则会对您的信用评分造成影响</p>
			<p v-if="type==3">感谢您的购买</p>
		</div>
		<div class="action">
			<button @click="toIndex()" v-if="payStatus==1 || payStatus==2 || type!=0" class="grey">回到首页</button>
			<button @click="toOrderList()" v-if="payStatus==1 || type!=0" class="primary">查看订单</button>
			<button @click="toPay()" v-if="payStatus==0" class="grey">重新支付</button>
			<button @click="toPay()" v-if="payStatus==2" class="primary">重新支付</button>
			<button @click="getPayStatus()" v-if="payStatus==0" class="primary">支付成功</button>
		</div>
	</div>
</template>
<script>
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';	
export default{
	name:'payCallback',
	data(){
		return{
			type:1,  //0为微信中支付，1为支付成功，2为先服务后付费，3为0元订单，4为余额支付
			payStatus:null, //0为支付中，1为支付成功，2为支付失败,只有当type==0 || type==4的时候才会有值
			title:'支付结果',
			processInstanceId:this.$route.query.pId, //只有当type为0的时候才有
			timer: 0,
			count: 0
		}
	},
	methods:{
		getPayStatus(){
			let _self = this;
			this.count ++;
			if(this.count === 1){
				this.$indicator.open({
					spinnerType:'triple-bounce'
				})
			}
			var u = service.common + '/app-background/payInfo/orderpaystatus.api?processInstanceId='+this.processInstanceId;
			ajax.get(u).then(res=>{
				this.$indicator.close();
				if(utils.getStatusCode(res.code)==200){
					if(res.data.status != 1){
						clearInterval(this.timer);
						if(this.count !== 1){
							this.$indicator.open({
								spinnerType:'triple-bounce'
							})
							setTimeout(() => {
								this.$indicator.close();
								if(res.data.status == 2){
									_self.payStatus = 1
								}else{
									_self.payStatus = 2;
								}
							},1000)
						}else{
							if(res.data.status == 2){
								_self.payStatus = 1
							}else{
								_self.payStatus = 2;
							}
						}
					}
				}else{
					this.$toast(res.message)
				}
			}).catch(err=>{
				this.$indicator.close();
				this.$toast('网络连接失败，请重试')
			})
		},
		toIndex(){
			this.$router.push({name:'index'})
		},
		toOrderList(){
			this.$router.push({name:'orderList'})
		},
		toPay(){
			var env=utils.getEnv();
			if(utils.isTestEnv() || env=='weixin' || env=='jd'){
				var callBackUrl=service.self+'/pay/callback';
				window.location.href=service.self+'/pay/list?processInstanceId='+this.processInstanceId+'&callBackUrl='+callBackUrl;
			}else{
				var callBackUrl=service.www+'/wemall/pay/callback';
				window.location.href=service.www+'/wemall/pay/list?processInstanceId='+this.processInstanceId+'&callBackUrl='+callBackUrl;
			}
			// this.$router.push({name:'payList',query:{processInstanceId:this.processInstanceId}})
		}

	},
	mounted(){
		let _self = this;
		utils.sendMta('tijiaodingdanch',{'paycallback':'true'})
		var type=this.$route.query.type;
		if(typeof type !="undefined" && typeof type !="null"){
			this.type=parseInt(type);
		}
		if(this.$route.query.pId){
			this.type=0;
		}
		switch(this.type){
			case 0:
			case 4:
					this.payStatus=0;
					this.getPayStatus();
					// 轮询订单状态
					this.timer = setInterval(() => {
						_self.getPayStatus();
					},2000)
					break;
			case 1:
					break;
			case 2:
					this.title="预约成功";
					break;
			case 3:
					this.title="下单成功";
					break;
		}
	},
	destroyed () {
		clearInterval(this.timer);
	}
}
</script>
<style lang="scss" scoped>
@import '../../../assets/styles/variables.scss';
@import './callback';	
</style>