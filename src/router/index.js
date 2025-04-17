import { createRouter, createWebHistory } from 'vue-router';
import { parseJwt } from '../utils/jwt';

import UnderConstructionView from '../views/user/UnderConstructionView.vue';
import HomeView from '../views/user/HomeView.vue';
import AdminLoginView from '../views/admin/AdminLoginView.vue';
import UserRequestView from '../views/user/UserRequestView.vue';
import AdminDashboardView from "../views/admin/AdminDashboardView.vue";
import AdminUserRequestView from "../views/admin/AdminUserRequestView.vue";
import AppAdminLayout from "../layouts/AppAdminLayout.vue";
import RequestsList from "../components/RequestsList.vue";
import AppUserLayout from "../layouts/AppUserLayout.vue";
import NewRequestView from "../views/user/NewRequestView.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import StatisticsView from "@/views/admin/StatisticsView.vue";
import SupportView from '../views/user/SupportView.vue';

const routes = [
  { 
    path: '/', 
    name: 'Construction', 
    component: UnderConstructionView,
    redirect: '/user/home'
  },
  {
    path: '/user',
    name: 'user',
    component: AppUserLayout,
    children: [
      {
        path: "",
        name: "home",
        component: HomeView,
      },
      {
        path: 'new',
        name: 'new-request',
        component:NewRequestView,
      },
      {
        path: 'request/:userRequestId',
        name: 'user-request',
        component: UserRequestView,
        meta: { requiresUser: true }
      },
      {
        path: 'become-member',
        name: 'become-member',
        component:NewRequestView,
      },
      {
        path: 'support',
        name: 'support',
        component:SupportView,
      },
      {
        path: 'login',
        name: 'user-login',
        component: UserLoginView
      }
    ]
  },
  {
    path: '/admin',
    component: AppAdminLayout,
    meta: { requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: AdminDashboardView
      },
      {
        path: 'requests/:userRequestId',
        name: 'admin-request',
        component: AdminUserRequestView
      },
      {
        path: 'requests',
        name: 'admin-all-requests',
        component: RequestsList
      },
      {
        path: 'statistics',
        name: 'admin-statistics',
        component: StatisticsView
      }
    ]
  },
  {
    path: '/admin/login', 
    name: 'admin-login',
    component: AdminLoginView
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

/**
 * Route protection middleware to check if the user is authenticated.
 * Redirect users to the home page if they are not authenticated.
 * Redirect admins to the admin login page if they are not authenticated.
 */
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('jwt');
  const decoded = token ? parseJwt(token) : null;
  const role = decoded?.role;
  const username = decoded?.sub;

  // Admin route protection
  if (to.meta.requiresAdmin) {
    if (!token || (role !== 'SUPERUSER' && role !== 'MODERATOR')) {
      return next({ name: 'admin-login' });
    }
  }

  // User request protection
  if (to.meta.requiresUser) {
    const userRequestId = to.params.userRequestId;
    if (!token || role !== 'USER' || username !== userRequestId) {
      return next({ name: 'home' });
    }
  }


  next();
});

export default router; 