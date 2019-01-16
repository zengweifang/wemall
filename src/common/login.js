import Vue from 'vue'
import {utils} from './utils';
import {dingding} from './dingding';
import {config,service} from './config';
import {ajax} from "./ajax";
import {Indicator,Toast} from 'mint-ui';
export const login = {
    /*
    **  判断是否登录
    */  
    isLogin(to){
        //如果是在微信中，则要判断
        var phone=utils.getCookie('phone'),
            env=utils.getEnv();
        if(env!='weixin' && env !='alipay_channel' && env !='dingding'){
            if(phone && utils.checkPhone(phone) && utils.getCookie('userId')){
                return true;
            }
        }else{
            if(phone && utils.checkPhone(phone) && utils.getCookie('userId') && utils.getCookie('openId')){
                return true;
            }
            var toUrl=window.location.href,
                loginUrl=service.self+'/login?we_appId='+utils.getCookie('we_appId');        
            if(to && typeof to =='object'){
                toUrl=service.self+to.path+utils.toParamsStr(to.params)+'?1=1'+utils.toQueryStr(to.query);
            }
            var reUrl=loginUrl+';'+toUrl;
            if(env=='weixin'){
                //在微信中的处理
                this.isBindWX(reUrl);
            }else if(env=='alipay_channel'){
                this.isBindAlipay(reUrl);
            }else if(env=='dingding'){
                this.isBindDingDing(loginUrl)
            }
        }
        return false;
    },
    /*
    **  判断是否绑定了微信
    */
    isBindWX(redirectUrl){
        var u = service.common+'/wechat-service/oauth2/authorize';
        ajax.get(u,{
            params:{
                    appId:config.wxAppId,
                    redirectUrl:redirectUrl 
            }           
        }).then(res=>{
            window.location.href=res.data;
        
        }).catch(err=>{
            Toast('网络连接失败，请重试')
        })
    },
    /*
    **  判断是否绑定了支付宝
    */  
    isBindAlipay(redirectUrl){
        Indicator.open({
            spinnerType: 'triple-bounce'
        });
        var u = service.common + '/alipay-service/oauth2/authorize';
        ajax.get(u,{
            params:{
                    appId:config.alipayAppid,
                    redirectUrl:redirectUrl 
            }               
        }).then(res=>{
            Indicator.close();
            // alert(res.data)

            window.location.href=res.data;
        }).catch(err=>{
            Indicator.close();
            Toast('网络连接失败，请重试')
        })
    },
    
    isBindDingDing(loginUrl){
    	dingding.ready().then(res=>{
    		return dingding.getCode();
    	}).then(res=>{
            return dingding.getUserInfo(res.code);
        }).then(res=>{
            if(utils.getStatusCode(res.code)==200 && res.data){
            	if(res.data.binding){
            		var secs=7*24*60*60;
					utils.setCookie('phone',res.data.phone,secs,service.domain);
					utils.setCookie('userId',res.data.userId,secs,service.domain);                	
					utils.setCookie('openId',res.data.openId,secs,service.domain); 
                    if(res.data.userToken){
                        utils.setCookie('Authorization',res.data.userToken.token_type + ' ' +res.data.userToken.access_token,res.data.userToken.expires_in,service.domain);
                        utils.setCookie('refreshToken',res.data.userToken.refresh_token,secs,service.domain);
                        utils.setCookie('auth_mode',config.mode,res.data.userToken.expires_in,service.domain);
                    }                                       	
                	window.location.reload();
            	}else{
            		utils.setCookie('openId',res.data.openId,secs,service.domain);
            		window.location.href=loginUrl;
            	}
            }else{
                    Toast(res.mesage);
                }
        }).catch(err=>{
            console.log('isBindDingDing error',err)
            Toast('网络连接失败，请重试');
        })
    }
}
