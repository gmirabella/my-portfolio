<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { projects as projectsData } from '../data/projects'
import type { Project } from '../data/projects'
import { useTheme } from '../composables/useTheme'
import { useKonamiCode } from '../composables/useKonamiCode'
import { useMouseTrack } from '../composables/useMouseTrack'
import { useScrollVisibility } from '../composables/useScrollVisibility'
import { useBootSequence } from '../composables/useBootSequence'
import FooterLinks from './FooterLinks.vue'
import InteractiveTerminal from './InteractiveTerminal.vue'

const router = useRouter()
const projects = ref<Project[]>(projectsData)

// Theme toggle via composable
const { isNight, toggleTheme } = useTheme()

// Boot sequence
const { isBooting, bootProgress, currentMessage, welcomeMessage } = useBootSequence()

// Post-boot animation state
const typedText = ref('')
const showAuthor = ref(false)
const showPrompt = ref(false)
const showCards = ref(false)
const visibleCardIds = ref<number[]>([])   // cards revealed one by one on first ls

// ASCII progress bar: 20 blocks total
const ASCII_BLOCKS = 20
const asciiBar = (progress: number) => {
  const filled = Math.round((progress / 100) * ASCII_BLOCKS)
  const empty = ASCII_BLOCKS - filled
  return '█'.repeat(filled) + '░'.repeat(empty)
}

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

const autoTypeInput = async (text: string) => {
  currentInput.value = ''
  for (const char of text) {
    currentInput.value += char
    await sleep(110)
  }
}

// Full post-boot sequence
const runPostBootSequence = async () => {
  await sleep(200)

  // Typewriter on welcome text
  const msg = welcomeMessage.value
  for (let i = 0; i <= msg.text.length; i++) {
    typedText.value = msg.text.slice(0, i)
    await sleep(45)
  }
  if (msg.author) showAuthor.value = true

  await sleep(600)

  // Show the prompt
  showPrompt.value = true
  // Reveal main container (cards still invisible)
  showCards.value = true

  await sleep(500)

  // Auto-type ls
  await autoTypeInput('ls')
  await sleep(300)

  commandHistory.value.push('ls')

  // Reveal cards one by one
  for (const project of projects.value) {
    visibleCardIds.value = [...visibleCardIds.value, project.id]
    await sleep(180)
  }

  currentInput.value = ''
}

watch(isBooting, (booting) => {
  if (!booting) runPostBootSequence()
})

// InteractiveTerminal + sticky header
const terminal = ref<InstanceType<typeof InteractiveTerminal>>()
const headerRef = ref<HTMLElement | null>(null)
const { isElementVisible: headerIsVisible } = useScrollVisibility(computed(() => headerRef.value))
const showStickyHeader = computed(() => !headerIsVisible.value && showCards.value)

const handleKeyPress = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    terminal.value?.open()
  }
}
onMounted(() => window.addEventListener('keydown', handleKeyPress))
onUnmounted(() => window.removeEventListener('keydown', handleKeyPress))

// Mouse tracking for parallax effects
const { mousePos } = useMouseTrack()

// Project card refs for parallax
const projectRefs = ref<Record<number, HTMLElement | null>>({})

// Calculate tilt for parallax effect
const calculateTilt = (cardElement: HTMLElement | null) => {
  if (!cardElement) return { x: 0, y: 0 }

  const rect = cardElement.getBoundingClientRect()
  // Convert viewport coordinates to page coordinates (fixes scroll bug)
  const centerX = rect.left + window.scrollX + rect.width / 2
  const centerY = rect.top + window.scrollY + rect.height / 2

  // mousePos now contains page coordinates (from useMouseTrack)
  const deltaX = mousePos.value.x - centerX
  const deltaY = mousePos.value.y - centerY

  // Reduced intensity from 15 to 8 degrees (less excessive)
  const tiltX = (deltaY / rect.height) * 8
  const tiltY = (deltaX / rect.width) * -8

  return { x: tiltX, y: tiltY }
}

// Konami code easter egg
useKonamiCode(() => {
  console.log('%c🎮 KONAMI CODE ACTIVATED! 🎮', 'font-size: 32px; color: #ff0000;')

  // Trigger special animation
  document.body.classList.add('konami-mode')
  setTimeout(() => document.body.classList.remove('konami-mode'), 3000)
})

// Terminal input logic
const _inputField = ref<HTMLInputElement | null>(null)
const currentInput = ref('')
const inputFocused = ref(false)
const commandHistory = ref<string[]>([])
const historyIndex = ref(-1)
const outputLines = ref<string[]>([])

