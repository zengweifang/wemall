<template>
	<div class="more-address">
		<div class="search">
			<div class="back-icon fl" v-show="!searchActive" @click="goBack()">
				<i style="font-size:20px;font-weight:600;" class="iconfont icon-back"></i>
			</div>
			<div class="bar fl" :class="{'active-search':searchActive}" @click="enterKey()">
	  			<search-bar placeholder="请输入地址" :show-cancel="searchActive" :cancel-action="closeKey" v-model="searchKey"></search-bar>
			</div>
		</div>
    <div class="result" :class="{'no-start':!searchStatus}" v-if="searchActive">
      <ul>
        <li @click="selectItem(item)" v-for="(item,index) in searchResult">
          <p>{{item.name}}</p>
          <p>{{item.address}}</p>
        </li>
      </ul>
      <div class="error" v-if="searchResult.length==0 && searchStatus">
        <img src="../../../assets/imgs/icon_helplessman_index.png" alt="">
        <p>没有搜索结果</p>
        <p>换个关键词试试</p>
      </div>
    </div>
    <div id="mapContainer" class="amap-container"></div>
    <div class="no-addr" v-if="!nearList || nearList.length==0"><p>当前无可选择的服务地址</p></div>
    <div class="list" v-show="!searchStatus && nearList && nearList.length>0">
    	<ul>
    		<li @click="selectItem(item)" v-for="(item,index) in nearList">
    			<p><span v-if="index==0"><i class="iconfont icon-iconfontlocation"></i>[当前地址]</span>{{item.name}}</p>
    			<p>{{item.address}}</p>
    		</li>     		       		      		      		   		      		
    	</ul>
    </div>
	</div>
