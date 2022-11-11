const state = {
  warehouseList: []
}
const mutations = {
  SET_WAREHOUSE(state, warehouseList) {
    MyLStorage.set('warehouseList', warehouseList)
    state.warehouseList = warehouseList
  }
}
const actions = {
  setWarehouse({ commit }, arg) {
    commit('SET_WAREHOUSE', arg)
  }
}
export default {
  state,
  mutations,
  actions
}
