<template>
	<div class="product-detail" :class="{'white':error}">
		<mt-header :title="title" fixed :class="{'header-color':title,'header':!title}">
				<div slot="left">
			    	<mt-button  @click="goBack()" class="detail-circle">
			    		<i class="iconfont icon-back" style="font-weight: 600;font-size:20px;"></i>
			    	</mt-button>
			    	<div class="drop-button" v-if="hasDrop">
			    		<mt-button @click="toggleMenu()" class="detail-circle">
				    		<i class="iconfont icon-menu3" style="font-weight: 600;font-size:20px;"></i>
				    	</mt-button>				
				    	<drop-list v-if="showMenu">
							<li>
								<router-link :to="{name:'index'}">
									<i class="iconfont icon-shouye" style="font-weight: 600;font-size:18px;margin-right:0.15rem;"></i>首页
								</router-link>
							</li>
							<li>
								<router-link :to="{name:'orderList'}">
								<i class="iconfont icon-order1" style="font-weight: 600;font-size:18px;margin-right:0.15rem;"></i>我的订单
								</router-link>
							</li>			    		
				    	</drop-list>
			    	</div>
				</div>
		</mt-header>
		<div class="container">
			<div class="error" v-if="error">
				<img src="../../../assets/imgs/icon_helplessman_index.png" alt="">
				<p>商品信息已过期！</p>
			</div>
			<div class="swiper-area" v-if="!error">
				<mt-swipe :auto="4000" v-if="detail.imageurl">
				  	<mt-swipe-item  v-for="item in detail.imageurl">
						<st-img :src="item" alt="" class="src"></st-img>
				  	</mt-swipe-item>
				</mt-swipe>			
			</div>
			<div class="info" v-if="!error">
				<h1>{{detail.name}}</h1>
				<p class="prickle">{{detail.prickle}}</p>
				<p class="price" v-if="!packageId">&yen;{{detail.channelPrice}} <span v-if="detail.channelPrice<detail.originalPrice">&yen;{{detail.originalPrice}}</span></p>
			</div>
