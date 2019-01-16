<template>
	<div class="home-index" :class="{'padding-zero':isClose || positionStatus=='定位中...','all-height':ads && markets && modules && list && !hasOneModule}">
		<!-- 定位中动画 -->
		<div class="loading-img" v-if="positionStatus=='定位中...'">
			<div class="loading-icon">
				<div class="i-1 a-bounce"><img src="../../assets/imgs/icon_add1.png"></div>
				<div class="i-2"><img src="../../assets/imgs/icon_add2.png"></div>
			</div>
			<div class="loading-text">正在定位请稍候...</div>
		</div>
		<!-- 定位失败提示 -->
		<div class="fail-loading" v-if="positionStatus=='定位失败'">
			<img src="../../assets/imgs/icon_helplessman_index.png" class="fail-img">
			<p class="fail-text">定位失败</p>
			<div class="fail-btns">
				<div class="btn-1" @click="toChooseAddr()">去手动定位</div>
				<div class="btn-2" @click="$router.go(0)">重新加载</div>
			</div>
		</div>
		<!-- 首页内容为空 -->
		<div class="error" v-if="ads && markets && modules && list && !hasOneModule">
			<img src="../../assets/imgs/icon_helplessman_index.png">
			<p class="sorry-text">很抱歉，我们暂时无法</p>
			<p class="sorry-text">为您所在的区域提供服务</p>
			<p class="change-text" @click="toChooseAddr()">换个地址试试</p>
		</div>

		<!-- 首页有内容 -->
		<div class="normal" v-if="useRegion && useRegion.townCode && hasOneModule" :style="{'padding-top':!ads || ads.length==0?'46px':'0'}">
			<div class="pos-nav" :class="{'fixed':hasBg || (!ads || ads.length==0)}">
				<div class="dingding" v-if="isDingAdmin" @click="toDingDing()">
					<span class="arrow span-center"><i class="iconfont icon-order1"></i></span>
				</div>			
				<div class="position text-hide" @click="toChooseAddr()">
					<span class="icon span-center"><i class="iconfont icon-dingwei4" style="vertical-align: -2px;"></i></span>
					<span class="text text-hide" @click="toChooseAddr()">{{positionStatus}}</span>
					<span class="arrow span-center"><i class="iconfont icon-more"></i></span>					
				</div>
				<div class="search">
					<router-link :to="{name:'productSearch'}">
						<i class="iconfont icon-search" style="font-size:20px;"></i>
					</router-link>
				</div>
			</div>
			<div class="banner"  v-if="ads && ads.length>0">
				<mt-swipe ref="swipe" :auto="swiperAuto"  v-if="ads && ads.length>0" :showIndicators="ads && ads.length>1">
					<mt-swipe-item v-for="item in ads">
						<div class="img-cont" @click="jumpUrl(item)">
							<st-img :src="item.picture" :alt="item.text" :bg="false"></st-img>
						</div>
					</mt-swipe-item>
				</mt-swipe>
			</div>
			<loading-tip style="margin-top:0.32rem" v-if="!markets" color="#959595" type="triple-bounce" :size="26" height="4.8rem" bgColor="#fff"></loading-tip>
			<div class="section categories" v-if="markets && categories && categories.length>0" :style="{'height':markets && markets.length>3?'4.8rem':'2.6rem'}">
				<mt-swipe :auto="0" :continuous="false" :showIndicators="categories.length>1">
					<mt-swipe-item v-for="(item,index) in categories">						
						<ul>
							<li v-for="cItem in item" @click="jumpUrl(cItem)">
								<st-img :src="cItem.icon" alt=""></st-img>
								<p class="text-hide">{{cItem.name}}</p>
							</li>								
						</ul>
					</mt-swipe-item>							
				</mt-swipe>					
			</div>
			<loading-tip style="margin-top:0.32rem" v-if="!modules" color="#959595" type="triple-bounce" :size="26" height="3.4rem" bgColor="#fff"></loading-tip>
			<div class="section business" v-if="modules && modules.length>0">
				<div :class="['style-'+modules.length]">			
					<div v-for="item in modules" class="item" :class="['style-'+modules.length]" @click="jumpUrl(item)">
						<st-img  :src="item.icon[0]" :alt="item.icon" :bg="false"></st-img>
					</div>
				</div>
			</div>
			<loading-tip style="margin-top:0.32rem" v-if="!list" color="#959595" type="triple-bounce" :size="26" height="3rem" bgColor="#fff"></loading-tip>
			<div class="section recommend" v-if="list && list.length>0">
				<div class="cate-title">精品推荐</div>
				<good-list :listData="list" type="index"></good-list>
			</div>
		</div>			
<!-- 		<st-dialog title="请选择服务地址" :is-open="true" cancle-btn="取消" v-if="userAddressList.length>0 && !selServiceRegion && showDialog">
			<div>
				<ul>
					<li @click="setRegion(item)" v-for="item in userAddressList">
						<i class="iconfont icon-circle" style="margin-right:10px;"></i>{{item.poiName}}
					</li>
					<li @click="toChooseAddr()">
						<i class="iconfont icon-circle" style="margin-right:10px;"></i>其它位置
					</li>															
				</ul>
			</div>
		</st-dialog> -->
	</div>
