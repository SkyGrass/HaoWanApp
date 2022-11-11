const state = {
  showRedBlue: false,
  targetUrl: '',
  defWhCode: ''
}
const mutations = {
  SET_SHOW_RED_BLUE(state, showRedBlue) {
    state.showRedBlue = showRedBlue
  },
  SET_TARGET_URL(state, path) {
    state.targetUrl = path
  },
  SET_DEF_WHCODE(state, whCode) {
    state.defWhCode = whCode
  }
}
const actions = {
  setShowRedBlue({ commit }, arg) {
    commit('SET_SHOW_RED_BLUE', arg)
  },
  setTargetUrl({ commit }, arg) {
    commit('SET_TARGET_URL', arg)
  },
  setDefWhCode({ commit }, arg) {
    commit('SET_DEF_WHCODE', arg)
  }
}
export default {
  state,
  mutations,
  actions
}
