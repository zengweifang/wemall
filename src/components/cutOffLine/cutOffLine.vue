<template>
	<div class="linear">
		<hr>
		<h1>{{title}}</h1>
	</div>
</template>
<script>
	export default{
		name:'cut-off-line',
		props:["title"]
	}
</script>
<style lang="scss" scoped>
	@import '../../assets/styles/variables';
	.linear{
		width:100%;
		padding:0.56rem 0;
		text-align: center;
		overflow: hidden;
		background:#f0f0f0;
		position:relative;
		@include box-position(center,center);
		hr{
			width:100%;
			height:1px;
			border:none;
			border-top:1px solid #c2c2c3;
			padding:0;
		}
		h1{
			//width:30%;
			line-height:12px;
			font-size: 12px;
			color:#333;
			position:absolute;
			top:0.56rem;
			left:50%;
			transform:translate(-50%,-50%);
			background:inherit;
			padding:0 0.333333rem;
		}
	}
</style>