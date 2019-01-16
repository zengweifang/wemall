 import Vue from 'vue'
 import axios from "axios"
import {utils} from './utils'
import {auth} from './auth'
import {config,service} from './config';
let _options=(options)=>{
	return options || ''
}
let _request=(method,url,data,options)=>{
	if(config.mode=="localhost"){
		url=url.replace(service.common,'');
	}
	let _reqOptions={
		url:url,
		method:method,
		headers:{},
		params:{},
		data:data,
		withCredentials: true,
		timeout:15000
	}
	if (options.headers) {
	    _reqOptions.headers = options.headers;
	}

	if (options.params) {
	    _reqOptions.params = options.params;
	}
	if(options.timeout){
		_reqOptions.timeout = options.timeout;
	}
	return new Promise((resolve,reject)=>{
		//判断当前的环境是否与之前的auth在同一个环境，不在则重新请求
		var authMode=utils.getCookie('auth_mode');
		if(utils.getCookie('Authorization') && authMode && config.mode==authMode){
			_reqOptions.headers.Accept='application/json';
			_reqOptions.headers.Authorization=utils.getCookie('Authorization');
			var pos=utils.getLocalStorage('we_use_pos'),
				townCode=utils.getLocalStorage('we_townCode');
			if(pos){
				_reqOptions.headers['Location']=pos;
			}
			if(townCode){
				_reqOptions.headers['Wgj-Position']=townCode;
			}
			axios(_reqOptions)
			.then(res=>{
				resolve(res.data)
			})
			.catch(err=>{
				utils.console('ajax error:',err)
				if(err.response && err.response.status==401){
					auth.init().then(res=>{
						_reqOptions.headers.Accept='application/json';
						_reqOptions.headers.Authorization=utils.getCookie('Authorization');
						axios(_reqOptions)
						.then(res=>{
							resolve(res.data)
						})
						.catch(err=>{
							utils.console('ajax error :',err)
							reject(err)
						})
					})
				}else{
					reject(err)
				}
			})
		}else{
			// var authMode=utils.getCookie('auth_mode');
			// if(authMode && config.mode!=authMode){			
			// 	utils.delCookie('refreshToken');
			// 	utils.delCookie('userId');
			// 	utils.delCookie('openId');
			// 	utils.delCookie('phone');
			// }
			auth.init().then(res=>{
				_reqOptions.headers.Accept='application/json';
				_reqOptions.headers.Authorization=utils.getCookie('Authorization');
				var pos=utils.getLocalStorage('we_use_pos'),
					townCode=utils.getLocalStorage('we_townCode');
				if(pos){
					_reqOptions.headers['Location']=pos;
				}
				if(townCode){
					_reqOptions.headers['Wgj-Position']=townCode;
				}
				axios(_reqOptions)
				.then(res=>{
					resolve(res.data)
				})
				.catch(err=>{
					utils.console('ajax error :',err)
					reject(err)
				})
			}).catch(err=>{
				console.log('获取auth失败',err)
				reject(err)
			})
		}

	})		

}
export const ajax ={
	get(url,options){
		return _request('GET',url,null,_options(options))
	},
	post(url,data,options){
		return _request('POST',url,data,_options(options))
	},
	patch(url,data,options){
		return _request('PATCH',url,data,_options(options))
	},
	put(url,data,options){
		return _request('PUT',url,data,_options(options))
	}
}