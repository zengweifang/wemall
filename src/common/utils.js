import {config,service} from './config';
import {ajax} from './ajax';
import axios from "axios";
export const utils ={
	/*
	**	将字符串转成json对象
	*/	
	transJson(str){
		try{
			JSON.parse(str)
			return JSON.parse(str);
		}catch(e){
			return str;
		}
	},
	/*
	**	操作sessionStorage以及localStorage
	*/	
	getSessionStorage(key){
		return this.transJson(window.sessionStorage.getItem(key))
	},
	removceSessionStorage(key){
		window.sessionStorage.removeItem(key)
	},
	setSessionStorage(key,value){
		if(typeof value =='object'){
			value=JSON.stringify(value);
		}
		window.sessionStorage.setItem(key,value)
	},
	getLocalStorage(key){	
		if(window.localStorage){
			return this.transJson(window.localStorage.getItem(key))
		}
		return this.transJson(window.sessionStorage.getItem(key))
	},
 	setLocalStorage (key,value) {
		if(typeof value =='object'){
			value=JSON.stringify(value);
		}
		if(window.localStorage){
    		window.localStorage.setItem(key, value)
		}else{
			window.sessionStorage.setItem(key, value)
		}
  	},
  	removeLocalStorage(key){
 		if(window.localStorage){
    		window.localStorage.removeItem(key)
		}else{
			window.sessionStorage.removeItem(key)
		} 		
  	},
  	clearLocalStorage(){
  		window.localStorage.clear();
  	},
  	clearSessionStorage(){
  		window.sessionStorage.clear();
  	},
  	clearAllStoarge(){
  		this.clearSessionStorage();
  		this.clearLocalStorage();
  	},
	/*
	**	操作cookie
	*/
	getCookie(key){
		var arr,reg=new RegExp("(^| )"+key+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg)){
			return unescape(arr[2]);
		}else{
			return null;		
		}
	},
	setCookie(key,value,seconds,domain){
		var exp = new Date() , str;
		exp.setTime(exp.getTime() + seconds*1000);
		str = key + "="+ escape (value) + ";expires=" + exp.toGMTString() + ' ;path=/';
		if(domain)	{
			str += '; domain='+domain;
		}
		document.cookie=str;
	},
	delCookie(key) {
		var exp = new Date(0);
		document.cookie= key + "="+";expires="+exp.toGMTString() + ' ;path=/';		
		document.cookie= key + "="+";expires="+exp.toGMTString() + ' ;path=/; domain='+service.domain;			
	},
	clearCookie(){
		var cookies=document.cookie.split(';');
		for(var i=0,len=cookies.length;i<len;i++){
			var index=cookies[i].indexOf('='),
				key=cookies[i].substr(0,index);
			this.delCookie(key);
		}
	},
	/*
	**	返回当前设备的dpr
	*/	
  	getDpr(){
  			var win=window,
		        isAndroid = win.navigator.appVersion.match(/android/gi),
		        isIPhone = win.navigator.appVersion.match(/iphone/gi),
		        devicePixelRatio = win.devicePixelRatio,
		        dpr;
	        if (isIPhone) {
	            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
	            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {                
	                dpr = 3;
	            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
	                dpr = 2;
	            } else {
	                dpr = 1;
	            }
	        } else {
	            // 其他设备下，仍旧使用1倍的方案
	            dpr = 1;
	        }	
	        return dpr;	
  	},
	/*
	**	滑动
	*/  	
    slowScroll(distance,type){
		var nowDis=0,
		    speed=type=='normal'?200:type=='fast'?300:100;
		var changeDis=()=>{
		      setTimeout(()=>{
		          if(nowDis<distance){
		              nowDis=nowDis+speed>distance?distance:nowDis+speed;
		              window.scrollTo(0,nowDis);
		              changeDis();
		          }
		      },20)
		};
		changeDis();
	},
	/*
	**	截取返回码后3位，便于判断
	*/	
	getStatusCode(code){
		code=code+"";
		if(code && code.length>3){
			return code.substr(code.length-3,3)
		}
		return code;
	},
	/*
	**	检测手机号是否正确
	*/	
	checkPhone(phone){
		var ma=/^[1][34578][0-9]{9}$/;
		if(ma.test(phone)){
			return true;
		}
		return false;
	},
	/*
	**	检测座机以及手机号是否正确
	*/	
	checkTel(value){
		return /(^\d{8}$)|(^\d{12,13}$)|(^[1][34578][0-9]{9}$)/.test(value);
	},
	/*
	**	检测名字是否合格
	*/	
	checkName(value){
		return /^[\u4e00-\u9fa5a-zA-Z\.\s]{1,16}$/.test(value);
	},
	/*
	**	返回上一页
	*/	
	goBack(Vue){
		window.isBack=true;
		if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){ // IE
		    if(history.length > 0){
		        window.history.back();
		    }else{
		       Vue.$router.push({name:'index'});
		    }
		}else{ //非IE浏览器
		    if (navigator.userAgent.indexOf('Firefox') >= 0 ||
		        navigator.userAgent.indexOf('Opera') >= 0 ||
		        navigator.userAgent.indexOf('Safari') >= 0 ||
		        navigator.userAgent.indexOf('Chrome') >= 0 ||
		        navigator.userAgent.indexOf('WebKit') >= 0){

		        if(window.history.length > 1){
		            window.history.back();
		        }else{
		            Vue.$router.push({name:'index'});
		        }
		    }else{ //未知的浏览器
		        window.history.back();
		    }
		}
	},
	/*
	**	关闭当前页
	*/
	close(){
		if(typeof WeixinJSBridge !="undefined"){
			WeixinJSBridge.call('closeWindow');
		}else{
			window.close();
		}
	},
	/*
	**	深圳复制数组或者对象，主要在vuex的复制上
	*/
	deepCopy(o){
	    if (o instanceof Array) {
	        var n = [];
	        for (var i = 0; i < o.length; ++i) {
	            n[i] = this.deepCopy(o[i]);
	        }
	        return n;

	    } else if (o instanceof Object) {
	        var n = {}
	        for (var i in o) {
	            n[i] = this.deepCopy(o[i]);
	        }
	        return n;
	    } else {
	        return o;
	    }
	},
	/*
	**	转为query字符串
	*/	
	toQueryStr(obj){
		if(typeof obj=='object'){
			var arr=[];
			for(var key in obj){
				arr.push(key+'='+obj[key])
			}

			return arr.length>0?'&'+arr.join('&'):'';
		}
		return '';
	},
	/*
	**	转成params字符串
	*/	
	toParamsStr(obj){
		if(typeof obj=='object'){
			var str='';
			for(var key in obj){
				str='/'+obj[key]
			}
			return str;
		}
		return '';
	},
	/*
	**	判断当前是否在微信中打开
	*/	
	isWeixin(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            	return true;
            }
            return false;	
	},
	/*
	**	根据navigator判断当前在什么环境
	*/
	getEnv(){
		var na=window.navigator.userAgent.toLowerCase();
		if(na.indexOf('dingtalk')>=0){
			return 'dingding';
		}
		if(na.indexOf('alipay')>=0 && utils.getCookie('we_appId')=='wgjtYen2h'){
			return 'alipay_channel';
		}
		if(na.indexOf('alipay')>=0){
			return 'alipay';
		}
		if(na.indexOf('micromessenger')>=0){
			return 'weixin';
		}
		if(na.indexOf('jdpay')>=0){
			return 'jd';
		}
		return 'normal';
		// return 'dingding';
	},
	/*
	**	将VUEroute对象转为url链接
	*/	
	routerToUrl(route){
		return service.self+route.path+this.toParamsStr(route.params)+'?'+this.toQueryStr(route.query);
	},
	/*
	**	时间打点
	*/	
	test(name){
		var now=new Date(),
			year=now.getFullYear(),
			month=now.getMonth()+1,
			day=now.getDate(),
			hour=now.getHours(),
			minute=now.getMinutes(),
			seconds=now.getSeconds(),
			mills=now.getMilliseconds();
			//year+'-'+month+'-'+day+' '+
		console.log(name+':',hour+':'+minute+':'+seconds+' '+mills+'ms')			

	},
	getSystemVersion(){
		//var wa="Mozilla/5.0 (iPod; CPU iPhone OS 6_0_1 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Mobile/10A523".toLowerCase(),
		 var wa=window.navigator.userAgent.toLowerCase(),
			sysType="",
			phoneType="",
			pMa=/mozilla\/5.0\s*\((.*[android|iphone|ipad|ipod].*)\)\s*applewebkit/ig,
			res=pMa.exec(wa),
			info=res?res[1]:'',
			infoArr=info.split(';');
			if(wa.indexOf('ipone')>=0 || wa.indexOf('ipad')>=0 || wa.indexOf("iPod")>=0 || wa.indexOf('mac')>=0){
				sysType="ios ";
				var ma=/OS\s*([0-9_]*)/ig,
					temp=ma.exec(info);
				temp?sysType+=temp[1].replace(/_/g,'.'):'';
				phoneType=infoArr[0];

			}else if(wa.indexOf('linux')>=0 && wa.indexOf('android')>=0){
				sysType='android ';
				var ma=/android\s*([0-9\.]*)/ig,
					temp=ma.exec(info);
				temp?sysType+=temp[1]:'';
				for(var i=0;i<infoArr.length;i++){
					if(infoArr[i].indexOf('build')>=0){
						phoneType=infoArr[i].trim();
					}
				}
			}else{
				sysType="other";
				phoneType="other";
			}
			return {
				system:sysType,
				brand:phoneType
			}
	},
	/*
	**	判断是否在测试环境
	*/
	isTestEnv(){
		if(config.mode=='p-app.wang-guanjia.com' || config.mode=='app.wang-guanjia.com' || config.mode=='api.wang-guanjia.com' || config.mode=='www.wang-guanjia.com'){
			return false;
		}
		return true;
	},
	/*
	**	发送QQ统计数据
	*/
	sendMta(eventName,data){
		if(this.isTestEnv()){
			return;
		}
        var timeLit=setInterval(()=>{
            if(typeof MtaH5=='object'){
                MtaH5.clickStat(eventName,data)
                clearInterval(timeLit);
            }
        },100)		
	},
	loopDot(obj,str){
		var index=str.indexOf('.'),
			len=str.length,
			one=str,
			temp=obj[one];
			if(index>0){
				one=str.substr(0,index);
				temp=obj[one];			
				if(temp==null || temp == undefined){
					return false;
				}else{
					var newStr=str.substr(index+1,len-index);
					return this.loopDot(temp,newStr);				
				}
			}else{				
				if(temp == null || temp ==undefined){
					return false;
				}else{
					return true;
				}		
			}
	},	
	requireParam(){
		//arguments[0]为对象，arguments[1]~n-1为依赖的属性，中间用.号分割可以为多层级，arguments[n]为运行的函数
	    var args=arguments,
	      	len = args.length,
	      	_self=this;
	    var timeLit=setInterval(function(){
	      var app = args[0],
	          result = true;
	      for(var i=1;i<len-1;i++){
	      	if(args[i].indexOf('.')>=0){
	      		result=_self.loopDot(app,args[i]);
	      	}else{      		
		        if (app[args[i]] == null && app[args[i]]==undefined){
		          result=false;
		        }
	      	}
	      }
	      if(result){
	          clearInterval(timeLit);
	          if (typeof args[len-1]=='function'){
	            args[len - 1]();
	          }
	      }
	    },200)
	    setTimeout(function(){
	    	clearInterval(timeLit)
	    },30000)
	},
	/*
	**	加载文件
	*/
	loadFile(url){
		var script = document.createElement("script");
		script.src = url
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(script, s);
	},
	/*
	**	测试环境打印调试
	*/
	console(){
		if(this.isTestEnv()){
			var args=arguments;
			if(args.length==1){
				console.log(args[0])
			}else{
				console.log(args[0],args[1])
			}
		}
	},
	/*
	**  将query字符串转为对象
	*/
	transQuery(str){
		var arrs=str.split('&'),
			obj={};
		for(var i=0;i<arrs.length;i++){
			var index=arrs[i].indexOf('='),
				key=arrs[i].substr(0,index),
				value=arrs[i].substr(index+1,arrs[i].length-index);
				obj[key]=value;
		}
		return obj;
	},
	/**
	**	补0
	*/
	fillZero(num){
		return num>=10?num:'0'+num;
	}

}