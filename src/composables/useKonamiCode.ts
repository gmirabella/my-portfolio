import { ref, onMounted, onUnmounted } from 'vue'

const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
]

export function useKonamiCode(callback: () => void) {
  const sequence = ref<string[]>([])

  const handleKeyPress = (e: KeyboardEvent) => {
    sequence.value.push(e.code)

    // Keep only last 10 keys
    if (sequence.value.length > 10) {
      sequence.value.shift()
    }

    // Check if matches Konami code
    if (sequence.value.join(',') === KONAMI_SEQUENCE.join(',')) {
      callback()
      sequence.value = [] // Reset
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyPress)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress)
  })
}
