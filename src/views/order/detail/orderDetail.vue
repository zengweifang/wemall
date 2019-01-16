<template>
  <div class="order-detail">
	  <div v-if="detail">
    <!-- 订单状态 -->
    <div class="status" :class="statusClass" v-if="detail">
      <div class="status-icon status-pay" :class="setStatusClass(detail.status.name)"></div>
      <div class="status-msg">
          <p class="status-name">{{detail.status.name}}</p>
	        <p class="status-tip" v-if="detail.status.tips">{{detail.status.tips}}</p>
	        <p class="status-tip" v-if="detail.status.subTips">{{detail.status.subTips}}</p>
          <div v-if="detail.status.type==1" class="status-pay-msg">
             
              <p class="status-lefttime">
                请在<span v-if="detail">{{ time | countDown }}</span>内完成支付
              </p>
              <p>超时订单将自动取消</p>
          </div>
      </div>
    </div>
    <!-- 地址信息 -->
    <section class="address" v-if="detail">
      <div class="img">
        <img src="../../../assets/imgs/icon_location@3x.png" alt="">
      </div>
      <div class="info">
        <p>{{detail.address.name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{detail.address.phone}}</p>
        <p>{{detail.address.detail}}</p>
      </div>
    </section>
		<!--备注-->
		  <section class="remark" v-if="detail.remark">
			  <section class="remark-title">备注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</section>
			  <section>{{detail.remark}}</section>
		  </section>
    <!-- 商品列表 -->
    <section class="goods-list-detail"  v-if="detail">
      <div class="shop-wrapper" v-for="(shop,index) in detail.shop">
        <div class="header">
          <img src="../../../assets/imgs/icon-store.png" alt="">{{detail.shop[index].name}}
        </div>
        <ul class="content">
          <li class="goods" v-for="good in detail.shop[index].goods">
	          <!--<router-link
			          :to="{name:'productDetail',query:{storeId:detail.shop[index].id},params:{goodId:good.id}}">-->
	            <div>
		            <div class="img">
			            <img :alt="good.name" :src="good.image">
		            </div>
		            <div class="title">
			            {{good.name}}
		            </div>
		            <div class="price" v-if="!detail.serviceSubscriptionId">
			            <p>￥{{good.price}}</p>
			            <p>x{{good.quantity}}</p>
		            </div>
		            <div class="clear"></div>
		            <div class="attribute">
			            <p v-for="i in good.attribute">{{i.title}}：{{i.value}}</p>
			            <!--<p v-if="detail.remark">备注：{{detail.remark}}</p>-->
		            </div>
	            </div>
	          <!--</router-link>-->
          </li>
        </ul>
      </div>
	    
    </section>
    <!-- 订单基本信息 -->
    <section class="order-info"  v-if="detail">
      <p v-for="i in detail.base_infos">{{i.title}}：{{i.value}}</p>
    </section>
    <!-- 订单金额 -->
    <section class="finacial-info"  v-if="detail && !detail.serviceSubscriptionId">
      <p>商品金额<span>&yen;{{detail.total}}</span></p>
      <p>配送费<span>&yen;{{detail.freight}}</span></p>
      <p v-if="detail.coupon>0">优惠券<span>-&yen;{{detail.coupon}}</span></p>
      <div class="real-pay">
        实付金额<span>￥{{detail.subTotal}}</span>
      </div>
    </section>
    <div class="footer-btn"  v-if="detail">
      <button class="btn bigger btn-primary"
              v-for="btn in reverBtnList"
              :class="setBtnClass(btn)"
              @click="btnAction(detail,btn.type,btn)">
              {{btn.name}}
      </button>
    </div>
	  </div>
  </div>
</template>
<script>
  import { config , service } from '../../../common/config';
  import { ajax } from '../../../common/ajax';
  import { utils } from '../../../common/utils';
  export default {
    name: "orderDetail",
    data() {
      return {
        id:this.$route.params.id,
        // index:this.$route.query.index,
        title: "订单详情",
        detail:null,
        /*time:this.detail.status.payment_time_left,*/
        time:0,
        flag : false,
	    phone:utils.getCookie('phone')
      }
    },
    methods:{
	    goBack(){
	    	if(this.$route.query.from=='orderList'){
		    	utils.goBack(this);
	    	}else{
	    		this.$router.push({name:'index'})
	    	}
	    },
			btnAction(detail,type,btn){
				if(type == 100){
					this.deleteOrder(detail)
				}
				if(type == 105){
					this.cancelOrder(detail)
				}
				if(type == 202 || type == 102 || type==203){
					this.remindOrder(detail,type)
				}
				if(type == 204 || type == 104){
					this.comfirmOrder(detail)
				}
				if(type == 101){
					this.payNow(detail)
				}
				if(type == 103){
					let deliverUrl = this.getDeliveUrl(btn.url);
					this.$router.push({name:'checkDeliver',params:{deliverUrl:deliverUrl}});
				}
			},
      deleteOrder(detail){
				this.$messageBox.confirm('是否删除订单?',' ').then(confirm => {
					this.$indicator.open({
						spinnerType: 'fading-circle'
					});
					let u = service.common + '/app-background/order/delete?orderId=' + detail.id;
					ajax.get(u).then(res=>{
						this.$indicator.close();
						if(utils.getStatusCode(res.code)==config.successCode){
							window.history.go(-1);
						}else{
							this.$toast(res.message);
						}
					}).catch(err=>{
		        this.$indicator.close();
			      this.$toast('网络连接失败，请重试');
		      })
      });
      },
	    getDeliveUrl(u){
		    let uIndex = u.indexOf('url=') + 4;
		    let url = decodeURIComponent(u.slice(uIndex,u.length));
		    return url;
	    },
	    payNow(item){
		    this.$indicator.open({
			    spinnerType: 'fading-circle'
		    });
		    var u = service.common+"/app-background/order/getPayUrl?orderId="+item.id
		    ajax.get(u).then(res => {
			    if(utils.getStatusCode(res.code)==config.successCode){
				    this.$indicator.close();
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
	    remindOrder(detail,type){
		    let remindType = this.getRemindType(type);
		    let data = {
			    userId: utils.getCookie('userId'),
			    orderId: detail.id,
			    type: remindType
		    }
		    let u = service.common + '/app-background/order/orderReminder?userId=' + data.userId + '&orderId=' + data.orderId + '&type=' + data.type;
		    ajax.get(u).then(res => {
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
				    this.$toast('网络连接失败，请重试');
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
				    if(res.message == '操作成功'){
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
	    comfirmOrder(item){
		    let msg = '';
		    if(this.detail.status.tips){
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
			        window.location.reload()
				    }else{
					    this.$toast(res.message);
				    }
	        }).catch(err=>{
				    this.$indicator.close();
				    this.$toast('网络连接失败，请重试');
			    })
	      })
	    },
      setStatusClass(name){
        switch (name) {
          case "待付款":
	          return "status-pay";
	          break;
          case "已取消":
	          return "status-cancel";
	          break;
          case "交易完成":
            return "status-ok";
	          break;
          case "等待卖家接单":
	          return "status-wait-list";
	          break;
          case "配送中":
            return "status-deliver";
	          break;
          case "等待买家服务":
            return "status-wait-server";
	          break;
          case "服务中":
            return "status-servering";
	          break;
          case "等待买家确认服务完成":
          case "等待卖家确认服务完成":
            return "status-wait-confirm";
	          break;
        }
      },
      setBtnClass(btn){
        return {
          ['btn-secondary']: [100,110,103,105,202,102,203].indexOf(btn.type) != -1
        }
      },
      getDetail(id){
	      this.$indicator.open({
		      spinnerType: 'fading-circle'
	      });
        let u = service.common + "/app-background/order/detail?orderIds=" + id;
        //let u = 'http://192.168.1.89:8098' + "/app-background/order/detail?orderIds=" + id;
        ajax.get(u).then(res =>{
          this.$indicator.close();
          if(utils.getStatusCode(res.code)==200 && res.data){
            this.detail = res.data;
		        this.$indicator.close();
		        if(this.detail.status.payment_time_left > 0){
			        this.time = parseInt(this.detail.status.payment_time_left);
			        let self = this;
			        setInterval(function(){
				        if (self.time >=1000){
					        self.time-=1000
				        }else{
					        setTimeout(function (){window.location.reload()},3000)
				        }
			        },1000)
		        }
          }else{
	          this.$toast(res.message);
          }
        }).catch(err=>{
		      this.$indicator.close();
		      this.$toast('网络连接失败，请重试');
	      })
      }
    },
    filters:{
      countDown: function(value){
        let leftTime = parseInt(value/1000)
        let m = parseInt(leftTime/60%60)
        let s = parseInt(leftTime%60)
        return `${m}分${s}秒`
      }
    },
    computed: {
      reverBtnList() {
        return this.detail.operations.reverse();
      },
      statusClass() {
        let statusName = this.detail.status.name;
        switch (statusName) {
          case "已取消":
            return "cancel"
          case "待付款":
            return "paynow"
          case "交易完成":
            return "success"
          default:
            return "waiting"
        }
      }
    },
    mounted(){
      this.getDetail(this.id);

    }

  }
</script>
<style lang="scss">
  @import '../../../assets/styles/variables';
  @import '../../../assets/styles/common.scss';
  @import './orderDetail';
</style>
