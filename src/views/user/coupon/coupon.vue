<template>
	<div class="user-coupon-list">
		<div class="content">	
			<mt-navbar v-model="currentTab" :fixed="true">
				<mt-tab-item id="status_0">未使用</mt-tab-item>
				<mt-tab-item id="status_1">已使用</mt-tab-item>
				<mt-tab-item id="status_2"s>已过期</mt-tab-item>
			</mt-navbar>
			<mt-tab-container v-model="currentTab">
				<mt-tab-container-item id="status_0" style="display:block;">
					<ul 
						v-infinite-scroll="getCouponList"
						infinite-scroll-distance="10"
					>
						<li v-for="item in page[0].list">
							<div class="coupon">
								<div class="main">
									<div class="info">
										<div class="reduce-price">&yen;<span>{{item.amount}}</span></div>
										<div class="detail">
											<h1>{{item.title}}</h1>
											<div class="action">
								 				<p>
								 					{{item.leastCost>0?'满'+item.leastCost+'可用':'立减'}}
								 				</p>
								 				<button @click="toUseCoupon(item)">去使用</button>
											</div>
										</div>
									</div>
									<div class="divide"  @click="toggleMore(item)">
										<span class="fl"></span>
										<hr>
										<span class="fr"></span>
									</div>
									<div class="time" @click="toggleMore(item)">
										有效期：{{item.beginTimestamp | dateFilter}}~{{item.endTimestamp | dateFilter}}
										<i class="iconfont icon-sanjiaoxing fr" :class="{'icon-sanjiaoxing1':item.showMore}"></i>
									</div>	
								</div>
								<div class="more"  v-if="item.showMore">
									<p v-html="item.notice"></p>
									<p v-html="item.description"></p>
								</div>
							</div>	
						</li>
						<p class="load-tip" @click="getCouponList()">{{page[0].loadText}}</p>
					</ul>
				</mt-tab-container-item>
				<mt-tab-container-item id="status_1">
					<ul 
						v-infinite-scroll="getCouponList"
						infinite-scroll-distance="10"
					>
						<li v-for="item in page[1].list">
<!-- 							<mt-cell-swipe
	 								title="标题文字"
	 								:right="[{
										content: '<i class=\'iconfont icon-del\'></i>',
										style: { background: 'red', color: '#fff','border-radius':'50%',width:'44px',height:'44px','line-height':'44px','text-align':"center"},
										handler: () => deleteCoupon(item)
							}]"> -->
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
										<div class="divide"  @click="toggleMore(item)">
											<span class="fl"></span>
											<hr>
											<span class="fr"></span>
										</div>
										<div class="time"  @click="toggleMore(item)">
											有效期：{{item.beginTimestamp | dateFilter}}~{{item.endTimestamp | dateFilter}}
											<i class="iconfont icon-sanjiaoxing fr" :class="{'icon-sanjiaoxing1':item.showMore}"></i>
										</div>	
									</div>
									<div class="more"  v-if="item.showMore">
										<p v-html="item.notice"></p>
										<p v-html="item.description"></p>
									</div>
								</div>	
							<!-- </mt-cell-swipe>	 -->
						</li>
						<p class="load-tip" @click="getCouponList()">{{page[1].loadText}}</p>
					</ul>
				</mt-tab-container-item>
				<mt-tab-container-item id="status_2">
					<ul 
						v-infinite-scroll="getCouponList"
						infinite-scroll-distance="10"
					>
						<li v-for="item in page[2].list">
