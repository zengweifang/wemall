<template>
	<div class="ding-feedback">
		<header>
			<div>			
				<h1>反馈建议</h1>
				<button @click="returnBack()">返回</button>
			</div>
		</header>
		<div class="section">
			<h3>反馈建议</h3>
			<textarea v-model="text" cols="30" rows="10" maxlength="200" placeholder="在服务过程中，发现的问题与可改进的建议；在我们平台，您还希望获取哪些服务"></textarea>
		</div>
		<div class="section">
			<h3>联系电话</h3>
			<input type="text" placeholder="选填，便于我们与您联系" v-model="phone">
		</div>
		<button @click="feedback()" :class="{'disabled':!text}">提交</button>
	</div>
</template>
<script>
import pager from 'vue-simple-pager';
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';	
export default{
	name:'ding-feedback',
	data(){
		return{
			text:'',
			phone:''
		}
	},
	components:{
		'pager':pager
	},	
	methods:{
		returnBack(){
			utils.goBack();
		},
		feedback(){
			if(this.phone){
				if(!utils.checkTel(this.phone)){
					this.$toast("请填写正确联系电话，7~13个数字");
					return;
				}				
			}
			var sys=utils.getSystemVersion();
			var u=service.common+'/app-background/users/saveUserFeedback.api',
				data={
					detail:this.text,
					phone:this.phone?this.phone:utils.getCookie('phone'),
					photos:[],
					proVersion:'wemall_v1.0.0',
					sysVersion:sys.system,
					terminalVersion:sys.brand
				};
			ajax.post(u,data).then(res=>{
				this.$indicator.close()
				//我们已收到您的反馈，谢谢您的支持
				if(utils.getStatusCode(res.code)==200){
					this.text="";
					this.phone="";
					this.$messageBox.alert('我们已收到您的反馈，谢谢您的支持').then(res=>{
						utils.goBack();
					});
				}else{
					this.$toast(res.message);
				}
			}).catch(err=>{
				this.$indicator.close()
				this.$toast('网络连接失败，请重试');
			})
		},        
	},
	mounted(){

	}
}
</script>
<style lang="scss" scoped>
@import '../../../assets/styles/variables.scss';
@import './feedback';	
</style>