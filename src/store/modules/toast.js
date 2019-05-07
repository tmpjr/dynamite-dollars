export const toast = {
  namespaced: true,
  state: {
    toast: "",
    color: "success"
  },
  mutations: {
    setToast(state, toast) {
      state.toast = toast;
    },
    setColor(state, color) {
      state.color = color;
    },
    alert(state, toast) {
      state.color = "error";
      state.toast = toast; 
    },
    success(state, toast) {
      state.color = "success";
      state.toast = toast; 
    }
  },
  getters: {
    color: state => {
      return state.color;
    },
    toast: state => {
      return state.toast;
    },
    visible: state => {
      return state.toast != ""; 
    }
  }
};