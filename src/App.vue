# App.vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { projects as projectsData } from './data/projects'
import type { Project } from './data/projects'
import { useTheme } from './composables/useTheme'
import FooterLinks from './components/FooterLinks.vue'

// Handle click on media: if no local file, toggle embedded video
const handleMediaClick = (project: Project) => {
  console.log("Clicked project:", project.title)
  if (project.file) {
    // Open the file in a new tab
    window.open(project.file, '_blank')
  } else if (project.videoFile) {
    // For video files, open the video file in a new tab
    window.open(project.videoFile, '_blank')
  } else {
    console.log("Toggling video for project ID:", project.id)
    toggleVideo(project.id)
  }
}

const projects = ref<Project[]>(projectsData)

const isVideoPlaying = ref<Record<number, boolean>>({})

// Theme toggle via composable
const { isNight, toggleTheme } = useTheme()

onMounted(() => {
  // Theme initialization handled inside useTheme composable
})

const toggleVideo = (projectId: number) => {
  isVideoPlaying.value[projectId] = !isVideoPlaying.value[projectId]
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
                ></video>
                
                <!-- Poster image for other projects -->
                <img 
                  v-else-if="!isVideoPlaying[project.id] && project.posterImage" 
                  :src="project.posterImage" 
                  :alt="project.title"
                  class="poster-image"
                  loading="lazy"
                >
                
                <!-- YouTube iframe -->
                <iframe 
                  v-else-if="project.youtubeId || project.link"
                  :src="project.youtubeId 
                    ? `https://www.youtube.com/embed/${project.youtubeId}` 
                    : project.link"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  class="video-frame"
                ></iframe>
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
