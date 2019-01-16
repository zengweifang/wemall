<template>
	<div class="submit-order" v-if="createOrder && ownCreateOrder">
		<mt-header title="确认订单" fixed>
		    	<mt-button  slot="left" @click="goBack()">
		    		<i class="iconfont icon-back" style="font-weight: 600;font-size:20px;"></i>
		    	</mt-button>
		</mt-header>
		<section class="address">
     <router-link  :to="{name:'userSelAddr',query:{storeIds:storeIds,addressId:addressId}}">
        <p class="add-new-addr" v-if="!address || !address.phone"><span><i class="iconfont icon-add1"></i></span>添加收货地址</p>
  		 <div class="content"  v-if="address && address.phone">
  				<div class="icon">
  					<i class="iconfont icon-location1"></i>
  				</div>
  				<div class="sel-addr">
  					<p><span>{{address.name}}</span><span>{{address.phone}}</span></p>
  					<p>
  						<p>{{address.pname}}{{address.cityname}}{{address.adname}}</p>
              {{address.address}}
  					</p>
  				</div>
  				<div class="icon">
  					<i class="iconfont icon-more"></i>
  				</div>
  			</div>
      </router-link>
		</section>
		<section class="store-item" v-for="item in ownCreateOrder.storeOrders" v-if="createOrder">
			<div class="header has-border">
				<span class="store-name"><i class="iconfont icon-dianpu"></i>{{item.storeName}}</span><span class="store-price" v-if="!packageId">小计：<em>&yen;{{(item.subTotalMoney-item.freight).toFixed(2)}}</em></span>
			</div>
			<div class="goods" :class="{'has-border':index+1<item.orderItemList.length}" v-for="(gItem,index) in item.orderItemList">
				<div class="goods-info">
            <div class="img">
    					<img :src="gItem.imageUrl" :alt="gItem.name" class="src">
    				</div>
    				<div class="content">
    					<p>{{gItem.name}}</p>
    					<p class="pickle">{{gItem.prickle}}</p>
    					<p v-if="!packageId">
    						<span>&yen;{{gItem.price.toFixed(2)}}<i>&times;{{gItem.commodityCount}}</i></span>
    						<span>&yen;{{(gItem.price*gItem.commodityCount).toFixed(2)}}</span>
    					</p>
    				</div>
        </div>
        <div class="sel-item sel-service-time" :class="{warning:item.needServiceTime && !item.deliveryTimeStart}" v-if="item.needServiceTime" @click="openSelTime(item)">
          <p>服务时间
              <sel-time :open="item.isOpenTime" :process-instance-id="ownCreateOrder.processInstanceId" :val="item.deliveryTimeStart" v-model="item.deliveryTimeStart" v-on:closeSelTime="openSelTime(item)"></sel-time>
          </p>          
        </div>
  			<div class="sel-item" v-show="gItem.goodsAttributeList" :class="{warning:!aItem.value && aItem.required}" v-for="aItem in gItem.goodsAttributeList" @click="openAttrGroup(aItem)">
  				<p @click.prevent.stop="openAttrGroup(aItem)">
  					{{aItem.attributeDefineName}}
              <attr-group
                  v-on:closeModal="openAttrGroup(aItem)"
                  v-model="aItem.value" 
                  :is-open="aItem.isOpen"
                  :attr-type="aItem.attributeType" 
                  :time-scope="aItem.timeScope"
                  :hint="aItem.hint"
                  :init="aItem.value"
                  :regx="aItem.regx"
                  :selectable-values="aItem.selectableValues"
                  :text-constraint-type="aItem.textConstraintType"
                  :provider-id="gItem.providerId"
                  :is-required="aItem.required">
              </attr-group>          
  				</p>
  			</div>
      </div> 
      <div class="sel-item" @click="openAttrGroup(item)" v-if="item.deliveryModes">
        <p>配送信息
            <attr-group
                v-on:changeDelivery="changeDelivery(item,$event)"
                v-on:closeModal="openAttrGroup(item)"
                v-model="item.deliveryModeType" 
                :is-open="item.isOpen"
                :attr-type="3" 
                :data="item"
                :is-required="false">
            </attr-group>
        </p>
      </div>
      <div class="sel-item" v-if="item.deliveryModes && !packageId">
        <p>配送费<span class="price">&yen;{{item.freight.toFixed(2)}}</span></p>
      </div>
      <div class="sel-item">
        <p class="remark">备注：<input type="text" v-model="item.remark" placeholder="您对订单有特殊需求可在此备注" maxlength="50">
        </p>
      </div>          
		</section>	
