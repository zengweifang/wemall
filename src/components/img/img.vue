<template>
	<img :src="img" class="st-img" @error="error">
</template>
<script>
import defaultImg from "../../assets/imgs/default.png"
import defaultBgImg from "../../assets/imgs/default@3x.png"
export default{
	name:'st-img',
	props:{
		src:{
			type:String
		},
		bg:{
			type:Boolean,
			default:true
		}
	},
	watch:{
		src(newV){
			if(this.src){
				this.img=this.src;
			}
		}
	},
	data(){
		return {
			img:''
		}
	},
	methods:{
		error(e){
			if(this.bg){
				this.img=defaultBgImg;
				return;
			}
			this.img=defaultImg;
		}
	},
	mounted(){
		if(this.src){
			this.img=this.src;
		}else{
			this.img=defaultImg;
		}
	}
}
</script>
<style>
.st-img{
	/*width:100%;*/
	height:100%;
/*	background:url(../../assets/imgs/default@3x.png);
	background-size: cover;*/
}
</style>