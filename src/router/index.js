import { createRouter, createWebHistory } from 'vue-router';
import { parseJwt } from '../utils/jwt';

import AppUserLayout from '../layouts/AppUserLayout.vue';
import AppAdminLayout from '../layouts/AppAdminLayout.vue';

import HomeView from '../views/user/HomeView.vue';
import NewRequestView from '../views/user/NewRequestView.vue';
import UserRequestView from '../views/user/UserRequestView.vue';
import BecomeMemberView from '../views/user/BecomeMemberView.vue';
import SupportView from '../views/user/SupportView.vue';
import UserLoginView from '../views/user/UserLoginView.vue';

import AdminLoginView from '../views/admin/AdminLoginView.vue';
import AdminDashboardView from '../views/admin/AdminDashboardView.vue';
import AdminUserRequestView from '../views/admin/AdminUserRequestView.vue';
import AllRequestsView from '../views/admin/AllRequestsView.vue';
import StatisticsView from '../views/admin/StatisticsView.vue';
import AllAdminsOverview from '../views/admin/AllAdminsOverview.vue';
import CreateNewAdminView from '../views/admin/CreateNewAdminView.vue';
import SettingsView from '../views/admin/SettingsView.vue';

const routes = [
  {
    path: '/',
    component: AppUserLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
      },
      {
        path: 'new',
        name: 'new-request',
        component: NewRequestView,
      },
      {
        path: 'request/:userRequestId',
        name: 'user-request',
        component: UserRequestView,
        meta: { requiresUser: true },
      },
      {
        path: 'become-member',
        name: 'become-member',
        component: BecomeMemberView,
      },
      {
        path: 'support',
        name: 'support',
        component: SupportView,
      },
      {
        path: 'login',
        name: 'user-login',
        component: UserLoginView,
      },
    ],
  },
  {
    path: '/admin',
    component: AppAdminLayout,
    meta: { requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: AdminDashboardView,
      },
      {
        path: 'requests/:userRequestId',
        name: 'admin-request',
        component: AdminUserRequestView,
      },
      {
        path: 'requests',
        name: 'admin-all-requests',
        component: AllRequestsView,
      },
      {
        path: 'statistics',
        name: 'admin-statistics',
        component: StatisticsView,
      },
      {
        path: 'management',
        name: 'admin-management',
        component: AllAdminsOverview,
      },
      {
        path: 'new',
        name: 'admin-new-administrator',
        component: CreateNewAdminView,
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: SettingsView,
      },
    ],
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: AdminLoginView,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guards
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

  // user request protection
  if (to.meta.requiresUser) {
    const userRequestId = to.params.userRequestId;
    if (!token || role !== 'USER' || username !== userRequestId) {
      return next({ name: 'home' });
    }
  }

  next();
});

export default router;
export { routes };