<template>
  <div class="lowtech-container">
    <!-- Theme Toggle -->
    <button class="theme-toggle" :class="{ 'is-night': isNight }" @click="toggleTheme" aria-label="Toggle theme">
      <span class="toggle-track"><span class="toggle-thumb"></span></span>
      <span class="toggle-text">
        <span class="label-day">DAY</span>
        <span class="sep">|</span>
        <span class="label-night">NIGHT</span>
      </span>
    </button>
    
    <!-- Back Button -->
    <button class="back-button" @click="goBack">
      &lt;_BACK
    </button>

    <!-- 3D Scene Container -->
    <div class="scene-container" ref="sceneContainer"></div>

    <!-- Buttons Section - Centered -->
    <div class="button-section">
      <div class="terminal-window">
        <div class="terminal-titlebar">
          <div class="terminal-title">_</div>
          <div class="terminal-buttons">
            <span class="terminal-btn minimize">_</span>
            <span class="terminal-btn maximize">□</span>
            <span class="terminal-btn close">×</span>
          </div>
        </div>
        <div class="terminal-content">
          <h1 class="game-title">CAPITALISM SIMULATOR</h1>
          <a 
            :href="gameUrl" 
            target="_blank" 
            rel="noopener noreferrer"
            class="play-button"
          >
            <span class="button-text">WITH AI (Claude Artifact)</span>
          </a>
          <button @click="goToOfflineGame" class="play-button offline-btn">
            <span class="button-text">OFFLINE (non spendo tokens per sta minchiata)</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const router = useRouter()
const { isNight, toggleTheme } = useTheme()
const gameUrl = 'https://claude.ai/public/artifacts/a16db306-18bc-49e7-8fe4-7d38ecb75c4e'
const sceneContainer = ref<HTMLDivElement>()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationId: number
let gltfLoader: GLTFLoader
const modelCache: Map<string, THREE.Object3D> = new Map()

interface FallingObject {
  mesh: THREE.Mesh | THREE.Group | THREE.Object3D
  type: 'hamburger' | 'money' | 'phone' | 'computer' | 'chips' | 'drink' | 'plant'
  speed: number
  rotationSpeed: number
  radius: number // Collision radius
}

const fallingObjects: FallingObject[] = []

const goBack = () => {
  router.push('/')
}

const goToOfflineGame = () => {
  router.push('/capitalist-realism-rpg')
}

// Helper function to make materials opaque
const makeMaterialsOpaque = (object: THREE.Object3D) => {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            if (mat instanceof THREE.Material) {
              mat.transparent = false
              mat.opacity = 1
            }
          })
        } else if (child.material instanceof THREE.Material) {
          child.material.transparent = false
          child.material.opacity = 1
        }
      }
    }
  })
}

const loadGLBModel = async (path: string): Promise<THREE.Object3D> => {
  return new Promise((resolve, reject) => {
    if (!gltfLoader) {
      reject(new Error('GLTFLoader not initialized'))
      return
    }
    
    if (modelCache.has(path)) {
      const cached = modelCache.get(path)!
      try {
        // Deep clone to ensure all materials and geometries are cloned
        const cloned = cached.clone(true)
        // Ensure clone is properly set up
        cloned.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.matrixAutoUpdate = true
          }
        })
        // Make all materials opaque
        makeMaterialsOpaque(cloned)
        if (cloned instanceof THREE.Object3D) {
          resolve(cloned)
        } else {
          reject(new Error('Failed to clone model - not Object3D'))
        }
      } catch (error) {
        reject(new Error(`Failed to clone model: ${error}`))
      }
      return
    }
    
    gltfLoader.load(
      path,
      (gltf) => {
        const model = gltf.scene
        if (!model) {
          reject(new Error('Model scene is null'))
          return
        }
        
        if (model instanceof THREE.Object3D) {
          // Store original in cache
          modelCache.set(path, model)
          
          // Clone for use (deep clone)
          try {
            const cloned = model.clone(true)
            // Ensure clone is properly set up
            cloned.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.matrixAutoUpdate = true
              }
            })
            // Make all materials opaque
            makeMaterialsOpaque(cloned)
            
            // Also make original model materials opaque for cache
            makeMaterialsOpaque(model)
            
            if (cloned instanceof THREE.Object3D) {
              resolve(cloned)
            } else {
              reject(new Error('Cloned model is not an Object3D'))
            }
          } catch (error) {
            reject(new Error(`Failed to clone model: ${error}`))
          }
        } else {
          reject(new Error('Model is not an Object3D'))
        }
      },
      undefined,
      (error) => {
        console.error('Error loading GLB model:', error)
        reject(error)
      }
    )
  })
}

