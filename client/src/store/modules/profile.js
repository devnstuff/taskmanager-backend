import axios from 'axios';
import moment from "moment";

const state = {
  profile: {},
  projects: [],
  archivedProjects: [],
  project: {},
  tasks: [],
  activeTasks: [],
  inactiveTasks: [],
  todayTasks: [],
  comments: [],
  completedTasks: []
};

const getters = {

  profile: state => state.profile,
  projects: state => state.projects,
  archivedProjects: state => state.archivedProjects,
  project: state => state.project,
  tasks: state => state.tasks,
  activeTasks: state => state.activeTasks,
  completedTasks: state => state.completedTasks,
  inactiveTasks: state => state.inactiveTasks,
  todayTasks: state => state.todayTasks,
  comments: state => state.comments
};

const actions = {
  async createProfile({ commit, dispatch }) {
    try {
      let res = await axios.post('profile');

      commit('setProfile', res.data);
    } catch (err) {

      let error = {
        msg: err.response.data.msg,
        type: 'fail'
      };
      dispatch('feedback/setFeedback', error, { root: true });
    }
  },
  async getProfile({ commit, dispatch }) {
    try {
      let res = await axios.get('profile');

      // commit('setProfile', res.data.data);
      dispatch('profile/getProjects', null, { root: true })

    } catch (err) {
      let error = {
        msg: err.response.data.msg,
        type: 'fail'
      };
      dispatch('feedback/setFeedback', error, { root: true });
    }
  },
  async createProject({ dispatch }, payload) {
    let config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let body = JSON.stringify(payload);

    try {
      await axios.put('projects', body, config);

      dispatch('profile/getProfile', null, { root: true });

    } catch (err) {
      let error = {
        msg: err.response.data.msg,
        type: 'fail'
      };
      dispatch('feedback/setFeedback', error, { root: true });
    }
  },
  async getProjects({ dispatch, commit }) {
    try {
      let res = await axios.get('projects')
      let active = res.data.data.filter(a => !a.archived)
      let inactive = res.data.data.filter(b => b.archived)

      commit('setProjects', active)
      commit('setArchivedProjects', inactive)
      dispatch('profile/getAllTasks', null, { root: true });

    } catch (err) {
      if (err) console.log(err.message)
      // let error = {
      //   msg: err.response.data.msg,
      //   type: 'fail'
      // };
      // dispatch('feedback/setFeedback', error, { root: true });
    }
  },
  async getProjectById({ dispatch, commit }, payload) {
    try {
      let res = await axios.get(`projects/${payload}`);
      console.log(res)

      commit('filterProject', res.data.data);
      dispatch('profile/getTasks', payload, { root: true });
      dispatch('profile/getComments', payload, { root: true })

    } catch (err) {
      // dispatch('feedback/setFeedback', err.message, { root: true });
      console.log('')
    }
  },
  async erchiveProject({ dispatch }, payload) {
    let config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    let body = JSON.stringify({ archived: true })
    try {
      await axios.put(`projects/${payload}`, body, config)

      dispatch('profile/getProfile', null, { root: true })

    } catch (err) {
      let error = {
        msg: err.response.data.msg,
        type: 'fail'
      };
      dispatch('feedback/setFeedback', error, { root: true });
    }
  },
  async restoreProject({ dispatch, commit }, payload) {
    let config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    let body = JSON.stringify({ archived: false })
    try {
      await axios.put(`projects/${payload}`, body, config)

      dispatch('profile/getProfile', null, { root: true })

    } catch (err) {
      let error = {
        msg: err.response.data.msg,
        type: 'fail'
      };
      dispatch('feedback/setFeedback', error, { root: true });
    }
  },
  async deleteProject({ dispatch }, payload) {
    try {
      await axios.delete(`projects/${payload}`);

      dispatch('profile/getProfile', null, { root: true })
    } catch (err) {
      let error = {
        msg: err.response.data.msg,
        type: 'fail'
      };
      dispatch('feedback/setFeedback', error, { root: true });
    }
  },
  async getTasks({ dispatch, commit }, payload) {
    try {
      let res = await axios.get(`projects/${payload}/tasks/`)
      let active = res.data.data.filter(a => a.isActive)
      let inactive = res.data.data.filter(b => !b.isActive)

      commit('setTasks', active)
      commit('setInactiveTasks', inactive)

    } catch (err) {
      let error = {
        msg: err.response.data.msg,
        type: 'fail'
      };
      dispatch('feedback/setFeedback', error, { root: true });
    }
  },
  async getAllTasks({ commit }) {
    try {
      let res = await axios.get('projects');
      let tasks = [];
      let activeProjects = res.data.data.filter(s => s.archived === false);
      activeProjects.map(i => i.tasks.map(a => tasks.push(a)));

      let today = moment().format('ll')
      let todayTasks = tasks.filter(c => moment(c.due).format('ll') === today && c.isActive !== false)
      let activeTasks = tasks.filter(x => x.isActive === true);
      let completedTasks = tasks.filter(x => x.isActive === false);

      commit('setAllTasks', activeTasks);
      commit('setTodayTasks', todayTasks)
      commit('setCompletedTasks', completedTasks)

    } catch (err) {

      if (err) console.log(err.message)

      // dispatch('feedback/setFeedback', error, { root: true });
    }
  },
  async createTask({ dispatch, commit }, payload) {
    let config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let newTask = {
      project_id: payload.id,
      project_name: payload.project_name,
      project_color: payload.project_color,
      body: payload.body,
      due: payload.due,
      priority: payload.priority,
      priority_color: payload.priority_color
    }
    let body = JSON.stringify(newTask);

    try {
      await axios.post(`projects/${payload.id}/task`, body, config);

      dispatch('profile/getTasks', payload.id, { root: true })
      dispatch('profile/getAllTasks', null, { root: true })

    } catch (err) {
      let error = {
        msg: err.response.data.msg,
        type: 'fail'
      };
      dispatch('feedback/setFeedback', error, { root: true });
    }
  },
  async completeTask({ dispatch }, payload) {
    let config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    let body = JSON.stringify({ isActive: payload.status })

    try {
      await axios.put(`projects/${payload.id}/tasks/${payload.task}`,
        body, config);

      dispatch('profile/getTasks', payload.id, { root: true })
      dispatch('profile/getAllTasks', null, { root: true })

    } catch (err) {
      let error = {
        msg: err.response.data.msg,
        type: 'fail'
      };
      dispatch('feedback/setFeedback', error, { root: true });
    }
  },
  async getComments({ dispatch, commit }, payload) {
    try {
      let res = await axios.get(`projects/${payload}/comments/`)

      commit('setComments', res.data.data)

    } catch (err) {
      let error = {
        msg: err.response.data.msg,
        type: 'fail'
      };
      dispatch('feedback/setFeedback', error, { root: true });
    }
  },
  async createComment({ dispatch }, payload) {
    let config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let body = JSON.stringify({ body: payload.body })

    try {
      await axios.post(`projects/${payload.id}/comment`, body, config)

      dispatch('profile/getComments', payload.id, { root: true })


    } catch (err) {
      let error = {
        msg: err.response.data.msg,
        type: 'fail'
      };
      dispatch('feedback/setFeedback', error, { root: true });
    }
  },
  async deleteComment({ dispatch }, payload) {
    try {
      await axios.delete(`projects/${payload.id}/comments/${payload.comment}`)

      dispatch('profile/getComments', payload.id, { root: true })

    } catch (err) {
      let error = {
        msg: err.response.data.msg,
        type: 'fail'
      };
      dispatch('feedback/setFeedback', error, { root: true });
    }
  }
};

const mutations = {
  setProfile: (state, payload) => (state.profile = payload),
  setProjects: (state, payload) => (state.projects = payload),
  setArchivedProjects: (state, payload) => (state.archivedProjects = payload),
  filterProject: (state, payload) => (state.project = payload),
  deleteProject: (state, payload) => (state.profile.projects.filter(i => i._id !== payload)),
  setTasks: (state, payload) => (state.tasks = payload),
  setAllTasks: (state, payload) => (state.activeTasks = payload),
  setCompletedTasks: (state, payload) => (state.completedTasks = payload),
  setInactiveTasks: (state, payload) => (state.inactiveTasks = payload),
  setTodayTasks: (state, payload) => (state.todayTasks = payload),
  setComments: (state, payload) => (state.comments = payload)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
