<template>
	<div class="order-data">
		<header>
			<div>			
				<h1>订单数据统计</h1>
				<button @click="toFeedBack()">反馈建议</button>
			</div>
		</header>
		<div class="container">		
			<h2>实时数据</h2>
			<div class="section data">
				<h3>关键指标</h3>
				<div>
					<p>{{orderAmount}}</p>
					<p>销售额</p>
				</div>
				<div>
					<p>{{orderNum}}</p>
					<p>订单量</p>
				</div>
			</div>
			<div class="section list">
				<h3>订单数据</h3>
				<div class="search">
					<div class="condition">				
						<div class="div">
							<label>起始日期</label>
							<date-picker :date="startTime" :option="option" :limit="startLimit" :call-back="startCallBack"></date-picker>
						</div>
						<div  class="div">
							<label>终止日期</label>
							<date-picker :date="endTime" :option="option" :limit="endLimit" :call-back="endCallBack"></date-picker>
							<a class="clear" @click="clear()">清除</a>
						</div>
					</div>
					<div class="fr">
						<button @click="search()">搜索</button>
					</div>			
				</div>
				<div class="result">			
					<table v-if="!searchTip">
						<thead>
							<tr>
								<th>服务名称</th>
								<th>订单编号</th>
								<th>单价</th>
								<th>数量</th>
								<th>订单状态</th>
							</tr>
						</thead>
						<tbody v-for='item in list'>						
							<tr v-for="(gItem,index) in item.goodsList">
								<td>{{gItem.name}}</td>
								<td v-if="index==0" :rowspan="item.goodsList.length">{{item.orderNumber}}</td>
								<td>{{gItem.price}}</td>
								<td>{{gItem.quantity}}</td>
								<td v-if="index==0" :rowspan="item.goodsList.length">{{item.orderStatusDesc}}</td>
							</tr>
						</tbody>
					</table>
					<p class="search-tip" v-if="searchTip">{{searchTip}}</p>
				</div>
		    	<pager
			        :total-page="page.totalPage"
			        :init-page="page.currentPage"
			        :showJump="false"
			        :showItems="2"
			        @go-page="goPage">     	
		        </pager>	
			</div>
		</div>		
	</div>