<!-- 			<section class="section coupon" v-if="true" @click="openCouponModal()">
				<label>领取优惠券</label>
				<p class="coupon-list">
					<span v-for="item in couponList">
						<em></em><em></em><em></em><em></em>
						<i class="first"></i>
						<i class="last"></i>
						{{item.leastCost?'满'+item.leastCost+'减'+item.reduceCost:'立减'+item.reduceCost}}
					</span>
				</p>
				<i class="iconfont icon-more" style="float:right;margin-top:1px;"></i>
			</section> -->
			<section class="address section" v-if="!error">
				<div>
					<label>您的地址</label>
					<span class="region"><i class="iconfont icon-dingwei4"></i><span>{{positionStatus}}</span></span>
					<span class="status" v-if="detail.supportDelivery && detail.status==1">
						<span v-if="detail.goodsCategories==1 && detail.quantity>0 && detail.status==1">支持该商品送达</span>
						<span v-if="detail.goodsCategories==1 && detail.quantity<=0">暂时无货</span>
						<span v-if="detail.goodsCategories==2 && detail.quantity>0">支持上门服务</span>
						<span v-if="detail.goodsCategories==2 && detail.quantity<=0">暂无库存</span>
					</span>
					<span class="status" v-if="!detail.supportDelivery || detail.status==2">
						<span v-if="detail.goodsCategories==1">暂不支持购买</span>
						<span v-if="detail.goodsCategories==2">暂不支持上门服务</span>
					</span>				
				</div>
			</section>
			<section class="store section" v-if="detail.shopentry.storeName && !error">
				<div class="store-info">
					<div class="icon fl"><st-img :src="detail.shopentry.imageurl"></st-img></div>
					<div class="title fl">
						<h1 class="text-hide">{{detail.shopentry.storeName}}</h1>
						<p>{{detail.shopentry.storeNotice}}</p>
					</div>
	<!-- 				<div class="enter-store fr" v-if="true">
						<div>
							<mt-button type="primary" :plain="true" size="small" class="enter">进入店铺</mt-button>
						</div>
					</div> -->
				</div>
			</section>
			<cut-off-line v-if="!error" title="商品详情"></cut-off-line>
			<div class="detail" v-if="!error">
				<div class="summary">
					{{detail.summary}}
				</div>
				<div v-html="detail.descriptions" v-if="!error"></div>
			</div>			
		</div>
		
		<div class="fixed-area" v-if="!error">
			<p v-show="!searching" v-if="!detail.supportDelivery || detail.status==2 || detail.quantity<=0  || alipayTip || isPostpaid" class="tips" :class="{'disabled':detail.status==2 && detail.supportDelivery}">
				<span v-if="detail.supportDelivery">
					<span v-if="detail.status==2">商品已下架</span>
					<span v-if="detail.goodsCategories==1 && detail.quantity<=0 && detail.status==1">非常抱歉，所选地区暂时无货！</span>
					<span v-if="detail.goodsCategories==2 && detail.quantity<=0  && detail.status==1">非常抱歉，所选地区暂无库存！</span>
					<span v-if="detail.status==1 && detail.quantity>0 && alipayTip">抱歉，信用分未达到先服务后付费标准，您可直接购买商品</span>
					<span v-if="detail.status==1 && detail.quantity>0 && isPostpaid">符合先服务后付费的标准，可先进行服务体验，再进行付费</span>
				</span>
				<span v-if="!detail.supportDelivery">
					<span v-if="detail.goodsCategories==1">非常抱歉，所选地区暂不支持购买！</span>
					<span v-if="detail.goodsCategories==2">非常抱歉，所选地区暂不支持上门服务！</span>
				</span>	
			</p>
			<div class="fixed-bottons">
				<div class="little call fl ">
					<div>
						<a :href="'tel:'+detail.shopentry.phone">
							<i class="iconfont icon-tel"></i>
							<br>
							<p>联系商家</p>
						</a>
					</div>
				</div>
				<div class="little cart fl" v-if="false">
					<div>
						<i class="iconfont icon-cart"></i>
						<br>
						<p>购物车</p>
					</div>
				</div>
				<div @click="operation()" class="fl parse-long buy-now" :class="{'disabled':(detail.status==2 && detail.supportDelivery) || searching || disClick,'orange':detail.quantity<=0 || !detail.supportDelivery}">
					<span v-if="searching">{{packageId || isPostpaid?'立即预约':'立即购买'}}</span>
					<span v-if="!searching && detail.supportDelivery">
						<span v-if="detail.status==2">商品已下架</span>
						<span v-if="detail.status==1 && detail.quantity<=0">到货通知</span>
						<span v-if="detail.status==1 && detail.quantity>0">{{packageId || isPostpaid?'立即预约':'立即购买'}}</span>
					</span>
					<span v-if="!searching && !detail.supportDelivery">
						求开通
					</span>	
				</div>

<!-- 				<div class="fl" :class="{'buy-now':o==102,'disabled':o==103,'orange':o!=102 && o!=103,'medium':operations.length>1,'parse-long':operations.length==1}"  @click="operation(o)" v-for="o in operations">{{o | operationFilter}}</div> -->
			</div>
		</div>
		<mt-popup
			class="pop-modal"
			v-model="addAmount.openAmount"
			:modal="true"
			:closeOnClickModal="true"
			popup-transition="popup-fade"
			position="bottom">
		  		<div class="add-amount">
			  		<mt-cell title="数量" class="cell">
			  			<sel-amount :number="amount" v-model="amount" :min="minAmount" :max="maxAmount"></sel-amount>
			  		</mt-cell>
			  		<button class="btn" @click="confirmAmount()" :class="{'disabled btn-disabled':!amount || amount<minAmount || disClick}">{{addAmount.button}}</button>
		  		</div>
		  </mt-popup>
