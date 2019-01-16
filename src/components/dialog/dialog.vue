<template>
	<div class="st-dialog" v-if="open">
		<div class="st-mask"></div>
		<div class="dialog-body">
			<div class="header" v-if="title">
				<h1>{{title}}</h1>
			</div>
			<div class="content">
				<slot></slot>
			</div>
			<div class="footer">
				<button v-if="confirmBtn" @click="">{{confirmBtn}}</button>
				<button v-if="cancleBtn" @click="cancle()">{{cancleBtn}}</button>
			</div>
		</div>	
	</div>	
</template>
<script>
	export default{
		name:'dialog',
		data(){
			return {
				open:false
			}
		},
		props:["isOpen","title","cancleBtn","cancleAction","confirmBtn","confirmAction"],
		methods:{
			cancle(){
				this.open=false;
				if(typeof this.cancleAction == 'function'){
					this.cancleAction();
				}
			},
			confirm(){
				this.open=false;
				if(typeof this.confirmAction == 'function'){
					this.confirmAction();
				}				
			}
		},
		mounted(){
			this.open=this.isOpen;
		}
	}
</script>
<style lang="scss">
@import './dialog'
</style>