<template>
	<!-- 属性小组选择，根据不同的type显示不同的控件 -->
	<div class="attr-group" :class="{'for-input':attrType==0}">
		<!-- 文本框 -->
		<input type="text" :maxlength="inputMaxLength" v-model="key" v-if="attrType==0" :placeholder="hintHolder" @propertychange="subRes()" @input="subRes()"/>

		<span v-if="attrType!=0 && !key && attrType !=3">{{optionText}}</span>
		<span v-if="attrType==3">{{data.deliveryName}}</span>
		<span v-if="attrType==2 && key">{{key}}</span>
		<span v-if="attrType==1">{{key}}</span>
  		<i class="iconfont icon-more" v-if="attrType!=0"></i>		
		<!-- 下拉菜单 -->
		<mt-popup
			 @click.stop="noThing()"
			class="options-modal"
			v-model="optionsModal"
			:modal="true"
			:closeOnClickModal="true"
			position="bottom"
		>
			<!-- <header>请选择xxxx</header> -->
			<ul :class="{'more':selectableValues && selectableValues.length>5}">
				<li v-for="item in selectableValues" @click.stop="selItem(item)">{{item.content}}</li>
			</ul>
			<button @click.stop.prevent="comfirm(1)">确定</button>
		</mt-popup>
		<!-- 时间选择器 -->
		<mt-popup
			class="time-modal"
			v-model="timeModal"
			:modal="true"
			:closeOnClickModal="true"
			position="bottom"
		>		
			<time-picker :time-scope="timeScope" v-model="time" v-if="timeModal" :provider-id="providerId"></time-picker>
			<div class="actions">
				<button @click.stop.prevent="closeModal(2)" class="cancel fl">取消</button>
				<button @click.stop.prevent="comfirm(2)" class="confirm fr" :class="{'disabled':comfirmTime}">确定</button>
			</div>
		</mt-popup>
		<!-- 右边POP页面式配送方式 -->
		<mt-popup
			class="right-modal"
			v-model="rightModal"
			:modal="false"
			:closeOnClickModal="false"
			position="right"
		>		
			<div class="right-info" @click.stop="noThing()">
				<mt-header title="配送信息">
			    	<mt-button  slot="left" @click.stop="closeModal()">
			    		<i class="iconfont icon-back" style="font-weight: 600;font-size:20px;"></i>
			    	</mt-button>
				</mt-header>
				<div class="content">
					<ul class="p-li">
						<li @click.stop="openChildModal()">
							<label>配送方式</label>
							{{deliveryData.deliveryName}}
							<i class="iconfont icon-more"></i>
						</li>
					</ul>
				</div>
				<button class="confirm" @click.stop="comfirmSelDelivery()">确定</button>
				<mt-popup
					class="options-modal"
					v-model="rightSelModal"
					:modal="true"
					:closeOnClickModal="true"
					position="bottom"
				>
					<header>请选择配送方式</header>
					<ul>
						<li v-for="item in deliveryData.deliveryModes" @click.stop="selDeliveryMode(item)">{{item.displayName}}</li>
					</ul>
					<button @click.stop="selDeliveryMode()">确定</button>
				</mt-popup>				
			</div>
		</mt-popup>		
	</div>
