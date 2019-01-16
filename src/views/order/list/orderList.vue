<template>
	<div class="order-list">
    	<div class="page-infinite-wrapper">
			<div class="null" v-if="result">
				{{result}}
			</div>
			<ul v-infinite-scroll="loadMore"
				infinite-scroll-disabled="loading"
				infinite-scroll-distance="10">
				<li class="cast" v-for="(item,index) in orderList">
					<div class="header">{{item.time | time}}</div>
					<div class="content">
						<router-link :to="{ name: 'orderDetail', params: { id:item.detail.slice(31)},query:{from:'orderList'}}">
							<div class="imgs">
								<img v-for="good in item.goods" :src="good.image" :alt="good.name">
							</div>
							<div class="info">
								<p>{{getStr(item.goods)}}</p>
								<p v-if="!item.serviceSubscriptionId">共<span class="bold pointer">{{item.quantity}}</span>件</p>
								<p v-if="!item.serviceSubscriptionId">实付：<span class="price bold pointer">￥{{item.total}}</span></p>
							</div>
							<!--<div class="right">
								<img src="../../assets/imgs/icon-right.png">
							</div>-->
						</router-link>
					</div>
					<div class="footer">
						<div class="status" :class="setStatusClass(item)">
							<span class="spot" :class="setSpotClass(item)"></span>
							{{item.statusName}}
						</div>
						<div class="actions">
							<button v-if="item.operations[0].name" v-for="btn in item.operations" @click="btnAction(item,index,btn.type,btn)" class="btn btn-primary" :class="setBtnClass(btn)">{{btn.name}}</button>
						</div>
					</div>
				</li>
			</ul>
			<p v-show="loading && !allLoaded && !loadError" class="page-infinite-loading">
				<mt-spinner type="fading-circle"></mt-spinner>
				加载中...
			</p>
			<p v-show="allLoaded && !result" class="page-infinite-loading" style="background:#f1f1f1">
				已经到底了
			</p>
		    <p v-show="loadError" @click="getList()" class="page-infinite-loading" style="background:#f1f1f1">
			    加载出错了,点我重试
		    </p>
    	</div>
	</div>
