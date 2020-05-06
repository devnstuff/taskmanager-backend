import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';

const state = {
  token: localStorage.getItem('token'),
  user: null,
  isLoading: false
};

const getters = {
  token(state) {
    return state.token;
  },
  user(state) {
    return state.user;
  },
  userLoading(state) {
    return state.isLoading;
  }
};

const actions = {
  // singup a user

  async signup({ commit, dispatch }, payload) {
    commit('setUserLoading', true);

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const body = JSON.stringify(payload);

    try {
      const res = await axios.post(
        'api/user',
        body,
        config
      );

      commit('setToken', res.data.access_token);
      commit('setUserLoading', false);
      setTimeout(() => dispatch('profile/createProfile', null, { root: true }), 2000)
    } catch (err) {
      const error = {
        msg: err.response.data.msg,
        type: 'fail'
      };
      dispatch('feedback/setFeedback', error, { root: true });
    }
  },

  // singin a user

  async signin({ commit, dispatch }, payload) {
    commit('setUserLoading', true);

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const body = JSON.stringify(payload);

    try {
      const res = await axios.post(
        'api/auth',
        body,
        config
      );

      commit('setToken', res.data.access_token);
      commit('setUserLoading', false);
    } catch (err) {
      dispatch('feedback/setFeedback', err.message, { root: true });
    }
  },

  // load a user

  async loadUser({ commit, dispatch }) {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('api/auth');

      commit('setUser', res.data.data);
      dispatch('profile/getProfile', null, { root: true })

    } catch (error) {
      console.log(error.response.data.msg);
    }
  },

  // signout a user

  async signout({ commit }) {
    localStorage.removeItem('token');
    commit('setSignout', null);
  }
};

const mutations = {
  setToken(state, payload) {
    localStorage.setItem('token', payload);
    state.token = payload;
  },
  setUser(state, payload) {
    state.user = payload;
  },
  setUserLoading(state, payload) {
    state.isLoading = payload;
  },
  setSignout(state, payload) {
    state.token = payload;
    state.user = payload;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