const preloadModels = async () => {
  if (!gltfLoader) return
  
  const paths = ['/images/hamburger.glb', '/images/amazon.glb', '/images/computer.glb', '/images/friggitrice.glb', '/images/iphone_14_pro.glb', '/images/redbull.glb', '/images/plant.glb']
  
  const loadPromises = paths.map(path => {
    return new Promise<void>((resolve) => {
      if (modelCache.has(path)) {
        resolve()
        return
      }
      
      gltfLoader.load(
        path,
        (gltf) => {
          const model = gltf.scene
          if (model instanceof THREE.Object3D) {
            // Make materials opaque before caching
            makeMaterialsOpaque(model)
            modelCache.set(path, model)
          }
          resolve()
        },
        undefined,
        (error) => {
          console.error(`Error preloading ${path}:`, error)
          resolve() // Continue even if one fails
        }
      )
    })
  })
  
  await Promise.all(loadPromises)
}

const createObject = async (type: FallingObject['type'], x: number, y: number): Promise<THREE.Mesh | THREE.Group | THREE.Object3D> => {
  let geometry: THREE.BufferGeometry
  let material: THREE.MeshStandardMaterial

  switch (type) {
    case 'hamburger':
      try {
        const hamburgerModel = await loadGLBModel('/images/hamburger.glb')
        hamburgerModel.position.set(x, y, 0)
        hamburgerModel.scale.set(0.8, 0.8, 0.8) // Reduced scale for rain-like effect
        return hamburgerModel
      } catch (error) {
        // Fallback to primitive if model fails to load
        const burgerGroup = new THREE.Group()
        const topBun = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.3, 0.1, 8),
          new THREE.MeshStandardMaterial({ color: 0xffd700 })
        )
        topBun.rotation.x = Math.PI / 2
        topBun.position.y = 0.15
        const bottomBun = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.3, 0.1, 8),
          new THREE.MeshStandardMaterial({ color: 0xffd700 })
        )
        bottomBun.rotation.x = Math.PI / 2
        bottomBun.position.y = -0.15
        const patty = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.28, 0.08, 8),
          new THREE.MeshStandardMaterial({ color: 0x8b4513 })
        )
        patty.rotation.x = Math.PI / 2
        burgerGroup.add(topBun, bottomBun, patty)
        burgerGroup.position.set(x, y, 0)
        return burgerGroup as any
      }

    case 'money':
      try {
        const amazonLogoModel = await loadGLBModel('/images/amazon.glb')
        amazonLogoModel.position.set(x, y, 0)
        amazonLogoModel.scale.set(1, 1, 1) // Reduced scale for rain-like effect
        return amazonLogoModel
      } catch (error) {
        // Fallback to primitive if model fails to load
        geometry = new THREE.BoxGeometry(0.4, 0.2, 0.01)
        material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, y, 0)
        return mesh
      }

    case 'computer':
      try {
        const computerModel = await loadGLBModel('/images/computer.glb')
        computerModel.position.set(x, y, 0)
        computerModel.scale.set(0.8, 0.8, 0.8) // Reduced scale for rain-like effect
        return computerModel
      } catch (error) {
        // Fallback to primitive if model fails to load
        const laptopGroup = new THREE.Group()
        const laptopBase = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 0.3, 0.05),
          new THREE.MeshStandardMaterial({ color: 0x333333 })
        )
        laptopBase.position.y = -0.15
        const laptopScreen = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 0.3, 0.02),
          new THREE.MeshStandardMaterial({ color: 0x000000 })
        )
        laptopScreen.position.y = 0.15
        laptopScreen.rotation.x = -0.3
        laptopGroup.add(laptopBase, laptopScreen)
        laptopGroup.position.set(x, y, 0)
        return laptopGroup as any
      }

    case 'phone':
      try {
        const iphoneModel = await loadGLBModel('/images/iphone_14_pro.glb')
        iphoneModel.position.set(x, y, 0)
        iphoneModel.scale.set(0.6, 0.6, 0.6) // Reduced scale for rain-like effect
        return iphoneModel
      } catch (error) {
        // Fallback to primitive if model fails to load
        geometry = new THREE.BoxGeometry(0.15, 0.3, 0.05)
        material = new THREE.MeshStandardMaterial({ color: 0xffffff })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, y, 0)
        return mesh
      }

    case 'chips':
      try {
        const friggitriceModel = await loadGLBModel('/images/friggitrice.glb')
        friggitriceModel.position.set(x, y, 0)
        friggitriceModel.scale.set(1, 1, 1) // Reduced scale for rain-like effect
        return friggitriceModel
      } catch (error) {
        // Fallback to primitive if model fails to load
        geometry = new THREE.ConeGeometry(0.2, 0.4, 4)
        material = new THREE.MeshStandardMaterial({ color: 0xffa500 })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, y, 0)
        return mesh
      }

    case 'drink':
      try {
        const redbullModel = await loadGLBModel('/images/redbull.glb')
        redbullModel.position.set(x, y, 0)
        redbullModel.scale.set(0.5, 0.5, 0.5) // Reduced scale for rain-like effect
        return redbullModel
      } catch (error) {
        // Fallback to primitive if model fails to load
        geometry = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 8)
        material = new THREE.MeshStandardMaterial({ color: 0xff0000 })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, y, 0)
        return mesh
      }

    case 'plant':
      try {
        const plantModel = await loadGLBModel('/images/plant.glb')
        plantModel.position.set(x, y, 0)
        plantModel.scale.set(1.5, 1.5, 1.5) // Reduced scale for rain-like effect
        return plantModel
      } catch (error) {
        // Fallback to primitive if model fails to load
        geometry = new THREE.ConeGeometry(0.2, 0.5, 8)
        material = new THREE.MeshStandardMaterial({ color: 0x228b22 })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, y, 0)
        return mesh
      }

    default:
      geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3)
      material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  }

  if (geometry && material) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, 0)
    return mesh
  }
  
  // Fallback
  const fallbackMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.3, 0.3),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  )
  fallbackMesh.position.set(x, y, 0)
  return fallbackMesh
}

