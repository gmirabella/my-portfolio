# CLAUDE.md - Portfolio Project Documentation

> **Last Updated**: March 23, 2026
> **For**: Claude Code and AI Assistants
> **Project**: Vue 3 Portfolio with Brutalist 2026 Aesthetic

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Initial Setup:**
- Node.js 18+ required
- If you encounter Sharp installation issues on M1/M2 Mac: `npm install --force`
- No environment variables required for basic development
- Optional: Create `.env` for custom configuration (see Configuration section)

---

## Project Overview

### Tech Stack

- **Framework**: Vue 3.5.13 (Composition API with `<script setup>`)
- **Language**: TypeScript 5.6.3 (strict mode enabled)
- **Build Tool**: Vite 6.0.5
- **Router**: Vue Router 4.6.3
- **Styling**: Tailwind CSS 3.4.17 + Custom CSS (hybrid approach)
- **3D Graphics**: Three.js 0.181.0 (WebGL effects)
- **Package Type**: ES Modules

### Architecture Pattern

- **Component Style**: Single File Components (SFC) with `<script setup>` TypeScript
- **State Management**: Composables (no Vuex/Pinia) - see `useTheme.ts`
- **Data Structure**: Centralized project data in `/src/data/projects.ts`
- **Routing**: Client-side routing with lazy-loaded components
- **No Prop Drilling**: Use composables for shared state across components

### Design Philosophy: Brutalist 2026

