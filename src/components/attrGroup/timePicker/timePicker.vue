<template>
	<!-- 属性小组选择 时间控件，可自定义选择需要什么 -->
	<div class="attr-time-picker">
		<mt-picker
			:slots="timeSlots"
			@change="onValueChange"
			:item-height="24"
		></mt-picker>		
	</div>
</template>
<script>
import {utils} from '../../../common/utils';
export default{
	name:'attr-group',
	data(){
		var today=new Date(),
			year=today.getFullYear(),
			month=today.getMonth()+1,
			day=today.getDate(),
			hour=today.getHours(),
			minute=today.getMinutes();
		return {
			timeStr:'',
			today:today,
			year:year,
			month:month,
			day:day,
			hour:hour,
			minute:minute,
			timeSlots:[{
	                flex: 1,
	                values: [],
	                textAlign: 'center',
	                className:'small-font'
	          },
	          {
	                flex: 1,
	                values: [],
	                textAlign: 'center',
	                className:'small-font'
	          },
	          {
	                flex: 1,
	                values: [],
	                textAlign: 'center' ,
	                className:'small-font'
	          },
	          {
	                flex: 1,
	                values: [],
	                textAlign: 'center',
	                className:'small-font'
	      	 },
	         {
	                flex: 1,
	                values: [],
	                textAlign: 'center',
	                className:'small-font'
	      	 }	      	 
	      ],
		}
	},
	props:{
		value:String,
		timeScope:{
			type:Number,
			default:1,
			required:true,
		},
		providerId:String
	},//timeScope时间控制范围（0到分钟 1 到时分  2 到天 3 到月),value 默认值
	methods:{
		getDaysBuyMonth(month){
			var isRun=this.year%4==0,
				days=[],
				big=[1,3,5,7,8,10,12],
				small=[4,6,9,11],
				maxDay=30;
			month=parseInt(month);	
			if(big.indexOf(month)>=0){
				maxDay=31;
			}
			if(month==2){
				isRun?maxDay=28:maxDay=29;
			}
			for(var i =1;i<=maxDay;i++){
				days.push(i+"日")
			}
			return days;
		},
		getYearMonth(month){
			var years=[this.year+'年',this.year+1+'年'],
				months=[],
				days=this.getDaysBuyMonth(month),
				hours=[],
				minutes=['0分','30分'];
			var providerId1 = '26651824-775E-4FAA-9F7D-3B0BB08915DF';
			var providerId2 = 'B46FFA44-2DA2-4416-B05E-040CDF2E7597';
			var weAppId = utils.getCookie('we_appId');

			// weAppId="wgjWcB7bG";
			// providerId=providerId2;
			var providerTimeItems1=[9,10,11,12,13,14,15,16,17];
			var providerTimeItems2=[9,10,11,12,13,14,15,16,17,18,19,20,21];
			
			function checkItems(item,j){
				for(var i = 0;i<item.length;i++){
					if(j == item[i]){
						return true;
					}
				}
			}
			for(var i = 0 ;i<24;i++){
				if(weAppId=='wgjWcB7bG'){
					if(this.providerId == providerId1){
						if(checkItems(providerTimeItems1,i)){
							hours.push(i+"时")
						}

					}else if(this.providerId == providerId2){
						if(checkItems(providerTimeItems2,i)){
							hours.push(i+"时")
						}
					}
				}else{
					hours.push(i+"时")
				}
				

				if(i<=12){
					i!=0?months.push(i+"月"):'';
				}
			}
			return [years,months,days,hours,minutes];
		},
		onValueChange(picker,values){
			if(this.timeScope<3){
				var selMonth=values[1];
				picker.setSlotValues(2,this.getDaysBuyMonth(selMonth))
			}
			var str="";
			if(values.length>=1 && values[0]){
				str+=values[0].replace('年','');
			}
			if(values.length>=2 && values[1]){
				str+='-'+this.fillZero(values[1].replace('月',''));
			}
			if(values.length>=3 && values[2]){
				str+='-'+this.fillZero(values[2].replace('日',''));
			}
			if(values.length==4 && values[3]){
				str+=' '+this.fillZero(values[3].replace('时',''))+":00";
			}
			if(values.length==5 && values[4]){
				str+=' '+this.fillZero(values[3].replace('时',''))+":"+this.fillZero(values[4].replace('分',''));
			}
			this.subRes(str)
		},
		subRes(str){
			this.$emit('input', str)
		},		
		fillZero(num){
			num=parseInt(num);
			if(num<10){
				return '0'+num;
			}
			return num;
		}
	},
	mounted(){
		//timeScope时间控制范围（0到分钟 1 到时分  2 到天 3 到月),value 默认值
		//data  年，月，日，时，分
		var datas=this.getYearMonth(this.month);
		this.timeSlots[0].values=datas[0];
		this.timeSlots[0].defaultIndex=0
		switch(this.timeScope){
			case 0 :
					this.timeSlots[1].values=datas[1];
					this.timeSlots[1].defaultIndex=this.month-1;
					this.timeSlots[2].values=datas[2];
					this.timeSlots[2].defaultIndex=this.day-1;
					this.timeSlots[3].values=datas[3];
					this.timeSlots[3].defaultIndex=this.hour;
					var providerId1 = '26651824-775E-4FAA-9F7D-3B0BB08915DF';
					var providerId2 = 'B46FFA44-2DA2-4416-B05E-040CDF2E7597';
					var weAppId = utils.getCookie('we_appId');					
					if(weAppId=='wgjWcB7bG' && (this.providerId == providerId1 || this.providerId==providerId2)){
							this.timeSlots.splice(4,1);
					}else{
						this.timeSlots[4].values=datas[4];
						this.timeSlots[4].defaultIndex=this.minute-1;						
					}					
					break;

			case 1 :this.timeSlots.splice(4,1);
					this.timeSlots[1].values=datas[1];
					this.timeSlots[1].defaultIndex=this.month-1;
					this.timeSlots[2].values=datas[2];
					this.timeSlots[2].defaultIndex=this.day-1;
					this.timeSlots[3].values=datas[3];
					this.timeSlots[3].defaultIndex=this.hour;
					break;
			case 2 :this.timeSlots.splice(3,2);
					this.timeSlots[1].values=datas[1];
					this.timeSlots[1].defaultIndex=this.month-1;
					this.timeSlots[2].values=datas[2];
					this.timeSlots[2].defaultIndex=this.day-1;	
					break;				
			case 3 :this.timeSlots.splice(2,3);
					this.timeSlots[1].values=datas[1];
					this.timeSlots[1].defaultIndex=this.month-1;
					break;
		}
	}
}
</script>
<style lang="scss">	
	.attr-time-picker{
		padding:0.28rem 0;
	}
	.picker-slot-center{

	}
	.small-font{
		font-size:14px;
	}
</style>