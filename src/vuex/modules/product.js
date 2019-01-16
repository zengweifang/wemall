import * as types from '../mutation-types'
import {utils}  from '../../common/utils'
const state={
	createOrder:null
}
const mutations = {
	[types.SET_CREATE_ORDER] (state, { obj }) {
    	state.createOrder = obj
    	if(!obj){
    		utils.removceSessionStorage('we_createOrder');
    		return;
    	}
    	utils.setSessionStorage('we_createOrder',obj)
	}	
}
export default {
	state,
	mutations
}