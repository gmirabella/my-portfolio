import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Portfolio from './components/Portfolio.vue'
import CapitalismSimulator from './components/CapitalismSimulator.vue'
import CapitalistRealismRPG from './components/CapitalistRealismRPG.vue'

const routes = [
  {
    path: '/',
    component: Portfolio,
  },
  {
    path: '/capitalism-simulator',
    component: CapitalismSimulator,
  },
  {
    path: '/capitalist-realism-rpg',
    component: CapitalistRealismRPG,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