<!-- 		  <mt-popup
			class="coupon-modal"
			v-model="couponModal"
			:modal="true"
			:closeOnClickModal="true"
			position="bottom">
				<mt-cell title="领取优惠券" class="header"></mt-cell>
				<div class="content">

					<ul
					  v-infinite-scroll="getCouponList"
					  :infinite-scroll-disabled="loadDisabled"
					  :infinite-scroll-distance="10">
					  <li v-for="item in couponList" :class="{'li-disabled':item.quantity<=0}">
					  		<div class="main-info">
					  			<div class="reduce-price" :class="{'disabled':item.quantity<=0}">&yen;{{item.reduceCost}}</div>
					  			<div class="info" :class="{'disabled info-disabled':item.quantity<=0}">
					  				<h1>{{item.title}}</h1>
					 				<p>
					 					{{item.leastCost?'满'+item.leastCost+'可用':'立减'}}
					  					<button @click="getCoupon(item)" :class="{'disabled':item.quantity<=0 || item.hasBeenReceived}">
					  						<span v-if="item.quantity<=0">领光了</span>
					  						<span v-if="item.quantity>0 && item.hasBeenReceived==1">已领取</span>
					  						<span v-if="item.quantity>0 && item.hasBeenReceived==0">立即领取</span>
					  					</button>
					 				</p>
					  			</div>
					  		</div>
					  		<div class="divide">
					  			<span class="fl"></span>
					  			<hr>
					  			<span class="fr"></span>
					  		</div>
				  			<div class="time">
				  				有效期：{{item.activityBeginTime | timeFilter}}~{{item.activityEndTime | timeFilter}}
				  			</div>
					  </li>
					</ul>
					<p class="statusText">{{infiniteText}}</p>		  	
				</div>
		  </mt-popup>	 -->	
	</div>