</template>
<script>
import { config , service } from '../../../common/config';
import { ajax } from '../../../common/ajax';
import { utils } from '../../../common/utils';
export default{
	name:"orderList",
	data(){
		return {
			title:'我的订单',
			phone:utils.getCookie('phone'),
			orderList:[],
			pageNo:1,
			pageSize:10,
			loading:true,
			wrapperHeight: 0,
			allLoaded: false,
			result:"",
			loadError:false,
			firstLoad: true
		}
	},
	methods:{
		setBtnClass(btn){
			return {
				['btn-secondary']: [100,110,105,103,202,102,203].indexOf(btn.type) != -1
			}
		},
		setStatusClass(item){
			return {
				['cancel']: item.canceled,
				['wait']: [3,4,5,6].indexOf(item.statusType) != -1,
				['success']: [7].indexOf(item.statusType) != -1
			}
		},
		setSpotClass(item){
			return {
				['spot-cancel']: item.canceled,
				['spot-wait']: [3,4,5,6].indexOf(item.statusType) != -1,
				['spot-success']: [7].indexOf(item.statusType) != -1
			}
		},
		btnAction(item,index,type,btn){
			if(type == 100){
			  this.deleteOrder(item,index)
			}
			if(type == 105){
			  this.cancelOrder(item)
			}
			if(type == 202 || type == 102 || type==203){
			  this.remindOrder(item,type)
			}
			if(type == 204 || type == 104){
			  this.comfirmOrder(item,btn)
			}
			if(type == 101){
			  this.payNow(item)
			}
			if(type == 103){
				let deliverUrl = this.getDeliveUrl(btn.url)
				/*window.location.href = deliverUrl;*/
				this.$router.push({name:'checkDeliver',params:{deliverUrl:deliverUrl}})
			}
		},
		getDeliveUrl(u){
			let uIndex = u.indexOf('url=') + 4;
			let url = decodeURIComponent(u.slice(uIndex,u.length));
			return url;
		},
		goBack(){
			utils.goBack(this);
		},
		getList(){
			this.loadError = false;
			/*this.$indicator.open({
				spinnerType: 'fading-circle'
			});*/
			let appId = utils.getCookie("we_appId");
			this.phone = utils.getCookie('phone');
			var u = service.common + '/app-background/order/orderList?page=' + this.pageNo + '&phoneno=' + this.phone + '&appId=' + appId;
			//var u = 'http://192.168.1.89:8098' + '/app-background/order/orderList?page=' + this.pageNo + '&phoneno=' + this.phone + '&appId=' + appId;
			ajax.get(u).then(res=>{
				this.$indicator.close();
				this.firstLoad = false;
				if(utils.getStatusCode(res.code) == config.successCode && res.data){
					for(let i = 0; i<res.data.length; i++){
						this.orderList.push(res.data[i])
					}
					this.loading = false;
					
					this.pageNo+=1;
					if(this.orderList.length==0){
						this.result="没有相关订单！";
						this.allLoaded = true;
					}
					if(res.data.length < this.pageSize){
						this.allLoaded = true;
					}
				}else{
					this.$toast(res.message);
					this.loadError = true;
				}
			}).catch(err=>{
				this.$indicator.close();
				this.loadError = true;
			})
		},
		getRemindType(q){
			if(q == 202){
				return "TAKEORDER";
			}
			if(q == 203){
				return "SERVICE";
			}
			if(q == 102){
				return "DELIVERY";
			}
		},
		remindOrder(item,type){
			this.$indicator.open({
				spinnerType: 'fading-circle'
			});
			let remindType = this.getRemindType(type);
			let data = {
			  userId: utils.getCookie('userId'),
			  orderId: item.id,
			  type: remindType
			}
			let u = service.common + '/app-background/order/orderReminder?userId=' + data.userId + '&orderId=' + data.orderId + '&type=' + data.type;
			ajax.get(u).then(res => {
				this.$indicator.close();
				if(res.resultCode == config.successCode){
					this.$toast({
						message: res.msg,
						position: 'middle',
						duration: 1000
					});
				}else{
					this.$toast(res.message);
				}
			}).catch(err=>{
				this.$indicator.close();
				this.$toast('网络连接失败，请重试');
			})
		},
		comfirmOrder(item,btn){
			let msg = '';
			if(btn.name == '确认完成'){
				msg = '是否确认完成?'
			}else{
				msg = '是否确认收货?'
			}
			this.$messageBox.confirm(msg,' ').then(confirm =>{
				this.$indicator.open({
					spinnerType: 'fading-circle'
				});
				let u = service.common + "/app-background/order/userConfirm?orderId=" + item.id;
				ajax.post(u).then(res => {
					this.$indicator.close();
				if(res.message == '操作成功'){
					
					this.$toast({
						message: "确认成功",
						position: 'middle',
						duration: 1000
					});
					setTimeout(function(){
						window.location.reload();
					},1000)
				}else{
					this.$toast(res.message);
				}
			  }).catch(err=>{
					this.$indicator.close();
					this.$toast('网络连接失败，请重试');
				})
			})
		},
		cancelOrder(item){
			this.$messageBox.confirm('是否确认取消订单?',' ').then(confirm =>{
				this.$indicator.open({
					spinnerType: 'fading-circle'
				});
				let u = service.common + "/app-background/order/cancel?orderId=" + item.id;
				ajax.post(u).then(res=>{
					this.$indicator.close();
					if(utils.getStatusCode(res.code) == config.successCode){
						window.location.reload();
					}else{
						this.$toast(res.message);
					}
				}).catch(err=>{
					this.$indicator.close();
					this.$toast('网络连接失败，请重试');
				})
			})
		},
		deleteOrder(order,index){
			this.$messageBox.confirm('是否删除订单？',' ').then(confirm => {
				this.$indicator.open({
					spinnerType: 'fading-circle'
				});
				let u = service.common + '/app-background/order/delete?orderId=' + order.id;
				ajax.get(u).then(res=>{
					this.$indicator.close();
					if(utils.getStatusCode(res.code)==config.successCode){
						this.orderList.splice(index,1);
					}else{
						this.$toast(res.message);
					}
				}).catch(err=>{
					this.$indicator.close();
					this.$toast('网络连接失败，请重试');
				})
			});
		},
		payNow(item){
			this.$indicator.open({
				spinnerType: 'fading-circle'
			});
			var u = service.common+"/app-background/order/getPayUrl?orderId="+item.id
			ajax.get(u).then(res => {
				this.$indicator.close();
				if(utils.getStatusCode(res.code)==config.successCode){
					var env=utils.getEnv();
					if(env=='jd' || utils.getCookie('we_appId')=='wgjB8Jo7N'){
	                    var callBackUrl=service.common+'/mall/paySuccess-7';
	                    var url=decodeURIComponent(res.data.payUrl),
	                    	ma=/processInstanceId=(.*)/ig,
	                    	result=ma.exec(url);
	                    this.$router.push({name:'payList',query:{processInstanceId:result[1],callBackUrl:callBackUrl,phone:this.phone}})						
					}else{
						// let ma=/url=(.*)/ig,
						// 		url=res.data.payUrl,
						// 		phone=this.phone,
						// 		result=ma.exec(url);
	     //                if(utils.isTestEnv() || utils.isWeixin()){
	     //                  var callBackUrl=service.common+'/mall/paySuccess-7';
	     //                  var jumpUrl=result[1]+'&phone='+this.phone+'&callBackUrl='+callBackUrl+'&platform=6&openId='+utils.getCookie('openId');
	     //                }else{
	     //                  var callBackUrl=service.www+'/mall/paySuccess-7';
	     //                  var wwwPay=result[1].replace(config.mode,"www.wang-guanjia.com");
	     //                  var jumpUrl=wwwPay+'&phone='+phone+'&callBackUrl='+callBackUrl+'&platform=6&openId='+utils.getCookie('openId');
	     //                }
	     //                window.location.href = decodeURIComponent(jumpUrl);

	                    var url=decodeURIComponent(res.data.payUrl),
	                        ma=/processInstanceId=(\d*)$/,
	                        result=ma.exec(url);
	                    if(result && result[1]){
	                      this.$store.dispatch('setCreateOrder',null);
	                      if(utils.isTestEnv() || env=='weixin' || env=='jd' || env=='dingding'){
	                        var callBackUrl=service.self+'/pay/callback';
	                        window.location.href=service.self+'/pay/list?processInstanceId='+result[1]+'&callBackUrl='+callBackUrl;
	                        // this.$router.push({name:'payList',query:{processInstanceId:result[1],callBackUrl:callBackUrl}})
	                      }else{
	                        var callBackUrl=service.www+'/wemall/pay/callback';
	                        var jumpUrl=service.www + '/wemall/pay/list?processInstanceId='+result[1]+'&callBackUrl='+callBackUrl;
	                        window.location.href=jumpUrl;
	                      }
	                    }  	                    
					}	

				}else{
					this.$toast(res.message);
				}
			}).catch(err=>{
				this.$indicator.close();
				this.$toast('网络连接失败，请重试');
				utils.console(err)
			})
		},
		getStr(arr){
			if(arr){
				var names=[];
				for(var i=0;i<arr.length;i++){
					names.push(arr[i].name)
				}
				return names.join('、')
			}
		},
		loadMore() {
			if(!this.allLoaded && !this.firstLoad){
				this.loading = true;
				this.getList()
				utils.console("loadmore")
			}
		}
	},
	mounted(){
		var timeLit=setInterval(()=>{
			if(utils.getCookie('phone') && this.firstLoad){
				this.getList();
				clearInterval(timeLit);
			}
		},500);
	},
	filters:{
		time: function(value){
			var date = new Date(value);
			var Y = date.getFullYear(),
					m = date.getMonth() + 1,
					d = date.getDate(),
					H = date.getHours(),
					i = date.getMinutes(),
					s = date.getSeconds();
			if (m < 10) {
				m = '0' + m;
			}
			if (d < 10) {
				d = '0' + d;
			}
			if (H < 10) {
				H = '0' + H;
			}
			if (i < 10) {
				i = '0' + i;
			}
			if (s < 10) {
				s = '0' + s;
			}
			var t = Y + '-' + m + '-' + d + ' ' + H + ':' + i + ':' + s;
			return t;
		}
	}
}
</script>
<style lang="scss">
@import '../../../assets/styles/variables';
@import '../../../assets/styles/common.scss';
@import './orderList';
</style>