const checkCollision = (x: number, y: number, radius: number): boolean => {
  for (const obj of fallingObjects) {
    const dx = obj.mesh.position.x - x
    const dy = obj.mesh.position.y - y
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance < radius + obj.radius) {
      return true // Collision detected
    }
  }
  return false
}

const getObjectRadius = (type: FallingObject['type']): number => {
  // Approximate collision radius based on object type and scale (reduced for smaller objects)
  const baseRadii: Record<FallingObject['type'], number> = {
    'hamburger': 0.2,
    'money': 0.15,
    'phone': 0.1,
    'computer': 0.25,
    'chips': 0.15,
    'drink': 0.1, // Smaller for redbull
    'plant': 0.3  // Larger for plant
  }
  return baseRadii[type] || 0.15
}

const spawnObject = async () => {
  if (!sceneContainer.value) return

  const types: FallingObject['type'][] = ['hamburger', 'money', 'phone', 'computer', 'chips', 'drink', 'plant']
  const type = types[Math.floor(Math.random() * types.length)]
  
  const radius = getObjectRadius(type)
  let attempts = 0
  let x: number, y: number
  
  // Try to find a position without collision (max 20 attempts)
  // Increased minimum distance for rain-like spacing
  do {
    x = (Math.random() - 0.5) * 20
    y = 10
    attempts++
  } while (checkCollision(x, y, radius * 2.5) && attempts < 20)
  
  // If still colliding after max attempts, skip this spawn
  if (attempts >= 20 && checkCollision(x, y, radius * 2.5)) {
    return
  }
  
  try {
    const mesh = await createObject(type, x, y)
    if (mesh instanceof THREE.Object3D) {
      scene.add(mesh)
      
      fallingObjects.push({
        mesh: mesh,
        type,
        speed: 0.05 + Math.random() * 0.05,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        radius: radius
      })
    } else {
      console.error('Created object is not an Object3D:', mesh)
    }
  } catch (error) {
    console.error('Error creating object:', error)
  }
}