// Commands implementation
const commands: Record<string, (args: string[]) => string[]> = {
  help: () => [
    '<span style="color: #8a8a8a">Available commands:</span>',
    '  ls           List all projects',
    '  whoami       About me',
    '  skills       Technical skills',
    '  experience   Work experience',
    '  education    Studies & certifications',
    '  cat resume   View resume',
    '  clear        Clear terminal',
    ''
  ],

  ls: () => {
    // In the header terminal, ls just reveals cards - no text output
    visibleCardIds.value = projects.value.map(p => p.id)
    showCards.value = true
    return []
  },

  whoami: () => [
    '<span style="color: #d4d4d4">Graziana Mirabella</span>',
    'Technical Delivery Manager @ AKQA',
    'Milan, Italy',
    '',
    'Computer scientist passionate about visual art & storytelling',
    ''
  ],

  skills: () => [
    '<span style="color: #8a8a8a">Technical Skills:</span>',
    '  Languages:    Kotlin, React.js, Java, Unity3D, Vue.js, TypeScript',
    '  Expertise:    Agile Scrum, CI/CD, TDD, AI/LLM, UI/UX',
    ''
  ],

  experience: () => [
    '<span style="color: #8a8a8a">Work Experience:</span>',
    '',
    '  <span style="color: #4a7c2c">2022 — now</span>   Technical Delivery Manager @ AKQA',
    '',
    '  <span style="color: #4a7c2c">2020 — 2022</span>  Full-Stack Engineer @ Cuebiq',
    '',
    '  <span style="color: #4a7c2c">2018 — 2020</span>  Solution Engineer @ SopraSteria',
    '',
    '  <span style="color: #4a7c2c">2016 — 2018</span>  Engineer @ Accenture',
    ''
  ],

  education: () => [
    '<span style="color: #8a8a8a">Education & Certifications:</span>',
    '',
    '  <span style="color: #4a7c2c">oct 2025</span>  IBM Specialization: RAG and Agentic AI',
    '             IBM',
    '',
    '  <span style="color: #4a7c2c">sep 2024</span>  Ayurvedic Holistic Operator',
    '             A.I.O.C. Italia - Accademia Istruttori e Operatori Certificati',
    '',
    '  <span style="color: #4a7c2c">dec 2020</span>  Software Development Process and Methodologies',
    '             University of Minnesota — Coursera',
    ''
  ],

  cat: (args) => {
    if (args[0] === 'resume' || args[0] === 'resume.pdf') {
      return [
        '<span style="color: #8a8a8a">Resume:</span>',
        '  Name:       Graziana Mirabella',
        '  Role:       Technical Delivery Manager',
        '  Download:   <a href="/resume.pdf" target="_blank" style="color: #4a7c2c">/resume.pdf</a>',
        ''
      ]
    }
    return [`<span style="color: #8a8a8a">cat: ${args[0]}: No such file</span>`, '']
  },

  clear: () => {
    outputLines.value = []
    return []
  }
}

const executeCommand = () => {
  const input = currentInput.value.trim()
  if (!input) return

  commandHistory.value.push(input)
  historyIndex.value = -1

  const parts = input.split(' ')
  const cmd = parts[0].toLowerCase()
  const args = parts.slice(1)

  if (commands[cmd]) {
    const result = commands[cmd](args)
    outputLines.value.push(...result)
  } else {
    outputLines.value.push(
      `<span style="color: #8a8a8a">Command not found: ${cmd}</span>`,
      '<span style="color: #4a7c2c">Type "help" for available commands</span>',
      ''
    )
  }

  currentInput.value = ''
}

const navigateHistory = (direction: number) => {
  if (commandHistory.value.length === 0) return

  const newIndex = historyIndex.value + direction

  if (newIndex >= 0 && newIndex < commandHistory.value.length) {
    historyIndex.value = newIndex
    currentInput.value = commandHistory.value[commandHistory.value.length - 1 - newIndex]
  }
}

const autocomplete = () => {
  const input = currentInput.value.toLowerCase()
  const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input))

  if (matches.length === 1) {
    currentInput.value = matches[0]
  } else if (matches.length > 1) {
    outputLines.value.push(
      `<span style="color: #8a8a8a">~$ ${input}</span>`,
      matches.join('  '),
      ''
    )
  }
}

// Handle click on media: if no local file, toggle embedded video
const handleMediaClick = (project: Project) => {
  console.log("Clicked project:", project.title)
  console.log("Project has route:", !!project.route)
  console.log("Project has file:", !!project.file)
  console.log("Project has youtubeId:", !!project.youtubeId)
  console.log("Project has videoFile:", !!project.videoFile)

  // If project has a route, navigate to it
  if (project.route) {
    router.push(project.route)
    return
  }

  if (project.file) {
    // Open the file in a new tab
    console.log("Opening file:", project.file)
    window.open(project.file, '_blank')
  } else if (project.youtubeId || project.link) {
    // For YouTube videos, open YouTube directly
    const youtubeUrl = project.youtubeId
      ? `https://www.youtube.com/watch?v=${project.youtubeId}`
      : project.link
    console.log("Opening YouTube:", youtubeUrl)
    window.open(youtubeUrl, '_blank')
  } else if (project.videoFile) {
    // For video files without YouTube, open the video file in a new tab
    console.log("Opening video file:", project.videoFile)
    window.open(project.videoFile, '_blank')
  }
}
</script>

