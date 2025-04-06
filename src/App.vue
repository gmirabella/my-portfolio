# App.vue
<script setup>
import { ref, onMounted, computed } from 'vue'

const handleMediaClick = (project) => {
  console.log("Clicked project:", project.title)
  if (!project.file) {
    console.log("Toggling video for project ID:", project.id)
    toggleVideo(project.id)
  } else {
    console.log("Project has a file, skipping toggle.")
  }
}

const projects = ref([
  {
    id: 0,
    title: 'Boring Day #1 - Comics',
    description: 'Clip Studio Paint - Comic Course.',
    posterImage: '/images/boring.png',
    file: '/boring-day.jpg'
    // link: 'https://www.webtoons.com/en/canvas/boring-day/boring-day/viewer?title_no=1040158&episode_no=1'
  },
{
    id: 1,
    title: 'Now - Short Animation',
    description: 'Traditional Frame by Frame Animation inspired by Perfect Days.',
    posterImage: '/images/now.png',
    youtubeId: '99q9iHmjKlM'
  },
  {
    id: 2,
    title: 'Well - Short Animation',
    description: 'Traditional Frame by Frame Animation + Runway Gen Turbo AI (Experimental).',
    posterImage: '/images/well-1.png',
    youtubeId: 'WE7KpbhNgRE'
  },
  {
    id: 3,
    title: 'Oasi Meccanica - One Year Later',
    description: 'Midjourney + RunwayGen3 Project.',
    posterImage: '/images/building.png',
    youtubeId: 'JOucMxN4gEU'
  },

  {
    id: 4,
    title: 'Born - Very Short Animation',
    description: 'Traditional Frame by Frame Animation (Learning Course Adobe Animate).',
    posterImage: '/images/born.png',
    youtubeId: 'Kwc8WceOHlQ'
  },
  {
    id: 5,
    title: 'Ring of Fire',
    description: 'Midjourney + RunwayGen2 Project.',
    posterImage: '/images/cyborg.png',
    youtubeId: 'woDz7LheeGc'
  },
  {
    id: 6,
    title: 'Letter To Human',
    description: 'Midjourney + RunwayGen2 + Pika + Eleven Lab Project.',
    posterImage: '/images/robot-yellow.png',
    youtubeId: '0YGF0MVKbvc'
  },
  {
    id: 7,
    title: 'Visit Macondo [A Midjourney Experiment]',
    description: 'Midjourney V5 project.',
    posterImage: '/images/woman.png',
    youtubeId: 'whZD8iQOgFM'
  },
  {
    id: 8,
    title: 'Tastless Chambella',
    description: 'Blender 3d project',
    posterImage: '/images/chambella.png'
  },
  {
    id: 9,
    title: 'Famagosta - Music WebGame',
    description: 'Unity 3D WebGame.',
    posterImage: '/images/famagosta.png',
    youtubeId: 'cZKE2LGt6A0'
  },
  {
    id: 10,
    title: 'D.O.A - Music Video',
    description: 'Final Cut Project',
    posterImage: '/images/doa.png',
    youtubeId: 's61KB93Yi-c'
  }
])

const isVideoPlaying = ref({})
const pageSize = ref('0')
const co2Emission = ref('0')

const calculateCO2 = (size) => {
  return (size * 0.2).toFixed(2)
}

onMounted(() => {
  const pageContent = document.documentElement.innerHTML
  const blob = new Blob([pageContent], { type: 'text/html' })
  pageSize.value = Math.round(blob.size / 1024)
  co2Emission.value = calculateCO2(pageSize.value)
})

const toggleVideo = (projectId) => {
  isVideoPlaying.value[projectId] = !isVideoPlaying.value[projectId]
}
</script>

<template>
  <div class="lowtech-container">
    <!-- Header con nav -->
    <header class="header-container">
      <div class="header-content">
        <div class="title-container">
          <h1 class="retro-title">/usr/grza/portfolio</h1>
          <p class="subtitle">
            <span class="typing-text">Sketching dreams.</span>
            <span class="typing-text">Crafting code.</span>
            <span class="typing-text">Eternal writer.</span>
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
 
            <template v-if="project.file">
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
                <img 
                  v-if="!isVideoPlaying[project.id]" 
                  :src="project.posterImage" 
                  :alt="project.title"
                  class="poster-image"
                  loading="lazy"
                >
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
          </article>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer-container">
      <div class="footer-content">
        <div class="terminal-section">
          <div class="terminal-grid">
            <a href="https://www.linkedin.com/in/grazianamirabella/" target="_blank" class="terminal-link">
              <span class="terminal-icon">></span>
              <span class="terminal-text" data-text="LINKEDIN">LINKEDIN</span>
              <span class="terminal-plus">+</span>
            </a>
            <a href="https://www.instagram.com/gra_kub/" target="_blank" class="terminal-link">
              <span class="terminal-icon">></span>
              <span class="terminal-text" data-text="INSTAGRAM">INSTAGRAM</span>
              <span class="terminal-plus">+</span>
            </a>
            <a href="https://github.com/gmirabella" target="_blank" class="terminal-link">
              <span class="terminal-icon">></span>
              <span class="terminal-text" data-text="GITHUB">GITHUB</span>
              <span class="terminal-plus">+</span>
            </a>
            <a href="https://grzak.artstation.com/" target="_blank" class="terminal-link">
              <span class="terminal-icon">></span>
              <span class="terminal-text" data-text="ARTSTATION">ARTSTATION</span>
              <span class="terminal-plus">+</span>
            </a>
            <a href="/resume.pdf" target="_blank" class="terminal-link">
              <span class="terminal-icon">></span>
              <span class="terminal-text" data-text="RESUME.exe">RESUME.exe</span>
              <span class="terminal-plus">+</span>
            </a>
          </div>
        </div>
        
        <div class="sustainability-info">
          <small>
            <span class="tech-info">Page size: {{ pageSize }} KB</span>
            <span class="tech-info">Estimated CO2: {{ co2Emission }}g</span>
          </small>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=VT323&family=Press+Start+2P&display=swap');

