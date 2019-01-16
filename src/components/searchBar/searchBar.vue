<template>
	<div class="search-bar">
		<div class="search-icon">
			<i class="iconfont icon-search"></i>
		</div>
		<input id="search-input" :class="{'has-cancel':showCancel}" type="text" v-model="key" :placeholder="placeholder" @propertychange="subRes()" @input="subRes()"> 
		<span class="cancel" v-if="showCancel" @click="cancel()">取消</span>
	</div>
</template>
<script>
export default{
	name:'search-bar',
	data(){
		return {
			key:''
		}
	},
	props:['placeholder','showCancel','cancelAction'],
	watch:{
		showCancel:function(newV){
			if(newV){
				document.querySelector('#search-input').click();
			}
		}
	},
	methods:{
		toChooseAddr(){
			this.$router.push({name:'chooseAddr'})
		},
		cancel(){
			this.key="";
			if(typeof this.cancelAction =='function'){
				this.cancelAction();
			}
		},
		subRes(){
			this.$emit('input', this.key)
		}
	}
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/variables';
@import './searchBar';
</style>