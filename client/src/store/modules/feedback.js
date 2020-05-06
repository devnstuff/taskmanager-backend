import { v4 as uuidv4 } from 'uuid';

const state = {
  feedback: []
};

const getters = {
  feedback(state) {
    return state.feedback;
  }
};

const actions = {
  async setFeedback({ commit }, payload) {
    const id = uuidv4();
    const feedback = {
      msg: payload.msg,
      type: payload.type,
      id
    };
    commit('feedback', feedback);

    setTimeout(() => commit('clearFeedback', feedback.id), 4000);
  }
};

const mutations = {
  feedback(state, payload) {
    state.feedback.push(payload);
  },
  clearFeedback(state, payload) {
    state.feedback = state.feedback.filter(i => i.id !== payload);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
