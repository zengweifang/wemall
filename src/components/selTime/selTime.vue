<template>
		<!-- 服务时间选择 -->
		<div class="sel-time-item fr">
	        <i class="iconfont icon-more"></i>
	        <span v-if="!key">请选择</span>
	        <span v-if="key">{{key}}</span>
		    <mt-popup
		      class="sel-time-modal"
		      v-model="ownOpen"
		      :modal="true"
		      :closeOnClickModal="true"
		      popup-transition="popup-fade"
		      position="bottom">    
				<div class="sel-time" v-if="time"  @click.stop="">
					<div class="scroll">
						<ul>
							<li class="date" v-for="(item,index) in time" :class="{'active':index==nowDate}" @click.stop="selDate(index,item)">
								<p>{{item.title}}</p>
								<p>{{item.date}}</p>
							</li>
						</ul>
					</div>
					<div class="error" v-if="error">
						<div class="img-area">
							<img src="../../assets/imgs/icon_helplessman_index.png" alt="">
						</div>
						<p>所有时间段都被约满了喔~</p>
					</div>
					<div class="content" v-if="!error" >
						<button v-for="(item,index) in nowItems" :class="{'active':index==nowTime,'disabled btn-disabled':!item.enabled}" @click.stop="selTime(index,item)">{{item.title}}</button>
					</div>
					<div class="footer">
						<button @click.stop="confirm()" :class="{'disabled dis':error}">确定</button>
					</div>
				</div>
		    </mt-popup>	
		</div>
</template>
<script>
import {ajax} from '../../common/ajax';
import {utils} from '../../common/utils';
import {config,service} from '../../common/config';
export default{
	name:'sel-time',
	data(){
		return{
			ownOpen:false,
			time:null,
			nowDate:0,
			nowItems:null,
			nowTime:0,
			value:'',
			key:'',
			error:false
		}
	},
	props:['open','processInstanceId',"val"],
	watch:{
		open(newV){
			if(newV){
				this.ownOpen=newV;
				this.getData();
			}
	
		}
	},
	methods:{
		selDate(num,item){
			this.nowDate=num;
			this.error=false;
			this.nowItems=item.items;
			for(var i=0;i<item.items.length;i++){
				if(item.items[i].enabled){
					this.selTime(i,item.items[i])
					return;
				}

			}
			this.error=true;
		},
		selTime(num,item){
			if(!item.enabled){
				return;
			}
			this.nowTime=num;
			this.value=item.value;	
		},
		getData(){
	        this.$indicator.open({
	           spinnerType: 'triple-bounce'
	        });   			
			var u=service.common+'/app-background/order/serviceTimes?processInstanceId='+this.processInstanceId;
			this.ownOpen=false;
			ajax.get(u).then(res=>{
				this.$indicator.close();
				if(utils.getStatusCode(res.code)==200){
					this.ownOpen=this.open;
					this.time=res.data;
					if(!this.key){
						for(var i = 0;i<this.time.length;i++){
							for(var j=0;j<this.time[i].items.length;j++){
								if(this.time[i].items[j].enabled){
									this.nowDate=i;
									this.nowItems=this.time[i].items;
									this.error=false;
									this.selTime(j,this.time[i].items[j])
									return;
								}
							}
						}
						this.selDate(0,this.time[0]);
					}
				}else{
					this.closeModal();
					this.$messageBox({
						  message: res.message,
						  showConfirmButton:true,
						  confirmButtonText:'确定'				
					}).then(action => {
						
					});							
				}
			}).catch(err=>{
				this.$indicator.close();
				console.log(err)
				this.$messageBox({
					  message: '获取服务时间失败，请重试',
					  showConfirmButton:true,
					  confirmButtonText:'重试'				
				}).then(action => {
					this.getData();
				});				
			})
		},
		confirm(){
			this.key=this.value;
			this.$emit('input',this.key);
			this.closeModal();
		},
		closeModal(type){
			this.ownOpen=false;
			this.$emit('closeSelTime');
		}		
	},
	mounted(){
		this.error=false;
		if(this.val){
			this.key=this.val
		}
		// this.getData();
	}
}	
</script>
<style lang="scss">
@import '../../assets/styles/common.scss';
.sel-time-item{
	width:70%;
	
	i{
		float:right;
	    font-size: 20px;
	    margin-right: -6px;			
	}
	span{
		float:right;
	}
}
.sel-time-modal{
	width:100%;
}
.sel-time{
	width:100%;
	.active{
		border-bottom:2px solid $primary-color;
		color:$primary-color;
	}
	.scroll{
		height:1.306667rem;
		width:100%;
		overflow:hidden;
		ul{
			height:100%;
			overflow-y:hidden;
			overflow-x:scroll;
			white-space: nowrap;	
		}
		.date{
			height:100%;
			width:2.12rem;
			min-width:80px;
			text-align:center;
			display:inline-block;
			overflow:hidden;
			p:first-child{
				margin-top:0.28rem;
			}
			p{
				//margin:0.28rem 0;
				font-size:12px;
				line-height:16px;
			}
		}

	}
	.error{
		text-align:center;
		height:196px;
		width:100%;
		padding-top:0.5rem;
		padding-bottom:0.6rem;
		.img-area{
			width:3rem;
			height:3rem;
			margin:0 auto;			
		}
		img{
			width:100%;
			height:100%;
		}
		p{
			text-align:center;
		}
	}	
	.content{
		padding:0 0.186667rem;
		height:196px;
		overflow:auto;
		.active{
			color:$primary-color;
			border:1px solid $primary-color;

		}
		.btn-disabled{
			color:#ccc;
			border:1px solid #b4b4b4;
		}
		button{
			width:22%;
			margin:0.32rem 1.5% 0;
			height:0.933333rem;
			border:1px solid $light-font-color;
			color:$light-font-color;
			background:none;
		}
	}
	.footer{
		margin-top:0.4rem;
		button{
			width:100%;
			height:1.173333rem;
			background-color:$primary-color;
			border:none;
			color:$white;
			font-size:14px;
		}
		.dis{
			color:#fff;
			background:#959595;
		}
	}
}
</style>
