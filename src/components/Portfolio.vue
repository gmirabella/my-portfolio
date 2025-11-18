<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { projects as projectsData } from '../data/projects'
import type { Project } from '../data/projects'
import { useTheme } from '../composables/useTheme'
import FooterLinks from './FooterLinks.vue'

const router = useRouter()
const projects = ref<Project[]>(projectsData)

// Theme toggle via composable
const { isNight, toggleTheme } = useTheme()

// Handle click on media: if no local file, toggle embedded video
const handleMediaClick = (project: Project) => {
  console.log("Clicked project:", project.title)
  console.log("Project has route:", !!project.route)
  console.log("Project has file:", !!project.file)
  console.log("Project has youtubeId:", !!project.youtubeId)
  console.log("Project has videoFile:", !!project.videoFile)
  
  // If project has a route, navigate to it
  if (project.route) {
    router.push(project.route)
    return
  }
  
  if (project.file) {
    // Open the file in a new tab
    console.log("Opening file:", project.file)
    window.open(project.file, '_blank')
  } else if (project.youtubeId || project.link) {
    // For YouTube videos, open YouTube directly
    const youtubeUrl = project.youtubeId 
      ? `https://www.youtube.com/watch?v=${project.youtubeId}`
      : project.link
    console.log("Opening YouTube:", youtubeUrl)
    window.open(youtubeUrl, '_blank')
  } else if (project.videoFile) {
    // For video files without YouTube, open the video file in a new tab
    console.log("Opening video file:", project.videoFile)
    window.open(project.videoFile, '_blank')
  }
}
</script>

<template>
  <div class="lowtech-container">
    <button class="theme-toggle" :class="{ 'is-night': isNight }" @click="toggleTheme" aria-label="Toggle theme">
      <span class="toggle-track"><span class="toggle-thumb"></span></span>
      <span class="toggle-text">
        <span class="label-day">DAY</span>
        <span class="sep">|</span>
        <span class="label-night">NIGHT</span>
      </span>
    </button>
    <!-- Header con nav -->
    <header class="header-container">
      <div class="header-content">
        <div class="title-container">
          <h1 class="retro-title">/usr/grza/website</h1>
          <p class="subtitle">
            <span class="typing-text">Sketching dreams.</span>
            <span class="typing-text">Crafting code.</span> 
            <span class="typing-text">Learning things.</span>
          </p>
        </div>
      </div>
    </header>

    <!-- Contenuto principale -->
    <main>
      <div class="projects-container">
        <div class="projects-grid">
          <article 
            v-for="project in projects" 
            :key="project.id" 
            class="project-card"
          >
            <h2>{{ project.title }}</h2>
 
            <template v-if="project.file && !project.videoFile">
              <div class="media-container">
                <a 
                  :href="project.file"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="video-frame"
                >
                  <img 
                    :src="project.posterImage" 
                    :alt="project.title" 
                    class="poster-image"
                  >
                </a>
              </div>
            </template>

            <template v-else>
              <div 
                class="media-container clickable"
                @click="handleMediaClick(project)"
              >
                <!-- Video file with autoplay and loop -->
                <video 
                  v-if="project.videoFile"
                  :src="project.videoFile"
                  autoplay
                  loop
                  muted
                  playsinline
                  class="video-frame"
                  @click="handleMediaClick(project)"
                ></video>
                
                <!-- Poster image for other projects -->
                <img 
                  v-else-if="project.posterImage" 
                  :src="project.posterImage" 
                  :alt="project.title"
                  class="poster-image"
                  loading="lazy"
                >
                
                <!-- Placeholder for projects with route or link but no media -->
                <div 
                  v-else-if="project.route || project.link"
                  class="route-placeholder"
                >
                  Click to view →
                </div>
              </div>
            </template>
 
            <p class="project-description">{{ project.description }}</p>
            <p class="project-tools">{{ project.tools }}</p>
          </article>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer-container">
      <div class="footer-content">
        <FooterLinks />
        
      </div>
    </footer>
  </div>
</template>
