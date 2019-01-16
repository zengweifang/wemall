import {utils} from '../common/utils'
//POSITION
export const userAddressList = state => state.position.userAddressList;
export const nearPlaces = state => state.position.nearPlaces;
export const selAddrItem = state => state.position.selAddrItem;
export const orderAddr = state => state.position.orderAddr;
export const selServiceRegion = state => {
	if(state.position.selServiceRegion && state.position.selServiceRegion.id){
		return state.position.selServiceRegion;
	}
	return utils.getLocalStorage('we_selRegion');
}
export const autoRegion = state => {
	if(state.position.autoRegion && state.position.autoRegion.id){
		return state.position.autoRegion;
	}
	return utils.getLocalStorage('we_autoRegion');
}
export const positionStatus = state => state.position.status;
export const historyList = state => state.position.historyList;
export const showMoreAddr = state => state.position.showMoreAddr;
export const pos = state => {
	if(state.position.pos){
		return state.position.pos
	}
		return utils.getLocalStorage('we_pos')	
}
export const useRegion = state =>{
	if(!state.position.useRegion || !state.position.useRegion.townCode){
		var autoRegion=utils.getLocalStorage('we_autoRegion'),
			selRegion=utils.getLocalStorage('we_selRegion');
			if(selRegion){
				return selRegion;
			}
			return autoRegion;
	}
	return state.position.useRegion;
}

//PRODUCTION
export const createOrder = state => {
	if(state.product.createOrder && state.product.createOrder.storeOrders){
		return state.product.createOrder
	}
	return utils.getSessionStorage('we_createOrder')
}

//COMMON
export const showTab = state => {
	return state.common.showTab
}