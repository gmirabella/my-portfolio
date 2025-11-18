import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Portfolio from './components/Portfolio.vue'

const routes = [
  {
    path: '/',
    component: Portfolio,
  },
  {
    path: '/capitalism-simulator',
    component: () => import('./components/CapitalismSimulator.vue'),
  },
  {
    path: '/capitalist-realism-rpg',
    component: () => import('./components/CapitalistRealismRPG.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
