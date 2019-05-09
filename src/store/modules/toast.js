export const toast = {
  namespaced: true,
  state: {
    status: {
      color: "info",
      message: ""
    }
  },
  actions: {
    setCurrentStatus({commit}, currentStatus) {
      commit("setStatus", { status: currentStatus});
    },
    success({commit}, msg) {
      commit("setStatus", {status: { 
        color: "success",
        message: msg 
      }});
    },
    error({commit}, msg) {
      commit("setStatus",{status: { 
        color: "error",
        message: msg 
      }});
    }
  },
  mutations: {
    setStatus(state, { status }) {
      state.status = status;
    }
  },
  getters: {
    color: state => {
      return state.status.color;
    },
    message: state => {
      return state.status.message;
    }
  }
};