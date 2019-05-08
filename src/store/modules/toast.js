export const toast = {
  namespaced: true,
  state: {
    message: "",
    color: "info",
    active: false
  },
  mutations: {
    setMessage(state, message) {
      state.message = message;
    },
    setColor(state, color) {
      state.color = color;
    },
    error(state, message) {
      state.color = "error";
      state.message = message; 
      state.active = true;
    },
    success(state, message) {
      state.color = "success";
      state.message = message; 
      state.active = true;
    },
    setActive(state, active) {
      state.active = active;
    }
  },
  getters: {
    active: state => {
      return state.active;
    },
    color: state => {
      return state.color;
    },
    message: state => {
      return state.message;
    }
  }
};