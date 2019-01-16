<template>
		<div class="product-list" :class="{'all-height':loading.complete && list.length==0,'has-sort':(!loading.complete || list.length>0) && !searchKey}">
			<mt-header :title="title" fixed class="header" v-if="!searchKey">
				<div slot="left">
			    	<mt-button @click="goBack()">
			    		<i class="iconfont icon-back" style="font-weight: 600;font-size:20px;"></i>
			    	</mt-button>
			    	<div class="drop-button" v-if="hasDrop">
				    	<mt-button @click="toggleMenu()" class="drop-btn">
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
			<div class="search-header" v-if="searchKey">
				<button @click="goBack()">
					<i class="iconfont icon-back"  style="font-weight: 600;font-size:20px;"></i>
				</button>
				<div class="title" @click="searchBack()">
					<i class="iconfont icon-search"></i>
					{{searchKey}}
				</div>
			</div>
			<div class="good-sort" v-if="(!loading.complete || list.length>0) && !searchKey">
				<ul>
					<li v-for="item in filters" @click="changeSort(item)" :class="{active:filter==item.value}">
						<span :class="{'has-right':item.type}">{{item.name}}</span>					
						<i v-if="item.type" class="iconfont icon-shangsanjiao" :class="{'active-i':item.type=='up'}"></i>
						<i v-if="item.type" class="iconfont icon-xiasanjiao" :class="{'active-i':item.type=='down'}"></i>
					</li>
				</ul>
			</div>
			<div class="good-area">
				<good-list 
					v-infinite-scroll="getGoodList" 
					infinite-scroll-disabled="loadDisabled" 
					infinite-scroll-distance="10"
					:listData="list"
				>
				</good-list>
				<div v-if="list.length>0 || !loading.complete" @click="getGoodList()">			
					<loading-tip color="#959595" type="fading-circle" :size="22" :text="loading.text" :icon="loading.disabled && !loading.complete"></loading-tip>
				</div>
			</div>
			<error-page text="未找到相关商品" v-if="loading.complete && list.length==0"></error-page>
		</div>