const initThree = () => {
  if (!sceneContainer.value) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  const width = sceneContainer.value.clientWidth
  const height = sceneContainer.value.clientHeight
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.set(0, 0, 10)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  sceneContainer.value.appendChild(renderer.domElement)

  // Initialize GLTF Loader
  gltfLoader = new GLTFLoader()

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  // Preload models, then spawn objects
  preloadModels().then(() => {
    // Spawn initial objects after models are loaded (reduced density for rain effect)
    for (let i = 0; i < 6; i++) {
      setTimeout(() => spawnObject(), i * 800)
    }
  })
}

const animate = () => {
  animationId = requestAnimationFrame(animate)

  // Update falling objects with collision detection
  for (let i = fallingObjects.length - 1; i >= 0; i--) {
    const obj = fallingObjects[i]
    const newY = obj.mesh.position.y - obj.speed
    
    // Check collision with other objects before moving
    let canMoveDown = true
    
    for (let j = 0; j < fallingObjects.length; j++) {
      if (i === j) continue
      const other = fallingObjects[j]
      const dx = other.mesh.position.x - obj.mesh.position.x
      const dy = other.mesh.position.y - newY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const minDistance = obj.radius + other.radius
      
      if (distance < minDistance) {
        
        // If collision is primarily vertical (object is above or below)
        if (Math.abs(dy) > Math.abs(dx)) {
          // Stop vertical movement
          canMoveDown = false
          
          // Push objects apart horizontally to prevent overlap
          if (Math.abs(dx) < minDistance) {
            const pushAmount = (minDistance - Math.abs(dx)) * 0.5
            const direction = dx > 0 ? 1 : -1
            obj.mesh.position.x -= pushAmount * direction * 0.3
            other.mesh.position.x += pushAmount * direction * 0.3
          }
        } else {
          // Collision is primarily horizontal - push apart
          const pushAmount = (minDistance - distance) * 0.5
          const direction = dx > 0 ? 1 : -1
          obj.mesh.position.x -= pushAmount * direction * 0.3
          other.mesh.position.x += pushAmount * direction * 0.3
          
          // Also check if we can still move down
          const newDy = other.mesh.position.y - newY
          const newDistance = Math.sqrt(dx * dx + newDy * newDy)
          if (newDistance < minDistance) {
            canMoveDown = false
          }
        }
      }
    }
    
    // Only move down if no collision detected
    if (canMoveDown) {
      obj.mesh.position.y = newY
    }
    
    obj.mesh.rotation.x += obj.rotationSpeed
    obj.mesh.rotation.y += obj.rotationSpeed

    // Remove if off screen
    if (obj.mesh.position.y < -10) {
      scene.remove(obj.mesh)
      
      // Dispose properly for both Mesh and Group
      const disposeObject = (object: THREE.Object3D) => {
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) {
              child.geometry.dispose()
            }
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat) => mat.dispose())
              } else {
                child.material.dispose()
              }
            }
          }
        })
      }
      
      disposeObject(obj.mesh)
      fallingObjects.splice(i, 1)
    }
  }

  // Spawn new objects randomly (reduced frequency for rain-like effect)
  if (Math.random() < 0.006) {
    spawnObject()
  }

  renderer.render(scene, camera)
}

const handleResize = () => {
  if (!sceneContainer.value || !camera || !renderer) return

  const width = sceneContainer.value.clientWidth
  const height = sceneContainer.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(() => {
  initThree()
  animate()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)

  // Cleanup
  const disposeObject = (object: THREE.Object3D) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) {
          child.geometry.dispose()
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose())
          } else {
            child.material.dispose()
          }
        }
      }
    })
  }
  
  fallingObjects.forEach(obj => {
    scene.remove(obj.mesh)
    disposeObject(obj.mesh)
  })

  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style scoped>
.lowtech-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.back-button {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  background: transparent;
  border: none;
  color: #ffffff;
  font-family: 'VT323', monospace;
  font-size: 1em;
  cursor: pointer;
  padding: 0.5rem;
  letter-spacing: 1px;
  transition: opacity 0.2s ease;
}

.back-button:hover {
  opacity: 0.7;
}

.scene-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
}

.button-section {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
  pointer-events: none;
}