</template>
<script>
import selAmount from '../../../components/selAmount/selAmount';
import cutOffLine from '../../../components/cutOffLine/cutOffLine'
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';
import {login} from '../../../common/login';
import {mapActions,mapGetters} from 'vuex';
import stImg from '../../../components/img/img';
import dropList from '../../../components/dropList/dropList';
export default{
	name:"productDetail",
	data(){
		return {
			title:'',
			addressId:'',
			goodId:this.$route.params.goodId,
			groupNumber:this.$route.query.groupNumber,
			packageId:this.$route.query.packageId,
			source:this.$route.query.source,
			storeId:this.$route.query.storeId,
			serviceRegion:'',
			phone:utils.getCookie('phone'),
			userId:utils.getCookie('userId'),
			couponModal:this.$route.query.getCoupon || false,
			couponPage:1,
			couponPageSize:6,
			infiniteText:'正在加载中...',
			loadDisabled:false,
			couponList:[],
			cartCount:0,
			error:false,
			amount:1,
			maxAmount:999,
			minAmount:1,
			//添加数量选择
			addAmount:{
				selAmount:false,
				openAmount:false,
				button:'立即购买'			
			},
			detail:{
				shopentry:{
					phone:''
				}
			},
			searching:true,
			disClick:false,
			showMenu:false,
			hasDrop:utils.getCookie("we_enter")=='list' || utils.getCookie("we_enter")=='detail' || utils.getCookie('we_appId')	=='b9b45c08',
			isPostpaid:utils.getCookie('admittance')=="Y" && utils.getEnv()=='alipay_channel' && !this.$route.query.packageId,
			alipayTip:utils.getEnv()=='alipay_channel' && utils.getCookie('admittance') && utils.getCookie('admittance')!='Y' &&　!this.$route.query.packageId
		}
	},
	components:{
		'st-img':stImg,
		selAmount,
		cutOffLine,
		dropList
	},
	computed:{
     ...mapGetters({
     		"selServiceRegion":"selServiceRegion",
     		"autoRegion":"autoRegion",
     		"useRegion":"useRegion",
     		"pos":'pos',
     		'positionStatus':'positionStatus'
        }) 			
	},
	filters:{
		operationFilter:function(v){
			switch(v){
				case 101 :  return '加入购物车';
						    break;
				case 102 :  return '立即购买';
							break;
				case 103 : 	return '商品下架了';
							break;	
				case 104 :  return '已售罄';
							break;
				case 105 :  return '求开通（服务）';
							break;				
				case 106 :  return '到货通知';
							break;
			}
		},
		tipFilter:function(v){
			switch(v){
				case 103 : 	return '商品已下架';
							break;	
				case 104 :  return '非常抱歉，所选地区暂时无货！';
							break;
				case 105 :  return '非常抱歉，所选地区暂不支持上门服务！';
							break;				
				case 106 :  return '非常抱歉，所选地区暂时无货！';
							break;
			}
		},
		timeFilter:function(v){
			 var time=new Date(v),
			 	 fillZero=(num)=>{
					if(num<10){
						return "0"+num;
					}
					return num;
				};
			 return time.getFullYear() + '.' + fillZero(( time.getMonth() + 1 ))+ '.' + fillZero(time.getDate());
		}		
	},
	methods:{
		...mapActions([
			'setCreateOrder'
		]),	
		goBack(){
			utils.goBack(this);
		},
		toggleMenu(){
			this.showMenu=!this.showMenu;
		},		
		getDetail(goodId,groupNumber,storeId){
			this.$indicator.open({
			  spinnerType: 'fading-circle'
			});
			!goodId?goodId="":"";
			!groupNumber?groupNumber="":"";
			!storeId?storeId="":"";
			this.searching=true;					
			var u =service.common+ '/app-background/goods/gooddetail.api';
			ajax.get(u,{
				headers:{
					'Wgj-Position':this.serviceRegion
					//'Wgj-Position':555555
				},
				params:{
					goodId:goodId,
					groupNumber:groupNumber+'11',
					storeId:storeId,
					appId:utils.getCookie('we_appId'),
					serviceSubscriptionId:this.packageId,
					serviceSubscriptionSource:this.source,
					userId:this.userId,
				}
			}).then(res=>{
				this.$indicator.close();
				this.searching=false;
				if(utils.getStatusCode(res.code)==200){
						if(res.data){
							this.detail=res.data
							if(this.detail.isInvalid==1 || this.detail.isDisable || this.detail.isOnBusiness==0){		// || this.detail.overdue
								this.error=true;
								this.title="";
							}
							if(this.detail.miniQuantity){
								this.minAmount=this.detail.miniQuantity;
								this.amount=this.detail.miniQuantity;

							}
							if(this.detail.maxQuantity){
								this.maxAmount=this.detail.maxQuantity
							}else{
								if(this.detail.isQuantityLimited==1){
									this.limitAmount=1
								}else{
									this.limitAmount=this.detail.quantity<999?this.detail.quantity:999;
								}
							}
						}else{
							this.error=true;
							this.title="";
						}
				}else{
					this.$toast(res.message)
				}
			}).catch(err=>{
				this.$indicator.close();
				this.searching=false;
				this.$messageBox({
					  message: '网络连接失败，请重试',
					  showConfirmButton:true,
					  confirmButtonText:'重试'				
				}).then(action => {
					this.getDetail(this.goodId,this.groupNumber,this.storeId);
				});
			})
		},
		//打开领券pop
		openCouponModal(){
			this.couponModal=true;
		},		
		getCouponList(type){
			if(type==1){
				this.couponList=[];
				this.loadDisabled=false;
			}
			if(this.loadDisabled){
				return;
			}
			this.loadDisabled=true;
			this.infiniteText="正在加载中...";

			var u = '/coupon/coupon/getCouponListByGood.api',
				data = {
					goodId:this.goodId,
					phone:this.phone?this.phone:'',
					storeId:this.storeId,
					page:{
						currentPage:this.couponPage,
						pageSize:this.couponPageSize
					},
					townCode:this.serviceRegion
				};
			ajax.post(u,data,{
				headers:{
					'Wgj-Position':this.serviceRegion
				}})
			.then(res=>{
				if(utils.getStatusCode(res.code)==200 && res.data){
					this.couponList=this.couponList.concat(res.data);
					if(res.data.length>=this.couponPageSize){
						this.loadDisabled=false;
						this.couponPage++;
						this.infiniteText="正在加载中..."
					}else{
						this.infiniteText="已全部加载完毕"
						this.loadDisabled=true;
					}
				}
			})
			.catch(err=>{
				this.loadDisabled=false;
				this.infiniteText="加载失败"
			})

		},
		//领取优惠券
		getCoupon(item){
			var u = "/coupon/coupon/giveOutByPhone",
				data = {
					couponId:item.couponId,
					phone:this.phone,
					randomId:0,
					count:1
				}
			ajax.post(u,data).then(res=>{
				utils.console(res)
				if(utils.getStatusCode(res.code)==200){
					 	this.getCouponList(1);
				}else{
					this.$toast(res.msg)
				}	
			})
			.catch(err=>{
				this.$toast('网络繁忙，请重试')
			})
		},
		//获取购物车数量
		// getCartNumber(){
		// 	if(!this.userId){
		// 		return;
		// 	}
		// 	var u = '/app-background/shoppingCart/getCount?townCode='+this.serviceRegion+'&userId='+this.userId;
		// 	ajax.get(u).then(res=>{
		// 		if(utils.getStatusCode(res.code)==200 && res.data){
		// 			this.cartCount=res.data.totalCount;
		// 		}
		// 	})
		// },
		//选择数量
		selectAmount(type){
			if(type==1){
				this.addAmount.button="加入购物车";
			}else if(type==2 && this.isPostpaid){
				this.addAmount.button="立即预约"
			}else{
				this.addAmount.button="立即购买";
			}
			this.addAmount.openAmount=true;
		},
		buy(){
			//立即购买
			// if(this.detail.isQuantityLimited==1){
			// 	this.amount=1;
			// 	this.createOrder();
			// 	return;
			// }
			//如果有套餐ID的话直接用最小数量购买
			if(this.packageId){
				this.createOrder();
				return;
			}

			//如果是支付宝中，先请求是否有未支付订单
			var env = utils.getEnv();
			if(env=='alipay_channel'){
				this.getUnpaidOrder()
			}else{
				if(!this.addAmount.selAmount){
					this.selectAmount(0);
					return;
				}
			}
		},
		addToCart(){
			//加入购物车
			if(!this.addAmount.selAmount){
				this.selectAmount(1);
				return;
			}
			var u =service.common+"/app-background/shoppingCart/addGoods",
				data = {
					userId:this.userId,
					townCode:this.serviceRegion,
					good:{
						storeId:this.storeId,
						goodId:this.goodId,
						goodCount:this.amount,
						isSelected:this.amount
					}
				};
			ajax.post(u,data).then(res=>{
				if(utils.getStatusCode(res.code)==200 && res.data){
					utils.console('添加成功！')
				}
			})
		},
		openNotice(){
			//订阅到货通知或者求开通
			this.$indicator.open({
			  spinnerType: 'triple-bounce'
			});	
			this.disClick=true;
			if(this.detail.goodsCategories==1){
				var type=2;
			}else{
				type=1;
			}	
			var u = service.common+'/app-background/goods/subscribeGoodsStatus.api',
				data = {
					storeId:this.storeId,
					goodsId:this.goodId,
					userId:this.userId,
					location:this.pos.lng+','+this.pos.lat,
					type:type
				};
			ajax.post(u,data,{
	            	headers:{
	              		'Wgj-Position':this.serviceRegion
	              	}	
	            }).then(res=>{
				this.$indicator.close();
				this.disClick=false;
				 if(utils.getStatusCode(res.code)==200){
				 		this.$toast('信息订阅成功！');
				 }else{
				 	this.$toast(res.message);
				 }
			}).catch(err=>{
				this.disClick=false;
				this.$indicator.close();
				this.$toast('网络连接失败，请重试');
			})
		},
		//确认数量操作
		confirmAmount(){
			if(this.addAmount.button!="加入购物车"){
				this.createOrder();
			}
		},
		operation(type){
			var env=utils.getEnv();
			if(login.isLogin()){
				this.userId=utils.getCookie('userId');
				this.phone=utils.getCookie('phone');
				if(this.detail.status==1 && this.detail.quantity>0 && this.detail.supportDelivery){
					this.buy();
				}else{
					this.openNotice();
				}
			}else{
				if(env !="weixin" && env !="alipay_channel" && env !='dingding'){
					this.$router.push({name:'login'});
				}
			}
		},
		//立即购买生成订单页
		createOrder(){
			this.$indicator.open({
			  spinnerType: 'triple-bounce'
			});
			this.disClick=true;			
	        var u = service.common+'/app-background/order/submit/create',
	            data = {
	                userId:this.userId,
	                goodsItems:[
						{
							count:this.amount,
							goodsId:this.goodId,
							storeId:this.storeId
						}
					],
					appId:utils.getCookie('we_appId'),
	                addressId:this.addressId,
	                isSupportedServiceTime:true,
	                sourceType:4,
	                serviceSubscriptionId:this.packageId,
	                serviceSubscriptionSource:this.source,
	                payAndServiceRelation:this.isPostpaid?1:0,
	                dingTalkCorpId:utils.getCookie('corpId')
	            };
	        //if(utils.isWeixin()){
	        	data.couponSource=2;
	        //}    
	        ajax.post(u,data,{
	            headers:{
	              'Wgj-Position':this.serviceRegion
	            }
	        }).then(res=>{
	        	this.disClick=false;
	        	this.$indicator.close();
	            if(utils.getStatusCode(res.code)==200){
	            	res.data.storeOrders=this.setIsopen(res.data.storeOrders);
	                this.$store.dispatch('setCreateOrder',res.data);
	                this.$router.push({name:"submitOrder",query:{addressId:this.addressId,packageId:this.packageId}})
	            }else{
	            	if(res.message.indexOf('失效')>=0){
	            		this.$toast('商品信息已更新')
	            		this.addAmount.openAmount=false;
	            		this.getDetail(this.goodId,this.groupNumber,this.storeId);
	            	}else{
	            		this.$toast(res.message);
	            	}
	            	//window.location.reload();
	            }
	        }).catch(err=>{
	        	this.disClick=false;
	        	this.$indicator.close();
	            this.$toast('网络连接失败，请重试');
	        })			
		},
		//将各个属性小组添加一个isOpen属性，方便订单提交页操作pop
		setIsopen(info){
			for(var i = 0,len=info.length;i<len;i++){
				info[i].isOpen=false;
				info[i].isOpenTime=false;
				var orderItems=info[i].orderItemList;
				for(var j=0,jlen=orderItems.length;j<jlen;j++){
					var attrItems=orderItems[j].goodsAttributeList;
					if(attrItems){
						for(var k=0;k<attrItems.length;k++){
							if(attrItems[k].attributeType==0){
								attrItems[k].isOpen=true;
							}else{
								attrItems[k].isOpen=false;
							}
						}
					}
				}
			}
			return info;
		},
		//获取未支付完成的订单（仅在支付宝中使用）
		getUnpaidOrder(){
			this.$indicator.open({
			  spinnerType: 'fading-circle'
			});			
		  var u = service.common + '/app-background/order/unpaidOrderIds';
		  ajax.get(u,{
		    params:{
		      userId:utils.getCookie('userId'),
		      status:1
		    }
		  }).then(res=>{
		  	this.$indicator.close();
		    if(utils.getStatusCode(res.code)==200){
		      if(res.data && res.data.length>0){
		          this.$messageBox({
		            title: '提示',
		            message: '您好，由于您目前仍有订单未进行支付，支付完成才能进行预约服务',
		            showCancelButton: false,
		            showConfirmButton:true,
		            confirmButtonText:'去支付'
		          }).then(action=>{
		              this.$router.push({name:'orderDetail',params:{id:res.data[0]}})
		          })
		      }else{
				if(!this.addAmount.selAmount){
					this.selectAmount(2);
					return;
				}
		      }
		    }else{
		    	this.$toast(res.message)
		    }
		  }).catch(err=>{
		  	this.$indicator.close();
		    this.$toast('网络连接失败，请刷新重试')
		  })
		} 		

	},
	mounted(){
		var self=this;
		this.goodId=this.$route.params.goodId;
		this.storeId=this.$route.query.storeId;
		var brokerId = this.$route.query.brokerId;
		if (brokerId) {
			// 如果有旅游代理id保存在cookie中，以便在提交订单时使用
			var secs=7*24*60*60;
			utils.setCookie('travel-brokerId', brokerId, secs, service.domain);
		}
		utils.requireParam(this,'useRegion.townCode',()=>{
			this.serviceRegion=this.useRegion.townCode;
			this.getDetail(this.goodId,this.groupNumber,this.storeId);
			this.addressId=this.useRegion.phone?this.useRegion.id:'';
		//	this.getCouponList()				
		})			
	    window.addEventListener('scroll',()=>{
			var scrollT=document.documentElement.scrollTop || document.body.scrollTop;
			if(scrollT>40){
				self.title="商品详情";
			}else{
				self.title="";
			}	
	    })	
	    utils.sendMta('tijiaodingdanch',{'detail':'true'});              
	    	
	},
	destroyed(){
		this.$indicator.close();
	    window.removeEventListener('scroll',()=>{
			var scrollT=document.documentElement.scrollTop || document.body.scrollTop;
			if(scrollT>40){
				self.title="商品详情";
			}else{
				self.title="";
			}	
	    })		
	}
}
</script>
<style lang="scss">
@import '../../../assets/styles/common.scss';
@import './detail'
</style>