**Core Principles:**
- **Raw Structure**: Exposed grids, honest HTML hierarchy, asymmetric layouts
- **System Fonts**: No web fonts - Arial, Helvetica, system font stack only
- **High Contrast**: Pure black (#000000) and white (#FFFFFF), raw grays
- **Solid Borders**: Thick (4-8px), solid, no border-radius
- **Zero Animations**: No decorative effects, only essential 0.2s transitions
- **Bold Typography**: Heavy weights (700-900), large sizes, tight letter-spacing
- **Functional Over Aesthetic**: Anti-decorative, content-first approach

---

## File Structure

```
my-portfolio/
├── src/
│   ├── components/           # Vue Single File Components (6 total)
│   │   ├── Portfolio.vue     # Main portfolio grid (CRITICAL - has media routing logic)
│   │   ├── LandingPage.vue   # Entry point with WebGL background
│   │   ├── WebGLText.vue     # Three.js brutalist geometric rendering
│   │   ├── FooterLinks.vue   # Footer with social/career links
│   │   ├── CapitalismSimulator.vue        # Interactive game (external link)
│   │   └── CapitalistRealismRPG.vue       # Interactive RPG game
│   ├── composables/          # Reusable composition functions
│   │   └── useTheme.ts       # Theme toggle (night/day) with localStorage
│   ├── data/                 # Centralized data files
│   │   ├── projects.ts       # Project definitions with type safety
│   │   └── links.ts          # Social and career links
│   ├── assets/
│   │   └── vue.svg           # Static assets
│   ├── App.vue               # Root component (router outlet only)
│   ├── main.ts               # Application entry point + routing setup
│   ├── style.css             # CRITICAL: Primary styling (brutalist aesthetic)
│   └── vite-env.d.ts         # Vite type definitions
├── public/                   # Static assets served as-is
│   ├── images/               # 48+ portfolio media files (videos, images)
│   ├── boring-day.jpg        # Background/hero image
│   ├── dot.svg               # Favicon
│   └── resume.pdf            # Downloadable resume
├── dist/                     # Production build output (not in repo)
├── vite.config.ts            # Vite build configuration (IMPORTANT: manual chunks)
├── tsconfig.json             # TypeScript root config (STRICT mode)
├── tsconfig.app.json         # App-specific TS config
├── tsconfig.node.json        # Node/build tools TS config
├── tailwind.config.js        # Tailwind CSS configuration (brutalist tokens)
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (optional, not in repo)
└── CLAUDE.md                 # This file
```

---

## Development Conventions

### Vue 3 Patterns

**Composition API with `<script setup>`:**
```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { Project } from '../data/projects'

const projects = ref<Project[]>(projectsData)
</script>
```

**Composables for Shared State:**
```typescript
// useTheme.ts pattern
export function useTheme() {
  const isNight = ref(true)
  const toggleTheme = () => { /* ... */ }
  return { isNight, toggleTheme }
}
```

**No Prop Drilling:**
- Use composables (like `useTheme`) for cross-component state
- Import composable directly in any component that needs it
- Avoid passing props through multiple component levels

### TypeScript Conventions

**Strict Mode Enabled:**
- `noUnusedLocals: true` - Build fails with unused variables
- `noUnusedParameters: true` - Build fails with unused function parameters
- `noFallthroughCasesInSwitch: true` - Validate switch statements
- **NEVER use `as any`** - Use type guards or proper interfaces instead

**Type Definitions:**
```typescript
// Good: Explicit types
type Project = {
  id: number;
  title: string;
  description: string;
  tools?: string;
  posterImage?: string;
  videoFile?: string;
  youtubeId?: string;
  file?: string;
  link?: string;
  route?: string;
};

// Bad: Type casting
const data = rawData as any // ❌ Never do this
```

### Styling Approach

**Hybrid: Tailwind Utilities + Custom CSS**

- **Tailwind for**: Layout (grid, flex), spacing, responsive breakpoints
- **Custom CSS for**: Typography, brutalist-specific styles, theme overrides

**Example:**
```vue
<template>
  <!-- Tailwind utilities for layout -->
  <div class="max-w-[1200px] mx-auto px-lg py-xl">
    <!-- Custom CSS class for brutalist styling -->
    <div class="brutalist-project-grid">
      <!-- ... -->
    </div>
  </div>
</template>

<style>
/* Custom CSS in style.css */
.brutalist-project-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr; /* Asymmetric! */
  border: var(--border-width) solid var(--color-border);
}
</style>
```

---

## Design System

### CSS Variables (`:root` in style.css)

```css
:root {
  /* Typography */
  --font-system: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  --font-heading: "Helvetica Neue", "Arial Black", Arial, sans-serif;

  /* Colors - Night Theme (Default) */
  --color-bg: #000000;
  --color-text: #FFFFFF;
  --color-border: #FFFFFF;
  --color-accent: #666666;

  /* Spacing */
  --space-sm: 16px;
  --space-md: 32px;
  --space-lg: 48px;
  --space-xl: 64px;

  /* Borders */
  --border-width: 4px;
  --border-thick: 8px;
}

body.theme-day {
  --color-bg: #FFFFFF;
  --color-text: #000000;
  --color-border: #000000;
  --color-accent: #CCCCCC;
}
```

### Tailwind Design Tokens

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      brutalist: {
        black: '#000000',
        white: '#FFFFFF',
        gray: '#666666',
        concrete: '#CCCCCC',
      }
    },
    fontFamily: {
      system: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Arial', 'sans-serif'],
      heading: ['"Helvetica Neue"', '"Arial Black"', 'Arial', 'sans-serif'],
    },
    spacing: {
      'brutalist-lg': '32px',
      'brutalist-xl': '48px',
      'brutalist-2xl': '64px',
    },
    borderWidth: {
      'brutalist': '4px',
      'brutalist-thick': '8px',
    },
  }
}
```

### Theme System

**Mechanism:**
- Body element receives class: `.theme-night` (default) or `.theme-day`
- `useTheme()` composable provides `isNight` ref and `toggleTheme()` function
- Preference persists in `localStorage` with key `'theme'` and values `'night'` or `'day'`
- All theme overrides in `style.css` with `body.theme-day` selectors

**Usage:**
```vue
<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

const { isNight, toggleTheme } = useTheme()
</script>

<template>
  <button @click="toggleTheme">
    {{ isNight ? 'Switch to Day' : 'Switch to Night' }}
  </button>
