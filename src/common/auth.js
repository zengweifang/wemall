import {utils} from './utils';
import {config,service} from './config';
import axios from "axios";
export const auth = {
		getAccessToken(){
			var u =service.common+'/oauth-server/oauth/token',
				data = {
					grant_type:"client_credentials",
					client_id:config.clientId,
					client_secret:config.clientSecret
				};
			if(utils.getCookie('phone') && utils.getCookie('userId') && utils.getCookie('refreshToken')){
				data.refresh_token=utils.getCookie('refreshToken');
				data.grant_type='refresh_token';
			}
			return new Promise((resolve,reject)=>{
				axios.post(u,null,{
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					params:data
				}).then(res=>{
					resolve(res.data)
				}).catch(err=>{
					reject('获取token失败',err)
				})
				
			})				
		},
		init(){
	  		return new Promise((resolve,reject)=>{
				this.getAccessToken().then(res=>{
					utils.setCookie('Authorization',res.token_type + ' ' +res.access_token,res.expires_in,service.domain);
					utils.setCookie('appversion','3.8.0',res.expires_in,service.domain);
					utils.setCookie('auth_mode',config.mode,res.expires_in,service.domain);
					resolve(true)
				}).catch(err=>{
					reject('获取token失败')
				})
	  		})
		}
}