</template>
<script>
import goodList from '../common/goodList/goodList';
import stDialog from '../../components/dialog/dialog';
import {config,service} from '../../common/config';
import {ajax} from '../../common/ajax';
import {utils} from '../../common/utils';
import {login} from '../../common/login';
import {dingding} from '../../common/dingding';
import {mapActions,mapGetters} from 'vuex';
import stImg from '../../components/img/img';
import loadingTip from '../common/loadingTip/loadingTip';
export default{
	name:'index',
	data(){
		var self=this;
		return {
			phone:utils.getCookie('phone'),
			address:'定位中...',
			isDingAdmin:false,
		//	showDialog:false,
			serviceRegion:'',
			isClose : '',
			list:null,	//推荐列表
			modules:null, //运营模块
			ads:null,//广告banner
			categories:null,//多页分类ICON组
			markets:[],//全部ICON
			scrollPos:0, //记录滚动距离
			hasOneModule:false,
			firstEnter:true,  //标记是否是第一次进入页面
			swiperAuto:4000, //banner切换时间
			hasBg:false
		}
	},
	watch:{
		hasOneModule:function(newV){
			if(newV){
				this.$store.dispatch('setTab',true)
			}else{
				this.$store.dispatch('setTab',false)
			}
		}
	},
	components:{
		goodList,
		loadingTip,
		'st-img':stImg,
	},
	computed:{
		...mapGetters({
			userAddressList: 'userAddressList',
			positionStatus:'positionStatus',
			useRegion:'useRegion',
			autoRegion:'autoRegion',
			selServiceRegion:'selServiceRegion'
		})
	},
	methods:{
		...mapActions([
			'setUserAddressList',
			'setSelServiceRegion',
			'setTab'
		]),
		toDingDing(){
			this.$router.push({name:'dingOrderData'})
		},
		showDingEnter(){
			dingding.config().then(res=>{
				return dingding.ready();
			}).then(res=>{
				return dingding.getDDUserInfo()
			}).then(res=>{
				if(res.isManager){
					this.isDingAdmin=true;
					utils.setSessionStorage('is_ding_admin',true);
				}
			}).catch(err=>{
				console.log('show ding enter error:',err)
			})
		},
		login(){
			var env=utils.getEnv();
			if(!login.isLogin()){
				if(env!='alipay_channel' && env!='weixin' && env !='dingding'){
		             this.$router.push({name:'login',query:{from:'chooseAddr'}})
		        }	
			}
		},		
		getIsClose(){
			let appId = utils.getCookie("we_appId");
			let u = service.common + '/app-background/channel/getChannel?appId=' + appId;
			ajax.get(u).then(res=>{
				if(res.code == config.successCode){
					if(res.data){
						this.isClose = false;
					}else{
						this.isClose = true;
					}
				}
			}).catch(err=>{
				this.$toast('网络连接失败，请重试');
				//window.location.reload();
			})
		},
		scrollFunc(){
			var scrollT=document.documentElement.scrollTop || document.body.scrollTop;
			if(scrollT>50){
				this.hasBg=true;
			}else{
				this.hasBg=false;
			}				
		},
		toChooseAddr(){
			// window.location.href=utils.routerToUrl({path:'/position/chooseAddr'})
			this.$router.push({name:'chooseAddr'})
		},
		//url一定要解码过
		jumpUrl(item){
			if(!item.url && !item.contentGroupId){
				this.$toast('找不到指定页面');
				return;
			}
			if(item.contentGroupId){
				this.$router.push({name:'productList',params:{goodsTypeId:'empty'},query:{contentGroupId:item.contentGroupId}});
				return;
			}
			if(item.url.indexOf('vmanager:')>=0){
				this.transAppUrl(item.url);
			}else{
				if(item.url.indexOf('http')>=0){
					window.location.href=item.url;
				}else{
					this.$toast('找不到指定页面');
				}
			}
		},
		transAppUrl(url){
			if(url.indexOf('?')>=0){
				var queryStr=url.substr(url.indexOf('?')+1,url.length-url.indexOf('?')-1),
					paras=utils.transQuery(queryStr);
			}
			var ma = /^vmanager:\/\/([a-zA-z0-9]+)\??/,
				res = ma.exec(url);
			if(res && res[1]){
				switch(res[1]){
					case 'service':
									if(!paras.typegroupid){
										this.$toast('找不到指定页面');
										break;
									}
									this.$router.push({name:'productList',params:{goodsTypeId:paras.typegroupid}});
									break;
					case 'goodlist':
									if(!paras.typegroupid){
										this.$toast('找不到指定页面');
										break;
									}
									this.$router.push({name:'productList',params:{goodsTypeId:paras.typegroupid}});
									break;
					case 'home' :
									this.$router.push({name:'index'});
									break;
					case 'gooddetail':
									if(!paras.goodid || !paras.storeId){
										this.$toast('找不到指定页面');
										break;
									}
									this.$router.push({name:'productDetail',params:{goodId:paras.goodid},query:{storeId:paras.storeId}});
									break;
					case 'orderdetail':
									if(!paras.id){
										this.$toast('找不到指定页面');
										break;
									}
									this.$router.push({name:'orderDetail',params:{id:paras.id}});
									break;
					case 'web':
									window.location.href=decodeURIComponent(paras.url);
									break;
					case 'servicePackage':
									this.$router.push({name:'packageList',query:{from:'self'}});
									break;
					case 'allmarket':
									this.$router.push({name:'categories'});
									break;
					default:
									this.$toast('找不到指定页面');
									break;
				}
			}	
		},
		//获取首页banner和分类类目
		getHomeIndex(){
			this.$indicator.open({
				spinnerType: 'fading-circle'
			});
			var u = service.common + "/app-background/home/homeindex",
				data = {
					appId:utils.getCookie('we_appId'),
					townCode:this.serviceRegion
				};
			ajax.get(u,{
				params:data
			}).then(res=>{
				this.$indicator.close();
				this.categories=[];
				this.markets=[];
				this.ads=[];
				if(utils.getStatusCode(res.code)==200 && res.data){
					var rData=utils.deepCopy(res.data);
					var onePage=10;
					if(res.data.market && res.data.market.length>0){
						for(var i=0,len=Math.ceil(res.data.market.length/onePage);i<len;i++){
							var oneItem=rData.market.splice(0,onePage);
							this.categories.push(oneItem);
						}
						this.markets=res.data.market;
					}
					if(res.data.ad && res.data.ad.length>0){
						this.ads=res.data.ad;
					}
					if(this.markets.length>0 || this.ads.length>0){
						this.hasOneModule=true;
					}
				}else{
					this.$toast(res.message);
				}
			}).catch(err=>{
				this.$indicator.close();
				// this.$toast('网络连接失败，请重试');
				this.categories=[];
				this.markets=[];
				this.ads=[];
			})
		},
		//获取运营模块
		getActivetyZone(){
			this.$indicator.open({
				spinnerType: 'fading-circle'
			});			
			var u = service.common + '/app-background/home/activityzone',
				data = {
					townCode:this.serviceRegion,
					appId:utils.getCookie('we_appId')
				};
			ajax.get(u,{
				params:data
			}).then(res=>{
				this.$indicator.close();
				this.modules=[];
				if(utils.getStatusCode(res.code)==200 && res.data){
					if(res.data.length>0){
						this.modules=res.data;
						this.hasOneModule=true;
					}
				}else{
					this.$toast(res.message);
				}
			}).catch(err=>{
				this.$indicator.close();
				// this.$toast('网络连接失败，请重试');
				this.modules=[];
			})	
		},
		getRecommend(){
			this.$indicator.open({
				spinnerType: 'fading-circle'
			});				
			var u =service.common + "/app-background/recommend/getChannelRecommend";
			ajax.post(u,{
				appId:utils.getCookie('we_appId'),
				townCode:this.serviceRegion
			}).then(res=>{
				this.$indicator.close();
				this.list=[];
				if(utils.getStatusCode(res.code)==200 && res.data){
					if(res.data.length>0){
						this.list=res.data;
						this.hasOneModule=true;
					}
				}else{
					this.$toast(res.message);
				}
			}).catch(err=>{
				this.$indicator.close();
				this.list=[];
				// this.$toast('网络连接失败，请重试')
			})
		},		
	},
	activated(){
		window.addEventListener('scroll',this.scrollFunc)
		if(this.firstEnter){
			this.firstEnter=false;
			return;
		}
		if(utils.getEnv()=='dingding'){
			this.showDingEnter();
		}		
		var nowRegion="";
		if(this.useRegion && this.useRegion.townCode){
			nowRegion=this.useRegion.townCode;
		}
		if(!this.hasOneModule){
			this.$store.dispatch('setTab',false);
		}
		if(nowRegion && nowRegion!=this.serviceRegion){
			this.ads=null;
			this.markets=null;
			this.categories=null;
			this.modules=null;
			this.hasOneModule=false;
			this.serviceRegion=nowRegion;
			this.$store.dispatch('setTab',false);
			this.getHomeIndex();
			this.getActivetyZone();
			this.getRecommend();
		}
		try{
			document.documentElement.scrollTo(0,this.scrollPos);
		}catch(e){
			return;
		}
	},
	mounted(){
		this.$store.dispatch('setTab',false);
		utils.requireParam(this,'useRegion.townCode',()=>{
			this.serviceRegion=this.useRegion.townCode;
			this.getHomeIndex();
			this.getActivetyZone();
			this.getRecommend();
		})
		if(utils.getEnv()=='dingding'){
			this.showDingEnter();
		}
		utils.sendMta('tijiaodingdanch',{'homepage':'true'})
		
	},
	deactivated(){
		this.scrollPos=document.documentElement.scrollTop;
		window.removeEventListener('scroll',this.scrollFunc)
	}	
}
</script>
<style lang="scss">
@import '../../assets/styles/variables.scss';
@import './index';	
</style>