/* Reset CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Base styles */
body {
  font-family: 'VT323', monospace;
  line-height: 1.6;
  background: #f4f0e5;
  color: #1a1a1a;
  min-height: 100vh;
}

/* CRT Effect */
.lowtech-container {
  min-height: 100vh;
  background: #f4f0e5;
  position: relative;
  width: 80%;
  margin: 0 auto;
  border-left: 1px solid rgba(0,0,0,0.1);
  border-right: 1px solid rgba(0,0,0,0.1);
  overflow: hidden;
}

.lowtech-container::before {
  content: "";
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.03) 0px,
    rgba(0, 0, 0, 0.03) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 10;
  animation: scanline 10s linear infinite;
  opacity: 0.3;
}

.lowtech-container::after {
  content: "";
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 100%
  );
  pointer-events: none;
  z-index: 9;
  opacity: 0.3;
}

@keyframes scanline {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100vh);
  }
}

/* Header styles */
.header-container {
  width: 100%;
  border-bottom: 2px dashed #1a1a1a;
  padding: 2rem;
  background: #f4f0e5;
  text-align: center;
}

.header-content {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 80%;
  margin: 0 auto;
  width: 100%;
}

.title-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

/* Stile aggiornato del titolo */
.retro-title {
  font-family: 'VT323', monospace;
  font-size: 5em;
  color: #1a1a1a;
  letter-spacing: 1px;
  position: relative;
}

