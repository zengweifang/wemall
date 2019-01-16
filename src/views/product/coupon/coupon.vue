y<template>
	<div class="product-coupon">
		<div class="content">	
			<mt-navbar v-model="currentTab" :fixed="true">
				<mt-tab-item id="status_0">可用({{usefulList.length}}张)</mt-tab-item>
				<mt-tab-item id="status_1">不可用({{disList.length}}张)</mt-tab-item>
			</mt-navbar>
			<mt-tab-container v-model="currentTab">
				<mt-tab-container-item id="status_0" style="display:block;">
					<div class="empty" v-if="usefulList.length==0 && couponList">
						暂无可用优惠券
					</div>
					<ul>
						<li v-for="item in usefulList">
							<div class="coupon" @click="selectCoupon(item)">
								<div class="main">
									<div class="info">
										<div class="reduce-price">&yen;<span>{{item.amount}}</span></div>
										<div class="detail">
											<h1>{{item.title}}</h1>
											<div class="action">
								 				<p>
								 					{{item.leastCost>0?'满'+item.leastCost+'可用':'立减'}}
								 				</p>
								 				<i class="fr" :class="{'iconfont icon-icon34':item.couponCode==selected.couponCode}"></i>
											</div>
										</div>
									</div>
									<div class="divide">
										<span class="fl"></span>
										<hr>
										<span class="fr"></span>
									</div>
									<div class="time">
										有效期：{{item.beginTimestamp | dateFilter}}~{{item.endTimestamp | dateFilter}}
									</div>	
								</div>
							</div>	
						</li>
					</ul>
				</mt-tab-container-item>
				<mt-tab-container-item id="status_1" style="display:block;">
					<div class="empty" v-if="disList.length==0 && couponList">
						找不到相关优惠券
					</div>				
					<ul>
						<li v-for="item in disList">
							<div class="coupon coupon-disabled">
								<div class="main">
									<div class="info">
										<div class="reduce-price">&yen;<span>{{item.amount}}</span></div>
										<div class="detail">
											<h1>{{item.title}}</h1>
											<div class="action">
								 				<p>
								 					{{item.leastCost>0?'满'+item.leastCost+'可用':'立减'}}
								 				</p>
											</div>
										</div>
									</div>
									<div class="divide">
										<span class="fl"></span>
										<hr>
										<span class="fr"></span>
									</div>
									<div class="time">
										有效期：{{item.beginTimestamp | dateFilter}}~{{item.endTimestamp | dateFilter}}
									</div>	
								</div>
							</div>	
						</li>
					</ul>
				</mt-tab-container-item>
			</mt-tab-container>
		</div>
	</div>
</template>
<script>
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';
import {mapActions,mapGetters} from 'vuex'	
export default{
	name:'selectCoupon',
	data(){
		return{
			currentTab:'status_0',
			isShow:false,
			orderData:null,
			couponList:null,
			usefulList:[],
			disList:[],
			selected:{}
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
			"createOrder": 'createOrder',
			"useRegion":'useRegion'
		}) 
	},	
	methods:{
		...mapActions([
			'setCreateOrder'
		]),	
		goBack(){
			utils.goBack();
		},
		selectCoupon(item){
			this.selected=item;
			this.orderData.coupon=item;
			this.$store.dispatch('setCreateOrder',this.orderData)
			utils.goBack();
		},
		getNeedOrder(){
			utils.console(this.orderData)
			var stores=this.orderData.storeOrders,
				res=[];
			for(var i=0;i<stores.length;i++){
				for(var j=0;j<stores[i].orderItemList.length;j++){
					res.push(stores[i].orderItemList[j]);
				}
			}
			return res;
		},
		getCouponList(){
			this.$indicator.open({
			  spinnerType: 'fading-circle'
			});				
			var u=service.common+'/coupon/coupon/getCouponBySplitOrders',
				data={
					ownerId:utils.getCookie('userId'),
					phone:utils.getCookie('phone'),
					splitOrderParams:this.getNeedOrder(),
					townCode:this.useRegion.townCode,
					couponSource:2

				};
			ajax.post(u,data).then(res=>{
				this.$indicator.close()				
				if(utils.getStatusCode(res.code)==200){
					this.couponList=res.data;
					for(var i=0;i<this.couponList.length;i++){
						if(this.couponList[i].usable==0){
							this.disList.push(this.couponList[i])
						}else{
							this.usefulList.push(this.couponList[i])
						}
					}
				}else{
					this.$toast(res.message)
				}
			}).catch(err=>{
				this.$indicator.close()
			})

		}
	},
	mounted(){
		this.orderData=utils.deepCopy(this.createOrder);
		utils.console(this.orderData)
		this.getCouponList()
	}
}
</script>
<style lang="scss" scoped>
@import '../../../assets/styles/variables.scss';
@import './coupon';	
</style>