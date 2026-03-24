# Terminal Layout nel Boot - Proposte

## OPZIONE A: TERMINAL CENTRATO MINIMALISTA

**Descrizione**: Terminale semplice centrato con frase di benvenuto grande e prompt sotto.

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│          WELCOME TO THE PORTFOLIO           │
│                    MATRIX                   │
│                                             │
│                                             │
│          grza@portfolio:~$ _                │
│          type 'help' or 'ls' to explore     │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
```

**Caratteristiche**:
- Welcome message: Font grande (3-4em), centrato
- Prompt: Font normale (1.2em), centrato sotto
- Help text: Font piccolo (1em), opacità ridotta
- Barra di progresso: RIMOSSA (già completata)
- Cursor blinking sul prompt

**CSS**:
```css
.terminal-boot-centered {
  text-align: center;
  padding: 4rem 2rem;
}

.terminal-welcome {
  font-size: 3.5em;
  margin-bottom: 3rem;
  line-height: 1.2;
  letter-spacing: 2px;
}

.terminal-prompt-boot {
  font-size: 1.2em;
  margin-bottom: 0.5rem;
}

.terminal-help-text {
  font-size: 1em;
  opacity: 0.7;
}
```

---

## OPZIONE B: TERMINAL FULLSCREEN CLASSICO

**Descrizione**: Terminal stile fullscreen con output come in un vero terminale Unix.

```
┌─────────────────────────────────────────────┐
│ grza@portfolio:~$ ./init_portfolio.sh       │
│                                             │
│ SYSTEM BOOT COMPLETE ✓                      │
│                                             │
│ ╔═══════════════════════════════════════╗   │
│ ║  WELCOME TO THE PORTFOLIO MATRIX      ║   │
│ ╚═══════════════════════════════════════╝   │
│                                             │
│ Entering digital dreamscape...              │
│                                             │
│ grza@portfolio:~$ _                         │
│ type 'help' or 'ls' to explore              │
│                                             │
└─────────────────────────────────────────────┘
```

**Caratteristiche**:
- Stile terminal output realistico
- Box ASCII art intorno al welcome
- Welcome message: Font grande (2.5em)
- Descrizione sotto il welcome
- Prompt attivo con cursor

**CSS**:
```css
.terminal-boot-fullscreen {
  font-family: 'VT323', monospace;
  padding: 2rem;
  text-align: left;
}

.terminal-boot-line {
  margin-bottom: 0.5rem;
  font-size: 1.2em;
}

.terminal-welcome-box {
  font-size: 2.5em;
  text-align: center;
  margin: 2rem 0;
  padding: 1rem;
  border: 2px solid var(--color-terminal);
}
```

---

## OPZIONE C: TERMINAL MINIMALISTA RAW (RACCOMANDATO)

**Descrizione**: Massimo brutalismo - solo testo, zero decorazioni.

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│                                             │
│      WELCOME TO THE PORTFOLIO MATRIX        │
│                                             │
│      grza@portfolio:~$ _                    │
│      type 'help' or 'ls' to explore         │
│                                             │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
```

**Caratteristiche**:
- ZERO decorazioni
- Welcome: Grande (4em), spaziatura generosa
- Prompt: Normale (1.3em), sotto il welcome
- Help: Piccolo (1.1em), stesso allineamento
- Tutto allineato a sinistra con padding
- Cursor blinking

**CSS**:
```css
.terminal-boot-raw {
  padding: 4rem 6rem;
  font-family: 'VT323', monospace;
}

.terminal-welcome-raw {
  font-size: 4em;
  margin-bottom: 2rem;
  letter-spacing: 1px;
  line-height: 1.1;
}

.terminal-prompt-raw {
  font-size: 1.3em;
  margin-bottom: 0.3rem;
}

.terminal-help-raw {
  font-size: 1.1em;
  opacity: 0.75;
  padding-left: 0;
}
```

---

## OPZIONE D: TERMINAL CON ANIMAZIONE TYPEWRITER

**Descrizione**: Welcome message appare con effetto macchina da scrivere.

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│   > WELCOME TO THE PORTFOLIO MATRIX_        │
│                                             │
│                                             │
│   grza@portfolio:~$ _                       │
│   type 'help' or 'ls' to explore            │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
```

**Caratteristiche**:
- Welcome appare lettera per lettera (typewriter effect)
- Freccia ">" prima del welcome
- Cursor blinking alla fine del testo
- Quando typewriter finisce → cursor si sposta sul prompt
- Font grande (3em)

**CSS + JS**:
```css
.terminal-welcome-typewriter {
  font-size: 3em;
  margin-bottom: 3rem;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid var(--color-terminal);
  animation: typing 2s steps(30) forwards, blink-caret 0.75s step-end infinite;
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink-caret {
  50% { border-color: transparent; }
}
```

---

## 📊 Confronto Opzioni

| Opzione | Brutalismo | Complessità | Leggibilità | Wow Factor | Recommended |
|---------|-----------|-------------|-------------|------------|-------------|
| **A. Centrato** | ★★★ | ★ | ★★★★★ | ★★ | ✅ Facile |
| **B. Fullscreen** | ★★ | ★★★ | ★★★★ | ★★★ | Per nostalgici |
| **C. Raw** | ★★★★★ | ★ | ★★★★ | ★★★ | ✅ **Best** |
| **D. Typewriter** | ★★★ | ★★★★ | ★★★★ | ★★★★★ | Più cinematico |

---

## 🏆 Raccomandazione

**OPZIONE C (Raw)** è la più brutalist e coerente con il tuo stile.

**Se vuoi più impatto**: OPZIONE D (Typewriter) con palette AMBER o DOS GREEN.

---

## Modifiche Tecniche Necessarie

### 1. Rimuovere dalla boot sequence:
- ❌ Boot messages sequenziali
- ❌ Barra di progresso
- ❌ Welcome message grande al centro

### 2. Aggiungere:
- ✅ Terminal layout direttamente nel boot overlay
- ✅ Welcome message grande NEL terminale
- ✅ Prompt con cursor blinking
- ✅ "type help or ls to explore" sotto il prompt

### 3. Flow diventa:
```
1. Boot overlay appare
2. Welcome message appare nel terminal (grande)
3. Prompt e help text sotto
4. Dopo 2-3 secondi → tutto shrinka nell'header
5. Header mostra terminale compatto + welcome message
6. Scanline reveal delle card
```

---

## Mix & Match Raccomandato

### Combo 1: BRUTALIST PURO
- Layout: **Opzione C (Raw)**
- Colore: **DOS GREEN**
- Effetti: Scanline + Noise leggero

### Combo 2: VINTAGE CALDO
- Layout: **Opzione A (Centrato)**
- Colore: **AMBER**
- Effetti: Scanline + Flicker leggero

### Combo 3: RETRO CINEMATICO
- Layout: **Opzione D (Typewriter)**
- Colore: **PHOSPHOR GREEN**
- Effetti: Scanline + Glow medio

### Combo 4: HACKER AESTHETIC
- Layout: **Opzione B (Fullscreen)**
- Colore: **APPLE II GREEN**
- Effetti: Scanline + Noise pesante

---

Quale layout + quale palette preferisci?
