<template>
	<div class="user-sel-addr">
		<mt-header title="选择地址" fixed>
		    <mt-button slot="left" @click="goBack()"><i class="iconfont icon-back" style="font-weight: 600;font-size:20px;"></i></mt-button>
		</mt-header>
		<div class="content">
			<p class="searching" v-if="searchResult" @click="again()">{{searchResult}}</p>
			<div class="no-addr" v-if="!searchResult && addrList.length==0">
				<img src="../../../assets/imgs/icon_helplessman_index.png" alt="">
				<p>您还未添加服务地址</p>
			</div>
			<ul v-if="!searchResult">
				<li class="active-items" v-for="item in addrList" v-if="item.enable" @click="selAddrItem(item)">
					<mt-cell-swipe					  
					  :right="[
					    {
					      content: '删除',
					      style: { background: 'red', color: '#fff',width:'65px'},
					      handler: () => deleteAddr(item)
					    }
					  ]">
						<div class="left" slot="title">
							<div class="selected" v-if="addressId==item.id">
								<i class="iconfont icon-icon34"></i>
							</div>	
							<div class="title">
								<span>{{item.poiName}}&nbsp;&nbsp;{{item.address}}<span v-if="item.tag" class="tag">{{item.tag}}</span></span>
								<p class="label">
									{{item.name}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.phone}}
								</p>
							</div>						
						</div>
						<div class="edit" @click.stop="editAddr(item)">
						  	<i class="iconfont icon-edit1"></i>
						</div>
					  </mt-cell-swipe>
				</li>
			</ul>
			<p class="divide" v-if="disableList.length>0">以下地址超出服务范围</p>
			<ul>
				<li class="disabled-item"  v-for="item in disableList">
					<mt-cell-swipe					  
					  :right="[
					    {
					      content: '删除',
					      style: { background: 'red', color: '#fff',width:'65px'},
					      handler: () => deleteAddr(item)
					    }
					  ]">
						<div class="left" slot="title">
							<div class="title">
								<span>{{item.poiName}}&nbsp;&nbsp;{{item.address}}</span><span v-if="item.tag" class="tag">{{item.tag}}</span>
								<p class="label">
									{{item.name}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.phone}}
								</p>
							</div>						
						</div>
						<div class="edit" @click.stop="editAddr(item)">
						  	<i class="iconfont icon-edit1"></i>
						</div>
					  </mt-cell-swipe>				
				</li>
			</ul>
		</div>
		<div class="add-new" @click="toAddAddr()">
			<p class="add-new-addr">
				<span><i class="iconfont icon-add1"></i></span>新增地址
			</p>		
		</div>
	</div>
</template>
<script>
import {config,service} from '../../../common/config';
import stRadio from '../../../components/radio/radio';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';
import {mapActions,mapGetters} from 'vuex'
export default{
	name:'userSelAddr',
	data(){
		return {
			phone:utils.getCookie('phone'),
			storeIds:this.$route.query.storeIds,
			addrList:[],
			disableList:[],
			addressId:this.$route.query.addressId,
			searchStatus:false,
			searchResult:'正在加载中...',
			searchError:false
		}
	},
    computed:{
     ...mapGetters({
            "userAddressList": 'userAddressList',
        	"selServiceRegion":"selServiceRegion",
        	"setOrderAddr":'setOrderAddr'
        })   
    },	
	methods:{
		...mapActions([
			'setUserAddressList',
			'setSelServiceRegion'
		]),		
		goBack(){			
			utils.goBack(this);
		},
		toAddAddr(){
			this.phone=utils.getCookie('phone');
			if(this.userAddressList && this.userAddressList.length==10){
				this.$toast('新增地址已达上限，请修改现有地址');
				return;
			}
			this.$router.push({name:'addAddr',query:{from:'userSelAddr'}})
		},	
		getAddrList(){
			var u = '/app-background/serviceAddress/myServiceAddress',
				data = {
					phone:this.phone,
					storeIds:this.storeIds
				};
			this.searchResult="正在加载中...";
			ajax.post(u,data).then(res=>{
				this.searchResult="";
				if(utils.getStatusCode(res.code)==200 && res.data){
					this.addrList=res.data;
					this.$store.dispatch('setUserAddressList',res.data)
					this.disableList=this.getDisList(res.data);
					if(this.disableList.length==res.data.length && res.data.length>0){
						this.searchResult="没有可用地址";
					}
				}
			}).catch(err=>{
				this.searchResult="加载出错了,点我重新加载"
				this.searchError=true;
			})
		},
		again(){
			if(this.searchError){
				this.getAddrList();
			}
		},
		selAddrItem(item){
			var url=service.self+'/#/product/submit?addressId='+item.id+'&choose=1';
			this.$store.dispatch('setOrderAddr',item)	
			window.history.back();
		},
		editAddr(item){
			this.$router.push({name:"addAddr",query:{type:1,id:item.id}})
		},
		deleteAddr(item){
			var self=this;
			var u = '/app-background/serviceAddress/delete/'+item.id;
			this.$indicator.open({
			  spinnerType: 'triple-bounce'
			});					
			ajax.get(u).then(res=>{
				this.$indicator.close();
				if(utils.getStatusCode(res.code)==200){
					this.$toast('删除成功');
					self.getAddrList();
				}else{
					this.$toast(res.message);
				}			
			}).catch(err=>{
				this.$indicator.close();
				this.$toast('网络繁忙，请稍后再试');
			})			
			// this.$messageBox.confirm('确定删除吗?').then(action => {

			// });
		},
		getDisList(list){
			var arr=[];
			for(var i =0;i<list.length;i++){
				if(!list[i].enable){
					arr.push(list[i])
				}
			}
			return arr;
		}
	},
	activated(){
		this.addressId=this.$route.query.addressId;
		this.storeIds=this.$route.query.storeIds;
		var u = '/app-background/serviceAddress/myServiceAddress',
			data = {
				phone:this.phone,
				storeIds:this.storeIds
			};
		if(this.addrList && this.addrList.length==0){
			this.searchResult="正在加载中...";
		}	
		ajax.post(u,data).then(res=>{
			this.searchResult='';
			if(utils.getStatusCode(res.code)==200 && res.data && res.data.length){
				this.addrList=res.data;
				this.$store.dispatch('setUserAddressList',res.data)
				this.disableList=this.getDisList(res.data);
			}
		})
	},
	mounted(){
		//this.getAddrList();
	}
}	
</script>
<style lang="scss">
@import '../../../assets/styles/variables.scss';
@import './userSelAddr';
</style>