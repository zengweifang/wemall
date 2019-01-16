<template>
	<div class="choose-addr">
		<mt-header  title="选择服务地址" v-show="!searchActive" style="z-index:2">
		  <mt-button slot="left" @click="goBack()"><i class="iconfont icon-close" style="font-weight: 600;font-size:20px;"></i></mt-button>
		  <mt-button v-if="isLogin"  @click="toAddAddr()" slot="right">新增地址</mt-button>
		</mt-header>
		<smap :again="againLos" :call-back="losCallBack" :err-call-back="errCallBack"></smap>
		<div class="content" :class="{'little-top':searchActive}">
			<div v-if="isLogin && !searchStatus" class="my-address-list">
				<p class="title"><img class="fl" src="../../../assets/imgs/icon_my_address@3x.png" alt=""></i>我的服务地址</p>
				<div class="list">
					<router-link v-if="userAddressList && userAddressList.length<=0 && !addressText" :to="{name:'addAddr',query:{from:'chooseAddr'}}"  class="tip">您还未添加过服务地址，点击添加</router-link>
					<p class="tip" v-if="addressText && !userAddressList" @click="getAddressList(phone)">
					{{addressText}} 
						<span class="searching" v-if="searchingAddr"> 
							<mt-spinner type="snake" color="#ff5858" :size="12" class="thick"></mt-spinner>
						</span>
					</p>
					<ul v-if="userAddressList">
						<li @click="selItem(item)" v-for="(item,index) in userAddressList" v-show="index<3 || showMore">

							<p class="address">{{item.poiName}}&nbsp;&nbsp;{{item.address}}<span v-if="item.tag" class="tag">{{item.tag}}</span></p>
							<p class="contact">{{item.name}}  {{item.phone}}</p>
						</li>										
					</ul>
					<p class="show-more" @click='toggleMoreAddr()' v-if="userAddressList && userAddressList.length>3">
						{{showMore?'收起':"还有"+(userAddressList.length-3)+"个收货地址"}}
						<i style="font-size:12px;" class="iconfont" :class="{'icon-sanjiaoxing':!showMore,'icon-sanjiaoxing1':showMore}"></i>
					</p>
				</div>
			</div>
			<div v-if="!isLogin && !searchStatus" class="login-tip">
				<img class="fl" src="../../../assets/imgs/icon_my_address@2x.png" alt="">登录后使用常用服务地址	
				<mt-button @click="login()" class="fr" :plain="true" type="primary" size="small" style="height:0.746667rem;border-radius:0;">登录</mt-button>

			</div>
			<div class="near-place" v-if="!searchStatus">
				<p class="title"><i class="iconfont icon-map1"></i>附近地址</p>
				<div class="near-list">
					<ul v-if="nearText" class="searching">
						<li  @click.stop="againLocation()">
							<span>{{nearText}}</span>
							<p class="current">当前定位位置 
								<a class="again fr" v-if="disabled">
									<mt-spinner type="snake" color="#ff5858" :size="12" class="thick"></mt-spinner>{{locationText}}
								</a>
							</p>
						</li>
					</ul>		
					<ul v-if="!nearText">
						<li @click="selItem(item)" v-if="index<4" v-for="(item,index) in nearPlaces">
							<span>{{item.name}}</span>

							<p v-if="index==0" class="current">当前定位位置 
								<a :class="{disabled:disabled}" @click.stop="againLocation()" class="again fr">
									<i class="iconfont icon-dingwei"></i>{{locationText}}
								</a>
							</p>
						</li>																			
						<li class="more-address" >
							<router-link :to="{name:'moreAddr',query:{to:'index'}}">
								更多地址<i style="font-size:18px;font-weight:600;" class="iconfont icon-more fr"></i>	
							</router-link>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="search" :class="{'active-search':searchActive}" @click="enterKey()">
			<search-bar placeholder="请输入地址" :show-cancel="searchActive" :cancel-action="closeKey" v-model="searchKey"></search-bar>
		</div>
		<div class="result" :class="{'no-start':!searchStatus}" v-if="searchActive">
			<ul>
				<li v-for="(item,index) in searchResult" @click="selItem(item)">
					<p>{{item.name}}</p>
					<p>{{item.address}}</p>
				</li>
			</ul>
			<div class="error" v-if="searchResult.length==0 && searchStatus">
				<img src="../../../assets/imgs/icon_helplessman_index.png" alt="">
				<p>没有搜索结果</p>
				<p>换个关键词试试</p>
			</div>
		</div>		
	</div>