<!-- 		<section class="coupons" @click="toSelectCoupon()" v-if="createOrder">
			优惠券/优惠码<span class="available">{{createOrder.couponCount}}张可用</span>
      <span class="fr">
  			<span class="price">
          - &yen;{{createOrder.baseMoney.couponMoney.toFixed(2)}}
        </span>
        <i class="iconfont icon-more"></i>
      </span>
		</section> -->
		<section class="price-count" v-if="ownCreateOrder.baseMoney && !packageId">
			<p><label for="">商品金额</label><span class="price">&yen;{{ownCreateOrder.baseMoney.originMoney.toFixed(2)}}</span></p>
			<!-- <p><label for="">活动立减</label><span class="price">&yen;{{createOrder.baseMoney.reduceMoney.toFixed(2)}}</span></p> -->
			<p><label for="">优惠券</label><span class="price">&yen;{{createOrder.baseMoney.couponMoney.toFixed(2)}}</span></p>
			<p><label for="">配送费</label><span class="price">&yen;{{ownCreateOrder.baseMoney.freight.toFixed(2)}}</span></p>
		</section>
		<div class="fixed-area">
      <span v-if="!packageId">{{ownCreateOrder.payAndServiceRelation?'服务完成后应付':'应付'}}：<span class="price" v-if="ownCreateOrder.baseMoney">&yen;{{ownCreateOrder.baseMoney.subTotalMoney.toFixed(2)}}</span></span>
			
			<button :class="{'disabled':!canSubmit || !address || !address.phone}" @click="submitOrder()">{{packageId?'立即预约':ownCreateOrder.payAndServiceRelation?'先服务后付费':'提交订单'}}</button>
		</div>
<!--     <mt-popup
      class="delivery-modal"
      v-model="item.deliveryModeType"
      :modal="true"
      :closeOnClickModal="true"
      position="right"
    >
      
      <button @click="comfirm(1)">确定</button>
    </mt-popup> -->
	</div>
