import { ref, onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Composable to track if an element is visible in the viewport
 * Used to show/hide the floating terminal button based on hero terminal visibility
 */
export function useScrollVisibility(elementRef: Ref<HTMLElement | null>) {
  const isElementVisible = ref(true)

  const checkVisibility = () => {
    if (!elementRef.value) return

    const rect = elementRef.value.getBoundingClientRect()
    // Element is visible if its bottom edge is still in viewport
    isElementVisible.value = rect.bottom > 0
  }

  onMounted(() => {
    window.addEventListener('scroll', checkVisibility, { passive: true })
    checkVisibility() // Initial check
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', checkVisibility)
  })

  return { isElementVisible }
}