<!-- 							<mt-cell-swipe
 								title="标题文字"
 								:right="[{
 										content: '<i class=\'iconfont icon-del\'></i>',
 										style: { background: 'red', color: '#fff','border-radius':'50%',width:'44px',height:'44px','line-height':'44px','text-align':'center'},
										handler: () => deleteCoupon(item)
								}]"> -->
								<div  class="coupon coupon-disabled">
									<div class="main">
										<div class="info">
											<div class="reduce-price">&yen;<span>{{item.amount}}</span></div>
											<div class="detail">
												<h1>{{item.title}}</h1>
												<div class="action">
									 				<p>
									 					满{{item.leastCost}}可用
									 				</p>
												</div>
											</div>
										</div>
										<div class="divide"  @click="toggleMore(item)">
											<span class="fl"></span>
											<hr>
											<span class="fr"></span>
										</div>
										<div class="time"  @click="toggleMore(item)">
											有效期：{{item.beginTimestamp | dateFilter}}~{{item.endTimestamp | dateFilter}}
											<i class="iconfont icon-sanjiaoxing fr" :class="{'icon-sanjiaoxing1':item.showMore}"></i>
										</div>	
									</div>
									<div class="more"  v-if="item.showMore">
										<p v-html="item.notice"></p>
										<p v-html="item.description"></p>
									</div>
								</div>
							<!-- </mt-cell-swipe>	 -->
						</li>
						<p class="load-tip" @click="getCouponList()">{{page[2].loadText}}</p>
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
export default{
	name:'userCoupon',
	data(){
		return{
			currentTab:'status_0',
			right:[{
					content: '<i class="iconfont icon-del"></i>',
					style: { background: 'red', color: '#fff','border-radius':'50%',width:'44px',height:'44px','line-height':'44px','text-align':"center"},
					handler: () => this.deleteCoupon(item)
				}],
			page:[		
				{
					pageSize:10,
					currentPage:1,
					list:[],
					disabled:false,
					loadText:'正在加载中...'
				},
				{
					pageSize:10,
					currentPage:1,
					list:[],
					disabled:false,
					loadText:'正在加载中...'					
				},	
				{
					pageSize:10,
					currentPage:1,
					list:[],
					disabled:false,
					loadText:'正在加载中...'					
				}						
			]	
		}
	},
	watch:{
		currentTab:function(newV){
			this.getCouponList();
		}
	},
	computed:{

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
	methods:{
		goBack(){
			utils.goBack();
		},
		toggleMore(item){
			item.showMore=!item.showMore;
		},
		getCouponList(type){
			var current=parseInt(this.currentTab.replace('status_',''));
			utils.console("this.page["+current+"]",this.page[current])
			if(this.page[current].disabled){
				return;
			}
			if(type==0){
				this.page[current].list=[];
			}
			this.page[current].disabled=true;
			this.page[current].loadText="正在加载中..."
			var u=service.common+'/coupon/userCoupon/myCouponList',
				data={
					phone:utils.getCookie('phone'),
					status:current+1,
					pageSize:this.page[current].pageSize,
					currentPage:this.page[current].currentPage,
					couponSource:2
				};
			ajax.get(u,{
				params:data
			}).then(res=>{
				if(utils.getStatusCode(res.code)==200){
					if(res.data && res.data.length>0){
						for(var i=0;i<res.data.length;i++){
							res.data[i].showMore=false;
						}
						this.page[current].list=this.page[current].list.concat(res.data);
						this.page[current].currentPage++;
						this.page[current].loadText="继续加载";
						this.page[current].disabled=false;
					}
					if(!res.data || res.data.length==0 || res.data.length<this.page[current].pageSize){
						this.page[current].loadText="没有更多了";
						this.page[current].disabled=true;
					}
					if(this.page[current].list.length==0){
						this.page[current].loadText="没有找到相关优惠券";
						this.page[current].disabled=true;						
					}	
				}else{
					this.page[current].loadText="加载出错，点我重试";
					this.page[current].disabled=false;
					this.$toast(res.msg)				
				}
				utils.console("this.page["+current+"]",this.page[current])
			}).catch(err=>{
					this.page[current].loadText="加载出错，点我重试";
					this.page[current].disabled=false;
					utils.console(err)
			})		
		},
		deleteCoupon(item){
			var u=service.common+'/coupon/userCoupon/deleteCoupon',
				data={
					phone:utils.getCookie('phone'),
					userCouponId:item.id
				};
			this.$indicator.open({
			  spinnerType: 'triple-bounce'
			});					
			ajax.post(u,data).then(res=>{
				this.$indicator.close();
				if(utils.getStatusCode(res.code)==200){
					this.$toast('删除成功');
					this.getCouponList(0);
				}else{
					this.$toast(res.msg);
				}
			}).catch(err=>{
				this.$indicator.close();
			})
		},
		toUseCoupon(item){
			if(!item.promotionUrl || item.promotionUrl.indexOf('home')>=0){
				this.$router.push({name:'index'})
			}else{
				var ex1=/goodid=([0-9a-zA-Z\-]*)&/g,
					ex2=/storeId=([0-9a-zA-Z\-]*)$/g;
				var res1=ex1.exec(item.promotionUrl),
					res2=ex2.exec(item.promotionUrl);
				if(res1 && res1[1] && res2 && res2[1]){
					this.$router.push({name:'productDetail',params:{goodId:res1[1]},query:{storeId:res2[1]}})
				}else{
					this.$router.push({name:'index'})
				}

			}
		}
	},
	mounted(){
	}
}
</script>
<style lang="scss">
@import '../../../assets/styles/variables.scss';
@import './coupon';	
</style>