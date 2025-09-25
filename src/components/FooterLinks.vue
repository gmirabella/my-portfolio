<script setup lang="ts">
import { footerLinks } from '../data/links'
</script>

<template>
  <div class="terminal-section">
    <div class="terminal-grid">
      <a
        v-for="link in footerLinks"
        :key="link.label"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        class="terminal-link"
      >
        <span class="terminal-icon">></span>
        <span class="terminal-text" :data-text="link.label">{{ link.label }}</span>
        <span class="terminal-plus">+</span>
      </a>
    </div>
  </div>
</template>


