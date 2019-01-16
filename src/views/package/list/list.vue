<template>
	<div class="package-list">
		<div class="header is-fixed" style="background: #fff">
			<button @click="goBack()" class="back" v-if="hasBack">
				<i class="iconfont icon-back" style="font-weight: 600;font-size:20px;"></i>
			</button>
			<div class="location-msg" >
				<span class="title" v-if="hasBack">{{$route.meta.title}}</span>
				<p v-if="!hasBack">
					<span class="icon fl span-center"><i class="iconfont icon-dingwei4" style="vertical-align: -2px;"></i></span>
					<span class="text text-hide fl" @click="toChooseAddr()">{{positionStatus}}</span>
					<span class="arrow span-center fl"><i class="iconfont icon-more"></i></span>
				</p>
			</div>
			<div class="exchange" @click="toggleModal()">
				兑换
			</div>		
<!-- 			<router-link
					:to="{name:'orderList'}">
				<div class="order-wrapper">
					<span class="icon-s"><img src="../../../assets/imgs/icon_store_order.png"></span>
					<span class="text">订单</span>
				</div>
			</router-link> -->
		</div>
		<ul class="list"
			v-if="!isEmpty"
			v-infinite-scroll="getPackageList" 
			:infinite-scroll-disabled="loadStatus.disabled" 
			infinite-scroll-distance="10"
		>
<!-- 			<div class="tip" v-show="showTel">
				客服热线：<a href="tel:4008898112">4008898112</a>
			</div>	 -->
			<li class="item" v-for="item in packageList">
				<h1>{{item.name}}</h1>
				<div class="good"  v-for="gItem in item.goodsList">
					<div class="good-item">
						<div class="good-img">
							<st-img :src="gItem.imgurl" :alt="gItem.name"></st-img>
						</div>
						<div class="good-info">
							<div class="good-name">{{gItem.name}}</div>
							<div class="good-action">
								<p>剩余预约次数：<span>{{gItem.number}}</span></p>
								<button @click="appointOrder(item,gItem)" :class="{'disabled dis':!gItem.store}">立即预约</button>
							</div>
						</div>
					</div>			
					<div class="good-status" v-if="!gItem.store && gItem.number>0">
						<p>抱歉，该商品所在商户暂时不能提供服务，请<a href="tel:4008898112"><i class="iconfont icon-tel"></i>联系客服</a></p>
					</div>
				</div>
			</li>
			<p class="load-tip" @click="getPackageList()">
				{{loadStatus.text}}
			</p>		
		</ul>
		<div class="empty" v-if="isEmpty">
				<img src="../../../assets/imgs/icon_helplessman_index.png" alt="">
				<p>暂无套餐记录</p>			
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
						<button :class="{'dis disabled':inputDis || !couponCode}" @click="confirm()">确定</button>
					</div>
				</div>
		  </mt-popup>			
	</div>	
