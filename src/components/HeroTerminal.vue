<template>
  <section class="hero-terminal-section" ref="heroSection">
    <div class="hero-terminal-container">
      <div class="terminal-prompt-line">
        <span class="prompt-text">grza@portfolio:~$</span>
        <input ref="inputField" v-model="currentInput" @keydown.enter="executeCommand" @keydown.up="navigateHistory(-1)"
          @keydown.down="navigateHistory(1)" @keydown.tab.prevent="autocomplete" class="terminal-input"
          placeholder="type 'help' to explore..." spellcheck="false" />
        <span class="cursor">_</span>
      </div>

      <div class="terminal-output-compact" ref="outputContainer" v-if="outputLines.length > 0">
        <div v-for="(line, index) in outputLines.slice(-8)" :key="index" class="output-line" v-html="line" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { projects } from '../data/projects'

const heroSection = ref<HTMLElement | null>(null)
const outputContainer = ref<HTMLDivElement | null>(null)
const inputField = ref<HTMLInputElement | null>(null)
const currentInput = ref('')
const commandHistory = ref<string[]>([])
const historyIndex = ref(-1)

// Random cyberpunk welcome messages
const welcomeMessages = [
  'Wake up, Neo... <span style="color: rgba(76, 125, 56, 0.6)">The Matrix has you</span>',
  'Follow the white rabbit <span style="color: rgba(76, 125, 56, 0.6)">🐰</span>',
  'Welcome to the real world <span style="color: rgba(76, 125, 56, 0.6)">- Morpheus</span>',
  'I\'ve seen things you people wouldn\'t believe... <span style="color: rgba(76, 125, 56, 0.6)">- Roy Batty</span>',
  'The sky above the port was the color of television <span style="color: rgba(76, 125, 56, 0.6)">- Neuromancer</span>',
  'In the beginning was the command line <span style="color: rgba(76, 125, 56, 0.6)">- Neal Stephenson</span>',
  'Ubik: Safe when taken as directed <span style="color: rgba(76, 125, 56, 0.6)">- Philip K. Dick</span>',
  'Hello, friend. <span style="color: rgba(76, 125, 56, 0.6)">- Mr. Robot</span>',
  'Jacking in... <span style="color: rgba(76, 125, 56, 0.6)">Console cowboy detected</span>',
  'Cyberspace. A consensual hallucination <span style="color: rgba(76, 125, 56, 0.6)">- William Gibson</span>',
  'The future is already here <span style="color: rgba(76, 125, 56, 0.6)">It\'s just not evenly distributed</span>',
  'Greetings, program <span style="color: rgba(76, 125, 56, 0.6)">- Tron</span>',
  'Smells like teen spirit <span style="color: rgba(76, 125, 56, 0.6)">in the digital realm</span>',
  'Ghost in the Shell detected <span style="color: rgba(76, 125, 56, 0.6)">Initializing...</span>',
  'Reality is that which persists <span style="color: rgba(76, 125, 56, 0.6)">when you stop believing</span>',
  'AKIRA! <span style="color: rgba(76, 125, 56, 0.6)">Kaneda! What do you see?</span>',
  'All watched over by machines of loving grace <span style="color: rgba(76, 125, 56, 0.6)">- Richard Brautigan</span>',
  'Do androids dream? <span style="color: rgba(76, 125, 56, 0.6)">- Philip K. Dick</span>',
  'Come with me if you want to live <span style="color: rgba(76, 125, 56, 0.6)">- The Terminator</span>',
  'Welcome, stranger. <span style="color: rgba(76, 125, 56, 0.6)">What are you buying?</span>'
]

// Pick random welcome message on mount
const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]

const outputLines = ref<string[]>([
  `<span style="color: rgba(106, 168, 79, 0.9)">${randomWelcome}</span>`,
  '<span style="color: rgba(76, 125, 56, 0.6)">Type \'help\' to explore</span>'
])

