import { ref, onMounted, onUnmounted } from 'vue'

export function useMouseTrack() {
  const mousePos = ref({ x: 0, y: 0 })
  const isMoving = ref(false)
  let timeout: number

  const handleMouseMove = (e: MouseEvent) => {
    // Use page coordinates (viewport + scroll offset) to fix parallax bug when scrolling
    mousePos.value = {
      x: e.clientX + window.scrollX,
      y: e.clientY + window.scrollY
    }

    isMoving.value = true
    clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      isMoving.value = false
    }, 150)
  }

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    clearTimeout(timeout)
  })

  return {
    mousePos,
    isMoving
  }
}