</template>
<script>
import stRadio from '../../../components/radio/radio';
import searchBar from '../../../components/searchBar/searchBar';
import {config,service} from '../../../common/config';
import {ajax} from '../../../common/ajax';
import {utils} from '../../../common/utils';
// import { lazyAMapApiLoaderInstance } from 'vue-amap';
import {mapActions,mapGetters} from 'vuex'
export default{
  name:'moreAddr',
	data(){
    var self=this;
		return {
          address: '',
          lng: 0,
          lat: 0, 
          nearList:[],
          searchActive:false,
          canClick:true,
          searchKey:'',
          searchResult:[],
          searchStatus:false,
          toPage:this.$route.query.to            
		}
	},
	props:['pop'],
  components:{searchBar},
  watch:{
    searchKey:function(newv,oldv){
      if(newv!=""){
        this.searchAddr(newv)
      }
    }
  },
  computed:{
   ...mapGetters({
          "pos": 'pos',
          'nearPlaces':'nearPlaces'
      })   
  },  
	methods:{
      ...mapActions([
        'setSelAddrItem',
        'closeMorePop',
        'setSelServiceRegion'
      ]),    
  		goBack(to){
          if(this.pop){
            this.$store.dispatch('closeMorePop',false)
            return;
          }
          if(to){
            this.$router.push({name:to})
            return;
          }     
  			utils.goBack(this);
  		},
      searchAddr(keywords){
        var u = service.common+'/app-background/poi/searchPOIsByKeyword?keywords='+keywords;
        ajax.get(u).then(res=>{
          this.searchStatus=true
          utils.console(res)
          if(utils.getStatusCode(res.code)==200 && res.data.poi){
            this.searchResult=res.data.poi
          }
        }).catch(err=>{
          this.searchStatus=true
        })
      },
      getNearPlace(lng,lat){
        var u = service.common+'/app-background/poi/searchPOIsByLocation?location='+lng+','+lat;
        ajax.get(u).then(res=>{
          if(utils.getStatusCode(res.code)==200){
            this.nearList=res.data.poi;
            var doc=document,list=doc.querySelector('.more-address .list');
            if(list){
                try{
                  list.scrollTop=0;
                }catch(e){
                  utils.console(e)
                }
            }
          }
        })
      }, 

    enterKey(){
      if(this.canClick){
        this.searchActive=true
      }else{
        this.canClick=true;
      }
    },
    closeKey(){
      //utils.console(this.searchActive)
      this.searchActive=false;
      this.canClick=false;
      this.searchStatus=false;
      this.searchResult=[];
    },
    getTownCode(lng,lat){
      this.$indicator.open({
        spinnerType: 'triple-bounce'
      });       
      return new Promise((resolve,reject)=>{
        var u = service.common+'/app-background/administrativeRegion/infoAtLocation?location='+lng+','+lat;
        ajax.get(u)
        .then(res=>{
          this.$indicator.close(); 
          if(utils.getStatusCode(res.code)==200){
            resolve(res)
          }else{
            reject(null)
          }
        })
        .catch(err=>{
          this.$indicator.close(); 
          reject(null)
        })
      })
    },      
    selectItem(item){
        if(this.pop){
          this.$store.dispatch('setSelAddrItem',item);
          this.goBack(this.toPage);
        }else{
          this.$store.dispatch('setSelServiceRegion',item);
          if(!item.townCode || item.townCode==item.adcode){
            setTimeout(()=>{
              if(typeof item.location=='object'){
                var pos=[item.location.lng,item.location.lat];
              }else{
                var pos=item.location.split(',');
              }             
              this.getTownCode(pos[0],pos[1]).then(res=>{
                var n=utils.deepCopy(item);
                n.townCode=res.data.id;  
                this.$store.dispatch('setSelServiceRegion',n);     
                window.history.go(-2);
              }).catch(err=>{
              })
            },50)
          }          
        }      
    },
    getNearList(posResult,vueObj){
        vueObj.map.plugin('AMap.PlaceSearch',function(){
            var placeSearch=new AMap.PlaceSearch({
            pageSize: 20,
            city:posResult.addressComponent.adcode,
            citylimit:true,
            pageIndex: 1   
            });
            placeSearch.searchNearBy('',[posResult.position.lng,posResult.position.lat], 200, function(status, result) {
                if(status=='complete'){
                      vueObj.nearList=result.poiList.pois;
                      var doc=document,list=doc.querySelector('.more-address .list');
                      if(list){
                          try{
                            list.scrollTop=0;
                          }catch(e){
                            utils.console(e)
                          }
                      }            
                }
            }); 
        })
    },
    //高德地图组件
    aMap(){
        var self=this,lng=116.396749,lat=39.918055;
        if(self.pos && self.pos.lng && self.pos.lat){
            lng=self.pos.lng;
            lat=self.pos.lat;
        }
      utils.requireParam(window,'AMap.Map',function(){
        self.map = new AMap.Map('mapContainer',{
            center: new AMap.LngLat(lng,lat),
            zoom:15 
        })
        self.map.plugin('AMap.Geolocation', function () {
            self.geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true,        //显示定位按钮，默认：true
                buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy:true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                markerOptions:{
                    content:'<i class="iconfont icon-circle" style="background-color:#ff5858;color:#ff5858;border-radius:50%;"></i>'
                }
            })
            self.map.addControl(self.geolocation)
            //如果没有pos,则进行定位
            if(self.pos && self.pos.lng && self.pos.lat){
                lng=self.pos.lng;
                lat=self.pos.lat;
                self.getNearPlace(lng,lat)
            }else{
                self.geolocation.getCurrentPosition(function(status,result){
                    if(status=='complete'){
                        if(result.addressComponent && result.addressComponent.adcode){
                            self.getNearList(result,self)
                        }else{
                           self.getNearPlace(result.position.lng,result.position.lat)
                        }
                    }else{
                       self.getNearPlace(lng,lat);
                    }
                })
            }         
        });
         var centerMarker=new AMap.Marker({
              map: self.map,
              position: self.center,
              content:'<i class="iconfont icon-dingwei1" style="color:#ff5858;font-size:26px;"></i>'     
          });     
        AMap.event.addListener(self.map,'moveend',function(){
            let pos=self.map.getCenter();
            centerMarker.setPosition([pos.lng,pos.lat])
            self.getNearPlace(pos.lng,pos.lat)
        })    
      })      
    }
	},  
  mounted(){
    if(window.AMap){
      this.aMap()
    }else{
      utils.loadFile('https://webapi.amap.com/maps?v=1.4.4&key=f951d49b08bbd89685f7d6e5761d20f6');
      setTimeout(()=>{
        this.aMap();
      },1000);
    }
  }
}
</script>
<style lang="scss">
@import '../../../assets/styles/variables.scss';
@import './moreAddr';
</style>