</template>
<script>
import smap from '../../common/map/map';
import searchBar from '../../../components/searchBar/searchBar';
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';
import {login} from '../../../common/login';
import {mapActions,mapGetters} from 'vuex'
export default{
	name:'chooseAddr',
	data(){
		var self=this;
		return {
			phone:utils.getCookie('phone'),
			userId:utils.getCookie('userId'),
			isLogin:false,
			showMore:false,
			locationText:'重新定位',
			disabled:false,
			searchActive:false,
			canClick:true,
			searchKey:'',
			searchResult:[],
			searchStatus:false,
			addressText:'',
			nearText:'',
			againLos:false,
			losCallBack:()=>{},
			errCallBack:()=>{},
			searchingAddr:false
		}
	},
	components:{searchBar,smap},
    computed:{
     ...mapGetters({
            userAddressList: 'userAddressList',
            'pos':'pos',
            'nearPlaces':'nearPlaces'
        })   
    },
    watch:{
    	searchKey:function(newv,oldv){
    		if(newv !=""){
    			this.searchAddr(newv)	
    		}
    	}

    },
	methods:{
		...mapActions([
			'setUserAddressList',
			'setSelServiceRegion',
			'setNearPlaces'
		]),
		goBack(){
			utils.goBack(this)
		},
		login(){
			var env=utils.getEnv();
			if(!login.isLogin()){
				if(env!='alipay_channel' && env!='weixin' && env !='dingding'){
		             this.$router.push({name:'login',query:{from:'chooseAddr'}})
		        }	
			}
		},
		toAddAddr(){
			if(this.userAddressList && this.userAddressList.length>=10){
				this.$toast('新增地址已达上限，请修改现有地址');
				return;
			}
			this.$router.push({name:'addAddr',query:{from:'chooseAddr'}});
		},
		getAddressList(phone){
			this.addressText='正在加载中...'
			this.searchingAddr=true;
			var u = service.common+"/app-background/serviceAddress/myServiceAddress",
				data = {
					phone:phone,
					storeIds:''
				}
			ajax.post(u,data).then(res=>{
				this.searchingAddr=false;
				this.$store.dispatch('setUserAddressList',res.data)
				this.addressText="";
			})
			.catch(err=>{
				this.searchingAddr=false;
				this.addressText="服务地址请求失败，请重试"
			})
		},
		toggleMoreAddr(){
			this.showMore=!this.showMore;
		},
		getNearPlace(lng,lat){
				this.locationText="定位中...";
				this.nearText="正在定位，请稍后...";
				this.disabled=true;
				var u = service.common+'/app-background/poi/searchPOIsByLocation?location='+lng+','+lat;
				ajax.get(u).then(res=>{
					this.locationText="重新定位";
					this.nearText="";
					this.disabled=false;
					if(utils.getStatusCode(res.code)==200){
						if(res.data && res.data.poi.length>0){
							this.$store.dispatch('setNearPlaces',res.data.poi)
						}						
					}
				})
				.catch(err=>{
					this.nearText="定位失败，点击重试";
					this.disabled=false;
				})

		},
		againLocation(){
			this.againLos=!this.againLos;
			this.locationText="定位中...";
			this.nearText="正在定位，请稍后...";
			this.disabled=true;	
			window.canPop=false;	
			this.losCallBack=(lng,lat)=>{
				//this.getNearPlace(lng,lat);
				this.locationText="重新定位";
				this.nearText="";
				this.disabled=false;
			};
			this.errCallBack=()=>{
				this.locationText="";
				this.nearText="定位失败，点击重试";
				this.disabled=false;				
			}
		},
		enterKey(){
			 if(this.canClick){
				this.searchActive=true
			}else{
				this.canClick=true;
			}
		},
		closeKey(){
			//utils.console(this.searchActive)
			this.searchActive=false;
			this.canClick=false;
			this.searchStatus=false;
			this.searchKey="";
			this.searchResult=[];
		},
		searchAddr(keywords){
			var u = service.common+'/app-background/poi/searchPOIsByKeyword?keywords='+keywords;
			ajax.get(u).then(res=>{
				this.searchStatus=true
				if(utils.getStatusCode(res.code)==200 && res.data.poi){
					this.searchResult=res.data.poi
				}
			}).catch(err=>{
				this.searchStatus=true
			})
		},
		selItem(item){
			if(typeof item.location=='object'){
				var pos=[item.location.lng,item.location.lat];
			}else{
				var pos=item.location.split(',');
			}
			//如果没有townCode则去读取一遍
			var n=utils.deepCopy(item);
			this.$store.dispatch('setSelServiceRegion',item);
			this.closeKey();
			this.canClick=true;
			if(!item.townCode || item.townCode==item.adcode){   					
				this.getTownCode(pos[0],pos[1]).then(res=>{
					n.townCode=res.data.id;	
					this.$store.dispatch('setSelServiceRegion',n);	
					this.goBack();	
				})
				return;	
			}
			this.goBack();
		},
		getTownCode(lng,lat){
            this.$indicator.open({
              spinnerType: 'triple-bounce'
            });			
			return new Promise((resolve,reject)=>{
				var u = service.common+'/app-background/administrativeRegion/infoAtLocation?location='+lng+','+lat;
				ajax.get(u)
				.then(res=>{
					this.$indicator.close(); 
					if(utils.getStatusCode(res.code)==200){
						resolve(res)
					}else{
						reject(null)
					}
				})
				.catch(err=>{
					this.$indicator.close(); 
					reject(null)
				})
			})
		},		
	},
	activated(){
		this.phone=utils.getCookie('phone');
		this.userId=utils.getCookie('userId');	
		if(this.nearPlaces){
			this.locationText="重新定位";
		}		
		if(this.isLogin && (!utils.checkPhone(this.phone) && !this.userId)){
			this.isLogin=false;
		}
		if(!this.isLogin){
			if(utils.checkPhone(this.phone) && this.userId){
				this.isLogin=true;
				this.getAddressList(this.phone)
			}						
		}
	},	
	mounted(){
		if(this.$route.query.phone){
			var timeLit=setInterval(()=>{
				this.phone=utils.getCookie('phone');
				this.userId=utils.getCookie('userId');
				if(utils.checkPhone(this.phone) && this.userId){
					this.isLogin=true;
					this.getAddressList(this.phone)
					clearInterval(timeLit)
				}	
			},1000)
		}
		if(!this.$route.query.phone && this.phone && this.userId){
			this.isLogin=true;
			this.getAddressList(this.phone)
		}
		if(this.nearPlaces){
			this.locationText="重新定位";
		}else{
			if(this.pos){
				this.getNearPlace(this.pos.lng,this.pos.lat)
			}
		}
	}
}
</script>
<style lang="scss">
@import '../../../assets/styles/common.scss';
@import './chooseAddr.scss';	
</style>