<template>
	<div class="deliver-ifram">
		<mt-header :title="title" fixed class="header">
			<mt-button  slot="left" @click="goBack()">
				<i class="iconfont icon-back" style="font-weight: 600;font-size:20px;"></i>
			</mt-button>
		</mt-header>
		<iframe :src="deliverUrl"></iframe>
	</div>
</template>
<script>
	import { utils } from '../../../common/utils';
 export default {
	 name:'checkDeliver',
	 data(){
		 return {
			 deliverUrl:this.$route.params.deliverUrl,
			 title:"查看物流"
		 }
	 },
	 methods:{
		 goBack(){
			 utils.goBack(this);
		 }
	 },
	 mounted(){
		 utils.console(this.deliverUrl)
	 }

 }
</script>
<style lang="scss">
.deliver-ifram{
	position: fixed;
	right: 0;
	bottom: 0;
	left: 0;
	top: 0;
	-webkit-overflow-scrolling:touch;
	overflow-y: scroll;
}
iframe{
	position: absolute;
	border: none;
	top: 44px;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>