.cursor {
  display: inline-block;
  width: 12px;
  height: 24px;
  background: #1a1a1a;
  margin-left: 4px;
  animation: blink 1s step-start infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.subtitle {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: 'VT323', monospace;
  font-size: 1.5em;
  letter-spacing: 1px;
}

.typing-text {
  display: inline-block;
  overflow: hidden;
  border-right: 2px solid #1a1919;
  white-space: nowrap;
  animation: typing 3.5s steps(40, end),
             blink-caret 0.75s step-end infinite;
  margin: 0;
}

.typing-text:nth-child(2) {
  animation-delay: 3.5s;
}

.typing-text:nth-child(3) {
  animation-delay: 7s;
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: #1a1a1a }
}

/* Projects Grid */
.projects-container {
  width: 100%;
  margin: 2rem auto;
  padding: 1rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

/* Common bitmap background */
body, 
.header-container,
.project-card,
.footer-container {
  background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
  background-color: #f4f0e5;
}

.project-card h2 {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.8em;
  margin-bottom: 1.2rem;
  line-height: 1.5;
  font-weight: normal;
}

.project-description {
  font-family: 'VT323', monospace;
  font-size: 1.3em;
  line-height: 1.3;
  letter-spacing: 0.5px;
  font-weight: normal;
}

.media-container {
  margin: 1rem 0;
  cursor: pointer;
  border: 3px solid #1a1a1a;
  /* filter: grayscale(100%) contrast(1.2); */
}

.poster-image,
.video-frame {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  /* filter: grayscale(100%) contrast(1.2); */
}

/* Footer styles */
.footer-container {
  width: 100%;
  padding: 2rem;
  background: #f4f0e5;
  border-top: 2px dashed #1a1a1a;
  margin-top: 2rem;
}

.footer-content {
  max-width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.terminal-section {
  width: 100%;
  padding: 2rem 0;
}

.terminal-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}

.terminal-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1a1a1a;
  text-decoration: none;
  font-family: 'VT323', monospace;
  font-size: 1.1em;
  padding: 0.5rem;
  position: relative;
  overflow: hidden;
}

.terminal-icon {
  font-family: monospace;
  opacity: 0.7;
}

.terminal-text {
  letter-spacing: 1px;
  position: relative;
  transition: all 0.2s ease;
}

.terminal-text::before {
  content: attr(data-text);
  position: absolute;
  left: -2px;
  text-shadow: 2px 0 #ff0000;
  top: 0;
  color: #1a1a1a;
  background: #f4f0e5;
  overflow: hidden;
  clip: rect(0, 900px, 0, 0);
  animation: noise-anim-2 3s infinite linear alternate-reverse;
}

.terminal-text::after {
  content: attr(data-text);
  position: absolute;
  left: 2px;
  text-shadow: -2px 0 #00ff00;
  top: 0;
  color: #1a1a1a;
  background: #f4f0e5;
  overflow: hidden;
  clip: rect(0, 900px, 0, 0);
  animation: noise-anim 2s infinite linear alternate-reverse;
}

.terminal-plus {
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.terminal-link:hover {
  background: rgba(0, 0, 0, 0.05);
}

.terminal-link:hover .terminal-plus {
  opacity: 1;
}

.terminal-link:hover .terminal-text,
.terminal-link:hover .terminal-icon {
  animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
}

@keyframes glitch {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}

@keyframes noise-anim {
  0% {
    clip: rect(51px, 9999px, 28px, 0);
  }
  5% {
    clip: rect(70px, 9999px, 19px, 0);
  }
  10% {
    clip: rect(92px, 9999px, 13px, 0);
  }
  15% {
    clip: rect(85px, 9999px, 49px, 0);
  }
  20% {
    clip: rect(45px, 9999px, 56px, 0);
  }
  25% {
    clip: rect(26px, 9999px, 31px, 0);
  }
  30% {
    clip: rect(62px, 9999px, 73px, 0);
  }
  35% {
    clip: rect(34px, 9999px, 11px, 0);
  }
  40% {
    clip: rect(26px, 9999px, 61px, 0);
  }
  45% {
    clip: rect(34px, 9999px, 71px, 0);
  }
  50% {
    clip: rect(35px, 9999px, 69px, 0);
  }
  55% {
    clip: rect(92px, 9999px, 81px, 0);
  }
  60% {
    clip: rect(26px, 9999px, 87px, 0);
  }
  65% {
    clip: rect(47px, 9999px, 35px, 0);
  }
  70% {
    clip: rect(68px, 9999px, 91px, 0);
  }
  75% {
    clip: rect(67px, 9999px, 84px, 0);
  }
  80% {
    clip: rect(38px, 9999px, 92px, 0);
  }
  85% {
    clip: rect(92px, 9999px, 64px, 0);
  }
  90% {
    clip: rect(26px, 9999px, 77px, 0);
  }
  95% {
    clip: rect(6px, 9999px, 46px, 0);
  }
  100% {
    clip: rect(75px, 9999px, 65px, 0);
  }
}

@keyframes noise-anim-2 {
  0% {
    clip: rect(16px, 9999px, 10px, 0);
  }
  5% {
    clip: rect(75px, 9999px, 35px, 0);
  }
  10% {
    clip: rect(27px, 9999px, 89px, 0);
  }
  15% {
    clip: rect(89px, 9999px, 55px, 0);
  }
  20% {
    clip: rect(75px, 9999px, 15px, 0);
  }
  25% {
    clip: rect(45px, 9999px, 66px, 0);
  }
  30% {
    clip: rect(85px, 9999px, 85px, 0);
  }
  35% {
    clip: rect(40px, 9999px, 29px, 0);
  }
  40% {
    clip: rect(45px, 9999px, 23px, 0);
  }
  45% {
    clip: rect(69px, 9999px, 85px, 0);
  }
  50% {
    clip: rect(50px, 9999px, 85px, 0);
  }
  55% {
    clip: rect(26px, 9999px, 45px, 0);
  }
  60% {
    clip: rect(90px, 9999px, 76px, 0);
  }
  65% {
    clip: rect(20px, 9999px, 35px, 0);
  }
  70% {
    clip: rect(45px, 9999px, 26px, 0);
  }
  75% {
    clip: rect(92px, 9999px, 75px, 0);
  }
  80% {
    clip: rect(60px, 9999px, 25px, 0);
  }
  85% {
    clip: rect(89px, 9999px, 81px, 0);
  }
  90% {
    clip: rect(96px, 9999px, 55px, 0);
  }
  95% {
    clip: rect(21px, 9999px, 42px, 0);
  }
  100% {
    clip: rect(69px, 9999px, 35px, 0);
  }
}

.sustainability-info {
  text-align: center;
  font-family: 'VT323', monospace;
  border-top: 1px solid rgba(26, 26, 26, 0.2);
  padding-top: 0.5rem;
  width: 100%;
}

.tech-info {
  font-size: 0.8em;
  color: #666;
  margin: 0 0.5rem;
}

@media (max-width: 768px) {
  .terminal-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .terminal-grid {
    grid-template-columns: 1fr;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .retro-title {
    font-size: 2.5em;
  }
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .social-links {
    flex-wrap: wrap;
  }

  .lowtech-container {
    width: 95%;
  }
  
  .retro-title {
    font-size: 2em;
  }
}
</style>
/* Added clickable media-container styles */
.media-container.clickable {
  cursor: pointer;
}
.media-container:not(.clickable) {
  cursor: default;
}