</template>
<script>
import myDatepicker from '../../../components/datepicker/datepicker';
import pager from 'vue-simple-pager';
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {dingding} from '../../../common/dingding';
import {utils} from '../../../common/utils';	
export default{
	name:'ding-order-data',
	data(){	
		return{
			oneDay:24*60*60*1000,
			page:{
				pageSize:10,
				currentPage:1,
				totalPage:0
			},
			list:[],
			searchTip:'正在加载中...',
            orderAmount:0,
            orderNum:0,
            startTime:{
            	time:'',
            },
            endTime:{
            	time:'',
            },
            startLimit:[{
            	type:'fromto',
            	from:'',
            	to:''
            }],
            endLimit:[{
            	type:'fromto',
            	from:'',
            	to:''
            }],
            option:{
            	type:'day',
            	week:['周一','周二','周三','周四','周五','周六','周日'],
            	month:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
            	format: 'YYYY-MM-DD',
		 		buttons: {
		          ok: '确定',
		          cancel: '取消'
		        }, 
		        inputStyle:{
					'width':'50%',
					'height':'30px',
					'border':'1px solid #ccc',
					'margin-left':'5px',
					'padding':'5px'	        	
		        },
		        color: {
		          header: '#ff5858',
		          headerText: '#fff'
		        },		                  	
            }
		}
	},
	components:{
		'pager':pager,
		'date-picker': myDatepicker
	},	
	methods:{
		getFormatTime(time){
			var year = time.getFullYear(),
				month = utils.fillZero(time.getMonth()+1),
				day = utils.fillZero(time.getDate());
			return year+'-'+month+'-'+day;	
		},		
        goPage (data) {
            this.page.currentPage = data.page;
            this.getOrderList();
        },
        startCallBack(){
        	var stamp = this.getTimestamp(this.startTime.time),
        		temp = stamp-this.oneDay;
        	this.endLimit[0].from=this.getFormatTime(new Date(temp));
        },
        endCallBack(){
        	var stamp = this.getTimestamp(this.endTime.time),
        		temp = stamp+this.oneDay;        	
        	this.startLimit[0].to=this.getFormatTime(new Date(temp));
        },
        toFeedBack(){
        	this.$router.push({name:'dingFeedback'})
        },
        clear(){
        	this.startTime.time="";
        	this.endTime.time="";
        },
        getTimestamp(dateStr,type){
        	if(!dateStr){
        		return '';
        	}
        	var temp;
        	if(dateStr.indexOf(':')<0){
        		if(type==1){
        			temp=dateStr.replace(/-/g,'/')+' 23:59:59';
        		}else{
        			temp=dateStr.replace(/-/g,'/')+' 00:00:00';
        		}
        		return new Date(temp).getTime();
        	}
        	return new Date(dateStr.replace(/-/g,'/')).getTime();
        },
        //获取统计信息
        getStatistics(){
			this.$indicator.open({
			  spinnerType: 'fading-circle'
			});
			var u = service.common + "/app-background/order/dingtalk/corporationStatistics",
				data = {
					corpId:utils.getCookie('corpId'),
					beginTimestamp:this.getTimestamp(this.startTime.time),
					endTimestamp:this.getTimestamp(this.endTime.time,1)
				}
			ajax.post(u,data).then(res=>{
				this.$indicator.close();
				if(utils.getStatusCode(res.code)==200 && res.data){
					this.orderAmount = res.data.orderTotalAmount;
					this.orderNum = res.data.orderTotalNumber;
				}else{
					this.$toast(res.message);
				}
			}).catch(err=>{
				this.$indicator.close();
				this.$toast('网络连接失败，请重试')
			})
        },
        getOrderList(type){
        	if(type==1){
        		this.page.currentPage=1;
        	}
			this.$indicator.open({
			  spinnerType: 'fading-circle'
			});	        	
			var u = service.common + "/app-background/order/dingtalk/corporationOrders",
				data = {
					corpId:utils.getCookie('corpId'),
					beginTimestamp:this.getTimestamp(this.startTime.time),
					endTimestamp:this.getTimestamp(this.endTime.time,1),
					page:this.page
				}
			this.searchTip='正在加载中...'
			ajax.post(u,data).then(res=>{
				this.$indicator.close();
				if(utils.getStatusCode(res.code)==200 && res.data){
					if(res.data.page){
						this.page.totalPage=res.data.page.totalPage;
					}
					if(res.data.page.totalPage==0 && (!res.data.list || res.data.list.length==0)){
						this.searchTip='没有找到相关订单';
						return;
					}
					this.searchTip="";
					this.list=res.data.list;
				}else{
					this.$toast(res.message);
					this.searchTip=res.message;
				}
			}).catch(err=>{
				this.$indicator.close();
				this.$toast('网络连接失败，请重试')
				this.searchTip='网络连接失败，请重试';
			})	
        },
        search(){
        	this.getStatistics();
        	this.getOrderList(1);
        }
	},
	mounted(){
		var now=new Date().getTime(),
			stamp=now+this.oneDay;
		this.startLimit[0].to=this.getFormatTime(new Date(stamp));
		this.endLimit[0].to=this.getFormatTime(new Date(stamp));			
		var isDindAdmin=utils.getSessionStorage('is_ding_admin');
			if(isDindAdmin && utils.getEnv()=='dingding'){
				this.getStatistics();
				this.getOrderList();
			}else{
				console.log('您没有权限访问');
				utils.goBack();
			}	
	}
}
</script>
<style lang="scss">
@import '../../../assets/styles/variables.scss';
@import './orderData';	
</style>