import { ref, onMounted } from 'vue'
import welcomeData from '../data/welcomeMessages.json'

export type BootMessage = {
  text: string
  delay: number
  type?: 'info' | 'success' | 'warning' | 'error'
}

export type WelcomeMessage = {
  text: string
  author: string
}

export function useBootSequence() {
  const isBooting = ref(true)
  const bootProgress = ref(0)
  const currentMessage = ref('')

  const bootMessages: BootMessage[] = [
    { text: 'INITIALIZING SYSTEM...', delay: 0 },
    { text: 'LOADING MEMORY BANKS...', delay: 300 },
    { text: 'CHECKING FILE INTEGRITY...', delay: 600 },
    { text: 'MOUNTING VIRTUAL FILESYSTEM...', delay: 900 },
    { text: 'ESTABLISHING NEURAL NETWORK...', delay: 1200 },
    { text: 'COMPILING DREAMS...', delay: 1500 },
    { text: 'PARSING CODE FRAGMENTS...', delay: 1800 },
    { text: 'SYSTEM BOOT COMPLETE ✓', delay: 2100 }
  ]

  const welcomeMessage = ref<WelcomeMessage>({ text: '', author: '' })

  const startBootSequence = () => {
    let messageIndex = 0

    const showNextMessage = () => {
      if (messageIndex < bootMessages.length) {
        const msg = bootMessages[messageIndex]
        setTimeout(() => {
          currentMessage.value = msg.text
          bootProgress.value = ((messageIndex + 1) / bootMessages.length) * 100
          messageIndex++
          showNextMessage()
        }, msg.delay)
      } else {
        setTimeout(() => {
          const messages = welcomeData.active
      welcomeMessage.value = messages[Math.floor(Math.random() * messages.length)]
          setTimeout(() => {
            isBooting.value = false
          }, 400)
        }, 400)
      }
    }

    showNextMessage()
  }

  onMounted(() => {
    startBootSequence()
  })

  return {
    isBooting,
    bootProgress,
    currentMessage,
    welcomeMessage
  }
}
