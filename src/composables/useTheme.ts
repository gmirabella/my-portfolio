import { ref, onMounted } from 'vue'

export function useTheme() {
  const isNight = ref(true)

  const applyTheme = (night: boolean) => {
    const body = document.body
    if (night) {
      body.classList.add('theme-night')
      body.classList.remove('theme-day')
    } else {
      body.classList.add('theme-day')
      body.classList.remove('theme-night')
    }
  }

  const toggleTheme = () => {
    isNight.value = !isNight.value
    applyTheme(isNight.value)
    try { localStorage.setItem('theme', isNight.value ? 'night' : 'day') } catch {}
  }

  onMounted(() => {
    try {
      const saved = localStorage.getItem('theme')
      isNight.value = saved ? saved === 'night' : true
    } catch {
      isNight.value = true
    }
    applyTheme(isNight.value)
  })

  return { isNight, toggleTheme, applyTheme }
}


