<template>
	<div class="loading-tip" :style="{'height':height,'line-height':height,'background-color':bgColor}">
		<span class="spinner" v-if="icon">
			<mt-spinner :type='type' :color="color" :size="size"></mt-spinner>
		</span>
		<span v-if="text" :style="{'color':color}">{{text}}</span>				
	</div>
</template>
<script>
export default{
	name:'loading-tip',
	data(){
		return {
			
		}
	},
	props:{
		text:{
			type:String
		},
		color:{
			type:String,
			default:'#959595'
		},
		type:{
			type:String,
			default:'triple-bounce'
		},
		size:{
			type:Number,
			default:20
		},
		height:{
			type:String,
			default:'40px'
		},
		icon:{
			type:Boolean,
			default:true
		},
		bgColor:{
			type:String,
			default:'transparent'
		}
	}
}
</script>
<style lang="scss" scoped>
@import '../../../assets/styles/common.scss';
.loading-tip{
	text-align: center;
	.spinner{
		display: inline-block;
		vertical-align: middle;
		margin-right: 12px;
	}
}
</style>