import {utils} from './utils';
import {ajax} from './ajax';
import {config,service} from './config';
import {Toast} from 'mint-ui';
import axios from "axios";
export const dingding = {
    config(){
        console.log('钉钉获取config中...')
        var url=window.location.href;
        // var url=service.self+'/?we_appId='+utils.getCookie('we_appId')+'&ADTAG='+utils.getCookie('we_adtag')+'&corpid='+utils.getCookie('corpId');
        return new Promise((resolve,reject)=>{
            // if(utils.getSessionStorage('ding_config')){
            //      resolve(true);
            //      return;
            // }
            var u = service.dingding+'/dingding-service/config/getDDConfigPara',
                data = {
                    corpId:utils.getCookie('corpId'),
                    url:url
                }; 
            if(window.dingHasConfig){
                resolve('钉钉之前config过')
                return;
            }  
            console.log('钉钉config url：',data.url)
            axios.post(u,null,{
                params:data
            }).then(result=>{
                var res=result.data;
                if(utils.getStatusCode(res.code)==200 && res.data){
                    console.log('获取钉钉config成功：',res.data)
                    dd.config({
                        agentId: res.data.agentId, // 必填，微应用ID
                        corpId: res.data.corpId,//必填，企业ID
                        timeStamp: res.data.timeStamp, // 必填，生成签名的时间戳
                        nonceStr: res.data.nonce, // 必填，生成签名的随机串
                        signature: res.data.signature, // 必填，签名
                        type:0,   //选填，0表示微应用的jsapi，1表示服务窗的jsapi，不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
                        jsApiList : [ 'biz.alipay.pay','runtime.permission.requestAuthCode','device.geolocation.get','biz.user.get','biz.map.locate'] // 必填，需要使用的jsapi列表，注意：不要带dd。
                    });
                    dd.error(function(err){
                        console.log('钉钉config失败：',err)
                    })
                    console.log('钉钉config完成')
                    window.dingHasConfig=true;
                    resolve(res.data)
                }else{
                    console.log('获取钉钉config失败')
                    reject("获取钉钉config失败")
                }   
            }).catch(err=>{
                reject('获取钉钉config失败')
            })
        })
    },
    ready(){
        console.log('钉钉初始化中...')
        return new Promise((resolve,reject)=>{
            var timeout=setTimeout(()=>{
                console.log('钉钉初始化超时')
                reject('钉钉初始化超时')
            },5000)
            dd.ready(function(){
                console.log('钉钉初始化成功')
                clearTimeout(timeout)
                resolve(true)
            })
            dd.error(function(err){
                clearTimeout(timeout)
                console.log('钉钉初始化错误：',err)
                reject('钉钉初始化错误');
                if(err.message && err.message.indexOf('52013')){
                    window.location.reload();
                }else{
                    Toast('网络连接失败，请重试');
                }
            })
        })
    },
    //钉钉版本判断，是否低于2.7.6
    judgeVer(){
        var version = dd.version.split('.');
        if(version[0]<2){
            return true;
        }
        if(version[0]==2 && version[1]<7){
            return true;
        }
        if(version[0]==2 && version[1]==7 && version[2]<6){
            return true;
        }
        return false;
    },
    getCode(){
        return new Promise((resolve,reject)=>{
            // resolve({code:'45070706f8df34bda7d3376970d00a84'})
            // return;                   
            dd.runtime.permission.requestAuthCode({
                corpId: utils.getCookie('corpId'),
                onSuccess: function(result) {
                    console.log('钉钉获取免登码成功：',result)
                    resolve(result)           
                },
                onFail : function(err) {
                    console.log('钉钉获取免登码错误：',err)
                    reject(err)
                }
              
            })            
        });
    },
    getUserInfo(code){
        var url=window.location.href
        return new Promise((resolve,reject)=>{
            var u = service.dingding + '/dingding-service/user/getUserInfo',
                data = {
                    url:url,
                    corpId:utils.getCookie('corpId'),
                    code:code,
                    clientId:config.clientId,
                    clientSecret:config.clientSecret                    
                };
            console.log('get user info url',url)    
            axios.post(u,null,{
                params:data
            }).then(result=>{
                var res=result.data;
                if(utils.getStatusCode(res.code)==200 && res.data){
                    resolve(res)
                }else{
                    reject(res.message)
                }
            }).catch(err=>{
                reject(err)
            })
            
        })
    },
    getDDUserInfo(){
        return new Promise((resolve,reject)=>{
            console.log('钉钉获取JSPAI用户信息...')
            dd.biz.user.get({
                corpId:'',
                onSuccess : function(result) {
                    console.log('钉钉获取JSPAI用户信息成功：',result)
                    resolve(result)

                },
                onFail : function(err) {
                    console.log('钉钉获取JSPAI用户信息错误：',err)
                    reject(err)
                }
            });            
        })  
    },
    getLocation(){                
        return new Promise((resolve,reject)=>{
            console.log('钉钉获取定位中...')
            dd.device.geolocation.get({
                targetAccuracy : 50,
                coordinate : 1,
                withReGeocode : false,
                useCache:false, //默认是true，如果需要频繁获取地理位置，请设置false
                onSuccess : function(result) {
                    console.log('钉钉获取定位成功：',result)
                    resolve(result)
                },
                onFail : function(err) {
                    console.log('钉钉获取定位失败：',err)
                    reject(err)
                }
            });            
        })        
    },
    pay(paydata){
        dd.ready(function() {
            return new Promise((resolve,reject)=>{
                dd.biz.alipay.pay({
                    info: paydata, // 订单信息，
                    onSuccess: function (result) {
                        resolve(result)
                    },
                    onFail: function (err) {
                        reject(err)
                    }
                })
            })
        }); 
    }

}
