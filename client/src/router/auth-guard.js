import store from '../store/index';

export default (to, from, next) => {
  if (store.getters.token !== null && store.getters.token !== undefined) {
    next();
  } else {
    next('/signin');
  }
};