</template>
<script>
import timePicker from './timePicker/timePicker'
import {utils} from '../../common/utils';
export default{
	name:'attr-group',
	data(){
		return {
			optionsModal:false,
			timeModal:false,
			key:'',
			ownOpen:false,
			inputMaxLength:320,
			errorMsg:'',
			error:false,
			hintHolder:'',
			optionText:'请选择',
			rightModal:false,
			rightSelModal:false,
			deliveryData:{},
			time:'',
			minTime:new Date(),
			comfirmTime:true
		}
	},
	props:{
		//字段类型（0 文本 1 下拉菜单 2 时间控件 3右页面控件）
		attrType:{
			type:Number,
			required:true,
			validator:function(value){
				var arr=[0,1,2,3];
				return arr.indexOf(value)>=0
			}			
		},
		timeScope:{
			type:Number,
			validator:function(value){
				var arr=[0,1,2,3];
				return arr.indexOf(value)>=0
			}
		},
		selectableValues:Array,
		//文本框提示
		hint:String,
		//文本约束类型（0 无限制 1手机  2身份证 3 邮箱 4 姓名  5 正则表达式）
		textConstraintType:Number,
		regx:String, //正则表达式
		isRequired:Boolean,
		isOpen:Boolean,
		providerId:String,
		init:{},
		data:{}
	},
	watch:{
		isOpen:function(newV){
			if(this.attrType==0){
				this.ownOpen=true;
			}else{
				this.ownOpen=newV;
			}
			this.optionsModal= (this.attrType==1 && this.ownOpen) || false;
			this.timeModal=(this.attrType==2 && this.ownOpen) || false;			
			this.rightModal=(this.attrType==3 && this.ownOpen) || false;			
		},
		time:function(newV){
			if(this.timeModal){
				if(this.checkTime(newV)){
					this.comfirmTime=false;
				}else{
					this.comfirmTime=true;
				}	
			}
		}
	},
	components:{
		timePicker
	},
	methods:{
		noThing(){
		},
		//根据规则检测用户填写的值是否正确
		checkInput(type,input){
			var ma=new RegExp();
			switch(type){
				case 0: return true;
						break;
				case 1: ma=/^[1][34578][0-9]{9}$/;
						this.errorMsg="请输入正确的手机号";
						this.inputMaxLength=11;
						break;	
				case 2: ma=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
						this.errorMsg="请输入正确的身份证号";
						this.inputMaxLength=18;
						if(this.checkID(input)){
							return true;
						}else{
							return false;
						}
						break;
				case 3:	ma=/^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/;
						this.errorMsg="请输入正确的邮箱地址";
						break;
				case 4: ma=/^([\u4e00-\u9fa5a-zA-Z\.\s]{1,16})$/;
						this.errorMsg="请输入正确的姓名";
						this.inputMaxLength=20;
						break;	
				case 5:ma=new RegExp(this.regx);
						this.errorMsg="请按正确的格式输入";
						break;
			}
			if(ma.test(input)){
				return true;
			}
			return false;

		},	
		//下拉框选择选中事件
		selItem(item){
			this.key=item.content;
			this.subRes();
			this.closeModal(1)
		},
		//配送信息打开子modal
		openChildModal(){
			this.rightSelModal=true;
		},		
		//选择配送方式
		selDeliveryMode(item){
			if(!item){
				this.rightSelModal=false;
				return;
			}
			this.rightSelModal=false;
			this.deliveryData.deliveryName=item.displayName;
			this.deliveryData.deliveryModeType=item.type;
		},
		//确认选择的配送方式，发给submit页面
		comfirmSelDelivery(){
			this.$emit('changeDelivery',this.deliveryData);
		},
		//确认事件
		comfirm(type){
			console.log('key',this.key)
			if(type==2){
				if(!this.checkTime(this.time)){
					console.log('时间选择错误')
					return;
				}
				this.key=this.time;
			}
			this.subRes();
			this.closeModal(type)
		},
		checkTime(key){
			//检测选中的时间不能小于当前时间
			var today=new Date(),
				year=today.getFullYear(),
				month=today.getMonth()+1,
				day=today.getDate(),
				hour=today.getHours(),
				minute=today.getMinutes();
				if(this.timeScope==3 || this.timeScope==2){
					var n = new Date(key.replace(/-/g,'/')).getTime();
					if(n<today.getTime()){
						return false;
					}
					return true;
				}
				if(this.timeScope==1 || this.timeScope==0){
					var n=new Date(key.replace(/-/g,'/')).getTime();
					var providerId1 = '26651824-775E-4FAA-9F7D-3B0BB08915DF';
					var providerId2 = 'B46FFA44-2DA2-4416-B05E-040CDF2E7597';
					
					var weAppId = utils.getCookie('we_appId');
					// weAppId="wgjWcB7bG";
					// providerId=providerId2;
					if(weAppId=='wgjWcB7bG'){
						if(this.providerId == providerId1 || this.providerId == providerId2){
							//可以选择的服务时间需比当前时间晚两小时
							var minDate=today.getTime()+2*60*60*1000;
							if(n<minDate){
								return false;
							}
						}
					}else{
						if(n<today.getTime()){
							return false;
						}
					}
					return true;
				}
		},
		//关闭Modal
		closeModal(type){
			this.timeModal=false;
			this.ownOpen=false;
			this.rightSelModal=false;
			this.$emit('closeModal');
		},		
		//提交填写的值
		subRes(){
			//手机号：/^[1][34578][0-9]{9}$/
			//邮箱：/^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/
			//身份证：/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
			//姓名：^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$
			//正则表达式
			if(!this.key){
				return;
			}
			if(this.attrType==0){
				this.key=this.key.trim();
				if(this.checkInput(this.textConstraintType,this.key)){
					
					this.$emit('input', this.key);
					return;
				}
				this.$emit('input', '')
				return;
			}
			if(this.attrType==2){
				//去掉日期的年份
				this.key=this.key.substr(5,this.key.length-5);
				if(this.timeScope==1){
					this.$emit('input',this.key.replace(':00',''));
					return;
				}
			}
			this.$emit('input', this.key)
		},

		checkID(code){
			if(!code || code.length!=18){
				return false;
			}
			
			// 加权因子 
			var wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];  
			// 身份证验证位值.10代表X     
			var valideCodeArr = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];   
			// 区域ID  
			var areaMap = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};  
			// 男女ID  
			var sexMap = {0:"女",1:"男"};  
			//错误信息   
			 return checkIdCard(code)
				/** 
				 * 验证ID，正确返回“true”，错误则返回错误信息 
				 * @param {Object} idCard 
				 */  
			function checkIdCard(idCard){  
			    if (idCard.length == 15||idCard.length == 18) {  
			        if (!checkArea(idCard)) {  
			            return false;
			        } else if(!checkBrith(idCard)){  
			            return false;
			        } else if(idCard.length == 18 && !check18Code(idCard)){  
			           return false;
			        } else {  
			            return true;  
			        }  
			    }
			}  
				  
				  
				/** 
				 * 显示解析出的信息 
				 * @param {Object} idCard 正确的ID号 
				 * @param {Object} sexId 性别要显示的Input的id 
				 * @param {Object} birthId 生日要显示的Input的id 
				 * @param {Object} areaId 地区要显示的Input的id 
				 */  

				  
				  
				/** 
				 * 得到地区码代表的地区  
				 * @param {Object} idCard 正确的15/18位身份证号码 
				 */  
			function getArea(idCard){  
			    return areaMap[parseInt(idCard.substr(0, 2))];  
			}  
				  
			/**  
			 * 通过身份证得到性别 
			 * @param idCard 正确的15/18位身份证号码 
			 * @return 女、男 
			 */  
			function getSex(idCard){  
			    if (idCard.length == 15) {  
			        return sexMap[idCard.substring(14, 15) % 2];  
			    } else if (idCard.length == 18) {  
			        return sexMap[idCard.substring(14, 17) % 2];  
			    } else {  
			        //不是15或者18,null  
			        return null;  
			    }  
			}  
				  
			/** 
			 * 得到生日"yyyy-mm-dd" 
			 * @param {Object} idCard 正确的15/18位身份证号码 
			 */  
			function getBirthday(idCard){  
			    var birthdayStr;  
		
			    if (15 == idCard.length) {  
			        birthdayStr = idCard.charAt(6) + idCard.charAt(7);  
			          
			        if (parseInt(birthdayStr) < 10) {  
			            birthdayStr = '20' + birthdayStr;  
			        } else {  
			            birthdayStr = '19' + birthdayStr;  
			        }  
			        birthdayStr = birthdayStr + '-' + idCard.charAt(8) + idCard.charAt(9) + '-' + idCard.charAt(10) + idCard.charAt(11);  
			    }else if (18 == idCard.length) {  
			        birthdayStr = idCard.charAt(6) + idCard.charAt(7) + idCard.charAt(8) + idCard.charAt(9) + '-' + idCard.charAt(10) + idCard.charAt(11) + '-' + idCard.charAt(12) + idCard.charAt(13);  
			    }  
			      
			    return birthdayStr;  
			}  
			  
			/** 
			 * 验证身份证的地区码 
			 * @param {Object} idCard 身份证字符串 
			 */  
			function checkArea(idCard){  
			    if(areaMap[parseInt(idCard.substr(0, 2))] == null){  
			        return false;  
			    } else {  
			        return true;  
			    }  
			}  
			  
			/**  
			 * 验证身份证号码中的生日是否是有效生日 
			 * @param idCard 身份证字符串 
			 * @return 
			 */  
			function checkBrith(idCard){  
			    var result = true;  
			    if (15 == idCard.length) {  
			        var year = idCard.substring(6, 8);  
			        var month = idCard.substring(8, 10);  
			        var day = idCard.substring(10, 12);  
			        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));  
			         
			        // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法    
			        if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {  
			            result =  false;  
			        }  
			    } else if (18 == idCard.length) {  
			        var year = idCard.substring(6, 10);  
			        var month = idCard.substring(10, 12);  
			        var day = idCard.substring(12, 14);  
			        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));  
			          
			        // 这里用getFullYear()获取年份，避免千年虫问题    
			        if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {  
			            result = false;  
			        }  
			    } else {  
			        result = false;  
			    }  
			      
			    return result;  
			}  
			  
			/**  
			 * 判断身份证号码为18位时最后的验证位是否正确 
			 * @param idCardArr 身份证号码数组 
			 * @return 
			 */  
			function check18Code(idCardArr){  
			    var sum = 0; // 声明加权求和变量  
			    
			    // if (idCardArr[17].toLowerCase() == 'x') {  
			    //     idCardArr[17] = 10;// 将最后位为x的验证码替换为10方便后续操作    
			    // }  
			    idCardArr=idCardArr.toLowerCase().replace('x',10);
			    for (var i = 0; i < 17; i++) {  
			        sum += wi[i] * idCardArr[i];// 加权求和    
			    }  
			      
			    var valCodePosition = sum % 11;// 得到验证码所位置  
			    if (idCardArr[17] == valideCodeArr[valCodePosition]) {  
			        return true;  
			    } else {  
			        return false;  
			    }  
			}  	
		}	
	},
	mounted(){
		if(this.attrType==0){
			this.ownOpen=true;
		}else{
			this.ownOpen=this.isOpen;
		}
		//下拉框modal
		this.optionsModal= (this.attrType==1 && this.ownOpen) || false;
		//时间选择器modal
		this.timeModal=(this.attrType==2 && this.ownOpen) || false;	
		//配送选择modal
		this.rightModal=(this.attrType==3 && this.ownOpen) || false;	
		if(this.isRequired){
			this.hintHolder="(必填)"+this.hint;
			this.optionText="(必填)请选择";
		}else{
			this.hintHolder=this.hint;
		}
		this.key=this.init;
		//如果是配送，则深度拷贝配送data,防止没确定就更改到了父级的值
		if(this.attrType==3){
			this.deliveryData=utils.deepCopy(this.data);
		}
	}
}
</script>
<style lang="scss">
@import '../../assets/styles/variables';
@import '../../assets/styles/common';
@import './attrGroup';
</style>