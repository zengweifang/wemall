// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'es6-promise/auto'
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import axios from "axios"
import {routes} from './router/routerConfig'
import store from './vuex/index'
import VeeValidate from 'vee-validate';
import {utils} from './common/utils';
import {login} from './common/login';
import {config,service} from './common/config';
import vConsole from 'vconsole';
//引入mint-ui相关内容

import { Lazyload,InfiniteScroll,Indicator,Toast,MessageBox,Popup,Header,Button,Radio,Cell,Swipe,SwipeItem,Spinner,DatetimePicker,Picker,Tabbar, TabItem,CellSwipe} from 'mint-ui';

Vue.use(Lazyload)
Vue.use(InfiniteScroll);
Vue.prototype.$toast = Toast;
Vue.prototype.$indicator = Indicator;
Vue.prototype.$messageBox = MessageBox;
Vue.component(Popup.name, Popup);
Vue.component(Header.name, Header);
Vue.component(Button.name, Button);
Vue.component(Radio.name, Radio);
Vue.component(Cell.name, Cell);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Spinner.name, Spinner);
Vue.component(Picker.name, Picker);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);
Vue.component(CellSwipe.name, CellSwipe);
// import 
//引入手淘适配
import './assets/js/lib/flexible'
import './assets/js/lib/flexible-css'
//引入全局样式
import './assets/styles/style'
import './assets/fonts/iconfont.css'



//开启debug调试状态
if(utils.isTestEnv() || utils.getCookie('we_debug_mode')){
  new vConsole();
}
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(VueRouter)
Vue.use(VeeValidate);
// Vue.use(VueAMap);
// VueAMap.initAMapApiLoader({
//   key: 'f951d49b08bbd89685f7d6e5761d20f6',
//   plugin: ['Geolocation','PlaceSearch']
// });
/* eslint-disable no-new */
const router = new VueRouter({
    mode: 'history', // 去掉hash模式
	  routes
})
if(window.location.href.indexOf('#')>=0){
  window.location.replace(window.location.href.replace('#/',''));
}
router.beforeEach((to,from,next)=>{
      var env=utils.getEnv(),
          secs=7*24*60*60,
          oneDay=24*60*60;
      if(env=='weixin' || env=='alipay' || env=='dingding'){
          secs=2*60*60;
      }
      if(to.query.enter){
          utils.setCookie('we_enter',to.query.enter,oneDay,service.domain)
      }      
      if(to.query.we_appId){
          utils.setCookie('we_appId',to.query.we_appId,secs,service.domain)
      }
      if(to.query.ADTAG){
          utils.setCookie('we_adtag',to.query.ADTAG,secs,service.domain)
      }
      if(to.query.we_appSecret){
          utils.setCookie('we_appSecret',to.query.we_appSecret,secs,service.domain)
      }
      var appId=utils.getCookie('we_appId') || '',
          ADTAG=utils.getCookie('we_adtag') || appId;

      //这是微信登录或者支付宝登录的时候返回的phone userId openId
      if(to.query.phone && utils.checkPhone(to.query.phone) && to.query.userId && to.query.userId!="null"){
          utils.setCookie('phone',to.query.phone,secs,service.domain);
          utils.setCookie('userId',to.query.userId,secs,service.domain);
          if(to.query.openId){
            utils.setCookie('openId',to.query.openId,secs,service.domain);            
          }
      }
      //如果是在支付宝中，同意了授权时，会拿到openId
      if(env=='alipay_channel' && to.query.openId && to.query.admittance){
          utils.setCookie('openId',to.query.openId,secs,service.domain);
          utils.setCookie('admittance',to.query.admittance,secs,service.domain);
      }
      //如果是在钉钉中，则要拿到企业ID
      if(env=='dingding' && to.query.corpid){
        utils.setCookie('corpId',to.query.corpid,secs,service.domain);
      }
      //给每个链接带上appid,
      if(utils.getCookie('we_appId') && (!to.query.we_appId || !to.query.ADTAG)){
          !to.query.we_appId?to.query.we_appId=appId:'';
          !to.query.ADTAG?to.query.ADTAG=ADTAG:'';
          next({path:to.path,query:to.query,name:to.name,params:to.params});
      }      
      //页面需要用户权限才能访问时，判断是否登录    
      if((!to.query.phone || !utils.checkPhone(to.query.phone)) && to.meta.auth && !login.isLogin(to)){
          if(env!='weixin' && env !='alipay_channel' && env !="dingding"){
              if(appId){
                next({path:'/login',query:{we_appId:appId,ADTAG:ADTAG,to:utils.routerToUrl(to)}})
                return;
              }else{
                next({path:'/login',query:{to:utils.routerToUrl(to)}})
                return;
              }
          }else{
            next(false);
            return;
          }
      }
      // }
      //如果是后退操作则
      // if(!to.meta.keepScroll ){
      //     window.scrollTo(0,0);
      // }
      next();

})

const app = new Vue({
	router,
	store,
	render:h => h(App)
}).$mount('#app')