</template>
```

---

## Critical Gotchas

### 🔴 CRITICAL: Debug Console Logs
**File**: `/src/components/Portfolio.vue` (lines 17-42)
**Issue**: `console.log()` statements left in `handleMediaClick()` function
**Action**: Remove before production deployment
**Impact**: Clutters browser console, exposes internal logic to users

**Lines to remove:**
```typescript
console.log("Clicked project:", project.title)
console.log("Project has route:", !!project.route)
console.log("Project has file:", !!project.file)
console.log("Project has youtubeId:", !!project.youtubeId)
console.log("Project has videoFile:", !!project.videoFile)
console.log("Opening file:", project.file)
console.log("Opening YouTube:", youtubeUrl)
console.log("Opening video file:", project.videoFile)
```

---

### 🔴 CRITICAL: Type Safety Issues
**Files**: Multiple (CapitalismSimulator.vue, CapitalistRealismRPG.vue, shims-vue.d.ts)
**Issue**: `as any` type casts bypass TypeScript's type checking
**Action**: Replace with proper type definitions or type guards
**Impact**: Reduces type safety, makes refactoring error-prone

**Find all occurrences:**
```bash
grep -rn "as any" src/
```

**Fix pattern:**
```typescript
// Bad
const model = loader.load() as any

// Good
interface GLTFResult {
  scene: THREE.Group;
  // ... other properties
}
const model = loader.load() as GLTFResult
```

---

### 🟡 WARNING: Sharp Native Dependency
**File**: `package.json`
**Dependency**: `"sharp": "^0.33.5"`
**Issue**: Native module that may fail on M1/M2 Macs during `npm install`
**Workaround**: Run `npm install --force` or `npm install --no-optional`
**Impact**: Installation failure blocks development setup

**Alternative**: Consider replacing with `vite-imagetools` or making Sharp optional

---

### 🟡 WARNING: Hardcoded External URLs
**File**: `/src/components/CapitalismSimulator.vue` (line ~60)
**Issue**: Claude Artifact URL hardcoded: `https://claude.ai/public/artifacts/...`
**Action**: Move to `.env` file: `VITE_CAPITALISM_GAME_URL=...`
**Impact**: Difficult to change URLs across environments (dev/staging/prod)

**Fix:**
```typescript
// .env
VITE_CAPITALISM_GAME_URL=https://claude.ai/public/artifacts/a16db306-18bc-49e7-8fe4-7d38ecb75c4e

// CapitalismSimulator.vue
const gameUrl = import.meta.env.VITE_CAPITALISM_GAME_URL || 'fallback-url'
```

---

### 🟡 WARNING: LocalStorage Silent Failures
**File**: `/src/composables/useTheme.ts`
**Issue**: `localStorage.setItem()` wrapped in `try/catch` with no user feedback
**Behavior**: Theme preference won't persist in private/incognito mode silently
**Impact**: Users may be confused why theme doesn't persist

```typescript
try {
  localStorage.setItem('theme', value)
} catch {
  // Silent failure - no user notification
}
```

**Consider**: Adding user-facing notification when localStorage unavailable

---

### 🟢 INFO: Commented Poster Images
**File**: `/src/data/projects.ts`
**Lines**: 28, 37, 46, 63, 74, 82, 92, 102, 112, 121
**Issue**: Multiple `//posterImage: '...'` commented entries
**Decision Needed**: Delete if obsolete, or uncomment with correct paths
**Impact**: Unclear whether images are intentionally hidden or forgotten

---

### 🟢 INFO: Custom Configuration File
**File**: `/.kilocodemodes` (in gitignore)
**Purpose**: Defines 3 custom Claude modes (Code Reviewer, Code Skeptic, Documentation Specialist)
**Impact**: Affects how Claude agents behave when working on this project
**Action**: Document purpose if keeping, or remove if no longer needed

---

### 🟢 INFO: Manual Chunk Splitting
**File**: `/vite.config.ts` (lines 9-15)
**Configuration**: Manual chunks for `three` and `vue-vendor` bundles
**Reason**: Performance optimization - separate large dependencies for better caching
**WARNING**: Do NOT modify without testing bundle sizes
**Chunk size warning limit**: Set to 1000 KB (elevated from default 500 KB)

```typescript
rollupOptions: {
  output: {
    manualChunks: {
      'three': ['three'],
      'vue-vendor': ['vue', 'vue-router']
    }
  }
}
```

---

### 🟢 INFO: Media Handling Complexity
**File**: `/src/components/Portfolio.vue` (`handleMediaClick` function)
**Behavior**: Multiple fallback paths for different media types
**Priority**: `route` > `file` > `youtubeId/link` > `videoFile`
**Impact**: Must test all media types after changes to routing or click handling

