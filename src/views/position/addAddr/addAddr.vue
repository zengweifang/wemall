<template>
	<div class="add-address">
		<div class="address-form">
			<form>			
				<div class="form-item">
					<label>联系人</label>
					<div class="edit-area">
						<div class="has-bottom">
							<input v-model="addForm.name" maxlength="16" name="name" v-validate="{ rules: {required:true }}" required type="text" placeholder="联系人姓名">
						</div>
						<div class="sel-sex">
							<st-radio :options="options" v-model="addForm.gender" name="sex" :init="addForm.gender"></st-radio>
						</div>
					</div>
				</div>
				<div class="form-item">
					<label>联系电话</label>
					<div class="edit-area">
						<input maxlength="14" type="text" placeholder="联系电话号码" v-model="addForm.phone">
					</div>
				</div>
				<div class="form-item">
					<label>服务地址</label>
					<div class="edit-area">
						<div class="sel-location" @click="openMorePop()">
							<!-- <router-link :to="{name:'moreAddr'}"> -->
								<i class="iconfont icon-iconfontlocation fl"></i>
								<input class="has-bottom" v-model="addForm.poiName" type="text" :value="regionName"  placeholder="小区/写字楼/学校等" readonly>
								<i style="font-size:18px;font-weight:600;" class="iconfont icon-more fr"></i>
							<!-- </router-link> -->
						</div>
						<input  maxlength="40" class="has-top" type="text" placeholder="详细地址（如门牌号等）" v-model="addForm.address">
					</div>
				</div>
				<div class="form-item ">
					<label>标签</label>
					<div class="edit-area">
						<span class="tag" :class="{'active':activeTag==item.name}" v-for="item in tagList" @click="pickTag(item)">{{item.name}}</span>
					</div>
				</div>
			</form>
		</div>
		<mt-button type="primary" class="confirm" @click="save()" :class="{disabled:!addForm.name || !addForm.phone || !addForm.gender || !addForm.address || !addForm.poiName}">确定</mt-button>
		<mt-popup
		  style="height:100%;width:100%;"
		  v-model="showMoreAddr"
		  :modal="true"
		  position="right"
		  :closeOnClickModal="false"
		  popup-transition="right">
		  <more-addr :pop="true"></more-addr>
		</mt-popup>
	</div>
</template>
<script>
import stRadio from '../../../components/radio/radio';
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';
import moreAddr from '../moreAddr/moreAddr';
import {mapActions,mapGetters} from 'vuex';
export default{
	name:'addAddr',
	data(){
		return {
			title:'新增服务地址',
			regionName:'',
			phone:utils.getCookie('phone'),
			options:[
				{
					label:'先生',
					value:1,
					disabled:false
				},
				{
					label:'女士',
					value:2,
					disabled:false
				}				
			],
			tagList:[
				{name:'公司'},
				{name:'家'},
				{name:'其他'}
			],
			addForm:{
				name:'',
				poiName:'',
				address:'',
				phone:'',
				tag:'公司',
				gender:1
			},
			activeTag:'公司',
			id:this.$route.query.id,
			type:this.$route.query.type,
			addrList:[]
		}
	},
	components:{stRadio,moreAddr},
	watch:{
		selAddrItem:function(newV){
			this.getInfoFromAddr(newV);
		}
		// addForm:{
		// 	handler:function(newv,old){
		// 		utils.console('addForm',newv)
		// 	},
		// 	deep:true
		// }
	},
  	computed:{
   		...mapGetters({
          'selAddrItem': 'selAddrItem',
          'useRegion':'useRegion',
          'showMoreAddr':'showMoreAddr',
          "userAddressList":"userAddressList"
     	})   
  	}, 	
	methods:{
	      ...mapActions([
	        'openMorePop',
	        'setUserAddressList'
	      ]),  	
		goBack(){
			utils.goBack(this);
		},
		save(){
			this.phone=utils.getCookie('phone');
			if(!utils.checkName(this.addForm.name)){
				this.$toast('请填写正确姓名，1~16个字符');
				return;
			}
			if(!this.addForm.gender){
				this.$toast('请选择您的性别');
				return;
			}	
			if(!utils.checkTel(this.addForm.phone)){
				this.$toast("请填写正确联系电话，7~13个数字");
				return;
			}
			this.$indicator.open({
			  spinnerType: 'triple-bounce',
			  text:'正在提交...'
			});
			if(this.type==1){
				var u = service.common+'/app-background/serviceAddress/update';
			}else{
				var u = service.common+'/app-background/serviceAddress/save';
			}
			ajax.post(u,this.addForm).then((res)=>{
				this.$indicator.close();
				if(utils.getStatusCode(res.code)==200 && res.data){
					this.$toast('提交成功');
					this.goBack();
				}else{
					this.$toast({
						message:res.message
					})
				}			
			}).catch(err=>{
				this.$indicator.close();
				this.$toast('网络繁忙，请稍后再试')				
			})
		},
		getTags(){
			var u = service.common+'/app-background/serviceAddress/getTag';
			ajax.get(u).then(res=>{
				if(utils.getStatusCode(res.code)==200 && res.data && res.data.length>0){
					this.tagList=res.data
				}
			})
		},	
		pickTag(item){
			utils.console(item)
			this.addForm.tag=item.name;
			this.activeTag=item.name;
		},
		getInfoFromAddr(obj){
				this.addForm.poiId=obj.id;
				this.addForm.poiName=obj.poiName?obj.poiName:obj.name;
				this.addForm.poiAddress=obj.address;
				this.addForm.pcode=obj.pcode;
				this.addForm.pname=obj.pname;
				this.addForm.citycode=obj.citycode;
				this.addForm.cityname=obj.cityname;
				this.addForm.adcode=obj.adcode;
				this.addForm.adname=obj.adname;
				this.addForm.address=obj.address;
				if(typeof obj.location=='object'){
					this.addForm.location=obj.location.lng+','+obj.location.lat;	
				}else{
					this.addForm.location=obj.location;	
				}	
						
		},
		openMorePop(){
			this.$store.dispatch('openMorePop',true)
		},
		getAddrList(){
			this.phone=utils.getCookie('phone');
			var u = service.common+'/app-background/serviceAddress/myServiceAddress',
				data = {
					phone:this.phone
				};
			ajax.post(u,data).then(res=>{
				if(utils.getStatusCode(res.code)==200 && res.data){
					this.$store.dispatch('setUserAddressList',res.data)
					this.addrList=utils.deepCopy(res.data);
					this.addForm=this.getEditItem(this.addrList);
				}
			})
		},
		getEditItem(list){
			 if(!list || list.length<=0){
			 	return {};
			 }
			 for(var i = 0,len=list.length;i<len;i++){
			 	utils.console(list[i])
			 	if(list[i].id==this.id){
			 		//utils.console(this.list[i])
			 		return list[i]
			 	}
			 }
			 return {};
		}
	},
	mounted(){
		if(this.useRegion && this.useRegion.adcode){
			this.getInfoFromAddr(this.useRegion)
		}
		if(this.phone && utils.checkPhone(this.phone)){
			this.addForm.userphone=this.phone
		}
		this.getTags();
		if(this.type==1){
			this.title="编辑服务地址";
			if(!this.userAddressList || this.userAddressList.length<=0){
				this.getAddrList();
			}else{
				this.addrList=utils.deepCopy(this.userAddressList);
				this.addForm=this.getEditItem(this.addrList);
				if(this.addForm.tag){
					this.activeTag=this.addForm.tag;
				}
			}
		}

	}
}
</script>
<style lang="scss" scoped>
@import '../../../assets/styles/variables.scss';
@import './addAddr';
</style>