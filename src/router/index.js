import { createRouter, createWebHistory } from '@ionic/vue-router';
import TabsPage from '../views/TabsPage.vue'
import MeMWelcomeStepper from "@/views/MeMWelcomeStepper";
import {getAuth} from "firebase/auth";
import GroupProfileInformation from "@/views/GroupProfileInformation";

const routes = [
  {
    path: '/',
    component: MeMWelcomeStepper,
  },
  {
    path: '/app/',
    component: TabsPage,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        redirect: '/app/discovery',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'discovery',
        component: () => import('@/views/DiscoveryPage.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'groups',
        component: () => import('@/views/GroupsPage.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'profile',
        component: () => import('@/views/ProfilePage.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'friends',
        component: () => import('@/views/FriendsView.vue'),
        name: 'FriendsPage',
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/group',
    component: GroupProfileInformation,
    name: 'GroupProfile',
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/camera',
    component:() => import('@/views/CameraPage.vue'),
    name: 'Camera',
    meta: {
      requiresAuth: true
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach(async (to, from, next)=>{
  const user = getAuth().currentUser
  console.log(user)
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if(requiresAuth && !user ){
    next('/')
  }else if (!requiresAuth && user) {
    next('/app/profile')
  } else {
    next()
  }
})
export default router
