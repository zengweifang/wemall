<template>
	<div class="map" id="map"></div>
</template>
<script>
import {utils} from '../../../common/utils';
import {ajax} from '../../../common/ajax';
import {dingding} from '../../../common/dingding';
import {config,service} from '../../../common/config';
import {mapActions,mapGetters} from 'vuex';
export default{
	name:'map',
	props:['again','callBack','errCallBack'],
	data(){
		var self=this;
		return {}
	},
	computed:{
   		...mapGetters({
          'pos':'pos',
          "autoRegion":"autoRegion",
          "useRegion":"useRegion",
          "positionStatus":"positionStatus"
     	})   
  	},
  	watch:{
  		again:function(newV){
			this.getLocation();
  		},
  		$route:function(){
  			this.judgeLoc();
  		}
  	},
	methods:{
		...mapActions([
			'setAutoRegion',
			'setPos',
			'setPositionStatus',
			'setSelServiceRegion'
		]),
		setSelRegionNull(vue){
			var now=new Date().getTime();
			var last=utils.getLocalStorage('we_sel_time');
			if(now-last>24*60*60*1000 && !this.useRegion.phone){
				vue.$store.dispatch('setSelServiceRegion',null);
			}
		},
		getAutoRegion(lng,lat){			
			var u = service.common+'/app-background/poi/searchPOIsByLocation?location='+lng+','+lat;
			ajax.get(u).then(res=>{
				if(utils.getStatusCode(res.code)==200 && res.data){
					if(res.data.poi && res.data.poi.length>0){
						var region=utils.deepCopy(res.data.poi[0]);
						this.$store.dispatch('setAutoRegion',res.data.poi[0])
						this.$store.dispatch('setNearPlaces',res.data.poi);
						this.setSelRegionNull(this);
			            if(typeof this.callBack=='function'){
			            	this.callBack(lng,lat);
			            }						
						this.getTownCode(lng,lat).then((ret)=>{
							region.townCode=ret.data.id;
							this.$store.dispatch('setAutoRegion',region)
						}).catch(err=>{
							utils.console('GetTownCode Error:',err)
						})
						utils.console('当前自动获取的行政区：',region)
					}else{
						this.$store.dispatch('setAutoRegion',null)
			            if(typeof this.errCallBack=='function'){
			        		this.errCallBack();
			            }						
					}
				}else{
					this.$store.dispatch('setAutoRegion',null)
		            if(typeof this.errCallBack=='function'){
		        		this.errCallBack();
		            }					
				}
			})
			.catch(err=>{
	            if(typeof this.errCallBack=='function'){
	        		this.errCallBack();
	            }				
				this.$store.dispatch('setAutoRegion',null)
			})			
		},
		getTownCode(lng,lat){
			return new Promise((resolve,reject)=>{
				var u = service.common+'/app-background/administrativeRegion/infoAtLocation?location='+lng+','+lat;
				ajax.get(u)
				.then(res=>{
					if(utils.getStatusCode(res.code)==200){
						resolve(res)
					}else{
						reject(null)
					}
				})
				.catch(err=>{
					reject(null)
				})
			})
		},
		//定位成功回调
		geoSucc(pos){
			this.$store.dispatch('setPos',pos);
			this.getAutoRegion(pos.lng,pos.lat);
		},
		//定位失败回调
		geoErr(err,type){
			var self=this;
			self.$store.dispatch('setPos',null)
			var message="定位失败！";
			if(err && err.message){
				if(err.message.indexOf('permission denied')>=0){
					message="定位请求失败，请您开启定位服务以及允许我们获取您的定位信息。"
				}
				if(err.message.indexOf('not Support html5')>=0){
					message="定位失败，请您手动选择定位。"
				}
			}
			if(typeof self.errCallBack=='function'){
				self.errCallBack();
			}				        	
			if(!type && window.canPop){
				this.$messageBox({
					message:message,
					showConfirmButton:true,
					showCancelButton:true,
					confirmButtonText:'重新定位',
					cancelButtonText:'手动选择'
				}).then(action =>{
					if(action=='confirm'){
						self.getLocation();
					}else{
						window.canPop=false;
						self.$router.push({name:'chooseAddr'});
					}
				})
			}
		},
		//高德获取地理位置
		aMapLoc(type){
			var self=this;

			utils.test('Geolocation AmapLoc -> enter')		
			utils.requireParam(window,'AMap.Map',function(){
				utils.test('Geolocation AmapLoc -> start')
				if(type==2){
					self.$indicator.open({
					  spinnerType: 'fading-circle'
					});
				}			
				var mapObj = new AMap.Map('map');
				mapObj.plugin('AMap.Geolocation', function () {
				    var geolocation = new AMap.Geolocation({
				        enableHighAccuracy: true,//是否使用高精度定位，默认:true
				        timeout: 5000,          //超过10秒后停止定位，默认：无穷大
				        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
				        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
				        showButton: false,        //显示定位按钮，默认：true
				        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
				        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
				        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
				        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
				        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
				        zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
				    });
				    mapObj.addControl(geolocation);
				    geolocation.getCurrentPosition();
				    AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
				    AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
				});
			})
			function onComplete(result){
				utils.test('Geolocation AmapLoc -> complete')
				utils.console('Geolocation AmapLoc -> complete',result)
				if(type==2){
					self.$indicator.close();
				}				
				self.geoSucc({lng:result.position.lng,lat:result.position.lat})
			}
			function onError(err,type){
				if(type==2){
					self.$indicator.close();
				}				
				utils.test('Geolocation AmapLoc -> error')
				utils.console('Geolocation AmapLoc -> error',err)
				self.geoErr(err,type)
			}
		},
		//钉钉获取地理位置
		dingLoc(type){
			var self=this;
			utils.console('Geolocation dingLoc -> enter')	
			dingding.config().then((res)=>{
				return dingding.ready();
			}).then(res=>{
				return dingding.getLocation();
			}).then(res=>{
				utils.console('Geolocation dingLoc -> complete',res);
				self.geoSucc({lng:res.longitude,lat:res.latitude});			
			},err=>{
				utils.console('Geolocation dingLoc -> error',err);
			}).catch(err=>{
				utils.console('Geolocation dingLoc -> error',err);
			})
		},
		// QQLoc(type){
		// 	var _self=this;
		// 	utils.requireParam(window,'qq.maps',function(){
		// 		var geolocation = new qq.maps.Geolocation("5LVBZ-ZIEWO-TYBWI-SGS5R-TOWKF-ZBF7W", "wemall");
		// 		geolocation.getIpLocation(onSucc,onErr,{
		// 			timeout:10
		// 		})
		// 		function onSucc(result){
		// 			console.log('qq geo result',result)
		// 		}
		// 		function onErr(err){
		// 			console.log('qq geo err',err)
		// 		}
		// 	})
		// },
		//根据不同环境选择定位方式		
		getLocation(type){
			utils.console('Geolocation -> start')
			if(utils.getEnv()=='dingding'){
				utils.console('Geolocation dingLoc -> before')
				this.dingLoc(type)
			}else{
				utils.console('Geolocation AmapLoc -> before')
				this.aMapLoc(type);
			}
		},
		//判断是否需要定位
		judgeLoc(){
			if(this.useRegion && this.useRegion.name){
				if(this.positionStatus=='定位中...'){
					this.$store.dispatch('setPositionStatus',this.useRegion.name)
				}
			}				
			if(!this.$route.name){
				return;
			}
			if(!this.$route.name || (typeof this.$route.meta.position !="undefined" && !this.$route.meta.position)){
				return
			}
			if(this.callBack){
				return;
			}			
			if(this.useRegion && this.useRegion.name){
				if(this.positionStatus=='定位中...'){
					this.$store.dispatch('setPositionStatus',this.useRegion.name)
				}
				// 拿到上次定位的时间，如果时间超过2小时，并且并不是用户手动选择的用户地址，那么重新拿定位
				var now=new Date().getTime();
				var last=utils.getLocalStorage('we_sel_time');
				//距离上次定位到现在的时间差，定位指的是autoRegion selRegion设值，如果大于2小时，而且使用的地址不是用户填写的地址，那么就重新拿定位
				utils.console('距离上次定位到现在的毫秒差:',now-last-2*60*60*1000)
				if(now-last>2*60*60*1000 && !this.useRegion.phone){
					setTimeout(()=>{
						this.getLocation();
					},1000)						
				}										
			}else{
					this.getLocation(2);				
			}
		}
	},
	mounted(){
		this.judgeLoc();
	}
}
</script>
<style lang="scss" scoped>
.hidden{
	width:0;
	height:0;
	position:absolute;
	top:-888888px;
	left:-99999px;
}	
</style>