// Commands implementation
const commands: Record<string, (args: string[]) => string[]> = {
  help: () => [
    '<span style="color: rgba(106, 168, 79, 0.9)">Available commands:</span>',
    '  <span style="color: rgba(139, 195, 74, 0.85)">ls</span>            List all projects',
    '  <span style="color: rgba(139, 195, 74, 0.85)">whoami</span>        About me',
    '  <span style="color: rgba(139, 195, 74, 0.85)">skills</span>        Technical skills & experience',
    '  <span style="color: rgba(139, 195, 74, 0.85)">education</span>     Studies & degree',
    '  <span style="color: rgba(139, 195, 74, 0.85)">certification</span> Certifications',
    '  <span style="color: rgba(139, 195, 74, 0.85)">cat resume</span>    View resume',
    '  <span style="color: rgba(139, 195, 74, 0.85)">clear</span>         Clear terminal',
    '',
    '<span style="color: rgba(76, 125, 56, 0.6)">Tip: Press Ctrl+K for full terminal mode</span>',
    ''
  ],

  ls: () => [
    '<span style="color: rgba(106, 168, 79, 0.9)">Projects:</span>',
    ...projects.map(p => `  📁 ${p.title}`),
    '',
    '<span style="color: rgba(76, 125, 56, 0.6)">Scroll down to see project details</span>',
    ''
  ],

  whoami: () => [
    '<span style="color: rgba(106, 168, 79, 0.9)">Graziana Mirabella</span>',
    'Technical Delivery Manager @ AKQA',
    'Milan, Italy',
    '',
    'Computer scientist passionate about visual art & storytelling',
    'Leading teams in creating impactful and sustainable software',
    '',
    'Contact: graziana.mirabella | +39 334 59 51 878',
    'Bio: <a href="https://tinyurl.com/grza-bio" target="_blank" style="color: rgba(106, 168, 79, 0.9)">https://tinyurl.com/grza-bio</a>',
    ''
  ],

  skills: () => [
    '<span style="color: rgba(106, 168, 79, 0.9)">Technical Skills:</span>',
    '',
    '  <span style="color: rgba(139, 195, 74, 0.85)">Languages:</span>    Kotlin, React.js, Java, Unity3D, Vue.js, TypeScript, Three.js',
    '  <span style="color: rgba(139, 195, 74, 0.85)">Expertise:</span>    Agile Scrum, CI/CD, TDD, AI/LLM, UI/UX, Storytelling',
    '  <span style="color: rgba(139, 195, 74, 0.85)">Tools:</span>        Git, Vite, Jira, Confluence',
    '',
    '<span style="color: rgba(106, 168, 79, 0.9)">Experience:</span>',
    '  <span style="color: rgba(139, 195, 74, 0.85)">Current:</span>      Technical Delivery Manager @ AKQA (2022-Now)',
    '  <span style="color: rgba(139, 195, 74, 0.85)">Previous:</span>     Full-Stack Engineer @ Cuebiq (2019-2022)',
    '                Solution Engineer @ SopraSteria, Accenture',
    ''
  ],

  education: () => [
    '<span style="color: rgba(106, 168, 79, 0.9)">Education:</span>',
    '',
    '  <span style="color: rgba(139, 195, 74, 0.85)">Degree:</span>       Computer Science for New Media Communications',
    '  <span style="color: rgba(139, 195, 74, 0.85)">University:</span>   University of Milan',
    '  <span style="color: rgba(139, 195, 74, 0.85)">Thesis:</span>       Cognitive Rehabilitation through motion sensors',
    ''
  ],

  certification: () => [
    '<span style="color: rgba(106, 168, 79, 0.9)">Certifications:</span>',
    '',
    '  <span style="color: rgba(139, 195, 74, 0.85)">oct 2025</span>  IBM Specialization: RAG and Agentic AI',
    '             IBM',
    '',
    '  <span style="color: rgba(139, 195, 74, 0.85)">sep 2024</span>  Ayurvedic Holistic Operator',
    '             A.I.O.C. Italia - Accademia Istruttori e Operatori Certificati',
    '',
    '  <span style="color: rgba(139, 195, 74, 0.85)">dec 2020</span>  Software Development Process and Methodologies',
    '             University of Minnesota — Coursera',
    ''
  ],

  cat: (args) => {
    if (args[0] === 'resume' || args[0] === 'resume.pdf') {
      return [
        '<span style="color: rgba(106, 168, 79, 0.9)">Resume:</span>',
        '  Name:       Graziana Mirabella',
        '  Role:       Technical Delivery Manager',
        '  Location:   Milan, Italy',
        '  Contact:    graziana.mirabella | +39 334 59 51 878',
        '',
        '  Download: <a href="/resume.pdf" target="_blank" style="color: rgba(106, 168, 79, 0.9)">/resume.pdf</a>',
        ''
      ]
    }
    return [`<span style="color: #ff0000">cat: ${args[0]}: No such file or directory</span>`, '']
  },

  clear: () => {
    outputLines.value = []
    return []
  }
}

