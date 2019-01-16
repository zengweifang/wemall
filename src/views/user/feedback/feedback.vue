<template>
	<div class="user-feedback">
		<div class="content">		
			<div class="text-area">
				<h1>旺管家期待与您的交流（200字）</h1>
				<textarea maxlength="200" v-model="text"></textarea>
			</div>
			<div class="img-upload">
				<h1>上传图片（非必填）</h1>
				<div class="upload-area">
					<div class="upload">
						<div class="img-list fl">
							<div class="single-img"  v-for="(item,index) in files">
								<i @click="delImg(index)">&times;</i>
								<img :src="item.url" alt="">
							</div>
						</div>
						<form action="/app-background/users/saveUserFeedback.api" method="post" enctype="multipart/form-data" >
							<input id="input_img_0" type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="addImgs($event)">
							<label class="add fl" v-if="files.length<3" for="input_img_0">
								<i class="iconfont icon-add1"></i>
							</label>
						</form>

					</div>
					<p class="fl">（最多上传三张，每张不超过5M，支持jpg/bmp/png）</p>
				</div>
			</div>
		</div>
		<button class="submit-button" :class="{'disabled dis':!text}" @click="submit()">提交</button>
	</div>
</template>
<script>
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';	
export default{
	name:'userFeedback',
	data(){
		return{
			text:'',
			files:[],
			imgUrls:[],
			error:false
		}
	},
	methods:{
		goBack(){
			utils.goBack();
		},
		feedback(){
			var sys=utils.getSystemVersion();
			var u=service.common+'/app-background/users/saveUserFeedback.api',
				data={
					detail:this.text,
					phone:utils.getCookie('phone'),
					photos:this.imgUrls,
					proVersion:'wemall_v1.0.0',
					sysVersion:sys.system,
					terminalVersion:sys.brand
				};
			ajax.post(u,data).then(res=>{
				this.$indicator.close()
				//我们已收到您的反馈，谢谢您的支持
				utils.console(res)
				if(utils.getStatusCode(res.code)==200){
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
		submit(){
			this.$indicator.open({
			  spinnerType: 'triple-bounce'
			});			
			for(var i=0;i<this.files.length;i++){
				this.upload(this.files[i].file)
			}
			var timeLit=setInterval(()=>{
				if(this.error){
					clearInterval(timeLit);
					return;
				}
				if(this.imgUrls.length==this.files.length){
					this.feedback();
					clearInterval(timeLit);
				}
			},1000)		
		},
		upload(file){
			var formData=new FormData();
			formData.append('file',file)
			var u=service.upload+'/upload';
			ajax.post(u,formData,{
				timeout:60000
			}).then(res=>{
				this.imgUrls.push(service.static+'/'+res.url);
			}).catch(res=>{
				this.$indicator.close();
				this.cancelSubmit();
				this.$toast('网络连接失败，请重试');
			})

		},
		cancelSubmit(){
			this.error=true;
			this.imgUrls=[];
		},
		addImgs(e){
			var files=e.target.files,
				max=files.length>3?3:files.length;
				for(var i=0;i<max;i++){
					var reader=new FileReader();
					reader.readAsDataURL(files[i]);
					var obj={
						file:files[i]
					}
					reader.onload=()=>{
						obj.url=reader.result;
						this.files.push(obj);
					}					
				}

		},
		delImg(index){
			this.files.splice(index,1);
		}
	},
	mounted(){
		utils.getSystemVersion()
	}
}
</script>
<style lang="scss" scoped>
@import '../../../assets/styles/variables.scss';
@import './feedback';	
</style>