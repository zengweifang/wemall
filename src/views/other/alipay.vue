<template>
	<div class="alipay">
		<div class="section">
			<img src="../../assets/imgs/ali_01.jpg" alt="">
		</div>
		<div class="section">
			<img src="../../assets/imgs/ali_02.jpg" alt="">
			
		</div>
		<div class="section">
			<img src="../../assets/imgs/ali_03.jpg" alt="">
			<button @click="toIndex()">立即预约</button>
		</div>
		<div class="section">
			<img src="../../assets/imgs/ali_04.jpg" alt="">
		</div>
	</div>
</template>
<script>
import {config,service} from '../../common/config';
import {ajax} from '../../common/ajax';
import {utils} from '../../common/utils';	
export default{
	name:'alipay',
	data(){
		return{
		}
	},
	methods:{
		toIndex(){
			this.$router.push({name:'index'})
		}
	},
	mounted(){
	}
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';
.alipay{
	background-color:#e5eaee;
	.section{
		width:100%;
		height:auto;
		position:relative;
		overflow:hidden;
		img{
			width:100%;
			border:none;
			outline-width:0px;  
			vertical-align:top;  			
		}
		button{
			position:absolute;
			z-index:20;
			top:15px;
			left:50%;
			margin-left:-30%;
			width:60%;
			height:40px;
			opacity:0;
		}
	}
}	
</style>