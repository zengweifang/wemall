<template>
	<div class="sel-amount">
		<span class="minus" :class="{disabled:disMinus}" @click="minus()"><i class="iconfont icon-minus"></i></span>
		<input type="num" maxlength="4" v-model="key" @propertychange="subRes()" @input="subRes()" :readonly="max==1" />
		<span class="add" :class="{disabled:key>=max || key>=max}" @click="add()"><i class="iconfont icon-add1"></i></span>
	</div>
</template>
<script>
export default{
	name:'sel-amount',
	data(){
		return {
			key:1,
			disMinus:false,
			del:false
		}
	},
	props:['number','max','min'],
	watch:{
		key:function(newV){
			var ma=/^[0-9]*$/;
			if(!ma.test(newV)){
				this.key="";
			}
			if(this.key>this.max){
				this.key=this.max
			}				
			this.subRes();
			if(newV<=this.min){
				this.disMinus=true
			}else{
				this.disMinus=false
			}
		},
		number:function(newV){
			this.key=newV
		}
	},
	methods:{
		subRes(){
			var ma=/^[0-9]*$/;
			if(!ma.test(this.key)){
				this.key="";
			}
			if(this.key && this.key>this.max){
				this.key=this.max
			}
			if(this.key && this.key<this.min){
				this.key=this.min
			}		
			this.$emit('input', parseInt(this.key))
		},
		minus(){
			if(this.key<=this.min){
				return;
			}
			this.key--;
		},
		add(){
			if(!this.key){
				this.key=0;
			}
			this.key++;
		}
	},
	mounted(){
		if(this.number){
			this.key=this.number
			if(this.key==this.min){
				this.disMinus=true;
			}
		}
	}
}	
</script>
<style lang="scss" scoped>
@import '../../assets/styles/common';
.sel-amount{
	width:2.36rem;
	height:0.653333rem;
	line-height:0.653333rem;
	border:1px solid #959595;
	border-radius:5px;
	overflow:hidden;
	span{
		display:inline-block;
		width:28.25%;
		height:100%;
		float:left;
		text-align:center;
		color:#ff5858;
		i{
			font-size:20px;
		}
		//@include box-position(center,center);
	}
	input{
		width:43.5%;
		border:none;
		height:100%;
		float:left;
		text-align:center;
		@include box-position(center,center);
	}
	.minus{
		border-right:1px solid #959595;
	}
	.add{
		border-left:1px solid #959595;
	}
	.disabled{
		color:#bfbfbf;
	}
}
</style>