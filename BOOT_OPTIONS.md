# Boot Sequence - Opzioni di Visualizzazione Card

Questo documento descrive le 3 opzioni implementabili per far apparire le card dopo il boot.

## ✅ OPZIONE 1: GRID SNAP (ATTUALMENTE IMPLEMENTATA)

**Descrizione**: Tutte le card appaiono insieme dopo il boot - massima onestà brutalist, zero fronzoli.

**Caratteristiche**:
- ✅ Più brutalist e diretto
- ✅ Minima complessità
- ✅ Performance ottimale
- ✅ **GIÀ IMPLEMENTATO**

**Comportamento**: Dopo il boot (2.9 secondi), grid appare tutta insieme con un leggero scale-up.

---

## OPZIONE 2: FADE-IN SEQUENZIALE (Matrix Style)

**Descrizione**: Le card appaiono una dopo l'altra dall'alto verso il basso, stile "caricamento matrix".

**Caratteristiche**:
- Card appaiono in sequenza (delay 100ms tra una e l'altra)
- Effetto "materializzazione" dal nulla
- Più cinematico ma ancora minimal

**Come attivarla**:

### 1. Modifica `src/components/Portfolio.vue`

Cambia la classe della grid:

```vue
<!-- DA: -->
<div class="projects-grid grid-snap">

<!-- A: -->
<div class="projects-grid grid-cascade">
```

### 2. Aggiungi gli stili in `src/style.css`

Aggiungi questo CSS dopo `.grid-snap`:

```css
/* OPTION 2: Grid Cascade - Cards appear sequentially */
.projects-grid.grid-cascade .project-card {
  animation: card-fade-in 0.4s ease-out backwards;
}

.projects-grid.grid-cascade .project-card:nth-child(1) { animation-delay: 0s; }
.projects-grid.grid-cascade .project-card:nth-child(2) { animation-delay: 0.1s; }
.projects-grid.grid-cascade .project-card:nth-child(3) { animation-delay: 0.2s; }
.projects-grid.grid-cascade .project-card:nth-child(4) { animation-delay: 0.3s; }
.projects-grid.grid-cascade .project-card:nth-child(5) { animation-delay: 0.4s; }
.projects-grid.grid-cascade .project-card:nth-child(6) { animation-delay: 0.5s; }
.projects-grid.grid-cascade .project-card:nth-child(7) { animation-delay: 0.6s; }
.projects-grid.grid-cascade .project-card:nth-child(8) { animation-delay: 0.7s; }
.projects-grid.grid-cascade .project-card:nth-child(9) { animation-delay: 0.8s; }
.projects-grid.grid-cascade .project-card:nth-child(10) { animation-delay: 0.9s; }
.projects-grid.grid-cascade .project-card:nth-child(11) { animation-delay: 1.0s; }
.projects-grid.grid-cascade .project-card:nth-child(12) { animation-delay: 1.1s; }

@keyframes card-fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## OPZIONE 3: SCANLINE REVEAL

**Descrizione**: Una barra orizzontale verde neon "scansiona" dal top verso il bottom rivelando le card.

**Caratteristiche**:
- Effetto scanline stile CRT/terminal
- Barra verde neon che "legge" il contenuto
- Molto retro-futuristico

**Come attivarla**:

### 1. Modifica `src/components/Portfolio.vue`

Cambia la classe della grid:

```vue
<!-- DA: -->
<div class="projects-grid grid-snap">

<!-- A: -->
<div class="projects-grid grid-scanline">
```

### 2. Aggiungi gli stili in `src/style.css`

Aggiungi questo CSS dopo `.grid-cascade`:

```css
/* OPTION 3: Scanline Reveal - Horizontal scan line reveals cards */
.projects-grid.grid-scanline {
  position: relative;
  animation: scanline-reveal 2s ease-out;
}

.projects-grid.grid-scanline::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(
    to bottom,
    transparent,
    #00ff00 50%,
    transparent
  );
  box-shadow:
    0 0 10px rgba(0, 255, 0, 0.8),
    0 0 20px rgba(0, 255, 0, 0.4);
  animation: scanline-move 2s ease-out;
  pointer-events: none;
  z-index: 10;
}

@keyframes scanline-move {
  from {
    top: 0;
    opacity: 1;
  }
  to {
    top: 100%;
    opacity: 0;
  }
}

@keyframes scanline-reveal {
  from {
    opacity: 0;
    clip-path: inset(0 0 100% 0);
  }
  to {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }
}

/* Day theme scanline */
body.theme-day .projects-grid.grid-scanline::before {
  background: linear-gradient(
    to bottom,
    transparent,
    #2d5016 50%,
    transparent
  );
  box-shadow: none;
}
```

---

## Confronto Opzioni

| Opzione | Brutalismo | Performance | Complessità | Wow Factor |
|---------|-----------|-------------|-------------|------------|
| **Grid Snap** (attuale) | ★★★★★ | ★★★★★ | ★ | ★★ |
| **Cascade** | ★★★★ | ★★★★ | ★★ | ★★★ |
| **Scanline** | ★★★ | ★★★★ | ★★★ | ★★★★★ |

---

## Modifiche al Boot Sequence

Puoi anche personalizzare i messaggi di boot modificando `src/composables/useBootSequence.ts`:

```typescript
const bootMessages = ref<BootMessage[]>([
  { text: 'INITIALIZING SYSTEM...', delay: 0, type: 'info' },
  { text: 'LOADING MEMORY BANKS...', delay: 300, type: 'info' },
  // ... aggiungi o modifica messaggi qui
])

const welcomeMessages = [
  'WELCOME TO THE PORTFOLIO MATRIX',
  // ... aggiungi messaggi qui
]
```

---

## Testare le Opzioni

```bash
# Avvia il dev server
npm run dev

# La sequenza di boot dura circa 2.9 secondi
# Le card appaiono subito dopo
```

---

## Raccomandazione

- **Grid Snap**: Se vuoi massima pulizia brutalist
- **Cascade**: Se vuoi un tocco di cinema senza esagerare
- **Scanline**: Se vuoi l'effetto WOW più forte (ma meno brutalist)

**Attualmente implementato**: Grid Snap (Opzione 1)
