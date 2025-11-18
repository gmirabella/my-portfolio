<template>
  <div class="webgl-container" ref="container">
    <canvas ref="canvas" class="webgl-canvas"></canvas>
    
    <!-- Lottie Animation Container -->
    <div class="lottie-container" ref="lottieContainer"></div>
    
    <div class="text-overlay" ref="textOverlay">
      <h1 class="glitch-text" @mouseenter="startGlitch" @mouseleave="stopGlitch">
        ENTER THE DIGITAL REALM
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import lottie from 'lottie-web'

const container = ref<HTMLDivElement>()
const canvas = ref<HTMLCanvasElement>()
const textOverlay = ref<HTMLDivElement>()
const lottieContainer = ref<HTMLDivElement>()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let material: THREE.ShaderMaterial
let geometry: THREE.PlaneGeometry
let mesh: THREE.Mesh
let animationId: number
let isGlitching = false

// Lottie variables
let lottieAnimation: any = null
let lottieData: any = null

// Vertex shader for dithering effect
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Fragment shader with dithering, glitch effects and Lottie integration
const fragmentShader = `
  uniform float time;
  uniform float glitchIntensity;
  uniform vec2 resolution;
  uniform sampler2D lottieTexture;
  uniform float lottieOpacity;
  varying vec2 vUv;
  
  // Dithering function
  float dither(vec2 uv, float time) {
    vec2 grid = floor(uv * 8.0);
    float noise = fract(sin(dot(grid, vec2(12.9898, 78.233))) * 43758.5453);
    return step(0.5, noise);
  }
  
  // Glitch effect
  vec2 glitch(vec2 uv, float time) {
    float glitch = sin(time * 10.0) * glitchIntensity;
    uv.x += sin(uv.y * 20.0 + time * 5.0) * glitch * 0.01;
    uv.y += sin(uv.x * 20.0 + time * 3.0) * glitch * 0.01;
    return uv;
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Apply glitch distortion
    uv = glitch(uv, time);
    
    // Sample Lottie texture
    vec4 lottieColor = texture2D(lottieTexture, uv);
    
    // Create text-like pattern
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(uv, center);
    float text = 1.0 - smoothstep(0.2, 0.3, dist);
    
    // Add dithering
    float dither = dither(uv, time);
    text *= dither;
    
    // Mix Lottie with text pattern
    float lottieMask = lottieColor.a * lottieOpacity;
    text = mix(text, lottieMask, lottieMask * 0.5);
    
    // Add color channels with slight offset for RGB separation
    float r = text + lottieColor.r * lottieMask;
    float g = text * (1.0 + sin(time * 2.0) * 0.1) + lottieColor.g * lottieMask;
    float b = text * (1.0 + sin(time * 3.0) * 0.1) + lottieColor.b * lottieMask;
    
    // Add scanlines
    float scanline = sin(uv.y * 200.0) * 0.1 + 0.9;
    
    vec3 color = vec3(r, g, b) * scanline;
    
    gl_FragColor = vec4(color, max(text, lottieMask));
  }
`

const initWebGL = () => {
  if (!canvas.value || !container.value) return

  // Scene setup
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer({ 
    canvas: canvas.value, 
    alpha: true,
    antialias: false // For retro pixelated look
  })
  
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
  // Create material with shaders
  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      time: { value: 0 },
      glitchIntensity: { value: 0 },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      lottieTexture: { value: new THREE.Texture() },
      lottieOpacity: { value: 0.0 }
    },
    transparent: true
  })
  
  // Create geometry
  geometry = new THREE.PlaneGeometry(2, 2)
  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
  
  camera.position.z = 1
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  if (material) {
    material.uniforms.time.value = performance.now() * 0.001
  }
  
  renderer.render(scene, camera)
}

const initLottie = () => {
  if (!lottieContainer.value) return
  
  // Initialize Lottie animation
  lottieAnimation = lottie.loadAnimation({
    container: lottieContainer.value,
    renderer: 'canvas',
    loop: true,
    autoplay: true,
    path: '/src/assets/dog-medusa.lottie'
  })
  
  // Create texture from Lottie canvas
  const canvas = lottieContainer.value.querySelector('canvas')
  if (canvas && material) {
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    material.uniforms.lottieTexture.value = texture
    material.uniforms.lottieOpacity.value = 1.0
  }
}

const startGlitch = () => {
  isGlitching = true
  if (material) {
    material.uniforms.glitchIntensity.value = 1.0
    material.uniforms.lottieOpacity.value = 0.8
  }
}

const stopGlitch = () => {
  isGlitching = false
  if (material) {
    material.uniforms.glitchIntensity.value = 0.0
    material.uniforms.lottieOpacity.value = 1.0
  }
}

const handleResize = () => {
  if (!camera || !renderer) return
  
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  
  if (material) {
    material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight)
  }
}

onMounted(() => {
  initWebGL()
  initLottie()
  animate()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
  
  if (lottieAnimation) {
    lottieAnimation.destroy()
  }
  
  if (renderer) {
    renderer.dispose()
  }
  if (material) {
    material.dispose()
  }
  if (geometry) {
    geometry.dispose()
  }
})
</script>

<style scoped>
.webgl-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.webgl-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.lottie-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0;
  pointer-events: none;
}

.text-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
}

.glitch-text {
  font-family: 'VT323', monospace;
  font-size: 3rem;
  color: #ffffff;
  text-align: center;
  letter-spacing: 2px;
  text-shadow: 
    2px 0 #ff0000,
    -2px 0 #00ff00,
    0 2px #0000ff;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.3s ease;
  mix-blend-mode: difference;
}

.glitch-text:hover {
  transform: translateX(2px);
  text-shadow: 
    4px 0 #ff0000,
    -4px 0 #00ff00,
    0 4px #0000ff;
}

/* Retro scanlines overlay */
.webgl-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
  pointer-events: none;
  z-index: 3;
}

/* Day theme */
body.theme-day .glitch-text {
  color: #1a1a1a;
  text-shadow: 
    2px 0 #ff6b6b,
    -2px 0 #4ecdc4,
    0 2px #45b7d1;
}

body.theme-day .glitch-text:hover {
  text-shadow: 
    4px 0 #ff6b6b,
    -4px 0 #4ecdc4,
    0 4px #45b7d1;
}
</style>
