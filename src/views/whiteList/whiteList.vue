<template>
	<div class="login">		
		<div class="form">
			<div class="phone">
				<label>手机号码</label>
				<input type="text" name="phone" v-validate="{rules: { required: true, regex : /^[1][34578][0-9]{9}$/,max:11}}" v-model="phone" placeholder="输入手机号码" maxlength="11"/>
			</div>
		</div>
			<button class="confirm" @click="sure()" :class="{'disabled':errors.has('phone') || !phone || !loginStatus.canLogin}">确定</button>
	</div>
</template>
<script>
import {config,service} from '../../common/config'
import {ajax} from '../../common/ajax'
import {utils} from '../../common/utils'
export default{
	name:'whiteList',
	components:{},
	data(){
		return {
			phone:'',
			loginStatus:{
				canLogin:true,
			}
		}
	},
	methods:{
		goBack(){
			utils.goBack(this);
		},
		sure(){
			var _self=this;
			this.$indicator.open("加载中...");
			var e = service.common+"/app-background/channel/register";
			this.loginStatus.canLogin=false;
			ajax.post(e,{phone:this.phone}).then(res=>{
				this.$indicator.close()
				this.loginStatus.canLogin=true;
				this.$toast(res.message)		               			
			}).catch(err=>{
				this.$indicator.close()
				utils.console(err)
				this.$toast('网络连接失败，请重试')
				this.loginStatus.canLogin=true;				
			})
		},
		
	}	
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/variables';
@import '../login/login';
</style>