<template>
	<div class="search">
		<div class="search-bar">
			<i class="iconfont icon-search"></i>
			<form action="javascript:;">
				<input v-model='keywords' type="search" placeholder="请输入商品、服务名称" @propertychange="inputSearch()" @input="inputSearch()" @keyup.enter="clickSearch($event)">
			</form>
			<span @click="back()">取消</span>
		</div>
		<div class="result" v-if="nameList">
			<ul>
				<li v-for="item in nameList" @click="toProductList(item)">
					{{item}}
				</li>
			</ul>
		</div>
		<div class="history" v-if="!nameList">
			<h2><i class="iconfont icon-liulanjilu"></i>搜索历史</h2>
			<ul>
				<li class="text-hide" @click="toProductList(item)" v-for="item in searchHistory">{{item}}</li>
			</ul>
			<button @click="clear()" v-if="searchHistory.length>0">清除搜索历史</button>
		</div>
	</div>
</template>
<script>
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';
import {mapActions,mapGetters} from 'vuex';
export default{
	name:'search',
	data(){
		return{
			keywords:'',
			nameList:null,
			searchHistory:[]
		}
	},
	components:{

	},
	computed:{
		...mapGetters({
			positionStatus:'positionStatus',
			useRegion:'useRegion'
		})
	},	
	methods:{
		search(){
			var u ="/app-background/search/getGoodsSearchNameListByKeyword.api";
			ajax.get(u,{
				params:{
					townCode:this.useRegion.townCode,
					keywords:this.keywords,
					appId:utils.getCookie('we_appId')
				}
			}).then(res=>{
				if(utils.getStatusCode(res.code)==200){
					this.nameList=res.data;
				}
			}).catch(err=>{

			})
		},
		inputSearch(){
			if(this.keywords.trim()){
				utils.requireParam(this,'useRegion.townCode',()=>{
					this.search();
				})
			}
		},
		toProductList(item){

			if(this.searchHistory.indexOf(item)>=0){
				this.searchHistory.splice(this.searchHistory.indexOf(item),1);
			}
			this.searchHistory.unshift(item);
			utils.setLocalStorage('we_searchHistory',this.searchHistory);
			this.$router.push({name:'productList',params:{goodsTypeId:'empty'},query:{key:item}})
		},
		clickSearch(e){
			if(this.keywords.trim()){
				this.toProductList(this.keywords.trim());
			}
		},
		clear(){
			this.searchHistory=[];
			utils.setLocalStorage('we_searchHistory',this.searchHistory);
		},
		back(){
			window.history.back();
		}
	},
	mounted(){
		this.searchHistory=utils.getLocalStorage('we_searchHistory') || [];
	}
}
</script>
<style lang="scss" scoped>
@import '../../../assets/styles/variables.scss';
@import './search';
</style>