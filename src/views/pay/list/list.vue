<template>
	<div class="pay-order">
		<div class="pay-price">订单金额
			<span>&yen;{{price}}</span>
		</div>
		<div class="payment-list">
			<h1>选择支付方式</h1>		
			<ul class="list">
				<li v-for="(item,index) in list" @click="payContent(item)">
					<img :src="item.icon" :alt="item.name">
					<h2 class="text-hide" :class="{disabled: amountDisabled}">{{item.name}}</h2>
					<p class="text-hide" v-if="item.type != 78" :class="{disabled: amountDisabled}">{{item.description}}</p>
					<!-- <h2 class="text-hide" v-if="item.type == 78" :class="{disabled: amountDisabled}">{{item.name}}</h2> -->
					<p class="text-hide" v-if="item.type == 78" :class="{disabled: amountDisabled}">{{amount}}<span v-if="showSpan">(</span>{{item.amount === 0 ? '0.00': item.amount}}<span v-if="showSpan">)</span></p>
					<i class="iconfont icon-more"></i>
				</li>
			</ul>
		</div>
		<div v-html="alipayContent" v-if="alipayContent"></div>
		<mt-popup
            v-model="popupVisible"
            :popup-transition="'popup-fade'" :position="'center'" :closeOnClickModal='false'>
            <div class="popupInner">
                <div class="content">
                    <div class="content-title">支付确认</div>
                    <div class="content-text">确认支付{{price}}元?</div>
                </div>
                <div class="btn">
                    <button class="left-btn" @click.stop="fail()">取消</button>
                    <button class="right-btn" @click.stop="success()">确认</button>
                </div>
            </div>
        </mt-popup>
	</div>