**Flow:**
1. If `project.route` exists → Navigate with Vue Router
2. Else if `project.file` exists → Open file in new tab
3. Else if `project.youtubeId` or `project.link` → Open external link
4. Else if `project.videoFile` → Open video file in new tab

---

### 🟢 INFO: Strict TypeScript Configuration
**Files**: `tsconfig.json`, `tsconfig.app.json`
**Settings**:
- `noUnusedLocals: true` - Unused variables cause build failures
- `noUnusedParameters: true` - Unused function params cause build failures
- `noFallthroughCasesInSwitch: true` - Switch statements must be exhaustive

**Impact**: Must maintain clean code discipline - cannot leave unused code

---

## Working with This Codebase

### Development Workflow

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production (runs TypeScript check first)
npm run build

# Preview production build locally
npm run preview
```

**Build Process:**
1. `vue-tsc -b` - TypeScript compilation check (fails on type errors)
2. `vite build` - Bundle application (only runs if tsc passes)

**Common Build Errors:**
- **Unused variables**: Remove or prefix with `_` (e.g., `_unusedVar`)
- **Type errors**: Fix type definitions, never use `as any`
- **Missing dependencies**: Run `npm install`

---

### Before Making Changes

**Checklist:**
- [ ] Check `style.css` first - it's the primary styling source (516 lines)
- [ ] TypeScript is STRICT - fix type errors, don't cast as `any`
- [ ] Test theme toggle after CSS changes (both night and day themes)
- [ ] Verify media click handlers for all project types (route, file, YouTube, videoFile)
- [ ] Test responsive breakpoints (1024px, 768px, 480px)
- [ ] Run `npm run build` to catch TypeScript errors before committing

---

### Adding New Projects

**File**: `/src/data/projects.ts`

**Project Type Definition:**
```typescript
export type Project = {
  id: number;                 // Unique identifier
  title: string;              // Project name
  description: string;        // Short description
  tools?: string;             // Tools/technologies used
  posterImage?: string;       // Static image path (e.g., '/images/project.jpg')
  videoFile?: string;         // Local video path (e.g., '/images/project.mp4')
  youtubeId?: string;         // YouTube video ID
  file?: string;              // External file to open (e.g., '/resume.pdf')
  link?: string;              // External URL
  route?: string;             // Internal route (e.g., '/capitalism-simulator')
};
```

**Click Behavior Priority:**
1. **route**: Navigate internally with Vue Router
2. **file**: Open file in new tab
3. **youtubeId/link**: Open external link in new tab
4. **videoFile**: Open video file in new tab

**Always provide:**
- Either `posterImage` OR `videoFile` for visual representation
- At least one action: `route`, `file`, `link`, `youtubeId`, or `videoFile`

**Example:**
```typescript
{
  id: 100,
  title: "New Project",
  description: "Description here",
  tools: "Vue 3, TypeScript, Three.js",
  videoFile: "/images/new-project.mp4",
  link: "https://github.com/username/project"
}
```

---

### Responsive Breakpoints

```css
/* Desktop: 3 columns (asymmetric) */
@media (min-width: 1024px) {
  .projects-grid {
    grid-template-columns: 1.2fr 1fr 1fr;
  }
}

/* Tablet: 2 columns (asymmetric) */
@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: 1.3fr 1fr;
  }
}

/* Mobile: 1 column */
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
```

**Test at these widths:** 480px, 768px, 1024px, 1280px, 1920px

---

## Skills & Tools Integration

### /context7 (Context7 Documentation Query)

**When to use:**
- Before making architectural decisions (Vue patterns, TypeScript types)
- To verify Tailwind utility class syntax
- To check Three.js API usage
- To look up Vue 3 Composition API best practices

**Example queries:**
```
/context7 Vue 3 Composition API best practices for theme composables
/context7 Tailwind CSS brutalist design patterns
/context7 TypeScript utility types Pick Omit Partial
/context7 Three.js BoxGeometry PlaneGeometry parameters
```

---

### /frontend-design (UI/UX Design Plugin)

**When to use:**
- After design system setup (validate tokens)
- To check color contrast for accessibility (WCAG AA/AAA)
- To generate spacing scales
- To validate brutalist design principles

**Example usage:**
```
/frontend-design Validate brutalist color contrast accessibility
/frontend-design Check WCAG AA compliance for white on black
/frontend-design Generate spacing scale for asymmetric grid layout
```

---

### /code-simplifier (Code Simplification)

**When to use:**
- After major CSS transformations (Step 3-6 in plan)
- To deduplicate repeated styles
- To simplify complex CSS selectors
- To refactor verbose TypeScript code

**Target files:**
- `/src/style.css` (after removing animations, updating typography)
- `/src/components/LandingPage.vue` (scoped styles)
- `/src/components/Portfolio.vue` (scoped styles)

**Usage pattern:**
1. Make major style changes
2. Run `/code-simplifier` on the modified file
3. Review suggestions
4. Test visual output after simplification

---

## Common Tasks

### Task 1: Change Theme Colors

**Files to modify:**
1. `/src/style.css` - Update CSS variables in `:root` and `body.theme-day`
2. `/tailwind.config.js` - Update `theme.extend.colors.brutalist.*`

**Example:**
```css
/* style.css */
:root {
  --color-accent: #FF0000; /* Change from #666666 */
}

