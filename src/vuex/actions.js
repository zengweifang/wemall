import * as types from './mutation-types'
export const setUserAddressList = ({ commit }, list) => {
    commit(types.SET_USER_ADDRESS_LIST, {list})
}
export const setNearPlaces = ({ commit }, list) => {
    commit(types.SET_NEAR_PLACES, {list})
}
export const setPos = ({ commit }, pos) => {
    commit(types.SET_POS, {pos})
}
export const setSelAddrItem = ({ commit }, item) => {
    commit(types.SET_SELECT_ADDR_ITEM, {item})
}
export const setOrderAddr = ({ commit }, item) => {
    commit(types.SET_ORDER_ADDR, {item})
}
export const setSelServiceRegion = ({ commit }, item) => {
    commit(types.SET_SERVICE_REGION, {item})
}
export const setAutoRegion = ({ commit }, region) => {
    commit(types.SET_AUTO_REGION, {region})
}
export const pushHistory = ({ commit }, route) => {
    commit(types.PUSH_HISTORY, {route})
}
export const removeHistory = ({ commit }) => {
    commit(types.REMOVE_HISTORY)
}
export const clearHistory = ({ commit }) => {
    commit(types.CLEAR_HISTORY)
}
export const openMorePop = ({ commit },status) => {
    commit(types.OPEN_MORE_ADDR_POP,{status})
}
export const closeMorePop = ({ commit },status) => {
    commit(types.CLOSE_MORE_ADDR_POP,{status})
}
export const setPositionStatus=({ commit },status) => {
    commit(types.SET_POSITION_STATUS,{status})
}
//production
export const setCreateOrder = ({ commit },obj) => {
    commit(types.SET_CREATE_ORDER,{obj})
}
//common
export const setTab = ({ commit },status) => {
    commit(types.SET_TAB,{status})
}