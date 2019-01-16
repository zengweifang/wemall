<template>
	<div class="user-info">
		<div class="content">
			<div class="head">
				<input class="input-head" type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="updateHead($event)">
				<label>头像</label>
				<div class="fr">
					<st-img v-if="userInfo" :src="userInfo.imageUrl"></st-img>
					<i class="iconfont icon-more fr"></i>				
				</div>
			</div>
			<div class="item" @click="toggleNickNameModal()">
				<label>昵称</label>
				<div class="fr" v-if="userInfo">
					<span class="text-hide">{{userInfo.nickName}}</span>
					<i class="iconfont icon-more fr"></i>
				</div>
			</div>
			<div class="item" @click="updateSex()">
				<label>性别</label>
				<div class="fr" v-if="userInfo">
					{{userInfo.sex | sexFilter}}
					<i class="iconfont icon-more fr"></i>
				</div>
			</div>
			<div class="item" @click="updateBirthday()">
				<label>出生日期</label>
				<div class="fr" v-if="userInfo">
					{{userInfo.birthday | dateFilter}}			
					<i class="iconfont icon-more fr"></i>
				</div>
			</div>	
			<div class="item" @click="updateMarital()">
				<label>婚姻状况</label>
				<div class="fr" v-if="userInfo">
					{{userInfo.isMarried | maritalFilter}}
					<i class="iconfont icon-more fr"></i>
				</div>
			</div>	
		</div>
		<div class="phone">
			<label>手机号</label>
			<div class="fr" v-if="userInfo">
				{{userInfo.phone}}
			</div>
		</div>
		<mt-datetime-picker
		  v-model="birthday"
		  ref="picker"
		  type="date"
		  year-format="{value} 年"
		  month-format="{value} 月"
		  date-format="{value} 日"
		  :startDate="startDate"
		  :endDate="endDate"
		  @confirm="confirmDate">
		</mt-datetime-picker>
		<mt-popup
			class="select-modal"
			v-model="select.isOpen"
			:modal="true"
			:closeOnClickModal="true"
			popup-transition="popup-fade"
			position="bottom">
				<ul>
					<li v-for="item in select.options" @click.stop="selItem(item)">{{item.label}}</li>
				</ul>
				<button @click.stop.prevent="close()">关闭</button>
		</mt-popup>
		<mt-popup
			class="input-modal"
			v-model="inputModal"
			:modal="true"
			:closeOnClickModal="true"
			popup-transition="popup-fade"
			position="center">
				<div class="input-box">
					<div class="box-header">
						<h1>请输入昵称</h1>
					</div>
					<div class="box-content">
						<p>
							<input type="text" v-model="inputNickName" maxlength="20" minlength="2">
							<span>2-20个字符。支持中英文、数字、减号和下划线。</span>
						</p>
					</div>
					<div class="box-footer">
						<button @click="toggleNickNameModal()">取消</button>
						<button :class="{'dis disabled':!inputNickName || nickNameErr || inputNickName==userInfo.nickName}" @click="confirmNickName()">确定</button>
					</div>
				</div>
		  </mt-popup>			  																	
	</div>
</template>
<script>
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';	
import stImg from '../../../components/img/img';
export default{
	name:'userInfo',
	data(){
		return{
			userInfo:null,
			birthday:new Date(),
			startDate:new Date('1900/01/01'),
			endDate:new Date(),
			inputModal:false,
			inputNickName:'',
			nickNameErr:false,
			select:{
				type:'',
				options:[],
				isOpen:false
			}
		}
	},
	components:{
		stImg
	},
	watch:{
		inputNickName(newV){
			var ma = /^[\u4e00-\u9fa5a-zA-Z0-9_\-]{2,20}$/;
			if(ma.test(newV)){
				this.nickNameErr=false
			}else{
				this.nickNameErr=true
			}
		}
	},
	filters:{
		dateFilter:function(v){
			if(!v){
				return;
			}
			var date=new Date(v),
				year=date.getFullYear(),
				month=date.getMonth()+1,
				day=date.getDate();
			return year +'-' +month +'-'+day	
		},
		sexFilter:function(v){
			switch(v){
				case 1:
						return '男';
						break;
				case 2:
						return '女';
						break;
				case 3:
						return '保密';
						break;
				default:return '';
						break;		
			}
		},
		maritalFilter:function(v){
			switch(v){
				case 0:
						return '未婚';
						break;
				case 1:
						return '已婚';
						break;
				case 2:
						return '保密';
						break;
				default:return '';
						break;		
			}			
		}

	},
	methods:{
		goBack(){
			utils.goBack();
		},
		getInfo(){
			this.$indicator.open({
			  spinnerType: 'fading-circle'
			});				
			var u=service.common+'/app-background/users/userinfo.api';
			ajax.get(u,{
				params:{
					phone:utils.getCookie('phone')
				}
			}).then(res=>{
				this.$indicator.close();
				if(utils.getStatusCode(res.code)==200){
					this.userInfo=res.data;
					this.inputNickName=this.userInfo.nickName;
					this.birthday=res.data.birthday?new Date(res.data.birthday):new Date();
				}else{
					this.$toast(res.message);		
				}
			}).catch(err=>{
				this.$indicator.close();
				this.$toast('网络连接失败，请重试');				
			})
		},
		updateHead(e){
			this.$indicator.open({
			  spinnerType: 'triple-bounce'
			});					
			var files=e.target.files,
				formData=new FormData();
			formData.append('file',files[0])
			var u=service.upload+'/upload';
			ajax.post(u,formData,{
				timeout:30000
			}).then(res=>{
				this.$indicator.close();
				this.update({
					imageUrl:res.original
				})
			}).catch(res=>{
				this.$indicator.close();
				this.$toast('网络连接失败，请重试');
			})
		},
		toggleNickNameModal(){
			this.inputModal=!this.inputModal;
		},
		updateBirthday(){
			this.$refs.picker.open();
		},
		updateSex(){
			this.select.options=[
				{
					label:'男',
					value:1
				},
				{
					label:'女',
					value:2
				}							
			];
			this.select.type="sex";
			this.select.isOpen=true;
		},
		updateMarital(){
			this.select.options=[
				{
					label:'未婚',
					value:0
				},
				{
					label:'已婚',
					value:1
				},
				{
					label:'保密',
					value:2
				},								
			];
			this.select.type="marital";
			this.select.isOpen=true;
		},
		update(obj){
			var u=service.common+'/app-background/users/updateuserinfo.api',
				data=obj;
			data.id=this.userInfo.id;
			this.$indicator.open({
			  spinnerType: 'triple-bounce'
			});			
			ajax.post(u,null,{
				params:data
			}).then(res=>{
				this.$indicator.close();
				if(utils.getStatusCode(res.code)==200){
					this.$toast('修改成功');
					this.getInfo();
				}else{
					this.$toast(res.message);
				}
			}).catch(err=>{
				this.$indicator.close();
				this.$toast('网络连接失败，请重试');
			})
		},
		confirmDate(value){
			if(!value){
				return;
			}
			this.update({
				birthday:value.getTime()
			})
		},
		selItem(item){
			if(this.select.type=='sex'){
				this.update({
					sex:item.value
				})
			}else{
				this.update({
					isMarried:item.value
				})
			}
			this.close();
		},
		confirmNickName(){
			this.update({
				nickName:this.inputNickName
			})
			this.toggleNickNameModal();
		},
		close(){
			this.select.isOpen=false;
		}
	},
	mounted(){
		this.getInfo()
	}
}
</script>
<style lang="scss" scoped>
@import '../../../assets/styles/variables.scss';
@import './info';	
</style>