</template>
<script>
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';
import {mapActions,mapGetters} from 'vuex'
import attrGroup from '../../../components/attrGroup/attrGroup';
import selTime from '../../../components/selTime/selTime';
export default{
  name:'submitOrder',
	data(){
		return {
        selTimeModal:false,
        showServiceTime:false,
        attr:[false,false,false],
        attrs:{},
        canSubmit:true,
        packageId:this.$route.query.packageId,
        phone:utils.getCookie('phone'),
        userId:utils.getCookie('userId'),        
        serviceRegion:'',
        storeIds:'',
        orderInfo:[],
        addressId:this.$route.query.addressId,
        address:null,
        deliveryModal:false,
        ownCreateOrder:{}
		}
	},
	props:[],
	components:{
     attrGroup,
     selTime
	},
  watch:{
    ownCreateOrder:{
      handler:function(newV,oldV){
            if(!newV){
              return;
            }
            utils.console("ownCreateOrder changed",newV)
            this.canSubmit=this.testAttr(newV) && this.testTime(newV);
      },
      deep:true
    }    
  },
  computed:{
   ...mapGetters({
        "createOrder": 'createOrder',
        "selServiceRegion":"selServiceRegion",
        "autoRegion":"autoRegion",
        "pos":'pos',
        "userAddressList":'userAddressList',
        "orderAddr":'orderAddr'
      })   
  },
	methods:{
    ...mapActions([
      'setCreateOrder',
      'setUserAddressList'
    ]),    
		goBack(){
       this.exitOrderSubmit();
			 utils.goBack(this);
		},
    toSelectCoupon(){
      if(!this.addressId || !this.address){
        this.$toast('请先选择服务地址');
        return;
      }
    //  if(this.createOrder.couponCount>0){
        this.$router.push({name:'selectCoupon'})
     // }else{
     //   this.$toast('无可用优惠券')
     // }
    },
    //打开选择服务时间的modal
    openSelTime(item){
      if(!this.addressId || !this.address){
        this.$toast('请先选择服务地址');
        return;
      }
      item.isOpenTime=!item.isOpenTime;
      var temp=utils.deepCopy(this.ownCreateOrder)
      this.$store.dispatch('setCreateOrder',temp)     
       // this.showServiceTime=!this.showServiceTime;
    },
    //返回时解锁库存
    exitOrderSubmit(){
      var u =service.common+'/app-background/order/exitOrderSubmit',
          data = {
             "userId" : this.userId,
             "processInstanceId" : this.ownCreateOrder.processInstanceId         
          }
      ajax.post(u,data).then(res=>{

      }).catch(err=>{

      })
    },
    testTime(info){
      var sinfo=info.storeOrders;
       for(var i = 0,len=sinfo.length;i<len;i++){
          if(sinfo[i].needServiceTime && !sinfo[i].deliveryTimeStart){
              return false;
          }
       }
       return true;
    },
    //检测属性小组是否都填了，属性小组组件会检测值的正确性，这里只需要检测是否填了
    testAttr(info){
      var sinfo=info.storeOrders;
       for(var i = 0,len=sinfo.length;i<len;i++){
          var orderItemList=sinfo[i].orderItemList;
          for(var j=0,cLen=orderItemList.length;j<len;j++){
            var goodAttrs=orderItemList[j].goodsAttributeList;
            if(goodAttrs){
              for(var k=0,kLen=goodAttrs.length;k<kLen;k++){
                if(goodAttrs[k].required && !goodAttrs[k].value){
                    return false;
                }
              }
            }
          }
       }
       return true;
    },
      //得到更改物流信息接口所需要的配送信息
      getDeliveryInfo(list){
          if(!list){
            return;
          }
          var arr=[];
          for(var i=0,len=list.length;i<len;i++){
             var obj={
                id:list[i].storeId,
                deliveryTimeStart:list[i].deliveryTimeStart,
                deliveryTimeEnd:list[i].deliveryTimeEnd,
                deliveryModeType:list[i].deliveryModeType
             }
             arr.push(obj)
          }
          return arr;
      }, 
      //更改地址后重新获取当前页面信息      
      changeDeliveryInfo(){
        var u = service.common+'/app-background/order/submit/changeDeliveryInfo',
        data = {
            processInstanceId:this.ownCreateOrder.processInstanceId,
            addressId:this.addressId,
            userId:this.userId,
            storeOrders:this.getDeliveryInfo(this.ownCreateOrder.storeOrders),
            isSupportedServiceTime:true
        };
        if(this.ownCreateOrder.coupon){
            data.baseCoupon={
              couponId:this.ownCreateOrder.coupon.id,
              couponCode:this.ownCreateOrder.coupon.couponCode
            };
        }        
        ajax.post(u,data).then(res=>{
             if(utils.getStatusCode(res.code)==200 && res.data){
                this.hanlderChangeData(res.data);

             }else{
               // this.$toast(res.message);
             }
        }).catch(err=>{
             utils.console(err)
             this.$toast('获取订单信息失败');
        })
      },
      //重新处理拿到的信息，由于变动的只是价格信息，单独更改，ownCreateOrder中有当前页面的服务信息等
      hanlderChangeData(data){
          if(!this.ownCreateOrder){
              this.ownCreateOrder={};
          }
          var info=data.storeOrders;
          this.ownCreateOrder.processInstanceId=data.processInstanceId;
          this.ownCreateOrder.baseMoney.originMoney=data.baseMoney.originMoney;
          this.ownCreateOrder.baseMoney.subTotalMoney=data.baseMoney.subTotalMoney;
          this.ownCreateOrder.baseMoney.reduceMoney=data.baseMoney.reduceMoney;
          this.ownCreateOrder.baseMoney.couponMoney=data.baseMoney.couponMoney;
          this.ownCreateOrder.baseMoney.freight=data.baseMoney.freight;
          for(var i=0,len=info.length;i<len;i++){
              this.ownCreateOrder.storeOrders[i].subTotalMoney=info[i].subTotalMoney;
              this.ownCreateOrder.storeOrders[i].freight=info[i].freight;
              for(var j=0,len=info[i].orderItemList.length;j<len;j++){
                  this.ownCreateOrder.storeOrders[i].orderItemList[j].price=info[i].orderItemList[j].price;
                  this.ownCreateOrder.storeOrders[i].orderItemList[j].id=info[i].orderItemList[j].id;
              }
          }
          utils.console("hanlder data:",this.ownCreateOrder)
      },
      //打开属性小组面板
      openAttrGroup(item){
            item.isOpen=!item.isOpen;
            utils.console("submit isOpen",item.isOpen)
           var temp=utils.deepCopy(this.ownCreateOrder)
           this.$store.dispatch('setCreateOrder',temp)
      },
      //改变店铺的配送信息      
      changeDelivery(item,callData){
          var changeFlag=false;
          if(item.deliveryModeType!=callData.deliveryModeType){
            item.deliveryModeType=callData.deliveryModeType;
            changeFlag=true;
          }
          if(item.deliveryName!=callData.deliveryName){
            item.deliveryName=callData.deliveryName;
            changeFlag=true;
          }
          if(item.deliveryTimeStart!=callData.deliveryTimeStart){
            item.deliveryTimeStart=callData.deliveryTimeStart;
            changeFlag=true;
          }
          if(item.deliveryTimeEnd!=callData.deliveryTimeEnd){
            item.deliveryTimeEnd=callData.deliveryTimeEnd;
            changeFlag=true;
          }
          utils.console('changeFlag',changeFlag)
          if(changeFlag){
            this.changeDeliveryInfo();
          }
          var temp=utils.deepCopy(this.ownCreateOrder)
          this.$store.dispatch('setCreateOrder',temp)
          this.openAttrGroup(item);

      },
      //得到地址列表
      getAddrList(){
        var u = service.common+'/app-background/serviceAddress/myServiceAddress',
          data = {
            phone:this.phone,
            storeIds:this.storeIds
          };
        ajax.post(u,data).then(res=>{
          if(utils.getStatusCode(res.code)==200 && res.data){
              this.$store.dispatch('setUserAddressList',res.data)
              this.address=this.getAddrItem(res.data,this.addressId);
          }
        })
      },      
      //得到当前订单页的地址
      getAddrItem(list,id){
         if(!list || list.length<=0){
          return null;
         }
         for(var i = 0,len=list.length;i<len;i++){
          if(list[i].id==id){
            return list[i]
          }
         }
         return null;
      },
    //提交时，只提交下列数据
    hanlderSubmitData(sinfo){
        var resArr=[];
        for(var i = 0,len=sinfo.length;i<len;i++){
            var info={
                  "id":sinfo[i].id,
                  "storeId":sinfo[i].storeId,
                  // "deliveryTimeStart":sinfo[i].deliveryTimeStart,  //格式：yyyy-MM-dd HH:mm
                  // "deliveryTimeEnd":sinfo[i].deliveryTimeEnd, //格式：yyyy-MM-dd HH:mm
                  "deliveryModeType":sinfo[i].deliveryModeType,
                  "remark":sinfo[i].remark,
                  "orderItemList":[]
            }
            info.deliveryTimeStart=sinfo[i].deliveryTimeStart;
            var orderItemList=sinfo[i].orderItemList;
            for(var j=0,cLen=orderItemList.length;j<len;j++){
                  var oneOrder={
                        "id":orderItemList[j].id,  //order item id
                        "itemId":orderItemList[j].itemId,  //商品id
                        "storeId":orderItemList[j].storeId,  //店铺id
                        "goodsAttributeList":[]                     
                  };
                  var goodAttrs=orderItemList[j].goodsAttributeList;
                  if(goodAttrs){                  
                    for(var k=0,kLen=goodAttrs.length;k<kLen;k++){
                        if(goodAttrs[k].attributeType==1){
                            for(var m=0,mlen=goodAttrs[k].selectableValues.length;m<mlen;m++){
                                if(goodAttrs[k].selectableValues[m].content==goodAttrs[k].value){
                                    goodAttrs[k].attributeValueId=goodAttrs[k].selectableValues[m].id
                                }
                            }
                        }
                        var oneAttr={
                              "attributeGroupId":goodAttrs[k].attributeGroupId,  //属性组
                              "attributeDefineName":goodAttrs[k].attributeDefineName,  //属性定义名称
                              "attributeDefineId":goodAttrs[k].attributeDefineId,  //属性定义id
                              "value":goodAttrs[k].value //选择的值, 若是时间值，则格式为： 时：MM-dd HH:mm; 天：MM-dd;                             
                        };                        
                        if(goodAttrs[k].attributeType!=2){
                            oneAttr.attributeValueId=goodAttrs[k].attributeValueId
                        }
                        oneOrder.goodsAttributeList.push(oneAttr);
                    }
                  }
                  info.orderItemList.push(oneOrder);
            }
            resArr.push(info);
        }
        return resArr;
        },      
      submitOrder(){
          utils.sendMta('submitorder')
          this.canSubmit=false; 
          this.$indicator.open({
            spinnerType: 'triple-bounce'
          });
              
          var u=service.common+"/app-background/order/submit/confirm",
              data={
                userId:this.userId,
                processInstanceId:this.ownCreateOrder.processInstanceId,
                addressId:this.addressId,
                appId:utils.getCookie('we_appId'),
                storeOrders:this.hanlderSubmitData(this.ownCreateOrder.storeOrders),
                sourceType:4
              };
          if(utils.getSessionStorage('broker')){
            data.broker = String(utils.getSessionStorage('broker'))  // 经纪人串(id)
          }
          var travelBrokerId = utils.getCookie('travel-brokerId');
          if (travelBrokerId) {
            data.broker = travelBrokerId;
          }
          if(this.ownCreateOrder.coupon){
              data.baseCoupon={
                couponId:this.ownCreateOrder.coupon.id,
                couponCode:this.ownCreateOrder.coupon.couponCode
              };
          }
          ajax.post(u,data).then(res=>{
              this.$indicator.close();
              this.canSubmit=true;   
              if(utils.getStatusCode(res.code)==200 && res.data){

                  var env=utils.getEnv();
                  //发送统计数据
                  utils.sendMta('submitordersuccess')
                  utils.sendMta('tijiaodingdanch',{'submitsuccess':'true'})

                  //套餐预约流程
                  if(this.packageId){
                      this.$toast('预约成功');
                      this.$router.push({name:'orderList'});
                      return;
                  }

                  this.$toast('提交成功');
                  //orderPayType（订单支付类型。  取值：1-零元订单；2-先全额支付后服务的订单；3-先预约后全额支付的订单）
                  
                  //0元订单流程
                  if(res.data.orderPayType==1){
                      this.$store.dispatch('setCreateOrder',null);
                      this.ownCreateOrder=null;
                      this.$router.push({name:'payCallback',query:{type:3}})
                      return;
                  }
                  //先服务后付款流程
                  if(res.data.orderPayType==3){
                      this.$store.dispatch('setCreateOrder',null);
                      this.ownCreateOrder=null;
                      this.$router.push({name:'payCallback',query:{type:2}})
                      return;
                  }
                  
                  //京东支付
                  if(env == 'jd'){
                      var callBackUrl=service.common+'/mall/paySuccess-7';
                      this.$router.push({name:'payList',query:{processInstanceId:this.ownCreateOrder.processInstanceId,callBackUrl:callBackUrl,phone:this.phone}})
                      this.$store.dispatch('setCreateOrder',null); 
						          this.ownCreateOrder=null;
                  }else{
                    // var url=res.data.url,
                    //     ma=/url=(https.*)$/,
                    //     result=ma.exec(url);                   
                    // if(result && result[1]){
                    //     this.$store.dispatch('setCreateOrder',null);              
                    //     if(utils.isTestEnv() || utils.isWeixin()){
                    //       var callBackUrl=service.common+'/mall/paySuccess-7';
                    //       var jumpUrl=result[1]+'&phone='+this.phone+'&callBackUrl='+callBackUrl+'&platform=6&openId='+utils.getCookie('openId');
                    //     }else{
                    //       var callBackUrl=service.www+'/mall/paySuccess-7';
                    //       var wwwPay=result[1].replace(config.mode,"www.wang-guanjia.com");
                    //       var jumpUrl=wwwPay+'&phone='+this.phone+'&callBackUrl='+callBackUrl+'&platform=6&openId='+utils.getCookie('openId');
                    //     }
                    //     window.location.href=decodeURIComponent(jumpUrl);
                    // }
                    var url=decodeURIComponent(res.data.url),
                        ma=/processInstanceId=(\d*)$/,
                        result=ma.exec(url);
                    if(result && result[1]){
                      this.$store.dispatch('setCreateOrder',null);
					            this.ownCreateOrder=null;
                      if(utils.isTestEnv() || env=='weixin' || env=='jd' || env=='dingding'){
                        var callBackUrl=service.self+'/pay/callback';
                        // this.$router.push({name:'payList',query:{processInstanceId:result[1],callBackUrl:callBackUrl}})
                        window.location.href=service.self+'/pay/list?processInstanceId='+result[1]+'&callBackUrl='+callBackUrl;
                      }else{
                        var callBackUrl=service.www+'/wemall/pay/callback';
                        var jumpUrl=service.www + '/wemall/pay/list?processInstanceId='+result[1]+'&callBackUrl='+callBackUrl;
                        window.location.href=jumpUrl;
                      }
                    }    
                  }             
              }else{
                  this.canSubmit=true;
                  this.$indicator.close();
                  this.$toast(res.message);
              }
          }).catch(err=>{
               this.canSubmit=true;
               this.$indicator.close();
               this.$toast('网络繁忙，请稍后再试');
          })    
      },
      changeCoupon(){
        var u = service.common+'/app-background/order/submit/changeCoupon',
            data = {
              userId:utils.getCookie('userId'),
              processInstanceId:this.ownCreateOrder.processInstanceId,
              baseCoupon:{
                couponId:this.ownCreateOrder.coupon.id,
                couponCode:this.ownCreateOrder.coupon.couponCode
              }
            };
        ajax.post(u,data).then(res=>{
          if(utils.getStatusCode(res.code)==200){
            this.ownCreateOrder.baseMoney=res.data;
            var temp=utils.deepCopy(this.ownCreateOrder);
            this.$store.dispatch('setCreateOrder',temp);
          }else{
            this.$toast(res.message);
          }
        }).catch(err=>{
          this.$toast('网络繁忙，请稍后再试')
        })
      }       
	},
  destroyed(){
        utils.console('destoryed',this.ownCreateOrder)
        if(this.ownCreateOrder && this.ownCreateOrder.storeOrders){      
          var temp=utils.deepCopy(this.ownCreateOrder)
          this.$store.dispatch('setCreateOrder',temp)    
        }
  },
	mounted(){
        utils.console('mounted',this.createOrder)
        if(!this.createOrder || !this.createOrder.storeOrders){
            return;
        }
        var self=this;
        var ids=[];
        this.ownCreateOrder=utils.deepCopy(this.createOrder);
        this.canSubmit=this.testAttr(this.ownCreateOrder);
        if(this.ownCreateOrder.coupon){
          this.changeCoupon();
        }
        if(this.orderAddr && this.orderAddr.id){
            this.addressId=this.orderAddr.id;
            this.changeDeliveryInfo();
        }
        for(var i = 0 ;i<this.ownCreateOrder.storeOrders.length;i++){
              ids.push(this.ownCreateOrder.storeOrders[i].storeId)
        }
        this.storeIds=ids.join(',');
        if(this.addressId){
            if(this.userAddressList && this.userAddressList.length>0){
                this.address=this.getAddrItem(this.userAddressList,this.addressId);
            }else{
                this.getAddrList();
            }
        }
        utils.sendMta('tijiaodingdanch',{'submit':'true'})
	}
}	
</script>
<style lang="scss" scoped>
@import '../../../assets/styles/common.scss';
@import './submit'
</style>