body.theme-day {
  --color-accent: #00FF00; /* Day theme accent */
}
```

```javascript
// tailwind.config.js
colors: {
  brutalist: {
    accent: '#FF0000',
  }
}
```

**Test:** Toggle theme and verify color changes in both night and day modes

---

### Task 2: Add New Font Family

**Files to modify:**
1. `/src/style.css` - Update `--font-system` or `--font-heading` variables
2. `/tailwind.config.js` - Update `fontFamily` in theme extension

**Example:**
```css
/* style.css */
:root {
  --font-heading: "Inter", "Helvetica Neue", Arial, sans-serif;
}
```

```javascript
// tailwind.config.js
fontFamily: {
  heading: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
}
```

**Note:** Brutalist aesthetic prefers system fonts - only use web fonts if absolutely necessary

---

### Task 3: Modify Grid Layout

**File**: `/src/style.css`

**Change asymmetric ratios:**
```css
.projects-grid {
  /* Current: 1.2fr 1fr 1fr */
  grid-template-columns: 2fr 1fr 1fr; /* More dramatic asymmetry */

  /* Or symmetric: */
  grid-template-columns: 1fr 1fr 1fr; /* Equal columns */
}
```

**Test:** Verify layout at all breakpoints (1024px, 768px, 480px)

---

### Task 4: Add Environment Variable

**Steps:**
1. Create `/.env` file in project root (if it doesn't exist)
2. Add variable with `VITE_` prefix: `VITE_MY_VAR=value`
3. Access in code: `import.meta.env.VITE_MY_VAR`
4. Add to `.gitignore` to keep secrets out of repo

**Example:**
```bash
# .env
VITE_API_URL=https://api.example.com
VITE_FEATURE_FLAG=true
```

```typescript
// In component
const apiUrl = import.meta.env.VITE_API_URL
const featureEnabled = import.meta.env.VITE_FEATURE_FLAG === 'true'
```

---

## Troubleshooting

### Issue: Sharp Installation Fails on M1/M2 Mac

**Error:**
```
npm ERR! sharp: Installation failed
```

**Solutions:**
1. **Force install**: `npm install --force`
2. **Skip optional**: `npm install --no-optional`
3. **Clear cache**: `npm cache clean --force && npm install`
4. **Alternative**: Remove Sharp from dependencies if not critical

---

### Issue: TypeScript Build Fails with "Unused Variable"

**Error:**
```
error TS6133: 'variableName' is declared but its value is never read.
```

**Solutions:**
1. **Remove the variable** if truly unused
2. **Prefix with underscore**: `_variableName` (indicates intentionally unused)
3. **Use the variable** in your code

**Do NOT:** Disable `noUnusedLocals` in `tsconfig.json` - this is intentional for code quality

---

### Issue: Theme Toggle Not Persisting

**Symptoms:** Theme resets to night mode on page reload

**Causes:**
1. **Private browsing mode**: localStorage unavailable
2. **Browser settings**: localStorage disabled
3. **Code error**: Check `useTheme.ts` for try/catch blocks

**Debug:**
```javascript
// In browser console
localStorage.getItem('theme') // Should return 'night' or 'day'
```

**If `null` returned:** localStorage not working - likely private mode

---

### Issue: Videos Not Autoplaying

**Symptoms:** Video files don't start playing automatically

**Causes:**
1. **Browser policy**: Most browsers block autoplay without user interaction
2. **Missing attributes**: Check `autoplay`, `muted`, `playsinline` on `<video>` tags

**Fix:**
```vue
<video autoplay muted playsinline loop>
  <source :src="project.videoFile" type="video/mp4">