</template>
<script>
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';
export default{
	name:'payList',
	data(){
		return{
			list:[],
			amountItem: null,
			processInstanceId: this.$route.query.processInstanceId,
			platformType:2,
			callBackUrl:'',
			phone:utils.getCookie('phone'),
			price:0,
			alipayContent:'',
			env:utils.getEnv(),
			amount: '余额:',
			amountDisabled: false,
			showSpan: false,
			popupVisible: false
		}
	},
	methods:{
		payList(){
			this.$indicator.open({
			  spinnerType: 'fading-circle'
			});			
			var u = service.common+"/app-background/payInfo/getpayment.api",
				data = {
					processInstanceId:this.processInstanceId,
					platformType:this.platformType,
					phone:this.phone,
					openId: utils.getCookie('openId')
				}
			ajax.get(u,{
				params:data
			}).then((res)=>{
				this.$indicator.close();
				if(utils.getStatusCode(res.code)==200){
					if(res.data.subtotal==0){
						this.$router.push({name:'orderList'});
						return;
					}
					this.price=res.data.subtotal;
					var payments=res.data.payments;
					for(var i=0,len=payments.length;i<len;i++){
						if(this.env=='jd'){
							//京东中使用京东H5支付
							if(payments[i].type==61){
								this.list.push(payments[i]);
							}
						}else if(this.env=='weixin'){
							//微信中使用微信公众号支付
							if(payments[i].type==37){
								this.list.push(payments[i])
							}
							// 余额支付
							if(payments[i].type == 78){
								this.amountItem = payments[i];
							}

							if(i == len - 1 && this.amountItem){
								if(this.amountItem.amount === undefined || this.amountItem.amount === null){
									this.list.push(this.amountItem)
									this.amount = '未激活';
									this.amountDisabled = true;
								}else{
									if(this.amountItem.amount < this.price){
										this.list.push(this.amountItem)
										this.amount = '余额不足';
										this.amountDisabled = true;
										this.showSpan = true;
									}else{
										
										this.list.unshift(this.amountItem)
										this.amount = '余额:';
										this.amountDisabled = false;
									}
								}
								
							}
						}else{
							//其他情况中使用支付宝网页支付或者微信H5支付
							if(this.env!='alipay' && this.env!='alipay_channel' && this.env!='dingding'){
							// if(config.mode=='localhost'){
								if(payments[i].type==32){
									this.list.push(payments[i])
								}
							}
							if(payments[i].type==26){
								this.list.push(payments[i]);
							}
						}
					}
				}else{
					this.$toast(res.message);
				}
			}).catch(err=>{
				console.log(err)
				this.$indicator.close();
				this.$toast('网络连接失败，请重试')
			})
		},
		payContent(payItem){
			var type = payItem.type;	
			// 余额支付
			if(type == 78){
				if(!this.amountDisabled){
					this.popupVisible = true;
				}
			}else{
				let data = {
					processInstanceId:this.processInstanceId,
					phone:this.phone,
					type:payItem.type
				};
				if(type==26){
					data.frontEndCallbackUrl=this.callBackUrl;
				}
				if(type==37){
					data.openId=utils.getCookie('openId')
				}
				this.payFun(data,type);
			}
		},
		weJDpay(paydata){
			// var paydata={
			// 	merchant:this.$route.query.merchant,
			// 	orderId:this.$route.query.orderId,
			// 	signData:this.$route.query.signData
			// }
			var _self=this;
			var defer = jsBridgeV3.onReady();
            defer.then(function(res) {               
                res.jrPayMerchantSpe(function(d) {
                	if(typeof d=="string"){
                		if(d.indexOf("JDP_PAY_SUCCESS")>=0){
                			utils.sendMta('tijiaodingdanch',{'paysuccess':'true'})
                			_self.$router.push({name:'payCallback'})
                		}
                	}else if(typeof d=="object"){
                		if(d.payStatus=="JDP_PAY_SUCCESS"){
                			utils.sendMta('tijiaodingdanch',{'paysuccess':'true'})
                			_self.$router.push({name:'payCallback'})
                		}
                	}
                }, {
                    merchant: paydata.merchant,
                    orderId: paydata.orderId,
                    signData:paydata.signData
                });
            })			
		},
		fail(){
			this.popupVisible = false;
		},
		success(){
			let data={
				processInstanceId:this.processInstanceId,
				phone:this.phone,
				type: 78,
				openId: utils.getCookie('openId')
			};
			this.payFun(data,78);
		},
		payFun(data,type){
			let u = `${service.common}/app-background/payInfo/paycontent.api`;
			utils.sendMta('tijiaodingdanch',{'clickpay':'true'})
			if(type == 78){
				this.popupVisible = false;
			}
			this.$indicator.open({
				spinnerType: 'triple-bounce'
			});	
			ajax.get(u,{
				params:data
			}).then(res=>{
				this.$indicator.close();
				if(utils.getStatusCode(res.code)==200){
					switch(type){
						//支付宝网页支付
						case 26:
								this.alipayContent=res.data.content;
								//支付宝自已写入的script无法执行，在页面渲染完成后手动提交
								this.$nextTick(function(){
									document.forms[0].submit();
								});
								break;
						//微信网页支付		
						case 32:
								var url=this.callBackUrl+'?pId='+this.processInstanceId;
								// window.location.replace(res.data.content+'&redirect_url='+url);
								window.location.href=res.data.content+'&redirect_url='+url;
								break;
						//微信公众号支付		
						case 37:		
								var weRes=this.getOBJ(res.data.content);
								this.weWxPay(weRes);
								break;
						//京东支付		
						case 61:
								var jdData=this.getOBJ(res.data.content);
								this.weJDpay(jdData);
								break;
						//余额支付		
						case 78:
								this.$router.push({name:'payCallback',query:{type:4,pId: this.processInstanceId}})
								break;
					}
				}else{
					this.$toast(res.message);
				}
			}).catch(err=>{
				console.log(err)
				this.$indicator.close();
				this.$toast('网络连接失败，请重试')
			})
		},
		/**
		*	将params格式字符串改为对象
		*/
		getOBJ(str){
            var arr=str.split('&'),obj={},
                len=arr.length;
            for(var i=0;i<len;i++){
                   var index=arr[i].indexOf('='),
                       lenX=arr[i].length,
                       key=arr[i].substr(0,index),
                       value=arr[i].substr(index+1,lenX-index);
                    obj[key]=value;
            }
            return obj;
		},
		//用于微信公众号支付
		weWxPay(paydata){
			var _self=this;
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId": paydata.appId,     //公众号名称，由商户传入     
                    "timeStamp": paydata.timeStamp,         //时间戳，自1970年以来的秒数     
                    "nonceStr": paydata.nonceStr, //随机串     
                    "package": paydata.package,
                    "signType": paydata.signType,         //微信签名方式：
                    "paySign": paydata.paySign//微信签名 
            	},
            	function(res){
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                    	utils.sendMta('tijiaodingdanch',{'paysuccess':'true'})
                        _self.$router.push({name:'payCallback'})
                    } else {
                    	this.$toast('支付失败')
                    }
            	}
            );	
		}
	},
	mounted(){
		utils.sendMta('tijiaodingdanch',{'enterpay':'true'})
		if(this.$route.query.callBackUrl){
			this.callBackUrl=this.$route.query.callBackUrl;
		}
		this.payList();
	}
}	
</script>
<style lang="scss" scoped>
@import '../../../assets/styles/common.scss';
@import './list'
</style>