<template>
  <div class="landing-page">
    <!-- Theme Toggle -->
    <button class="theme-toggle" :class="{ 'is-night': isNight }" @click="toggleTheme" aria-label="Toggle theme">
      <span class="toggle-track"><span class="toggle-thumb"></span></span>
      <span class="toggle-text">
        <span class="label-day">DAY</span>
        <span class="sep">|</span>
        <span class="label-night">NIGHT</span>
      </span>
    </button>
    
    <div class="landing-content">
      <!-- WebGL Background -->
      <WebGLText />
      
      <!-- Dog Medusa GIF -->
      <div class="video-container">
        <img 
          src="/images/dog-medusa.gif"
          alt="Dog Medusa"
          class="dog-medusa-gif"
        />
      </div>
      
      <div class="landing-footer">
        <button class="enter-button" @click="$emit('enter')">
          <span class="button-text">ENTER PORTFOLIO</span>
          <span class="button-cursor">_</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import WebGLText from './WebGLText.vue'

defineEmits<{
  enter: []
}>()

// Theme toggle via composable
const { isNight, toggleTheme } = useTheme()
</script>

<style scoped>
.landing-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

/* Theme toggle for landing page */
.theme-toggle {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 2100;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: rgba(0,0,0,0.6);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
}

.theme-toggle .toggle-track {
  position: relative;
  width: 54px;
  height: 22px;
  background: #0f0f0f;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 4px;
}

.theme-toggle .toggle-thumb {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 24px;
  height: 18px;
  background: #dcdcdc;
  border: 1px solid #999;
  border-radius: 2px;
  transform: translateX(0);
  transition: transform 0.18s ease;
}

.theme-toggle.is-night .toggle-thumb {
  transform: translateX(28px);
  background: #f1f1f1;
}

.theme-toggle .toggle-text {
  font-family: 'VT323', monospace;
  font-size: 14px;
  letter-spacing: 1px;
  color: #ffffff;
}

.theme-toggle .toggle-text .label-day {
  opacity: 0.6;
}

.theme-toggle .toggle-text .label-night {
  opacity: 1;
}

.theme-toggle .toggle-text .sep {
  opacity: 0.5;
  margin: 0 4px;
}

.theme-toggle:is(.is-night) .toggle-text .label-day {
  opacity: 0.6;
}

.theme-toggle:is(:not(.is-night)) .toggle-text .label-night {
  opacity: 0.6;
}

.landing-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  position: relative;
  z-index: 1;
}

.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dog-medusa-gif {
  width: auto;
  height: 60vh;
  max-width: 90vw;
  object-fit: contain;
}

.landing-footer {
  text-align: center;
}

.enter-button {
  background: transparent;
  border: 2px solid rgba(255,255,255,0.5);
  color: #ffffff;
  padding: 1rem 2rem;
  font-family: 'VT323', monospace;
  font-size: 1.2em;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.enter-button:hover {
  background: rgba(255,255,255,0.1);
  border-color: #ffffff;
  transform: translateY(-2px);
}

.button-cursor {
  animation: blink 1s step-start infinite;
  margin-left: 0.5rem;
}

@keyframes blink {
  50% { opacity: 0; }
}

/* Day theme overrides */
body.theme-day .landing-page {
  background: #f8f7e9;
}

body.theme-day .enter-button {
  border-color: rgba(0,0,0,0.5);
  color: #1a1a1a;
}

body.theme-day .enter-button:hover {
  background: rgba(0,0,0,0.1);
  border-color: #1a1a1a;
}
</style>
