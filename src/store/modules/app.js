const state = {
  model: {
    accountId: '',
    accountName: '',
    accountDate: '',
    loginName: '',
    loginUserId: '',
    pwd: '',
    key: ''
  },
  menus: []
}
const mutations = {
  SET_MODEL(state, model) {
    MyLStorage.set('model', model)
    MyLStorage.set('token', model.key) 
    state.model.accountId = model.accountId
    state.model.accountName = model.accountName
    state.model.accountDate = model.accountDate
    state.model.loginName = model.loginName
    state.model.loginUserId = model.loginUserId
    state.model.pwd = model.pwd
    state.model.key = model.key
  },
  SET_MENUS(state, menus) {
    state.menus = menus
  }
}
const actions = {
  setModel({ commit }, arg) {
    commit('SET_MODEL', arg)
  },
  setMenus({ commit }, arg) {
    commit('SET_MENUS', arg)
  }
}
export default {
  state,
  mutations,
  actions
}
