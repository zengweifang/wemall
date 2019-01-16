<template>
	<div class="categories">
		<error-page text="未找到相关商品" v-if="error"></error-page>
		<div class="second-list fl" v-if="!error">
			<ul>
				<li v-for="item in cateList" @click="changeCate(item)" class="text-hide" :class="{'active':item.id==currentCateId}"><p>{{item.name}}</p></li>
			</ul>
		</div>
<!-- 		<error-page text="未找到相关商品"></error-page>

		aaaaaaaaaaa
		<router-link :to="{name:'productDetail',params:{goodId:'6ED8C8D7-7C87-45E6-9BB0-1CB84A6DF780'},query:{storeId:'item.storeId'}}">cccccc</router-link>
		<router-link :to="{name:'addAddr'}">cccccccccccc</router-link>
		this.$router.push({name:'productList',params:{goodsTypeId:paras.typegroupid}});
		<router-link :to="{name:'productList',params:{goodsTypeId:'9A9538B8-751E-474F-A968-AFB9BDD45E8A'}}">ccccccccdrferewrer</router-link>
		<router-link :to="{name:'orderList'}">45555555555555</router-link>
		<error-page text="未找到相关商品"></error-page> -->
		<div class="good-list fl" v-if="!error">
			<good-list-rank
				v-infinite-scroll="getGoodList" 
				:infinite-scroll-disabled="loading.disabled" 
				infinite-scroll-distance="10"			
				:listData="goodList">
			</good-list-rank>
			<error-page text="未找到相关商品" v-if="loading.complete && goodList.length==0"></error-page>
			<div @click="getGoodList()" v-if="goodList.length>0 || !loading.complete">			
				<loading-tip  color="#959595" type="fading-circle" :size="22" :text="loading.text" :icon="loading.disabled && !loading.complete"></loading-tip>
			</div>
		</div>
	</div>
</template>
<script>
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';
import {mapActions,mapGetters} from 'vuex';
import goodListRank from '../../common/goodListRank/goodListRank';
import errorPage from '../../common/error/error';
import loadingTip from '../../common/loadingTip/loadingTip';
export default{
	name:'categories',
	data(){
		return{
			serviceRegion:'',
			goodList:[],
			cateList:null,
			loading:{
				disabled:false,
				text:'正在加载中',
				error:false,
				complete:false
			},
			page:{
				pageSize:12,
				currentPage:1
			},
			error:false,
			errorTip:'',
			currentCateId:'',
			scrollPos:0
		}
	},
	components:{
		goodListRank,
		errorPage,
		loadingTip
	},
	computed:{
	...mapGetters({
	      useRegion:'useRegion'
	  })
	},	
	methods:{
		getCateList(){
			this.$indicator.open({
			  spinnerType: 'fading-circle'
			});
			var u = service.common + "/app-background/goodsType/getSecondGoodsType",
				data = {
					appId:utils.getCookie('we_appId'),
					townCode:this.serviceRegion
				};
			ajax.get(u,{
				params:data
			}).then(res=>{
				this.$indicator.close();
				if(utils.getStatusCode(res.code)==200){
					if(!res.data || res.data.length==0){
						this.error=true;
						return;
					}
					this.cateList=res.data;
					this.currentCateId=this.cateList[0].id;
					this.getGoodList(0);
				}else{
					this.$messageBox({
						  message: res.message,
						  showConfirmButton:true,
						  confirmButtonText:'重试'				
					}).then(action => {
						this.getCateList();
					});
					this.error=true;
					this.errorTip=res.message;
				}
			}).catch(err=>{
				this.$indicator.close();
				this.error=true;
				this.errorTip="网络连接失败，请重试";
				this.$messageBox({
					  message: '网络连接失败，请重试',
					  showConfirmButton:true,
					  confirmButtonText:'重试'				
				}).then(action => {
					this.getCateList();
				});
			})

		},		
		getGoodList(type){
			if(type==0){
				this.page.currentPage=1;
				this.goodList=[];
				this.loading.disabled=false;
				this.loading.error=false;
				this.loading.complete=false;
			}
			if(this.loading.disabled || !this.serviceRegion){
				return;
			}
			this.loading.disabled=true;
			this.loading.text="正在加载中";
			var u =service.common + "/app-background/goodsType/getChannelGoodsInSecondGoodsType";
			ajax.post(u,{
				appId:utils.getCookie('we_appId'),
				goodsTypeId:this.currentCateId,
				orderBy:'-composite',
				page:this.page,
				townCode:this.serviceRegion
			}).then(res=>{
				if(type==0){
					this.goodList=[];
				}
				if(utils.getStatusCode(res.code)==200){
					if(res.data && res.data.length>0){					
						this.loading.text="加载更多";
						this.goodList=this.goodList.concat(res.data);
						this.loading.disabled=false;
						this.page.currentPage++;
						if(res.data.length<this.page.pageSize){
							this.loading.complete=true;
							this.loading.text="已经到底了";
						}
					}						
					if(!res.data || res.data.length==0){
						if(this.goodList.length>0){
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
		//更改当前分类
		changeCate(item){
			if(this.currentCateId==item.id){
				return;
			}
			this.currentCateId=item.id;
			this.getGoodList(0);
		}
	},
	activated(){
		//重新重置数据。如果当前类别不同的话
		if(!this.serviceRegion){
			return;
		}
		var newRegion='',changeRegion=false;
		if(this.useRegion && this.useRegion.townCode){
			newRegion=this.useRegion.townCode;	
		}
		changeRegion=newRegion!=this.serviceRegion;
		if(changeRegion || !window.isBack){
			this.error=false;
			this.serviceRegion=newRegion;
			this.getCateList(0)
			setTimeout(()=>{
				window.scrollTo(0,0);
			},300)			
			return;
		}
		try{
			document.querySelector('.good-list').scrollTo(0,this.scrollPos);
		}catch(err){
			utils.console('err',err)
		}
			
	},
	deactivated(){
		try{
			this.scrollPos=document.querySelector('.good-list').scrollTop;
		}catch(e){
			return;
		}		
	},
	mounted(){
		utils.requireParam(this,'useRegion.townCode',()=>{
			this.serviceRegion=this.useRegion.townCode;
			this.getCateList(0);
		})
	}
}
</script>
<style lang="scss" scoped>
@import '../../../assets/styles/common.scss';
@import './categories';
</style>