import * as types from '../mutation-types'
import {utils}  from '../../common/utils'
const state={
	userAddressList:null,
	pos:null,
	selAddrItem:null,
	selServiceRegion:null, //用户选择的行政区
	autoRegion:null,   //一进来自动拿的行政区
	useRegion:null,
	historyList:[],
	showMoreAddr:false,
	status:'定位中...',
	selDeliveryAddr:null,
	orderAddr:null,
	nearPlaces:null
}
const mutations = {
	[types.SET_USER_ADDRESS_LIST] (state, { list }) {
    	state.userAddressList = list
    	//utils.setLocalStorage('list',list)
	},
	[types.SET_NEAR_PLACES] (state, { list }) {
    	state.nearPlaces = list
    	//utils.setLocalStorage('list',list)
	},	
	[types.SET_POS] (state, { pos }) {
    	state.pos = pos
    	utils.setLocalStorage('we_pos',pos)
    	if(!pos && state.status=="定位中..."){
    		state.status='定位失败'
    	}
	},	
	[types.SET_SELECT_ADDR_ITEM] (state, { item }) {
    	state.selAddrItem = item

	},	
	[types.SET_ORDER_ADDR] (state, { item }) {
		
    	state.orderAddr = item

	},
	[types.SET_AUTO_REGION] (state, { region }) {
    	// if(region && !region.townCode){
    	// 	region.townCode=region.adcode;
    	// }		
    	state.autoRegion = region
    	utils.setLocalStorage('we_autoRegion',region);
    	utils.setLocalStorage('we_sel_time',new Date().getTime());
    	var selRegion=utils.getLocalStorage('we_selRegion');
		if(!selRegion){
	    	if(region.townCode){
	    		utils.setLocalStorage('we_townCode',region.townCode);
	    	}
	    	if(typeof region.location=='object'){
	    		utils.setLocalStorage('we_use_pos',region.location.lng+','+region.location.lat);
	    	}else{
	    		utils.setLocalStorage('we_use_pos',region.location);
	    	}
			state.useRegion=region;
			if(!region){
				state.status='定位失败'
			}else{
				state.status=region.name
			}
		}    	
	},		
	[types.SET_SERVICE_REGION] (state, { item }) {
    	if(item){
    		// if(!item.townCode){
    		// 	item.townCode=item.adcode;
    		// }
    		state.status=item.poiName?item.poiName:item.name
    		state.useRegion=item;
    	}
    	if(item.townCode){
    		utils.setLocalStorage('we_townCode',item.townCode);
    	}
    	if(typeof item.location=='object'){
    		utils.setLocalStorage('we_use_pos',item.location.lng+','+item.location.lat);
    	}else{
    		utils.setLocalStorage('we_use_pos',item.location);
    	}    	
    	state.selServiceRegion = item
    	utils.setLocalStorage('we_selRegion',item)
    	utils.setLocalStorage('we_sel_time',new Date().getTime());
    	
	},			
	[types.PUSH_HISTORY] (state) {
    	state.historyList.push(route)
	},
	[types.REMOVE_HISTORY] (state) {
    	state.historyList.pop()
	},
	[types.REMOVE_HISTORY] (state) {
    	state.historyList=[]
	},	
	[types.OPEN_MORE_ADDR_POP] (state) {
    	state.showMoreAddr=true
	},	
	[types.CLOSE_MORE_ADDR_POP] (state) {
    	state.showMoreAddr=false
	},
	[types.SET_POSITION_STATUS] (state,{status}) {
		var selRegion=utils.getLocalStorage('we_selRegion');
		if(selRegion){
			state.status=selRegion.poiName?selRegion.poiName:selRegion.name;
			return;
		}	
		state.status=status	
    	
	}	
}
export default {
	state,
	mutations
}