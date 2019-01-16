<template>
	<div class="update">
		<img src="../../assets/imgs/pic_olderi300@3x.png" alt="">
		<p>请下载最新版旺管家APP，才能参与优惠活动哦~~</p>
	</div>
</template>
<script>	
export default{
	name:'update'
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/common.scss';
.update{
	width:100%;
	min-height:100%;
	background-color: $app-background;
	text-align: center;
	img{
		width:4.2rem;
		height: 4.2rem;
		// margin-top: 2.52rem;
		margin-top: 35%;
	}
	p{
		font-size:14px;
		padding:0 0.4rem;
	}
}
</style>