</template>
<script>
import goodList from '../../common/goodList/goodList';
import dropList from '../../../components/dropList/dropList';
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';
import {mapActions,mapGetters} from 'vuex';
import loadingTip from '../../common/loadingTip/loadingTip';
import errorPage from '../../common/error/error';
export default{
	name:'productList',
	data(){
		return {
			title:'商品列表',
			currentUrl:'',
			currentData:null,
			contentGroupId:this.$route.query.contentGroupId,
			searchKey:this.$route.query.key,
			goodsTypeId:this.$route.params.goodsTypeId,
			page:{
				currentPage:1,
				pageSize:12
			},
			list:[],
			infiniteText:'正在加载中',
			loading:{
				disabled:false,
				text:'正在加载中',
				error:false,
				complete:false
			},			
			serviceRegion:'',
			showMenu:false,
			appId:utils.getCookie('we_appId'),
			hasDrop:utils.getCookie("we_enter")=='list' || utils.getCookie("we_enter")=='detail' || utils.getCookie('we_appId')	=='b9b45c08',
			filter:'composite',
			filters:[
				{
					value:'composite',
					name:'综合'
				},
				{
					value:'-salesvolume',
					name:'销量'
				},
				{
					value:'price',
					name:'价格',
					type:'empty'
				},
				{
					value:'-createtime',
					name:'新品'
				}
			],
			scrollPos:0
		}
	},
	props:[],
	components:{
		goodList,
		dropList,
		loadingTip,
		errorPage
	},
	computed:{
     ...mapGetters({
     		"selServiceRegion":"selServiceRegion",
     		"autoRegion":"autoRegion",
     		"pos":'pos',
     		'positionStatus':'positionStatus',
     		'useRegion':'useRegion'
        }) 			
	},
	methods:{
		goBack(){
			if(this.$route.query.from == 'multipleBrokerage'){
				this.$router.push({name:'multipleBrokerage'})
			}else{
				this.$router.push({name:'index'})
			}
			
		},
		searchBack(){
			window.history.back();
		},
		toggleMenu(){
			this.showMenu=!this.showMenu;
		},
		changeSort(item){
			if(this.filter=='price' && item.value=='price'){
				item.type=item.type=='up'?'down':'up';
			}
			if(this.filter!='price' && item.value=='price'){
				item.type='up';
			}
			if(item.value!='price'){
				this.filters[2].type='empty';
			}
			this.filter=item.value;
			this.getGoodList(0);
		},
		getList(url,data,type){
			if(type==0){
				this.page.currentPage=1;
				this.list=[];
				this.loading.disabled=false;
				this.loading.error=false;
				this.loading.complete=false;
			}
			if(this.loading.disabled || !this.serviceRegion){
				return;
			}
			this.loading.disabled=true;
			this.loading.text="正在加载中";				
			ajax.post(url,data).then(res=>{
				if(type==0){
					this.list=[];
				}
				if(utils.getStatusCode(res.code)==200){
					if(res.data && res.data.length>0){
						this.loading.text="加载更多";
						this.list=this.list.concat(res.data);
						this.loading.disabled=false;
						this.page.currentPage++;
						if(res.data.length<this.page.pageSize){
							this.loading.complete=true;
							this.loading.text="已经到底了";
						}
					}						
					if(!res.data || res.data.length==0){
						if(this.list.length>0){
							this.loading.text="已经到底了";
							this.loading.complete=true;
						}else{					
							this.loading.text="未找到相关商品";
							this.loading.complete=true;
						}	
					}
				}else{
					this.loading.text=res.message;
					this.loading.error=true;
					this.loading.disabled=false;
				}
			}).catch(err=>{
				this.loading.text="加载出错，点我重试";
				this.loading.disabled=false;
				this.loading.error=true;
			})
		},
		getGoodList(type){
			if(this.$route.query.key){
				this.currentUrl=service.common+"/app-background/search/getChannelGoodsSearchListByKeyword.api";
				this.currentData={
					appId:utils.getCookie('we_appId'),				
					townCode:this.serviceRegion,
					page:this.page,
					orderBy:this.filters[0].value,  //默认综合排序
					keyWord:this.searchKey
				}
			}else if(this.$route.query.contentGroupId){
				this.currentUrl=service.common+"/app-background/home/getContentGroupInfo";
				this.currentData={
					appId:utils.getCookie('we_appId'),
					townCode:this.serviceRegion,
					page:this.page,
					orderBy:this.filter,
					contentGroupId:this.contentGroupId
				}
			}else{
				this.currentUrl=service.common+"/app-background/goods/getGoodsListByAppId";
				this.currentData={
					  appId:utils.getCookie('we_appId'),
					  townCode: this.serviceRegion,
					  page:this.page,
					  orderBy:this.filter,
					  goodsTypeId:this.goodsTypeId,
				}
			}
			if(this.filter=='price'){
				if(this.filters[2].type=='down'){
					this.currentData.orderBy='-'+this.filter;
				}
			}
			this.getList(this.currentUrl,this.currentData,type);
		}		
	},
	activated(){
		//重新重置数据。如果当前类别不同的话
		if(!this.serviceRegion){
			return;
		}
		var newRegion='',regionChange=false;
		if(this.useRegion && this.useRegion.townCode){
			newRegion=this.useRegion.townCode;	
		}
		regionChange=newRegion==this.serviceRegion?false:true;
		this.serviceRegion=newRegion;
		var goodsTypeChange=this.$route.params.goodsTypeId!=this.goodsTypeId,
			searchKeyChange=this.$route.query.key && this.$route.query.key!=this.searchKey,
			groupIdChange=this.$route.query.contentGroupId && this.$route.query.contentGroupId!=this.contentGroupId;
		if(goodsTypeChange || regionChange || searchKeyChange || groupIdChange || !window.isBack){
			this.filter='composite';
			this.filters[2].type='empty';
			this.goodsTypeId=this.$route.params.goodsTypeId;
			this.searchKey=this.$route.query.key;
			this.contentGroupId=this.$route.query.contentGroupId;
			window.scrollTo(0,0);
			this.getGoodList(0);
			return;		
		}
		document.querySelector('.product-list').scrollTo(0,this.scrollPos);
	},
	mounted(){
		utils.requireParam(this,'useRegion.townCode',()=>{			
			this.serviceRegion=this.useRegion.townCode;
			this.getGoodList(0);
		})              
        utils.sendMta('tijiaodingdanch',{'thirdlist':'true'})
	},
	deactivated(){
		this.showMenu=false;
		this.scrollPos=document.querySelector('.product-list').scrollTop;

	},
	destroyed(){
		this.showMenu=false;
	}
}
</script>
<style lang="scss">
@import '../../../assets/styles/common.scss';
@import './list'	
</style>