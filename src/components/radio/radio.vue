<template>
	<div class="st-radio">
		<div class="single-radio" v-for="item in options">
			<span class="radia-core">
				<span class="circle" :class="{'active':result==item.value}">
					<i class="iconfont icon-select3"></i>
				</span>
				<input type="radio" v-model="result" :value="item.value" :name="name" @click="a(item.value)">
			</span>
			<span>{{item.label}}</span>
		</div>
	</div>
</template>
<script>
export default{
	name:'st-radio',
	data(){
		return {
			result:this.init
		}
	},
	props:['options','name','init'],
	watch:{
		init(newV){
			this.result=newV;
		}
	},
	methods:{
		a(x){
			this.$emit('input', x)
		}
	}
	
}
</script>
<style lang="scss" scoped>
@import './radio';
</style>