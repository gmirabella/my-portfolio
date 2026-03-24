import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Portfolio from './components/Portfolio.vue'
import { projects } from './data/projects'

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

// Console Easter Eggs & Developer Messages
console.log(`
%c
    ╔═══════════════════════════════════════╗
    ║   /usr/grza/website                   ║
    ║   █▀█ █▀█ █▀█ ▀█▀ █▀▀ █▀█ █   ▀█▀ █▀█  ║
    ║   █▀▀ █▄█ █▀▄  █  █▀▀ █▄█ █    █  █▄█  ║
    ║   ▀   ▀▀▀ ▀ ▀  ▀  ▀   ▀▀▀ ▀▀▀ ▀▀▀ ▀▀▀  ║
    ╚═══════════════════════════════════════╝

    Looking for hidden commands? Try these:

    → window.portfolio.help()
    → window.portfolio.projects()
    → window.portfolio.skills()
    → window.portfolio.konami()  // UP UP DOWN DOWN...

    Built with Vue 3 + Three.js + TypeScript
    Source: github.com/graziana/my-portfolio

%c
`, 'color: #00ff00; font-family: monospace; font-size: 12px;', '')

// Expose global portfolio API
declare global {
  interface Window {
    portfolio: {
      help: () => void
      projects: () => void
      skills: () => void
      konami: () => void
    }
  }
}

window.portfolio = {
  help: () => console.table({
    'ls': 'List all projects',
    'whoami': 'About me',
    'cat resume': 'Show resume',
    'npm start': 'Start Capitalism Simulator'
  }),
  projects: () => console.table(projects.map(p => ({
    title: p.title,
    tools: p.tools
  }))),
  skills: () => console.log('Vue 3 | TypeScript | Three.js | WebGL | Vite'),
  konami: () => console.log('🎮 Try: ↑↑↓↓←→←→BA on the page!')
}