</video>
```

**Note:** Must include `muted` for autoplay to work in most browsers

---

### Issue: Three.js Scene Not Rendering

**Symptoms:** Black screen or empty canvas where WebGL should render

**Debug checklist:**
1. Check browser console for WebGL errors
2. Verify browser supports WebGL: Visit `https://get.webgl.org/`
3. Check camera position and scene setup
4. Verify canvas element has dimensions (width/height)

**Common fix:**
```typescript
// Ensure canvas has dimensions
renderer.setSize(window.innerWidth, window.innerHeight)
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()
```

---

### Issue: Responsive Grid Breaking on Tablet

**Symptoms:** Grid layout looks wrong at 768px-1024px range

**Causes:**
1. **Asymmetric ratios too extreme** for smaller screens
2. **Content overflow** in narrow columns
3. **Media query conflicts**

**Debug:**
```css
/* Temporarily test with symmetric grid */
@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: 1fr 1fr; /* Symmetric for testing */
  }
}
```

**Fix:** Adjust asymmetric ratios or switch to symmetric for tablet breakpoint

---

## Configuration

### Environment Variables

Create `/.env` file (not tracked in git):

```bash
# External URLs
VITE_CAPITALISM_GAME_URL=https://claude.ai/public/artifacts/a16db306-18bc-49e7-8fe4-7d38ecb75c4e

# Feature flags
VITE_ENABLE_WEBGL=true

# API endpoints (if needed)
VITE_API_BASE_URL=https://api.example.com
```

**Access in code:**
```typescript
const gameUrl = import.meta.env.VITE_CAPITALISM_GAME_URL
```

**Important:** Always provide fallback values for production safety

---

### Build Configuration

**File**: `/vite.config.ts`

**Key settings:**
- **Manual chunks**: `three` and `vue-vendor` split for caching
- **Chunk size limit**: 1000 KB (elevated for Three.js)
- **Port**: 5173 (default Vite dev server)

**Do NOT modify** chunk splitting without testing bundle sizes:
```bash
npm run build
# Check dist/ folder for bundle sizes
```

---

## Deployment Notes

### Pre-Deployment Checklist

- [ ] Remove all `console.log()` statements
- [ ] Run `npm run build` successfully
- [ ] Test production build locally: `npm run preview`
- [ ] Verify all environment variables set in hosting platform
- [ ] Check bundle sizes (should be under 1000 KB per chunk)
- [ ] Test theme toggle in production build
- [ ] Verify all media links work (routes, files, YouTube, videos)
- [ ] Test responsive design at all breakpoints
- [ ] Check accessibility (WCAG AA contrast, keyboard navigation)

### Build Output

**Location**: `/dist` folder

**Structure:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js        # Main bundle
│   ├── three-[hash].js        # Three.js chunk
│   ├── vue-vendor-[hash].js   # Vue + Vue Router chunk
│   └── index-[hash].css       # Compiled styles
└── images/                     # Copied from public/
```

**Hosting:** Deploy `dist/` folder to static hosting (Vercel, Netlify, Cloudflare Pages, etc.)

---

## Contributing

### Code Style

- **TypeScript**: Strict mode, no `any` casts
- **Vue**: Composition API with `<script setup>`
- **CSS**: CSS variables for theming, Tailwind for layout
- **Formatting**: Follow existing patterns in codebase

### Before Committing

1. Run `npm run build` - ensure no TypeScript errors
2. Test both night and day themes
3. Test all responsive breakpoints
4. Remove debug code (`console.log`, commented code)
5. Update this CLAUDE.md if you change architecture or add gotchas

---

## Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vite.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Three.js Documentation](https://threejs.org/docs/)
- [Brutalist Web Design Principles](https://brutalist-web.design/)

---

**Questions or issues?** Check the Troubleshooting section or refer to the exploration notes in `/Users/graziana.mirabella/.claude/plans/inherited-weaving-allen.md`