.terminal-window {
  background: transparent;
  border: 2px solid;
  border-color: rgba(255, 255, 255, 0.8) rgba(128, 128, 128, 0.8) rgba(128, 128, 128, 0.8) rgba(255, 255, 255, 0.8);
  box-shadow: 
    inset -1px -1px 0 rgba(0, 0, 0, 0.5),
    inset 1px 1px 0 rgba(255, 255, 255, 0.5),
    2px 2px 0 rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  min-width: 500px;
  pointer-events: auto;
  backdrop-filter: blur(10px);
  animation: terminalPulse 1s ease-in-out infinite;
}

.terminal-titlebar {
  background: linear-gradient(to bottom, #000080, #000080);
  color: #ffffff;
  padding: 2px 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'MS Sans Serif', sans-serif;
  font-size: 11px;
  font-weight: bold;
  height: 18px;
  border-bottom: 1px solid #000000;
  user-select: none;
}

.terminal-title {
  flex: 1;
  padding-left: 2px;
}

.terminal-buttons {
  display: flex;
  gap: 2px;
}

.terminal-btn {
  width: 16px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #c0c0c0;
  border: 1px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  color: #000000;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  line-height: 1;
}

.terminal-btn:hover {
  background: #d4d0c8;
}

.terminal-btn.close {
  font-size: 12px;
}

.terminal-content {
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  border: 1px inset rgba(128, 128, 128, 0.5);
}

.game-title {
  font-family: 'VT323', monospace;
  font-size: 2.2em;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 
    3px 3px 0 rgba(0, 0, 0, 0.8),
    5px 5px 0 rgba(0, 0, 0, 0.6),
    0 0 10px rgba(255, 255, 255, 0.3);
  letter-spacing: 3px;
  margin: 0;
  margin-bottom: 1rem;
  text-align: center;
  animation: titleGlow 2s ease-in-out infinite;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow: 
      3px 3px 0 rgba(0, 0, 0, 0.8),
      5px 5px 0 rgba(0, 0, 0, 0.6),
      0 0 10px rgba(255, 255, 255, 0.3);
  }
  50% {
    text-shadow: 
      3px 3px 0 rgba(0, 0, 0, 0.8),
      5px 5px 0 rgba(0, 0, 0, 0.6),
      0 0 20px rgba(255, 255, 255, 0.5),
      0 0 30px rgba(255, 255, 255, 0.3);
  }
}

body.theme-day .game-title {
  color: #1a1a1a;
  text-shadow: 
    3px 3px 0 rgba(255, 255, 255, 0.8),
    5px 5px 0 rgba(255, 255, 255, 0.6),
    0 0 10px rgba(0, 0, 0, 0.2);
  animation: titleGlowDay 2s ease-in-out infinite;
}

@keyframes titleGlowDay {
  0%, 100% {
    text-shadow: 
      3px 3px 0 rgba(255, 255, 255, 0.8),
      5px 5px 0 rgba(255, 255, 255, 0.6),
      0 0 10px rgba(0, 0, 0, 0.2);
  }
  50% {
    text-shadow: 
      3px 3px 0 rgba(255, 255, 255, 0.9),
      5px 5px 0 rgba(255, 255, 255, 0.7),
      0 0 20px rgba(0, 0, 0, 0.3),
      0 0 30px rgba(0, 0, 0, 0.2);
  }
}

.button-section > * {
  pointer-events: auto;
}

.play-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  border: 3px solid #ffffff;
  border-style: solid;
  color: #ffffff;
  font-family: 'VT323', monospace;
  font-size: 1.1em;
  font-weight: bold;
  letter-spacing: 2px;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  animation: retroBlink 1.2s ease-in-out infinite;
  box-shadow: 
    0 0 0 2px rgba(255, 255, 255, 0.3),
    0 3px 0 0 rgba(0, 0, 0, 0.8),
    0 5px 0 0 rgba(0, 0, 0, 0.6),
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    inset 0 -2px 4px rgba(0, 0, 0, 0.4);
  text-shadow: 
    2px 2px 0 rgba(0, 0, 0, 0.8),
    3px 3px 0 rgba(0, 0, 0, 0.6);
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  position: relative;
  width: 280px;
  justify-content: center;
  backdrop-filter: blur(5px);
}

.play-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
  pointer-events: none;
  opacity: 0.3;
}

