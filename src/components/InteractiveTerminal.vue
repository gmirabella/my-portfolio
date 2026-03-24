<template>
  <div class="terminal-overlay" v-if="isOpen" @click.self="close">
    <div class="terminal-window" @click.stop>
      <div class="terminal-header">
        <span class="terminal-title">grza@portfolio:~$</span>
        <button class="terminal-close" @click="close">×</button>
      </div>

      <div class="terminal-body" ref="terminalBody">
        <div v-for="(line, index) in outputLines" :key="index" class="terminal-line" v-html="line" />

        <div class="terminal-input-line">
          <span class="terminal-prompt">$</span>
          <input ref="terminalInput" v-model="currentInput" @keydown.enter="executeCommand"
            @keydown.up="navigateHistory(-1)" @keydown.down="navigateHistory(1)" @keydown.tab.prevent="autocomplete"
            class="terminal-input" spellcheck="false" />
          <span class="terminal-cursor">_</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { projects } from '../data/projects'

const isOpen = ref(false)
const currentInput = ref('')
const outputLines = ref<string[]>([
  '<span style="color: rgba(106, 168, 79, 0.9)">grza@portfolio:~$ Welcome to interactive terminal</span>',
  '<span style="color: rgba(76, 125, 56, 0.6)">Type "help" for available commands</span>',
  ''
])
const commandHistory = ref<string[]>([])
const historyIndex = ref(-1)
const terminalInput = ref<HTMLInputElement>()
const terminalBody = ref<HTMLDivElement>()

// Commands implementation
const commands: Record<string, (args: string[]) => string[]> = {
  help: () => [
    '<span style="color: rgba(106, 168, 79, 0.9)">Available commands:</span>',
    '  ls           List all projects',
    '  whoami       About me',
    '  skills       Technical skills',
    '  experience   Work experience',
    '  education    Studies & certifications',
    '  cat resume   View resume',
    '  clear        Clear terminal',
    '  exit         Close terminal',
    ''
  ],

  ls: () => [
    '<span style="color: rgba(106, 168, 79, 0.9)">Projects:</span>',
    ...projects.map(p => `  📁 ${p.title}`),
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
    '  Languages:    Kotlin, React.js, Java, Unity3D, Vue.js, TypeScript',
    '  Expertise:    Agile Scrum, CI/CD, TDD, AI/LLM, UI/UX',
    ''
  ],

  experience: () => [
    '<span style="color: rgba(106, 168, 79, 0.9)">Work Experience:</span>',
    '',
    '  <span style="color: rgba(139, 195, 74, 0.85)">2022 — now</span>   Technical Delivery Manager @ AKQA',
    '',
    '  <span style="color: rgba(139, 195, 74, 0.85)">2020 — 2022</span>  Full-Stack Engineer @ Cuebiq',
    '',
    '  <span style="color: rgba(139, 195, 74, 0.85)">2018 — 2020</span>  Solution Engineer @ SopraSteria',
    '',
    '  <span style="color: rgba(139, 195, 74, 0.85)">2016 — 2018</span>  Engineer @ Accenture',
    ''
  ],

  education: () => [
    '<span style="color: rgba(106, 168, 79, 0.9)">Education & Certifications:</span>',
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

  clear: () => {
    outputLines.value = []
    return []
  },

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

  exit: () => {
    close()
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
  outputLines.value.push(`<span style="color: rgba(76, 125, 56, 0.6)">$</span> ${input}`)

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
    if (terminalBody.value) {
      terminalBody.value.scrollTop = terminalBody.value.scrollHeight
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
      `<span style="color: rgba(76, 125, 56, 0.6)">$</span> ${input}`,
      matches.join('  '),
      ''
    )
  }
}

const open = () => {
  isOpen.value = true
  nextTick(() => {
    terminalInput.value?.focus()
  })
}

const close = () => {
  isOpen.value = false
}

defineExpose({ open, close })
</script>

<style scoped>
.terminal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.terminal-window {
  width: 90%;
  max-width: 800px;
  height: 80%;
  background: #000;
  border: 2px solid rgba(76, 125, 56, 0.6);
  font-family: 'VT323', monospace;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 30px rgba(76, 125, 56, 0.3);
}

.terminal-header {
  padding: 0.5rem 1rem;
  background: rgba(76, 125, 56, 0.9);
  color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2em;
}

.terminal-close {
  background: none;
  border: none;
  color: #000;
  font-size: 1.5em;
  cursor: pointer;
  font-family: 'VT323', monospace;
}

.terminal-close:hover {
  transform: scale(1.2);
}

.terminal-body {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  color: rgba(106, 168, 79, 0.9);
  font-size: 1.1em;
  line-height: 1.5;
}

.terminal-line {
  margin-bottom: 0.25rem;
}

.terminal-input-line {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.terminal-prompt {
  color: rgba(106, 168, 79, 0.9);
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  color: rgba(106, 168, 79, 0.9);
  font-family: 'VT323', monospace;
  font-size: 1.1em;
  outline: none;
}

.terminal-cursor {
  animation: blink 1s step-start infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
