import * as types from '../mutation-types'
import {utils}  from '../../common/utils'
const state={
	showTab:true
}
const mutations = {
	[types.SET_TAB] (state, { status }) {
		state.showTab=status
	}	
}
export default {
	state,
	mutations
}