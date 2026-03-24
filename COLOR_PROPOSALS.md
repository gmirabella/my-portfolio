# Palette Colori Retro - Proposte

## OPZIONE 1: AMBER TERMINAL (anni '70-'80)
**Ispirato a**: Vecchi terminal IBM, DEC VT100

```css
--color-terminal: #ffb000;           /* Amber brillante */
--color-terminal-dim: #cc8800;       /* Amber scuro */
--color-terminal-glow: rgba(255, 176, 0, 0.6);

/* Effetto invecchiato */
opacity: 0.92;
text-shadow: 0 0 8px rgba(255, 176, 0, 0.4);
```

**Preview**:
- Barra progresso: Arancione ambrato
- Testo: Arancione caldo
- Glow: Ambrato morbido
- Sensazione: Caldo, nostalgico, professionale

---

## OPZIONE 2: PHOSPHOR GREEN (CRT invecchiato)
**Ispirato a**: Monitor CRT IBM 3270, vecchi terminali Unix

```css
--color-terminal: #33ff33;           /* Verde fosforescente */
--color-terminal-dim: #00cc00;       /* Verde scuro */
--color-terminal-glow: rgba(51, 255, 51, 0.5);

/* Effetto invecchiato con scanline */
opacity: 0.88;
text-shadow: 0 0 6px rgba(51, 255, 51, 0.3);
filter: contrast(0.95) brightness(0.95);
```

**Preview**:
- Barra progresso: Verde fosforescente opaco
- Testo: Verde CRT classico
- Glow: Verde morbido
- Sensazione: Vintage computing, retro

---

## OPZIONE 3: APPLE II GREEN (mela verde opaco)
**Ispirato a**: Apple II, Commodore PET

```css
--color-terminal: #00ff41;           /* Verde Apple II */
--color-terminal-dim: #009900;       /* Verde foresta */
--color-terminal-glow: rgba(0, 255, 65, 0.4);

/* Effetto più opaco/invecchiato */
opacity: 0.85;
text-shadow: 0 0 5px rgba(0, 255, 65, 0.25);
filter: saturate(0.8);
```

**Preview**:
- Barra progresso: Verde mela opaco
- Testo: Verde foresta
- Glow: Verde tenue
- Sensazione: Homebrew, hackerspace, DIY

---

## OPZIONE 4: DOS GREEN (MS-DOS / terminale vintage)
**Ispirato a**: MS-DOS, vecchi PC IBM

```css
--color-terminal: #00aa00;           /* Verde DOS */
--color-terminal-dim: #007700;       /* Verde militare */
--color-terminal-glow: rgba(0, 170, 0, 0.3);

/* Effetto molto invecchiato */
opacity: 0.82;
text-shadow: 0 0 4px rgba(0, 170, 0, 0.2);
filter: contrast(0.9) saturate(0.7);
```

**Preview**:
- Barra progresso: Verde militare opaco
- Testo: Verde DOS classico
- Glow: Quasi assente
- Sensazione: Raw, brutale, computer anni '80

---

## 🏆 Raccomandazione

**Per stile "invecchiato retrocomputer"**:
1. **AMBER** (più caldo, professionale)
2. **DOS GREEN** (più brutalist, raw)
3. **PHOSPHOR GREEN** (equilibrio vintage/leggibile)
4. **APPLE II** (più nostalgico)

---

## Effetti Aggiuntivi Opzionali

### Scanline CRT (effetto righe monitor)
```css
.boot-overlay::after {
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
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 4px
  );
  pointer-events: none;
}
```

### Grana/Noise (effetto vintage)
```css
.boot-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
  pointer-events: none;
}
```

### Flicker (sfarfallio CRT)
```css
@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.97; }
}

.boot-overlay {
  animation: flicker 0.15s infinite;
}
```

---

## Mix & Match

Puoi combinare:
- Palette colore (1-4)
- Scanline effect (opzionale)
- Noise/grana (opzionale)
- Flicker (opzionale)

**Esempio**: DOS GREEN + Scanline + Noise leggero = Massimo effetto vintage