</template>
<script>
import stDialog from '../../../components/dialog/dialog';
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';
import {mapActions,mapGetters} from 'vuex';
import stImg from '../../../components/img/img';
import wxImg from '../../../assets/imgs/wx-code.jpg';
export default{
	name:'packageList',
	data(){
		var self=this;
		return {
			phone:utils.getCookie('phone'),
			userId:utils.getCookie('userId'),
			appId:utils.getCookie('we_appId'),
			inputModal:false,
			townCode:'',
			hasBack:false,
			page:{
				pageSize:10,
				currentPage:1
			},
			packageList:[],
			isEmpty:false,
			loadStatus:{
				text:'正在加载中...',
				isError:false,
				disabled:false
			},
			showTel:false,
			inputDis:false,
			couponCode:''
		}
  },
  components:{
	    'st-img':stImg
  },
  computed:{
   ...mapGetters({
          userAddressList: 'userAddressList',
          positionStatus:'positionStatus',
          useRegion:'useRegion'
      })
  },
  methods:{
	goBack(){
		utils.goBack(this);
		//window.history.back();
	}, 
	tipExchange(){
		this.$toast('请打开扫一扫，扫描卡上的二维码')
	},
	toggleModal(){
		this.inputModal=!this.inputModal;
		if(this.inputModal){
			utils.sendMta('wodetaocanyemia',{'clickmypackagebutton':'true'})
		}
	},
	confirm(){
		this.inputDis=true;
		this.inputModal=false;
		this.$indicator.open({
		  	spinnerType: 'triple-bounce'
		});	
		var u = service.common + "/coupon/coupon/giveOutByCode",
			data = {
				code:this.couponCode,
				phone:utils.getCookie('phone')
			};
		utils.sendMta('wodetaocanyemia',{'clickcomfirmbutton':'true'})
		ajax.post(u,data).then(res=>{
			this.$indicator.close();
			this.inputDis=false;
			if(utils.getStatusCode(res.errcode)==200){
				utils.sendMta('wodetaocanyemia',{'mypackageresult':'true'})	
				this.packageList=[];
				this.$messageBox({
					title:'',
					message:'<div class="exchange-box"><p class="input-box-tip">&emsp;兑换成功！</p><div><img class="wx-code" src="'+wxImg+'" /></div><p>下一步：长按识别二维码，关注旺管家公众号免费预约</p></div>',
					confirmButtonText:'去使用',
					confirmButtonClass:'to-use'
				}).then(res=>{
					this.inputModal=false;
					// this.getPackageList(0);
				})
				this.couponCode='';
				this.getPackageList(0);
			}else{
				this.$toast(res.errmsg);
				// this.inputModal=true;
			}
		}).catch(err=>{
			this.$indicator.close()
			this.$toast('网络连接失败，请重试')		
			this.inputDis=false;		
		})
	},
	toChooseAddr(){
		this.$router.push({name:'chooseAddr'})
	}, 
	toggleTel(){
		this.showTel=!this.showTel;
	},
	getPackageList(type){
		if(type==0){
			this.page.currentPage=1;
			this.loadStatus={
				text:'正在加载中...',
				isError:false,
				disabled:false
			};
			this.isEmpty=false;
		}
		this.userId=utils.getCookie('userId');
		var u = service.common + '/app-background/serviceSubscription/purchasedList',
		//var u = 'http://192.168.1.89:8098' + '/app-background/serviceSubscription/purchasedList',
			data = {
				userId:this.userId,
				appId:this.appId,
				page:this.page
			};
		if(this.loadStatus.disabled || !this.userId || !this.townCode){
			return;
		}
		this.loadStatus.disabled=true;
		this.loadStatus.text="正在加载中...";
		ajax.post(u,data,{
			headers:{
				'Wgj-Position':this.townCode
			}
		}).then(res=>{
			this.loadStatus.disabled=false;
			if(type==0){
				this.packageList=[];
			}
			if(utils.getStatusCode(res.code)==200 && res.data){
				if(res.data.length>0){
					this.page.currentPage++;
					this.packageList=this.packageList.concat(res.data);
					if(res.data.length<this.page.pageSize){
						this.loadStatus.text="已经到底了";
						this.loadStatus.disabled=true;						
					}
				}else{
					if(this.packageList.length==0){
						this.isEmpty=true;
					}
					this.loadStatus.text="已经到底了";
					this.loadStatus.disabled=true;
				}

			}else{
				this.loadStatus.text="加载出错了,点我重试";
			}
		}).catch(err=>{
			utils.console("getPackageList：",err);
			this.loadStatus.disabled=false;
			this.loadStatus.text="加载出错了,点我重试";
		})

	},
	appointOrder(item,goodItem){
		utils.sendMta('wodetaocanyemia',{'clickbookbutton':'true'})
		this.$router.push({name:'productDetail',params:{goodId:goodItem.id},query:{storeId:goodItem.store.id,packageId:item.id,source:item.source}});
	}
  },
  mounted(){
  	utils.sendMta('wodetaocanyemia',{'entermypackage':'true'})
  	if(this.$route.query.from=='self'){
  		this.hasBack=true;
  	}
	var timeLit=setInterval(()=>{
		if(utils.getCookie('userId') && this.useRegion && this.useRegion.townCode){
			this.townCode=this.useRegion.townCode;					
			this.getPackageList();
			clearInterval(timeLit);
		}
	},100)
  }
}
</script>
<style lang="scss">
	@import '../../../assets/styles/variables.scss';
	@import './list';
</style>