const executeCommand = () => {
  const input = currentInput.value.trim()
  if (!input) return

  // Add to history
  commandHistory.value.push(input)
  historyIndex.value = -1

  // Add command to output
  outputLines.value.push(`<span style="color: rgba(106, 168, 79, 0.9)">$ ${input}</span>`)

  // Parse command
  const parts = input.split(' ')
  const cmd = parts[0].toLowerCase()
  const args = parts.slice(1)

  // Execute
  if (commands[cmd]) {
    const result = commands[cmd](args)
    outputLines.value.push(...result)
  } else {
    outputLines.value.push(
      `<span style="color: #ff0000">Command not found: ${cmd}</span>`,
      '<span style="color: rgba(76, 125, 56, 0.6)">Type "help" for available commands</span>',
      ''
    )
  }

  currentInput.value = ''

  // Scroll to bottom
  nextTick(() => {
    if (outputContainer.value) {
      outputContainer.value.scrollTop = outputContainer.value.scrollHeight
    }
  })
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
      `<span style="color: rgba(76, 125, 56, 0.6)">$ ${input}</span>`,
      matches.join('  '),
      ''
    )
  }
}

defineExpose({ heroSection })
</script>

<style scoped>
.hero-terminal-section {
  width: 100%;
  padding: 0 2rem 2rem 2rem;
  margin: 0;
  border-bottom: 2px dashed rgba(255, 255, 255, 0.8);
  background: #000000;
}

.hero-terminal-container {
  max-width: 80%;
  margin: 0 auto;
  background: #000000;
  border: none;
  border-top: 1px solid rgba(76, 125, 56, 0.3);
  padding: 1rem 0 0 0;
  font-family: 'VT323', monospace;
  color: rgba(106, 168, 79, 0.9);
  box-shadow: none;
}

.terminal-prompt-line {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 1.2em;
  padding-bottom: 0.5rem;
}

.prompt-text {
  color: rgba(180, 180, 180, 0.9);
  flex-shrink: 0;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  color: rgba(200, 200, 200, 0.95);
  font-family: 'VT323', monospace;
  font-size: 1em;
  outline: none;
}

.terminal-input::placeholder {
  color: rgba(76, 125, 56, 0.6);
}

.cursor {
  animation: blink 1s step-start infinite;
  flex-shrink: 0;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.terminal-output-compact {
  border-top: 1px solid rgba(100, 100, 100, 0.3);
  padding-top: 0.5rem;
  font-size: 1em;
  line-height: 1.5;
  max-height: 150px;
  overflow-y: auto;
  color: rgba(160, 160, 160, 0.85);
}

.terminal-output-compact::-webkit-scrollbar {
  width: 6px;
}

.terminal-output-compact::-webkit-scrollbar-track {
  background: transparent;
}

.terminal-output-compact::-webkit-scrollbar-thumb {
  background: rgba(120, 120, 120, 0.5);
  border-radius: 3px;
}

.output-line {
  margin-bottom: 0.2rem;
  word-wrap: break-word;
}

/* Mobile styles */
@media (max-width: 768px) {
  .hero-terminal-container {
    max-width: 95%;
    padding: 0.75rem;
  }

  .terminal-prompt-line {
    font-size: 1em;
  }

  .terminal-output-compact {
    max-height: 100px;
    font-size: 0.9em;
  }
}

/* Day theme support */
body.theme-day .hero-terminal-section {
  border-color: rgba(45, 80, 22, 0.2);
  background: #ffffff;
}

body.theme-day .hero-terminal-container {
  background: #ffffff;
  border-color: #2d5016;
  color: #2d5016;
  box-shadow: 0 0 15px rgba(45, 80, 22, 0.15);
}

body.theme-day .terminal-prompt-line {
  border-color: rgba(45, 80, 22, 0.2);
}

body.theme-day .prompt-text {
  color: #2d5016;
}

body.theme-day .terminal-output-compact {
  border-color: rgba(45, 80, 22, 0.2);
  color: #3a6b1e;
}

body.theme-day .terminal-output-compact::-webkit-scrollbar-thumb {
  background: rgba(45, 80, 22, 0.4);
}

body.theme-day .terminal-input {
  color: #2d5016;
}
</style>
