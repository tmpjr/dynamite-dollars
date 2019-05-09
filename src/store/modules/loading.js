export const loading = {
  namespaced: true,
  state: {
    active: false,
    message: ""
  },
  mutations: {
    show(state, message) {
      state.active = true;
      state.message = message;
    },
    hide(state) {
      state.message = "";
      state.active = false;
    }
  },
  getters: {
    active: state => {
      return state.active;
    },
    message: state => {
      return state.message;
    }
  }
};