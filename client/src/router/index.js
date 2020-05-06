import Vue from 'vue';
import VueRouter from 'vue-router';
import authGuard from './auth-guard';
import Signin from '@/views/Signin.vue';
import Signup from '@/views/Signup.vue';
import User from '@/views/User.vue'

// guarded views

import Dashboard from '@/views/Dashboard';
import Today from '@/views/Today';
import AddProject from '@/views/AddProject';
import Project from '@/views/Project'

Vue.use(VueRouter);

const routes = [
  {
    path: '/signin',
    name: 'Signin',
    component: Signin
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: authGuard,
    children: [
      {
        path: '/today',
        name: 'Today',
        component: Today,
        beforeEnter: authGuard,
      },
      {
        path: '/user',
        name: User,
        component: User,
        beforeEnter: authGuard
      },
      {
        path: '/add-project',
        name: 'Add-project',
        component: AddProject,
        beforeEnter: authGuard
      },
      {
        path: '/project/:id',
        name: 'Project',
        props: true,
        component: Project,
        beforeEnter: authGuard
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