<template>
  <div class="lowtech-container">
    <button class="theme-toggle" :class="{ 'is-night': isNight }" @click="toggleTheme" aria-label="Toggle theme">
      <span class="toggle-track"><span class="toggle-thumb"></span></span>
      <span class="toggle-text">
        <span class="label-day">DAY</span>
        <span class="sep">|</span>
        <span class="label-night">NIGHT</span>
      </span>
    </button>
    <!-- Unified Terminal - Continuous Flow -->
    <header class="terminal-unified" ref="headerRef">
      <div class="terminal-output">
        <!-- Title (always visible, centered) -->
        <h1 class="terminal-title-center">/usr/grza@portfolio</h1>

        <!-- Boot sequence -->
        <div class="terminal-boot-line">
          <span class="terminal-prompt">~$</span>
          <span class="terminal-command">./init_portfolio.sh</span>
        </div>

        <div class="terminal-boot-message">
          {{ currentMessage }}<span v-if="isBooting" class="terminal-cursor">_</span>
        </div>

        <div v-if="isBooting" class="terminal-progress-ascii">
          [{{ asciiBar(bootProgress) }}] {{ Math.floor(bootProgress) }}%
        </div>

        <!-- Post-boot: continuous terminal flow -->
        <div v-if="!isBooting" class="terminal-post-boot">

          <!-- Welcome message: typewriter + author -->
          <div class="terminal-welcome-message">
            <span class="terminal-welcome-text">{{ typedText }}</span><span v-if="!showPrompt"
              class="terminal-cursor">_</span><span v-if="showAuthor && welcomeMessage.author"
              class="terminal-welcome-author"> {{ welcomeMessage.author }}</span>
          </div>

          <!-- Prompt line appears after welcome -->
          <div v-if="showPrompt" class="terminal-prompt-line">
            <span class="terminal-prompt">~$</span>
            <input ref="_inputField" v-model="currentInput" @keydown.enter="executeCommand"
              @keydown.up="navigateHistory(-1)" @keydown.down="navigateHistory(1)" @keydown.tab.prevent="autocomplete"
              @focus="inputFocused = true" @blur="inputFocused = false" class="terminal-input"
              placeholder="type 'help' or 'ls' to explore..." spellcheck="false" :disabled="!showCards" /><span
              v-if="showCards && !currentInput && !inputFocused" class="terminal-cursor">_</span>
          </div>

          <!-- Output lines (ls result etc.) -->
          <div class="terminal-output-lines" v-if="outputLines.length > 0">
            <div v-for="(line, index) in outputLines.slice(-12)" :key="index" class="output-line" v-html="line" />
          </div>
        </div>
      </div>
    </header>

    <!-- Contenuto principale -->
    <main :class="{ 'content-hidden': !showCards }">
      <div class="projects-container">
        <div class="projects-grid">
          <article v-for="project in projects" :key="project.id" class="project-card"
            :class="{ 'card-revealed': visibleCardIds.includes(project.id) }"
            :ref="(el) => projectRefs[project.id] = el as HTMLElement | null" :style="{
              transform: `perspective(1000px) rotateX(${calculateTilt(projectRefs[project.id]).x}deg) rotateY(${calculateTilt(projectRefs[project.id]).y}deg)`
            }">
            <h2>{{ project.title }}</h2>

            <template v-if="project.file && !project.videoFile">
              <div class="media-container">
                <a :href="project.file" target="_blank" rel="noopener noreferrer" class="video-frame">
                  <img :src="project.posterImage" :alt="project.title" class="poster-image">
                </a>
              </div>
            </template>

            <template v-else>
              <div class="media-container clickable" @click="handleMediaClick(project)">
                <!-- Video file with autoplay and loop -->
                <video v-if="project.videoFile" :src="project.videoFile" autoplay loop muted playsinline
                  class="video-frame" @click="handleMediaClick(project)"></video>

                <!-- Poster image for other projects -->
                <img v-else-if="project.posterImage" :src="project.posterImage" :alt="project.title"
                  class="poster-image" loading="lazy">

                <!-- Placeholder for projects with route or link but no media -->
                <div v-else-if="project.route || project.link" class="route-placeholder">
                  Click to view →
                </div>
              </div>
            </template>

            <p class="project-description">{{ project.description }}</p>
            <p class="project-tools">{{ project.tools }}</p>
          </article>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer-container">
      <div class="footer-content">
        <FooterLinks />
      </div>
    </footer>

    <!-- Sticky terminal header (appears on scroll) -->
    <div class="terminal-sticky-header" :class="{ 'visible': showStickyHeader }" @click="terminal?.open()"
      title="Click to open terminal (or Ctrl+K)">
      <span class="sticky-prompt">grza@portfolio:~$</span>
      <span class="sticky-cursor">_</span>
    </div>

    <!-- Full Interactive Terminal -->
    <InteractiveTerminal ref="terminal" />

  </div>
</template>
