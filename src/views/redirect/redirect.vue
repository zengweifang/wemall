<template>
	<div class="nopermission" v-if="show">
		<!--头部end-->
		<div class="clerksuccess-wrap">
			<section class="sign">
				<p class="successImg">
					<img src="../../assets/imgs/closeerr.png" alt="" />
				</p>
				<p class="sign-p2">您的账户暂时没有操作权限，请联系旺管家工作人员</p>
			</section>
			<footer class="propertyRight">
				<p class="propertyRight-p1">客服电话：400-889-8112</p>
				<p class="propertyRight-p2">旺生活互联网科技有限公司</p>
			</footer>
		</div>
	</div>
</template>

<script>
import {config,service} from '../../common/config'
import {ajax} from '../../common/ajax'
import axios from 'axios';
import {utils} from '../../common/utils'
export default{
	name:'blank',
	data(){
		return {
			phone: utils.getCookie('phone'),
			show: false
		}
	},
	methods:{
		goBack(){
			utils.goBack(this);
		},
		// 判断电话号码是否在白名单内
		isInWhiteList(){
			var _self = this;
			this.$indicator.open("加载中...");
			var u = service.common+"/app-background/channel/findWhiteListByPhone?phone=" + this.phone;
		 	ajax.get(u).then(res=>{
		 		this.$indicator.close();
				if(res.code == config.successCode){
					var secs=7*24*60*60;
					utils.setCookie('we_appId',"wgje6ROPs",secs,service.domain);
					_self.$router.push({name:'index'});
				}else{
					_self.show = true;
				}
			}).catch(err=>{
				this.$indicator.close();
				this.$toast('网络连接失败，请重试');
			})
		}
	},
	mounted(){
		this.isInWhiteList();
	}
}
</script>

<style lang="scss" scoped>
@import './redirect';	
</style>