.play-button:hover {
  transform: translate(2px, 2px);
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 
    0 0 0 2px rgba(255, 255, 255, 0.5),
    0 2px 0 0 rgba(0, 0, 0, 0.8),
    0 3px 0 0 rgba(0, 0, 0, 0.6),
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.4);
  animation: retroBlink 0.8s ease-in-out infinite;
}

.offline-btn {
  background: rgba(0, 0, 0, 0.5);
  border: 3px solid #ffffff;
  box-shadow: 
    0 0 0 2px rgba(255, 255, 255, 0.3),
    0 3px 0 0 rgba(0, 0, 0, 0.8),
    0 5px 0 0 rgba(0, 0, 0, 0.6),
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    inset 0 -2px 4px rgba(0, 0, 0, 0.4);
  text-shadow: 
    2px 2px 0 rgba(0, 0, 0, 0.8),
    3px 3px 0 rgba(0, 0, 0, 0.6);
  width: 280px;
}

.offline-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 
    0 0 0 2px rgba(255, 255, 255, 0.5),
    0 2px 0 0 rgba(0, 0, 0, 0.8),
    0 3px 0 0 rgba(0, 0, 0, 0.6),
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.4);
}

@keyframes retroBlink {
  0%, 100% {
    opacity: 1;
    filter: brightness(1);
  }
  25% {
    opacity: 0.85;
    filter: brightness(1.1);
  }
  50% {
    opacity: 1;
    filter: brightness(1);
  }
  75% {
    opacity: 0.9;
    filter: brightness(1.05);
  }
}

@keyframes terminalPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.button-text {
  letter-spacing: 1px;
}

/* Day theme styles */
body.theme-day .back-button {
  color: #ffffff;
}

body.theme-day .terminal-window {
  background: rgba(192, 192, 192, 0.85);
  border-color: rgba(255, 255, 255, 0.8) rgba(128, 128, 128, 0.8) rgba(128, 128, 128, 0.8) rgba(255, 255, 255, 0.8);
}

body.theme-day .terminal-titlebar {
  background: linear-gradient(to bottom, #000080, #000080);
  color: #ffffff;
}

body.theme-day .terminal-content {
  background: rgba(244, 240, 229, 0.7);
  border: 1px inset rgba(128, 128, 128, 0.5);
}

body.theme-day .play-button {
  background: rgba(244, 240, 229, 0.5);
  border: 3px solid #1a1a1a;
  color: #1a1a1a;
  box-shadow: 
    0 0 0 2px rgba(26, 26, 26, 0.3),
    0 3px 0 0 rgba(0, 0, 0, 0.8),
    0 5px 0 0 rgba(0, 0, 0, 0.6),
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  text-shadow: 
    2px 2px 0 rgba(255, 255, 255, 0.8),
    3px 3px 0 rgba(255, 255, 255, 0.6);
}

body.theme-day .play-button:hover {
  background: rgba(244, 240, 229, 0.7);
  box-shadow: 
    0 0 0 2px rgba(26, 26, 26, 0.5),
    0 2px 0 0 rgba(0, 0, 0, 0.8),
    0 3px 0 0 rgba(0, 0, 0, 0.6),
    inset 0 2px 4px rgba(255, 255, 255, 0.4),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2);
}

body.theme-day .offline-btn {
  background: rgba(244, 240, 229, 0.5);
  border: 3px solid #1a1a1a;
  color: #1a1a1a;
  box-shadow: 
    0 0 0 2px rgba(26, 26, 26, 0.3),
    0 3px 0 0 rgba(0, 0, 0, 0.8),
    0 5px 0 0 rgba(0, 0, 0, 0.6),
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  text-shadow: 
    2px 2px 0 rgba(255, 255, 255, 0.8),
    3px 3px 0 rgba(255, 255, 255, 0.6);
}

body.theme-day .offline-btn:hover {
  background: rgba(244, 240, 229, 0.7);
  box-shadow: 
    0 0 0 2px rgba(26, 26, 26, 0.5),
    0 2px 0 0 rgba(0, 0, 0, 0.8),
    0 3px 0 0 rgba(0, 0, 0, 0.6),
    inset 0 2px 4px rgba(255, 255, 255, 0.4),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2);
}
</style>

