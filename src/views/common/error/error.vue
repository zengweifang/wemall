<template>
	<div class="error">
		<img src="../../../assets/imgs/icon_helplessman_index.png" alt="">
		<p>{{text}}</p>
	</div>
</template>
<script>
export default{
	name:'error-page',
	data(){
		return {

		}
	},
	props:['text']
}
</script>
<style lang="scss" scoped>
@import '../../../assets/styles/common.scss';
.error{
	width:100%;
	min-height:100%;
	background-color: #fff;
	text-align: center;
	img{
		width:4.133333rem;
		height: 4.133333rem;
		margin-top: 2.52rem;
	}
	p{
		font-size:14px;
		margin-top:0.4rem;
		color:$lighter-font-color;

	}
}
</style>