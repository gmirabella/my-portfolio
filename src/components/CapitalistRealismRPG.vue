<template>
  <div class="lowtech-container rpg-container">
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
      <span class="back-icon">←</span>
      <span class="back-text">back</span>
    </button>


    <!-- Intro Screen -->
    <div v-if="gameState === 'intro'" class="window intro-window">
      <div class="title-bar">
        <div class="title-bar-text">💸 Capitalism Simulator - [Welcome]</div>
        <div class="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div class="window-body intro-body">
        <h1>CAPITALISM SIMULATOR</h1>
        <p>Qui dovrei darvi le istruzioni e spiegarvi come si gioca, ma non lo farò.<br><br>
        Prendete decisioni, fate quello che vi pare, sperate nella briscola. Buona fortuna.</p>
        <button @click="gameState = 'race'" class="start-game-btn">▶ START GAME</button>
      </div>
      <div class="status-bar">
        <p class="status-bar-field">Benvenuto nel capitalismo</p>
      </div>
    </div>

    <!-- Race Selection -->
    <div v-if="gameState === 'race'" class="window race-window">
      <div class="title-bar">
        <div class="title-bar-text">💸 Capitalism Simulator - [Selezione Razza]</div>
        <div class="title-bar-controls">
          <button aria-label="Close" @click="restartGame"></button>
        </div>
      </div>
      <div class="window-body race-body">
        <h2>SCEGLI LA TUA RAZZA</h2>
        <div class="races-grid">
          <button 
            v-for="race in RACES" 
            :key="race.id" 
            @click="selectRace(race)"
            class="race-card"
          >
            <div class="race-avatar">{{ race.avatar }}</div>
            <h3>{{ race.name }}</h3>
            <p>{{ race.desc }}</p>
            <div class="race-stats">
              <div v-for="[stat, val] in Object.entries(race.stats)" :key="stat" class="stat-row">
                <span class="stat-name">{{ stat }}:</span>
                <span :class="['stat-value', val > 0 ? 'positive' : val < 0 ? 'negative' : '']">
                  {{ val > 0 ? '+' : '' }}{{ val }}
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
      <div class="status-bar">
        <p class="status-bar-field">Step 1/5: Selezione Razza</p>
        <p class="status-bar-field">Budget: €0</p>
      </div>
    </div>

    <!-- Class Selection -->
    <div v-if="gameState === 'class'" class="window class-window">
      <div class="title-bar">
        <div class="title-bar-text">💸 Capitalism Simulator - [Selezione Classe]</div>
        <div class="title-bar-controls">
          <button aria-label="Close" @click="restartGame"></button>
        </div>
      </div>
      <div class="window-body class-body">
        <h2>SCEGLI LA TUA CLASSE</h2>
        <p>Come sopravvivi nel capitalismo?</p>
        <div class="classes-list">
          <div v-for="cls in CLASSES" :key="cls.id" class="class-section">
            <h3>{{ cls.name }}</h3>
            <p>{{ cls.desc }}</p>
            <div class="subclasses-grid">
              <button
                v-for="sub in cls.subclasses"
                :key="sub.id"
                @click="selectClass(cls.id, sub.id)"
                class="subclass-card"
              >
                <div class="subclass-avatar">{{ sub.avatar }}</div>
                <h4>{{ sub.name }}</h4>
                <p>{{ sub.desc }}</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="status-bar">
        <p class="status-bar-field">Step 2/5: Selezione Classe</p>
        <p class="status-bar-field">Razza: {{ character.race?.name }}</p>
      </div>
    </div>

    <!-- Character Form -->
    <div v-if="gameState === 'character-form'" class="window form-window">
      <div class="title-bar">
        <div class="title-bar-text">💸 Capitalism Simulator - [Nome]</div>
        <div class="title-bar-controls">
          <button aria-label="Close" @click="restartGame"></button>
        </div>
      </div>
      <div class="window-body form-body">
        <h2>COME TI CHIAMI?</h2>
        <div class="field-row-stacked">
          <label for="name">Nome del personaggio:</label>
          <input 
            id="name"
            type="text"
            v-model="characterForm.name"
            placeholder="Es: Marco Rossi"
          />
        </div>
        <button @click="generateBackstory" :disabled="!characterForm.name" class="generate-btn">
          ▶ GENERA STORIA
        </button>
      </div>
      <div class="status-bar">
        <p class="status-bar-field">Step 3/5: Nome Personaggio</p>
      </div>
    </div>

    <!-- Generating Backstory -->
    <div v-if="gameState === 'generating-backstory'" class="window generating-window">
      <div class="title-bar">
        <div class="title-bar-text">💸 Capitalism Simulator - [Generazione...]</div>
      </div>
      <div class="window-body generating-body">
        <h2>⏳ GENERAZIONE BACKSTORY...</h2>
        <p>L'AI sta creando la tua storia...</p>
        <div class="generating-icon">🎭</div>
      </div>
    </div>

    <!-- Backstory Display -->
    <div v-if="gameState === 'backstory-display'" class="window backstory-window">
      <div class="title-bar">
        <div class="title-bar-text">💸 Capitalism Simulator - [La Tua Storia]</div>
      </div>
      <div class="window-body backstory-body">
        <h2>🎭 LA TUA BACKSTORY</h2>
        <div class="backstory-text">{{ character.backstory }}</div>
        <button @click="gameState = 'familiar-quiz'" class="continue-btn">▶ CONTINUA</button>
      </div>
      <div class="status-bar">
        <p class="status-bar-field">Step 3.5/5: La Tua Storia</p>
      </div>
    </div>

    <!-- Familiar Quiz -->
    <div v-if="gameState === 'familiar-quiz'" class="window quiz-window">
      <div class="title-bar">
        <div class="title-bar-text">💸 Capitalism Simulator - [Famiglio]</div>
      </div>
      <div class="window-body quiz-body">
        <h2>🐾 SCEGLI IL TUO FAMIGLIO</h2>
        <p>Il tuo meccanismo di coping. A cosa ti aggrappi? ({{ Object.keys(quizAnswers).length }}/{{ FAMILIAR_QUIZ.length }})</p>
        <div class="quiz-questions">
          <div v-for="(question, qIndex) in FAMILIAR_QUIZ" :key="qIndex" class="quiz-question">
            <h3>Domanda {{ qIndex + 1 }}: {{ question.q }}</h3>
            <div class="quiz-answers">
              <button
                v-for="(answer, aIndex) in question.answers"
                :key="aIndex"
                @click="selectAnswer(qIndex, answer.familiar)"
                :class="['quiz-answer', quizAnswers[qIndex] === answer.familiar ? 'selected' : '']"
              >
                {{ quizAnswers[qIndex] === answer.familiar ? '✓ ' : '' }}{{ answer.text }}
              </button>
            </div>
          </div>
        </div>
        <div v-if="Object.keys(quizAnswers).length === FAMILIAR_QUIZ.length" class="quiz-complete">
          <p>✅ Hai completato tutte le domande!</p>
          <button @click="submitFamiliarQuiz" class="continue-btn">▶ CONTINUA</button>
        </div>
      </div>
      <div class="status-bar">
        <p class="status-bar-field">Step 4/5: Famiglio</p>
        <p class="status-bar-field">Risposte: {{ Object.keys(quizAnswers).length }}/{{ FAMILIAR_QUIZ.length }}</p>
      </div>
    </div>

    <!-- Character Sheet -->
    <div v-if="gameState === 'sheet'" class="window sheet-window">
      <div class="title-bar">
        <div class="title-bar-text">💸 Capitalism Simulator - [Scheda Personaggio]</div>
      </div>
      <div class="window-body sheet-body">
        <h2>📋 SCHEDA FINALE</h2>
        <div class="sheet-grid">
          <div class="sheet-left">
            <div class="character-avatar">{{ character.race?.avatar }}</div>
            <h3>{{ character.name }}</h3>
            <p><strong>Razza:</strong> {{ character.race?.name }}</p>
            <p><strong>Classe:</strong> {{ character.subclass?.name }}</p>
            <p><strong>Livello:</strong> {{ character.level }}</p>
            <p><strong>Stipendio:</strong> {{ character.salary === 0 ? 'Nessuno (ancora)' : `€${character.salary}/mese` }}</p>
          </div>
          <div class="sheet-right">
            <h4>STATISTICHE</h4>
            <div v-for="[stat, val] in Object.entries(character.stats)" :key="stat" class="stat-display">
              <span>{{ stat }}:</span>
              <strong>{{ val }}</strong>
            </div>
            <div class="familiar-box">
              <div class="familiar-avatar">{{ character.familiar?.avatar }}</div>
              <h5>{{ character.familiar?.name }}</h5>
              <p>{{ character.familiar?.trait }}</p>
            </div>
          </div>
        </div>
        <button @click="startGame" class="start-game-btn">▶ INIZIA IL GIOCO</button>
      </div>
      <div class="status-bar">
        <p class="status-bar-field">Step 5/5: Pronto!</p>
        <p class="status-bar-field">Budget: €{{ character.budget }}</p>
        <p class="status-bar-field">Burnout: {{ character.burnout }}%</p>
      </div>
    </div>

    <!-- Game Screen -->
    <div v-if="gameState === 'game'" class="window game-window">
      <div class="title-bar">
        <div class="title-bar-text">💸 Capitalism Simulator - [Gioco]</div>
        <div class="title-bar-controls">
          <button aria-label="Close" @click="restartGame"></button>
        </div>
      </div>
      <div class="window-body game-body">
        <!-- Sidebar -->
        <div class="game-sidebar">
          <div class="character-preview">
            <div class="preview-avatar">{{ character.race?.avatar }}</div>
            <strong>{{ character.name }}</strong>
            <div>{{ character.subclass?.name }}</div>
          </div>
          <div class="game-stats-box">
            <div><strong>Mese:</strong> {{ month }}</div>
            <div><strong>Budget:</strong> <span :class="character.budget < 0 ? 'negative' : 'positive'">€{{ character.budget }}</span></div>
            <div><strong>Stipendio:</strong> €{{ character.salary }}</div>
            <div>
              <strong>Burnout:</strong>
              <div class="burnout-bar">
                <div 
                  class="burnout-fill"
                  :style="{ width: `${character.burnout}%`, backgroundColor: character.burnout > 70 ? '#ff0000' : character.burnout > 40 ? '#ffff00' : '#00ff00' }"
                ></div>
                <span class="burnout-text">{{ character.burnout }}%</span>
              </div>
            </div>
            <div>
              <strong>Aura:</strong>
              <div class="aura-bar">
                <div 
                  class="aura-fill"
                  :style="{ width: `${Math.min(100, character.aura * 2)}%`, backgroundColor: '#00bfff' }"
                ></div>
                <span class="aura-text">{{ character.aura }}</span>
              </div>
            </div>
            <div v-if="character.race?.id === 'boomer-rentier'">
              <strong>Immobili:</strong> {{ character.properties }}
            </div>
            <div v-if="character.race?.id === 'faccio-cose-vedo-gente'">
              <strong>Passioni:</strong> {{ character.passions.length }}
            </div>
          </div>
          <div class="familiar-preview">
            <div class="familiar-avatar">{{ character.familiar?.avatar }}</div>
            <div>{{ character.familiar?.name }}</div>
          </div>
        </div>
        <!-- Chat Area -->
        <div class="game-chat">
          <div class="chat-messages">
            <div 
              v-for="(msg, idx) in chatHistory" 
              :key="idx"
              :class="['chat-message', msg.type]"
            >
              <div class="message-text">{{ msg.text }}</div>
              <div v-if="msg.effects && Object.keys(msg.effects).length > 0" class="message-effects">
                <div v-if="msg.effects.budget">💰 Budget: {{ msg.effects.budget > 0 ? '+' : '' }}€{{ msg.effects.budget }}</div>
                <div v-if="msg.effects.burnout">🔥 Burnout: {{ msg.effects.burnout > 0 ? '+' : '' }}{{ msg.effects.burnout }}%</div>
                <div v-if="msg.effects.salary">💼 Stipendio: €{{ msg.effects.salary }}</div>
              </div>
            </div>
          </div>
          <div v-if="!isGameOver && !isGameWon && !isGameFinished" class="chat-input-area">
            <div class="action-buttons">
              <button
                v-for="(action, idx) in availableActions"
                :key="idx"
                @click="handleAction(action)"
                :class="['action-btn', { 'side-quest-action': (action as any).isSideQuest }]"
              >
                {{ action.text }}
              </button>
            </div>
          </div>
          <div v-else-if="isGameWon" class="game-won-screen">
            <h3>🎉 VITTORIA!</h3>
            <p>Hai accumulato {{ character.aura }} punti Aura! Hai trovato un equilibrio nel capitalismo.</p>
            <button @click="restartGame" class="restart-btn">🔄 RESTART</button>
          </div>
          <div v-else-if="isGameFinished" class="game-finished-screen">
            <h3>🎭 Congratulazioni, hai vinto!</h3>
            <p>Hai esaurito tutte le azioni disponibili. Hai vissuto tutte le esperienze possibili nel capitalismo.</p>
            <p><strong>Sei bravissimo, ricco e bellissimo.</strong> Non hai raggiunto la realizzazione spirituale in questa vita, ma nel capitalismo sì.</p>
            <p>Hai accumulato €{{ character.budget }}, {{ character.aura }} punti Aura, e {{ character.burnout }}% di burnout.</p>
            <button @click="restartGame" class="restart-btn">🔄 RESTART</button>
          </div>
          <div v-else class="game-over-screen">
            <h3>🚫 GAME OVER</h3>
            <p>{{ character.burnout >= 100 ? 'BURNOUT TOTALE - Hai ceduto mentalmente' : 'BANCAROTTA - Sei finito in rosso' }}</p>
            <button @click="restartGame" class="restart-btn">🔄 RESTART</button>
          </div>
        </div>
      </div>
      <div class="status-bar">
        <p class="status-bar-field">In gioco...</p>
        <p class="status-bar-field">Budget: €{{ character.budget }}</p>
        <p class="status-bar-field">Burnout: {{ character.burnout }}%</p>
        <p class="status-bar-field">Aura: {{ character.aura }}</p>
        <p class="status-bar-field">Mese: {{ month }}</p>
      </div>
    </div>

    <!-- Taskbar -->
    <div class="taskbar">
      <button class="start-btn">
        <span class="start-icon">⊞</span>
        Start
      </button>
      <div class="taskbar-tasks">
        <button class="taskbar-task active">💸 Capitalism Simulator</button>
      </div>
      <div class="taskbar-clock">{{ currentTime }}</div>
    </div>

    <!-- Card Result Modal -->
    <div v-if="showCardModal" class="card-modal-overlay" @click.self="closeCardModal">
      <div class="card-modal">
        <div class="card-modal-header">
          <h3>🎴 Tiro di Briscola</h3>
        </div>
        <div class="card-modal-body">
          <div v-if="showCardResult && cardModalResult" class="card-result">
            <div class="card-result-icon">
              <span v-if="cardModalResult.result === 'successo-critico'">🎯</span>
              <span v-else-if="cardModalResult.result === 'successo'">✅</span>
              <span v-else-if="cardModalResult.result === 'fallimento-parziale'">⚠️</span>
              <span v-else>❌</span>
            </div>
            <div class="card-result-text">{{ cardModalResult.text }}</div>
          </div>
          <div v-else class="card-modal-loading">
            <div class="loading-spinner"></div>
            <p>Calcolo risultato...</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const { isNight, toggleTheme } = useTheme()

// Constants
const RACES = [
  {
    id: 'influencer',
    name: 'Influencer',
    desc: 'Vivi di like e follower. La tua autostima dipende dai numeri.',
    avatar: '🧑‍💻',
    stats: { abilita: 2, resilienza: -1, carisma: 3, saggezza: -2 }
  },
  {
    id: 'faccio-cose-vedo-gente',
    name: 'Faccio Cose Vedo Gente',
    desc: 'Ricco di famiglia che deve "capire cosa fare da grande". I soldi arrivano comunque.',
    avatar: '👨‍🎨​',
    stats: { abilita: 1, resilienza: 2, carisma: 2, saggezza: -1 }
  },
  {
    id: 'startup-bro',
    name: 'Startup Bro',
    desc: 'Disruption! Innovation! Debiti studenteschi a 5 zeri!',
    avatar: '👨‍💼',
    stats: { abilita: 2, resilienza: 0, carisma: 2, saggezza: -2 }
  },
  {
    id: 'boomer-rentier',
    name: 'Boomer Rentier',
    desc: 'Hai comprato casa a 30 anni. Non capisci perché i giovani si lamentano.',
    avatar: '🏠',
    stats: { abilita: -1, resilienza: 3, carisma: 0, saggezza: -1 }
  },
  {
    id: 'millennial-ansioso',
    name: 'Millennial Ansioso',
    desc: 'Crisi climatica, crisi economica, crisi esistenziale. Tutto crisi.',
    avatar: '😰',
    stats: { abilita: 2, resilienza: -2, carisma: 0, saggezza: 2 }
  },
  {
    id: 'genz-disilluso',
    name: 'Gen Z Disilluso',
    desc: 'Hai capito che è tutto una truffa a 16 anni. Troppo cinico per l\'età.',
    avatar: '🎭',
    stats: { abilita: 1, resilienza: 0, carisma: -1, saggezza: 3 }
  }
]

const CLASSES = [
  {
    id: 'subordinato',
    name: 'Il Subordinato',
    desc: 'Lavori per qualcun altro. Stipendio fisso, libertà zero.',
    subclasses: [
      { id: 'obbediente', name: 'L\'Obbediente', desc: 'Dici sempre sì. "Certo capo, nessun problema capo"', avatar: '🫡' },
      { id: 'rampante', name: 'Il Rampante', desc: 'Vuoi fare carriera. Sacrifichi tutto per salire', avatar: '📈' },
      { id: 'testa-bassa', name: 'Testa Bassa', desc: 'Sopravvivi. Fai il minimo, esci alle 18:00', avatar: '😑' }
    ]
  },
  {
    id: 'indipendente',
    name: 'L\'Indipendente',
    desc: 'Sei "libero professionista". Libero di morire di fame.',
    subclasses: [
      { id: 'freelance', name: 'Il Freelance Eterno', desc: 'Partita IVA e zero certezze. "Flessibilità"', avatar: '💼' },
      { id: 'consulente', name: 'Il Consulente', desc: 'Vendi competenze a ore. €50/ora sembra tanto, ma...', avatar: '🎯' },
      { id: 'gig-worker', name: 'Il Gig Worker', desc: 'App, algoritmi, deliveroo. Il futuro è qui', avatar: '🚴' }
    ]
  },
  {
    id: 'disilluso',
    name: 'Il Disilluso',
    desc: 'Hai capito che è una truffa. Ora cosa fai?',
    subclasses: [
      { id: 'minimalista', name: 'Il Minimalista', desc: 'Lavori poco, vivi con poco. "Meno è meglio"', avatar: '🌿' },
      { id: 'escapista', name: 'L\'Escapista', desc: 'Fuggi nella nicchia. Hobbies, passioni, sopravvivenza', avatar: '🎨' },
      { id: 'antisistema', name: 'L\'Anti-sistema', desc: 'Decrescita, baratto, comunità. Utopie necessarie', avatar: '✊' }
    ]
  }
]

const FAMILIARS = [
  { id: 'geppetto', name: 'Geppetto il Segugio', desc: 'Cane nerd che vive di manga e anime.', avatar: '🦮', trait: 'Fuga nella narrazione' },
  { id: 'calpurnia', name: 'Calpurnia la Gatta', desc: 'Gatta che ti giudica mentre guardi serie TV.', avatar: '🐱', trait: 'Intorpidimento emotivo' },
  { id: 'armando', name: 'Armando il Pappagallo', desc: 'Pappagallo che ripete "Spritz! Spritz!"', avatar: '🦜', trait: 'Socialità di facciata' },
  { id: 'bruno', name: 'Bruno il Toro', desc: 'Toro da palestra. Pesi, proteine, addominali.', avatar: '🐂', trait: 'Controllo corporeo' }
]

const FAMILIAR_QUIZ = [
  {
    q: 'Hai finito di lavorare alle 19. Sei esausto. Cosa fai?',
    answers: [
      { text: 'Crollo sul divano con Netflix', familiar: 'calpurnia' },
      { text: 'Apro TikTok "giusto 5 minuti"', familiar: 'armando' },
      { text: 'Vado in palestra a scaricare', familiar: 'bruno' },
      { text: 'Leggo manga o fumetti', familiar: 'geppetto' }
    ]
  },
  {
    q: 'È domenica sera. Il pensiero del lunedì ti assale. Come reagisci?',
    answers: [
      { text: 'Mi perdo in un videogioco per ore', familiar: 'geppetto' },
      { text: 'Faccio un allenamento intenso', familiar: 'bruno' },
      { text: 'Aggiungo cose al carrello Amazon', familiar: 'calpurnia' },
      { text: 'Esco per un drink con amici', familiar: 'armando' }
    ]
  },
  {
    q: 'Ti senti solo e disconnesso. Dove cerchi conforto?',
    answers: [
      { text: 'Nel mio fandom online preferito', familiar: 'geppetto' },
      { text: 'Nei social, scrollando vite altrui', familiar: 'armando' },
      { text: 'In palestra, sfogandomi', familiar: 'bruno' },
      { text: 'Guardando serie TV fino a tardi', familiar: 'calpurnia' }
    ]
  },
  {
    q: 'Hai 50€ extra questo mese. Come li usi?',
    answers: [
      { text: 'Nuovo manga/fumetto che aspettavo', familiar: 'geppetto' },
      { text: 'Shopping online random', familiar: 'calpurnia' },
      { text: 'Aperitivi con amici', familiar: 'armando' },
      { text: 'Integratori palestra e proteine', familiar: 'bruno' }
    ]
  }
]

// Side Quests
const SIDE_QUESTS: SideQuest[] = [
  {
    id: 'therapy',
    title: 'Fai terapia',
    description: 'Investi nella tua salute mentale. Costoso ma necessario.',
    requirements: { minBudget: 150 },
    rewards: { budget: -150, burnout: -20, aura: 10 },
    narrative: 'Inizi a fare terapia. "Finalmente", pensi. La salute mentale viene prima.',
    completionNarrative: 'La terapia ti aiuta. Ti senti meglio, più in equilibrio.'
  },
  {
    id: 'volunteer',
    title: 'Fai volontariato',
    description: 'Aiuti gli altri. Non paghi, ma guadagni in umanità.',
    requirements: { maxBurnout: 50 },
    rewards: { burnout: 5, aura: 8 },
    narrative: 'Fai volontariato in un centro di accoglienza. "Dare è ricevere", pensi.',
    completionNarrative: 'Aiutare gli altri ti dà senso. L\'aura aumenta.'
  },
  {
    id: 'course',
    title: 'Fai un corso di formazione',
    description: 'Investi in te stesso. Potrebbe aiutare la carriera.',
    requirements: { minBudget: 200 },
    rewards: { budget: -200, burnout: 3, aura: 3 },
    narrative: 'Fai un corso online. "Migliorerò le mie competenze", pensi.',
    completionNarrative: 'Il corso ti ha dato nuove competenze. Ti senti più preparato.'
  },
  {
    id: 'protest',
    title: 'Partecipa a una manifestazione',
    description: 'Lotti per i tuoi diritti. Perdi un giorno di lavoro.',
    requirements: { race: 'genz-disilluso' },
    rewards: { budget: -200, burnout: -5, aura: 12 },
    narrative: 'Partecipi a una manifestazione. "Il sistema non ci avrà", dici.',
    completionNarrative: 'Hai lottato per un futuro migliore. L\'aura aumenta.'
  },
  {
    id: 'collective',
    title: 'Organizza un collettivo',
    description: 'Unisci i lavoratori precari. Networking e lotta.',
    rewards: { burnout: 3, aura: 10 },
    narrative: 'Organizzi un collettivo di lavoratori. "L\'unione fa la forza", dici.',
    completionNarrative: 'Hai creato una rete di solidarietà. L\'aura aumenta.'
  },
  {
    id: 'detox',
    title: 'Fai un detox digitale',
    description: 'Stacchi dai social per una settimana. Rigenerante.',
    requirements: { race: 'influencer' },
    rewards: { burnout: -25, aura: 15 },
    narrative: 'Fai un detox digitale. "Finalmente pace", pensi.',
    completionNarrative: 'Il distacco ti ha rigenerato. Ti senti rinato.'
  },
  {
    id: 'hobby',
    title: 'Dedicati a un hobby',
    description: 'Fai qualcosa che ti piace. Non paghi, ma ti fa stare bene.',
    rewards: { burnout: -10, aura: 5 },
    narrative: 'Dedichi tempo a un hobby. "Finalmente qualcosa per me", pensi.',
    completionNarrative: 'Fare qualcosa che ti piace ti ha rigenerato.'
  },
  {
    id: 'help-friend',
    title: 'Aiuta un amico in difficoltà',
    description: 'Presti soldi a un amico. Costoso ma umano.',
    requirements: { minBudget: 300 },
    rewards: { budget: -300, aura: 8 },
    narrative: 'Un amico ti chiede aiuto. "Non posso dire di no", pensi.',
    completionNarrative: 'Aiutare un amico ti ha dato senso. L\'aura aumenta.'
  },
  {
    id: 'learn-skill',
    title: 'Impara una nuova skill',
    description: 'Investi tempo in una competenza. Potrebbe aiutare.',
    requirements: { minBudget: 150 },
    rewards: { budget: -150, burnout: 3, aura: 4 },
    narrative: 'Imparare qualcosa di nuovo. "Migliorerò", pensi.',
    completionNarrative: 'La nuova skill ti ha dato più sicurezza.'
  },
  {
    id: 'say-no',
    title: 'Dici no a una richiesta',
    description: 'Rifiuti qualcosa che non ti va. Liberatorio.',
    rewards: { burnout: -12, aura: 6 },
    narrative: 'Dici no. "Finalmente", pensi. "Non posso sempre dire sì".',
    completionNarrative: 'Dire no ti ha dato potere. Ti senti più libero.'
  },
  {
    id: 'community',
    title: 'Partecipa a una comunità',
    description: 'Ti unisci a una comunità locale. Networking e supporto.',
    rewards: { burnout: -8, aura: 7 },
    narrative: 'Ti unisci a una comunità. "Non sono solo", pensi.',
    completionNarrative: 'La comunità ti ha dato supporto. L\'aura aumenta.'
  },
  {
    id: 'creative-project',
    title: 'Inizia un progetto creativo',
    description: 'Fai qualcosa di creativo. Non paghi, ma ti soddisfa.',
    rewards: { burnout: -15, aura: 10 },
    narrative: 'Inizi un progetto creativo. "Finalmente esprimo me stesso", pensi.',
    completionNarrative: 'Creare qualcosa ti ha dato gioia. L\'aura aumenta.'
  }
]

// Rich kid (faccio-cose-vedo-gente) specific events
const RICH_KID_EVENTS = [
  { 
    text: '🎨 Ti iscrivi a un corso di ceramica. €500. "Sto esplorando la mia creatività", dici.', 
    budget: -500, 
    burnout: -5,
    aura: 2,
    narrative: 'Ti iscrivi a un corso di ceramica. "Sto esplorando la mia creatività", dici. I tuoi genitori sono contenti: "Finalmente fai qualcosa".'
  },
  { 
    text: '🧘 Viaggio "spirituale" in India. €3000. "Devo trovare me stesso", dici.', 
    budget: -3000, 
    burnout: -15, 
    aura: 5,
    narrative: 'Prenoti un viaggio "spirituale" in India. "Devo trovare me stesso", dici. I tuoi genitori pagano: "È un\'esperienza formativa".'
  },
  { 
    text: '☕ Apri un "progetto" di caffè. Investimento: €5000. "È la mia passione", dici.', 
    budget: -5000, 
    burnout: 10,
    narrative: 'Apri un "progetto" di caffè. "È la mia passione", dici. I tuoi genitori investono: "Vediamo se funziona".'
  },
  { 
    text: '📚 Fai un master in "qualcosa". €8000. "Mi serve per crescere", dici.', 
    budget: -8000, 
    burnout: 5,
    narrative: 'Ti iscrivi a un master. "Mi serve per crescere", dici. I tuoi genitori pagano: "L\'istruzione è importante".'
  },
  { 
    text: '🎭 Workshop di teatro. €300. "Sto esplorando", dici.', 
    budget: -300, 
    burnout: -3, 
    aura: 3,
    narrative: 'Fai un workshop di teatro. "Sto esplorando", dici. "Forse è la mia passione", pensi. Ma tra un mese sarà un\'altra.'
  },
  { 
    text: '💼 Stage non pagato. "È per il CV", dici. Ma i soldi arrivano comunque.', 
    budget: 0, 
    burnout: 8,
    narrative: 'Fai uno stage non pagato. "È per il CV", dici. "L\'esperienza è importante". Ma i soldi arrivano comunque dai genitori.'
  },
  { 
    text: '🍷 Cena con "network". €200. "Networking è importante", dici.', 
    budget: -200, 
    burnout: -2, 
    aura: 1,
    narrative: 'Ceni con il tuo "network". "Networking è importante", dici. "Sto costruendo relazioni". Ma in realtà bevi solo vino.'
  },
  { 
    text: '✈️ Weekend a Parigi. €800. "Ho bisogno di ispirazione", dici.', 
    budget: -800, 
    burnout: -10, 
    aura: 3,
    narrative: 'Fai un weekend a Parigi. "Ho bisogno di ispirazione", dici. "Sto cercando me stesso". Ma in realtà fai shopping.'
  },
  { 
    text: '🎵 Corso di produzione musicale. €1200. "Forse è la mia passione", dici.', 
    budget: -1200, 
    burnout: 3,
    narrative: 'Ti iscrivi a un corso di produzione musicale. "Forse è la mia passione", dici. "Sto esplorando". Ma tra un mese sarà un\'altra.'
  },
  { 
    text: '🏖️ Vacanza "di riflessione". €2500. "Devo capire cosa voglio", dici.', 
    budget: -2500, 
    burnout: -12, 
    aura: 4,
    narrative: 'Fai una vacanza "di riflessione". "Devo capire cosa voglio", dici. I tuoi genitori pagano: "Prenditi il tuo tempo".'
  },
  { 
    text: '⚖️ Hai vinto una causa contro il governo. Risarcimento: +€10000. "Finalmente giustizia", dici.', 
    budget: 10000, 
    burnout: -10, 
    aura: 3,
    narrative: 'Hai vinto una causa contro il governo per un errore burocratico. "Finalmente giustizia", dici. I soldi arrivano sul conto.'
  },
  { 
    text: '🏛️ Rimborso tasse inaspettato. +€10000. "Il sistema funziona", pensi.', 
    budget: 10000, 
    burnout: -5, 
    aura: 2,
    narrative: 'Ricevi un rimborso fiscale inaspettato. "Il sistema funziona", pensi. "A volte tornano indietro".'
  },
  { 
    text: '💼 Risarcimento da un\'azienda. +€10000. "Hanno sbagliato, ora pagano", dici.', 
    budget: 10000, 
    burnout: -8, 
    aura: 4,
    narrative: 'Ricevi un risarcimento da un\'azienda per un danno subito. "Hanno sbagliato, ora pagano", dici. "Giustizia è fatta".'
  },
  { 
    text: '🎁 Eredità inaspettata da un parente lontano. +€10000. "Non me lo aspettavo", pensi.', 
    budget: 10000, 
    burnout: -15, 
    aura: 5,
    narrative: 'Ricevi un\'eredità inaspettata da un parente lontano. "Non me lo aspettavo", pensi. "La fortuna esiste".'
  },
  { 
    text: '👵 Zia Enrichetta ti ha lasciato un\'eredità. +€8000. "Non la conoscevo nemmeno", pensi.', 
    budget: 8000, 
    burnout: -12, 
    aura: 4,
    narrative: 'Ricevi una chiamata dall\'avvocato: zia Enrichetta ti ha lasciato un\'eredità. "Non la conoscevo nemmeno", pensi. "Ma grazie zia".'
  },
  { 
    text: '🏠 I tuoi genitori ti aiutano con l\'affitto. +€2500. "Sono così generosi", pensi.', 
    budget: 2500, 
    burnout: -8, 
    aura: 3,
    narrative: 'I tuoi genitori ti fanno un bonifico per l\'affitto. "Sono così generosi", pensi. "Non me lo aspettavo".'
  },
  { 
    text: '💸 Papà ti fa un bonifico "per le spese". +€3000. "Sempre disponibile", pensi.', 
    budget: 3000, 
    burnout: -10, 
    aura: 2,
    narrative: 'Ricevi un bonifico da papà con la causale "per le spese". "Sempre disponibile", pensi. "Che bravo papà".'
  }
]

// Boomer-rentier specific events
const BOOMER_EVENTS = [
  // Eventi positivi (più frequenti)
  { 
    text: '💰 Affitto pagato in anticipo. Bonus: +€500. "Ottimi inquilini", pensi.', 
    budget: 500, 
    burnout: -3,
    narrative: 'L\'inquilino ti paga 3 mesi in anticipo. "Ottimo", pensi. "Affidabile".'
  },
  { 
    text: '🏖️ Stagione alta Airbnb. Affitti extra: +€800. "Il turismo paga", pensi.', 
    budget: 800, 
    burnout: -5,
    narrative: 'È stagione alta. Gli affitti Airbnb vanno a ruba. Guadagni extra.'
  },
  { 
    text: '📈 Valore immobiliare aumentato. Guadagno inatteso: +€1000. "Ottimo investimento", pensi.', 
    budget: 1000, 
    burnout: -2,
    narrative: 'Il valore dei tuoi immobili è aumentato. "Ho fatto bene a investire", pensi.'
  },
  { 
    text: '💼 Nuovo affitto a lungo termine. Introito: +€400/mese. "Stabilità", pensi.', 
    salary: 400,
    narrative: 'Trovi un nuovo inquilino per un affitto a lungo termine. "Stabilità", pensi. "Meglio così".'
  },
  { 
    text: '🎁 Regalo da un inquilino riconoscente. +€300. "Che brava persona", pensi.', 
    budget: 300, 
    burnout: -3,
    aura: 2,
    narrative: 'Un inquilino ti porta un regalo. "Grazie per tutto", dice. "Che brava persona", pensi.'
  },
  { 
    text: '🏠 Affitti un altro immobile. Introito: +€350/mese. "Espando il business", pensi.', 
    salary: 350,
    narrative: 'Affitti un altro immobile che avevi. "Espando il business", pensi. "Più immobili, più guadagni".'
  },
  { 
    text: '💵 Rimborso tasse. +€600. "Finalmente", pensi.', 
    budget: 600, 
    burnout: -2,
    narrative: 'Ricevi un rimborso dalle tasse. "Finalmente qualcosa torna indietro", pensi.'
  },
  { 
    text: '🎉 Fai una vacanza alle Maldive. €3000. "Me lo merito", pensi.', 
    budget: -3000, 
    burnout: -20, 
    aura: 5,
    narrative: 'Prenoti una vacanza alle Maldive. "Finalmente un po\' di relax", pensi. Il sole, il mare, il lusso.'
  },
  { 
    text: '🍾 Cena al ristorante stellato: €250. "La vita è breve", dici.', 
    budget: -250, 
    burnout: -8, 
    aura: 3,
    narrative: 'Prenoti una cena al ristorante stellato. "Me lo merito", pensi. Il cibo è divino.'
  },
  { 
    text: '👨‍🎓 Affitti una stanza a uno studente. Introito: +€300/mese.', 
    salary: 300,
    narrative: 'Affitti una stanza a uno studente. "Meglio di niente", pensi. Gli studenti pagano poco ma sono affidabili.'
  },
  { 
    text: '🏌️ Iscrizione al golf club: €2000/anno. "Networking", dici.', 
    budget: -2000, 
    burnout: -5, 
    aura: 2,
    narrative: 'Ti iscrivi al golf club. "Networking", dici. "Gli affari si fanno sul green".'
  },
  // Eventi negativi (ridotti e meno frequenti)
  { 
    text: '🚽 Inquilino ha cagato in salotto. Chiami la signora delle pulizie: €40. "Ma che gente!", pensi.', 
    budget: -40, 
    burnout: 3,
    narrative: 'Ricevi una chiamata dall\'inquilino. "C\'è stato un... incidente", dice. Vai a vedere: c\'è merda in salotto. Chiami la signora delle pulizie.'
  },
  { 
    text: '💊 Visita specialistica privata: €200. "Il SSN? Troppo lento", dici.', 
    budget: -200, 
    burnout: -3,
    narrative: 'Hai un problema di salute. "Vado dal privato", dici. "Il SSN è troppo lento".'
  },
  { 
    text: '🏠 Inquilino non paga l\'affitto. Devi sfrattarlo: €300 per avvocato.', 
    budget: -300, 
    burnout: 5,
    narrative: 'L\'inquilino non paga. "Devo sfrattarlo", pensi. Chiami l\'avvocato.'
  },
  { 
    text: '🔥 Gli inquilini ti hanno distrutto il piano cottura a induzione. Riparazione: €300. "Ma che gente!", pensi.', 
    budget: -300, 
    burnout: 4,
    narrative: 'Ricevi una chiamata dall\'inquilino Airbnb. "C\'è stato un... problema con il piano cottura", dice. Vai a vedere: il piano a induzione è completamente distrutto. Devi chiamare un tecnico.'
  },
  { 
    text: '💧 Perdita d\'acqua nell\'appartamento Airbnb. Idraulico: €150. "Questi affitti brevi sono un incubo", pensi.', 
    budget: -150, 
    burnout: 3,
    narrative: 'L\'inquilino ti chiama: "C\'è acqua dappertutto!". Corri a vedere: c\'è una perdita. Chiami l\'idraulico d\'urgenza.'
  },
  { 
    text: '🛋️ I mobili del salotto sono rovinati. Sostituzione: €400. "Gli affitti brevi costano", pensi.', 
    budget: -400, 
    burnout: 3,
    narrative: 'Vai a controllare l\'appartamento dopo un affitto. I mobili del salotto sono completamente rovinati. "Devo sostituirli", pensi.'
  },
  { 
    text: '🔌 Gli inquilini hanno bruciato le prese elettriche. Elettricista: €200. "Ma cosa ci hanno fatto?", pensi.', 
    budget: -200, 
    burnout: 4,
    narrative: 'L\'inquilino ti avvisa: "Le prese non funzionano più". Vai a vedere: sono completamente bruciate. "Cosa ci hanno attaccato?", pensi.'
  },
  { 
    text: '🔧 Ristrutturazione bagno: €2000. "Aumenta il valore", pensi.', 
    budget: -2000, 
    burnout: 2,
    narrative: 'Ristrutturi il bagno di un immobile. "Aumenterà il valore", pensi. Costoso ma necessario.'
  },
  { 
    text: '🎁 Compri un Rolex. €5000. "È un investimento", dici.', 
    budget: -5000, 
    aura: -3,
    narrative: 'Compri un Rolex. "È un investimento", dici. "I gioielli mantengono il valore".'
  },
  { 
    text: '⚖️ Hai vinto una causa contro il governo. Risarcimento: +€10000. "Finalmente giustizia", pensi.', 
    budget: 10000, 
    burnout: -10, 
    aura: 3,
    narrative: 'Hai vinto una causa contro il governo per un errore burocratico. "Finalmente giustizia", pensi. I soldi arrivano sul conto.'
  },
  { 
    text: '🏛️ Rimborso tasse inaspettato. +€10000. "Il sistema funziona", pensi.', 
    budget: 10000, 
    burnout: -5, 
    aura: 2,
    narrative: 'Ricevi un rimborso fiscale inaspettato. "Il sistema funziona", pensi. "A volte tornano indietro".'
  },
  { 
    text: '💼 Risarcimento da un\'azienda. +€10000. "Hanno sbagliato, ora pagano", pensi.', 
    budget: 10000, 
    burnout: -8, 
    aura: 4,
    narrative: 'Ricevi un risarcimento da un\'azienda per un danno subito. "Hanno sbagliato, ora pagano", pensi. "Giustizia è fatta".'
  },
  { 
    text: '🏠 Vendita immobile extra. Guadagno inatteso: +€10000. "Ottimo investimento", pensi.', 
    budget: 10000, 
    burnout: -12, 
    aura: 5,
    narrative: 'Vendi un immobile che avevi dimenticato. "Ottimo investimento", pensi. "A volte dimenticare paga".'
  },
  { 
    text: '💰 Rimborso mutuo inaspettato. +€10000. "Finalmente", pensi.', 
    budget: 10000, 
    burnout: -6, 
    aura: 2,
    narrative: 'Ricevi un rimborso inaspettato da una banca per un errore nel mutuo. "Finalmente", pensi. "A volte le banche sbagliano in positivo".'
  },
  { 
    text: '⚖️ Hai vinto la causa contro il tuo ex socio Brambilla. +€4500. "Finalmente giustizia", pensi.', 
    budget: 4500, 
    burnout: -8, 
    aura: 4,
    narrative: 'Hai vinto la causa contro il tuo ex socio Brambilla. "Finalmente giustizia", pensi. "Quel truffatore ha pagato".'
  },
  { 
    text: '🏖️ Affitto della seconda casa al mare. +€3200/mese. "Il turismo paga", pensi.', 
    salary: 3200,
    narrative: 'Affitti la tua seconda casa al mare. "Il turismo paga", pensi. "Meglio così".'
  },
  { 
    text: '📈 Dividendi dalle tue azioni Eni. +€5000. "Gli investimenti funzionano", pensi.', 
    budget: 5000, 
    burnout: -5, 
    aura: 3,
    narrative: 'Ricevi i dividendi dalle tue azioni Eni. "Gli investimenti funzionano", pensi. "Ho fatto bene a comprare".'
  }
]

const RANDOM_EVENTS = [
  { text: '💻 MacBook rotto. Riparazione: €650. "Ma come si fa a lavorare senza?"', budget: -650, burnout: 15 },
  { text: '🫧 Lavatrice morta. €400 per nuova. Intanto lavi a mano come nel medioevo.', budget: -400, burnout: 10 },
  { text: '🚗 Multa: €80. Eri in ritardo al lavoro. Ironia della sorte.', budget: -80, burnout: 8 },
  { text: '⚡ Bolletta Enel: €240 invece di €80. "Conguaglio" dicono.', budget: -160, burnout: 15 },
  { text: '📱 Smartphone caduto. €180 riparazione o vivi col vetro rotto?', budget: -180, burnout: 8 },
  { text: '🦷 Dentista: "Hai una carie". Tu: "Quanto costa?". Lui: "€300".', budget: -300, burnout: 10 },
  { text: '👓 Occhiali rotti. Nuovi: €250. Ora capisci i boomer.', budget: -250, burnout: 5 },
  { text: '🚗 Revisione auto: €450. "È quasi nuova!" mentivi.', budget: -450, burnout: 10 },
  { text: '💒 Matrimonio del cugino. Regalo minimo: €150.', budget: -150, burnout: 5 },
  { text: '🏥 Visita specialistica: €120. Il SSN? "Appuntamento tra 8 mesi".', budget: -120, burnout: 8 },
  { text: '📊 Riunione venerdì 18:30. 2 ore gratis. "Team building"', burnout: 20 },
  { text: '📧 Email urgente domenica 23:47. Risposta entro lunedì 8:00.', burnout: 18 },
  { text: '😷 Collega assenteista malato. Indovina chi fa il suo lavoro?', burnout: 15 },
  { text: '💰 Trovi €20 nel giubbotto dell\'anno scorso!', budget: 20, burnout: -3 },
  { text: '👵 Nonna ti dà €50 "per le spese". Grazie nonna!', budget: 50, burnout: -5 },
  { text: '💸 Rimborso 730: €280! Poi arriva la bolletta del gas.', budget: 280, burnout: -10 }
]

// Predefined backstories for each race/class combination
const BACKSTORIES: Record<string, Record<string, string>> = {
  'influencer': {
    'obbediente': `Sei nato a Milano, in una famiglia che ha sempre creduto nel "personal branding". A 18 anni hai aperto TikTok e Instagram. La tua laurea in Scienze della Comunicazione? Un optional. I follower sono tutto.\n\nHai iniziato facendo video di "day in my life" e "get ready with me". Poi sono arrivati i brand: skincare, fast fashion, integratori. Ogni post è un calcolo: hashtag, orario, engagement rate.\n\nLa tua autostima oscilla con i numeri. 10K follower? Felice. 9.8K? Ansia. Il tuo capo (un'agenzia di influencer marketing) ti paga in visibilità e prodotti. Soldi veri? Pochi.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'rampante': `Sei nato a Roma, figlio di genitori che hanno sempre creduto nel "networking". Instagram è la tua seconda natura. A 20 anni hai già collaborato con brand internazionali.\n\nHai capito che l'influencer è un lavoro. Studi algoritmi, A/B testing dei contenuti, timing perfetto. Il tuo obiettivo? Diventare macro-influencer, aprire un'agenzia, monetizzare tutto.\n\nSacrifichi tutto: amicizie, relazioni, tempo libero. Ogni momento è content. La tua vita è un set. Ma i soldi arrivano, lentamente.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'testa-bassa': `Sei nato a Napoli, dove "fare l'influencer" è ancora visto come "non un vero lavoro". Ma tu lo fai comunque, perché è meglio di niente.\n\nPosti quando ti va, accetti collaborazioni quando pagano (spesso poco). Non ti stressi per i numeri. Esci alle 18:00, anche se significa perdere il "golden hour" per le stories.\n\nLa tua filosofia: "Faccio il minimo, guadagno il minimo, ma almeno non mi brucio". I brand ti cercano per campagne low-budget. Va bene così.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'freelance': `Sei nato a Torino, dove il "fare da soli" è una tradizione. Instagram è la tua vetrina. Non lavori per nessuno, sei il tuo capo.\n\nGestisci tutto: contenuti, contratti, fatturazione, tasse. Partita IVA, regime forfettario. Ogni mese è diverso: a volte guadagni bene, a volte zero.\n\nI brand ti cercano per progetti spot. Niente contratti fissi, niente sicurezza. Ma sei libero. Libero di morire di fame, certo, ma libero.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'consulente': `Sei nato a Firenze, dove l'arte del "vendere se stessi" è antica. Non sei solo influencer: sei consulente di social media marketing.\n\nVendi competenze: strategia content, gestione community, analisi dati. €50/ora sembra tanto, ma tra tasse e tempi morti...\n\nI clienti ti chiamano per "una consulenza veloce" che diventa un progetto di mesi. Fatturi a ore, ma le ore non bastano mai.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'faccio-cose-vedo-gente': `Sei nato a Milano, in una famiglia ricca. Papà ha un'azienda, mamma fa la filantropa. Tu? "Devo capire cosa fare da grande", dici.\n\nHai studiato all'università privata, fatto l'Erasmus a Parigi, il gap year in Australia. "Esperienze formative", dicono i tuoi genitori. Tu intanto spendi.\n\nI soldi arrivano ogni mese sul conto. "È per le spese", dicono. Ma tu non lavori. Fai "cose": corsi di yoga, workshop di ceramica, viaggi "spirituali" in India.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'minimalista': `Sei nato a Genova, dove il "meno è meglio" è una filosofia. Instagram? Lo usi, ma non ti consuma. Posti quando ti va, senza ansia.\n\nLavori poco, vivi con poco. Le collaborazioni le accetti solo se ti pagano bene. Niente prodotti gratis, niente sconti. Solo soldi veri.\n\nLa tua vita è semplice: pochi oggetti, pochi impegni, pochi follower. Ma sei felice. O almeno, meno infelice degli altri.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'escapista': `Sei nato a Palermo, dove la "fuga" è un'arte. Instagram è solo una nicchia: posti foto di libri, mostre, viaggi low-cost.\n\nFuggi nella cultura. Hobbies, passioni, sopravvivenza. I brand non ti cercano (troppo "di nicchia"), ma va bene così.\n\nVivi di collaborazioni occasionali e progetti creativi. Non diventerai mai famoso, ma almeno mantieni la tua anima.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'antisistema': `Sei nato a Bari, dove il "sistema" è sempre stato una truffa. Instagram? Lo usi per criticare il capitalismo, ironicamente.\n\nPosti contenuti satirici, critici, anti-consumismo. I brand ti evitano (troppo "contro"), ma hai una community fedele.\n\nDecrescita, baratto, comunità. Utopie necessarie. Vivi con poco, condividi tutto. Il capitalismo non ti avrà.\n\nEccoti qui. Adesso inizia il gioco della vita.`
  },
  'faccio-cose-vedo-gente': {
    'obbediente': `Sei nato a Milano, in una famiglia ricca. Papà ha un'azienda, mamma fa la filantropa. Tu? "Devo capire cosa fare da grande", dici.\n\nI tuoi genitori ti danno €2000/mese. "È per le spese", dicono. Tu fai "cose": corsi di yoga, workshop di ceramica, viaggi "spirituali".\n\nDici sempre sì: "Certo mamma, faccio il corso di mindfulness". "Nessun problema papà, vado al networking event". Ma non lavori mai.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'rampante': `Sei nato a Roma, in una famiglia ricca. Papà è imprenditore, mamma è avvocato. Tu? "Voglio fare carriera", dici.\n\nMa quale carriera? Fai stage non pagati (tanto i soldi arrivano), networking event, corsi di "leadership". "Sto costruendo il mio network", dici.\n\nSacrifichi tutto per "crescere": viaggi per "formazione", corsi costosi, eventi esclusivi. Ma non lavori mai veramente.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'testa-bassa': `Sei nato a Napoli, in una famiglia ricca. Papà ha immobili, mamma fa la stilista. Tu? "Vediamo", dici.\n\nI soldi arrivano ogni mese. Tu fai "cose" quando ti va: un corso qui, un viaggio là. "Non mi stresso", pensi.\n\nSopravvivi. Fai il minimo, esci quando vuoi. "Tanto i soldi arrivano", pensi. E hai ragione.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'freelance': `Sei nato a Torino, in una famiglia ricca. Papà ha un'azienda, mamma fa la consulente. Tu? "Voglio essere indipendente", dici.\n\nMa i soldi arrivano comunque. Fai "progetti": un blog qui, un podcast là. "Sono freelance", dici. Ma non fatturi mai.\n\nGestisci tutto: "progetti", "collaborazioni", "network". Sei libero, ma anche solo. Nessun vero lavoro, nessuna vera responsabilità.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'consulente': `Sei nato a Firenze, in una famiglia ricca. Papà è architetto, mamma è gallerista. Tu? "Faccio consulenze", dici.\n\nVendi "consulenze" ai tuoi amici ricchi. €100/ora sembra tanto, ma in realtà non lavori mai. "Sto costruendo il mio brand", dici.\n\nI clienti ti chiamano per "una consulenza veloce" che diventa un pranzo. Fatturi a ore, ma le ore non bastano mai (perché non lavori).\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'gig-worker': `Sei nato a Bologna, in una famiglia ricca. Papà ha un'azienda tech, mamma fa la designer. Tu? "Faccio cose, vedo gente", dici.\n\nApp, algoritmi, "progetti". Il futuro è qui: flessibilità totale, zero responsabilità. Ogni "progetto" è un'esperienza. Ogni "collaborazione" è networking.\n\nVivi di app (per organizzare), algoritmi (per trovare eventi), "gig" (per dire che lavori). Ma i soldi arrivano comunque.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'minimalista': `Sei nato a Genova, in una famiglia ricca. Papà ha immobili, mamma fa la psicologa. Tu? "Voglio vivere con poco", dici.\n\nMa i soldi arrivano comunque. Fai "cose" minimaliste: corsi di meditazione, viaggi "essenziali", workshop di "semplicità".\n\nLavori poco, vivi con poco (relativamente). Le "cose" le fai solo se ti interessano. Niente stress, niente responsabilità. Solo "esperienze".\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'escapista': `Sei nato a Palermo, in una famiglia ricca. Papà ha un'azienda, mamma fa l'artista. Tu? "Fuggo nella creatività", dici.\n\nFuggi nella nicchia. Hobbies costosi, passioni esclusive, "sopravvivenza" (relativa). Non diventerai mai povero, ma almeno mantieni la tua anima.\n\nVivi di "progetti creativi" e "collaborazioni artistiche". La flessibilità? La usi per te, non per il sistema (che ti mantiene comunque).\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'antisistema': `Sei nato a Bari, in una famiglia ricca. Papà ha un'azienda, mamma fa la giornalista. Tu? "Critico il sistema", dici.\n\nDecrescita, baratto, comunità. Utopie necessarie. Vivi con poco (relativamente), condividi tutto (quando ti va). Il sistema ti mantiene, ma tu lo critichi.\n\nOrganizzi collettivi di "ricchi disillusi", condividi informazioni, lotti per "un futuro migliore". Il capitalismo ti mantiene, ma tu lo rifiuti.\n\nEccoti qui. Adesso inizia il gioco della vita.`
  },
  'startup-bro': {
    'obbediente': `Sei nato a Milano, dove le startup sono ovunque. A 22 anni hai fondato la tua prima app: "Uber per X". Fallita in 6 mesi.\n\nHai debiti studenteschi a 5 zeri. Ma dici sempre sì: "Certo investitore, posso cambiare il modello di business". "Nessun problema, lavoro anche la notte".\n\nIl tuo capo è un venture capitalist che ti promette milioni se "scali". Ma per ora ti paga in equity (che vale zero).\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'rampante': `Sei nato a Roma, dove "fare carriera" significa fondare startup. A 25 anni hai già 3 startup fallite e una quarta in corso.\n\nVuoi fare carriera. Sacrifichi tutto per salire: notti insonni, weekend di coding, relazioni sacrificate. Il tuo obiettivo? Exit milionaria.\n\nStudi pitch deck, modelli di business, growth hacking. Ottimizzi tutto. Ma sei sempre in debito.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'testa-bassa': `Sei nato a Napoli, dove "sopravvivere" è un'arte. Fai lo startup bro, ma solo quando ti va. Non ti stressi per i pitch o i round di finanziamento.\n\nSopravvivi. Fai il minimo, esci alle 18:00 (anche se significa perdere meeting con investitori). La startup? Va avanti, lentamente.\n\nI venture capitalist ti chiamano "poco ambizioso", ma tu sai che la salute mentale viene prima. Niente burnout, niente notti insonni.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'freelance': `Sei nato a Torino, dove il "fare da soli" è tradizione. Non lavori solo per startup: fai anche consulenze tech, sviluppi app per clienti.\n\nPartita IVA, regime forfettario. Ogni mese è diverso: a volte guadagni bene (progetti grossi), a volte zero (nessun cliente).\n\nGestisci tutto: tasse, contratti, sviluppo. Sei libero, ma anche solo. Nessun team, nessun investitore, nessuna sicurezza.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'consulente': `Sei nato a Firenze, dove "vendere competenze" è un'arte. Non fai solo startup: sei anche consulente per altre startup.\n\nVendi la tua esperienza: modelli di business, growth hacking, pitch deck. €50/ora sembra tanto, ma tra tasse e tempi morti...\n\nI clienti ti chiamano per "una consulenza veloce" che diventa un progetto. Fatturi a ore, ma le ore non bastano mai.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'faccio-cose-vedo-gente': `Sei nato a Milano, in una famiglia ricca. Papà ha un'azienda, mamma fa la filantropa. Tu? "Devo capire cosa fare da grande", dici.\n\nHai studiato all'università privata, fatto l'Erasmus, il gap year. "Esperienze formative", dicono. Tu intanto spendi.\n\nI soldi arrivano ogni mese. Fai "cose": corsi, workshop, viaggi. "Sto costruendo me stesso", dici. Ma non lavori mai.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'minimalista': `Sei nato a Genova, dove il "meno è meglio" è filosofia. Fai startup, ma solo quando serve. Non ti consumi per i round di finanziamento.\n\nLavori poco, vivi con poco. I progetti li accetti solo se convenienti. Niente notti insonni, niente burnout. Solo il necessario.\n\nLa tua vita è semplice: pochi impegni, pochi soldi, ma anche meno stress. Sei felice. O almeno, meno infelice degli altri.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'escapista': `Sei nato a Palermo, dove la "fuga" è un'arte. Startup è solo una delle tue "gig". Fai anche progetti creativi, sviluppi app per passione.\n\nFuggi nella nicchia. Hobbies, passioni, sopravvivenza. Non diventerai mai ricco, ma almeno mantieni la tua anima.\n\nVivi di progetti occasionali e lavori creativi. La flessibilità? La usi per te, non per il sistema.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'antisistema': `Sei nato a Bari, dove il "sistema" è sempre stato una truffa. Fai startup, ma critichi il capitalismo. Partecipi a collettivi tech, manifestazioni.\n\nDecrescita, baratto, comunità. Utopie necessarie. Vivi con poco, condividi tutto. Le startup ti sfruttano, ma tu resisti.\n\nOrganizzi collettivi di sviluppatori, condividi codice, lotti per diritti. Il capitalismo non ti avrà.\n\nEccoti qui. Adesso inizia il gioco della vita.`
  },
  'boomer-rentier': {
    'obbediente': `Sei nato a Milano negli anni '70, quando le case costavano poco. A 30 anni hai comprato casa. A 35 ne hai comprata un'altra da affittare.\n\nHai comprato casa a 30 anni. Non capisci perché i giovani si lamentano. "Ai miei tempi si faceva così", dici sempre.\n\nIl tuo capo è il sistema. Lavori in banca, guadagni bene, hai mutui che paghi con gli affitti. Dici sempre sì: "Certo capo, nessun problema".\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'rampante': `Sei nato a Roma negli anni '70, dove "fare carriera" significava comprare immobili. A 40 anni hai già 5 case in affitto.\n\nVuoi fare carriera. Sacrifichi tutto per salire: investi tutto in immobili, fai mutui su mutui. Il tuo obiettivo? Diventare rentier a tempo pieno.\n\nStudi mercati immobiliari, zone migliori, rendimenti. Ottimizzi tutto. Ma sei sempre in debito (anche se gli affitti coprono).\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'testa-bassa': `Sei nato a Napoli negli anni '70, dove "sopravvivere" è un'arte. Hai comprato casa a 30 anni, ma solo una. Non ti stressi per gli investimenti.\n\nSopravvivi. Fai il minimo, esci alle 18:00. La casa? La paghi, lentamente. Non diventerai mai ricco, ma almeno hai un tetto.\n\nI giovani ti chiamano "privilegiato", ma tu sai che hai solo fatto quello che si faceva ai tuoi tempi. Niente di speciale.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'freelance': `Sei nato a Torino negli anni '70, dove il "fare da soli" è tradizione. Non lavori solo per immobili: fai anche consulenze, piccoli investimenti.\n\nPartita IVA, regime forfettario. Ogni mese è diverso: a volte guadagni bene (affitti, consulenze), a volte zero (inquilini morosi).\n\nGestisci tutto: tasse, contratti, manutenzioni. Sei libero, ma anche solo. Nessun collega, nessun sindacato.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'consulente': `Sei nato a Firenze negli anni '70, dove "vendere competenze" è un'arte. Non fai solo immobili: sei anche consulente per altri rentier.\n\nVendi la tua esperienza: zone migliori, rendimenti, contratti. €50/ora sembra tanto, ma tra tasse e tempi morti...\n\nI clienti ti chiamano per "una consulenza veloce" che diventa un progetto. Fatturi a ore, ma le ore non bastano mai.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'faccio-cose-vedo-gente': `Sei nato a Milano negli anni '70, in una famiglia ricca. Papà aveva già l'azienda, mamma faceva la filantropa. Tu? "Devo capire cosa fare", dicevi.\n\nHai studiato, viaggiato, fatto "esperienze". I soldi arrivavano comunque. Fai "cose": corsi, workshop, "progetti".\n\nVivi di "passioni momentanee" e "sperimentazioni". Ogni mese è un'opportunità per "scoprire te stesso". Ma non lavori mai.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'minimalista': `Sei nato a Genova negli anni '70, dove il "meno è meglio" è filosofia. Hai comprato casa, ma solo una. Non ti consumi per gli investimenti.\n\nLavori poco, vivi con poco. Gli affitti li accetti solo se convenienti. Niente mutui su mutui, niente stress. Solo il necessario.\n\nLa tua vita è semplice: pochi impegni, pochi soldi, ma anche meno stress. Sei felice. O almeno, meno infelice degli altri.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'escapista': `Sei nato a Palermo negli anni '70, dove la "fuga" è un'arte. Immobili è solo una delle tue "gig". Fai anche progetti creativi, piccoli investimenti.\n\nFuggi nella nicchia. Hobbies, passioni, sopravvivenza. Non diventerai mai ricco, ma almeno mantieni la tua anima.\n\nVivi di progetti occasionali e lavori creativi. La flessibilità? La usi per te, non per il sistema.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'antisistema': `Sei nato a Bari negli anni '70, dove il "sistema" è sempre stato una truffa. Hai comprato casa, ma critichi il sistema immobiliare.\n\nDecrescita, baratto, comunità. Utopie necessarie. Vivi con poco, condividi tutto. Il sistema ti sfrutta, ma tu resisti.\n\nOrganizzi collettivi di inquilini, condividi informazioni, lotti per diritti. Il capitalismo non ti avrà.\n\nEccoti qui. Adesso inizia il gioco della vita.`
  },
  'millennial-ansioso': {
    'obbediente': `Sei nato a Milano negli anni '90, quando tutto iniziava a crollare. Crisi climatica, crisi economica, crisi esistenziale. Tutto crisi.\n\nHai studiato, ti sei laureato, hai fatto stage non pagati. Dici sempre sì: "Certo capo, posso fare straordinari". "Nessun problema, lavoro anche sabato".\n\nIl tuo capo è un sistema che ti promette stabilità se "ti impegni". Ma per ora ti paga poco e ti stressa tanto.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'rampante': `Sei nato a Roma negli anni '90, dove "fare carriera" significa sacrificare tutto. A 30 anni hai già cambiato 5 lavori, sempre per "crescere".\n\nVuoi fare carriera. Sacrifichi tutto per salire: notti insonni, weekend di lavoro, relazioni sacrificate. Il tuo obiettivo? Stabilità economica.\n\nStudi corsi online, certificazioni, networking. Ottimizzi tutto. Ma sei sempre ansioso. E sempre precario.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'testa-bassa': `Sei nato a Napoli negli anni '90, dove "sopravvivere" è un'arte. Fai il tuo lavoro, ma solo quando ti va. Non ti stressi per le promozioni.\n\nSopravvivi. Fai il minimo, esci alle 18:00 (anche se significa perdere opportunità). Il lavoro? Va avanti, lentamente.\n\nI capi ti chiamano "poco ambizioso", ma tu sai che la salute mentale viene prima. Niente burnout, niente ansia.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'freelance': `Sei nato a Torino negli anni '90, dove il "fare da soli" è tradizione. Non lavori solo per aziende: fai anche progetti freelance, consulenze.\n\nPartita IVA, regime forfettario. Ogni mese è diverso: a volte guadagni bene (progetti grossi), a volte zero (nessun cliente).\n\nGestisci tutto: tasse, contratti, sviluppo. Sei libero, ma anche solo. Nessun collega, nessun sindacato, nessuna sicurezza.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'consulente': `Sei nato a Firenze negli anni '90, dove "vendere competenze" è un'arte. Non fai solo progetti: sei anche consulente per altre aziende.\n\nVendi la tua esperienza: strategie, analisi, soluzioni. €50/ora sembra tanto, ma tra tasse e tempi morti...\n\nI clienti ti chiamano per "una consulenza veloce" che diventa un progetto. Fatturi a ore, ma le ore non bastano mai.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'faccio-cose-vedo-gente': `Sei nato a Milano negli anni '90, in una famiglia ricca. Papà aveva già l'azienda, mamma faceva la stilista. Tu? "Devo capire cosa fare", dicevi.\n\nHai studiato, viaggiato, fatto "esperienze". I soldi arrivavano comunque. Fai "cose": corsi, workshop, "progetti creativi".\n\nVivi di "passioni momentanee" e "sperimentazioni". Ogni progetto è un'opportunità per "scoprire te stesso". Ma non lavori mai.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'minimalista': `Sei nato a Genova negli anni '90, dove il "meno è meglio" è filosofia. Fai progetti, ma solo quando serve. Non ti consumi per le promozioni.\n\nLavori poco, vivi con poco. I progetti li accetti solo se convenienti. Niente notti insonni, niente burnout. Solo il necessario.\n\nLa tua vita è semplice: pochi impegni, pochi soldi, ma anche meno stress. Sei felice. O almeno, meno infelice degli altri.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'escapista': `Sei nato a Palermo negli anni '90, dove la "fuga" è un'arte. Progetti è solo una delle tue "gig". Fai anche lavori creativi, passioni.\n\nFuggi nella nicchia. Hobbies, passioni, sopravvivenza. Non diventerai mai ricco, ma almeno mantieni la tua anima.\n\nVivi di progetti occasionali e lavori creativi. La flessibilità? La usi per te, non per il sistema.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'antisistema': `Sei nato a Bari negli anni '90, dove il "sistema" è sempre stato una truffa. Fai progetti, ma critichi il capitalismo. Partecipi a collettivi, manifestazioni.\n\nDecrescita, baratto, comunità. Utopie necessarie. Vivi con poco, condividi tutto. Il sistema ti sfrutta, ma tu resisti.\n\nOrganizzi collettivi, condividi informazioni, lotti per diritti. Il capitalismo non ti avrà.\n\nEccoti qui. Adesso inizia il gioco della vita.`
  },
  'genz-disilluso': {
    'obbediente': `Sei nato a Milano nel 2000, quando tutto era già una truffa. Hai capito che è tutto una truffa a 16 anni. Troppo cinico per l'età.\n\nHai studiato, ti sei laureato, hai fatto stage non pagati. Ma dici sempre sì: "Certo capo, posso fare straordinari". "Nessun problema, lavoro anche sabato".\n\nIl tuo capo è un sistema che ti promette stabilità se "ti impegni". Ma tu sai che è una truffa. E lo fai comunque.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'rampante': `Sei nato a Roma nel 2000, dove "fare carriera" significa sacrificare tutto. A 24 anni hai già cambiato 3 lavori, sempre per "crescere".\n\nVuoi fare carriera. Sacrifichi tutto per salire: notti insonni, weekend di lavoro, relazioni sacrificate. Il tuo obiettivo? Uscire dal sistema.\n\nStudi corsi online, certificazioni, networking. Ottimizzi tutto. Ma sei sempre cinico. E sempre precario.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'testa-bassa': `Sei nato a Napoli nel 2000, dove "sopravvivere" è un'arte. Fai il tuo lavoro, ma solo quando ti va. Non ti stressi per le promozioni.\n\nSopravvivi. Fai il minimo, esci alle 18:00 (anche se significa perdere opportunità). Il lavoro? Va avanti, lentamente.\n\nI capi ti chiamano "poco ambizioso", ma tu sai che è tutto una truffa. Niente burnout, niente ansia. Solo cinismo.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'freelance': `Sei nato a Torino nel 2000, dove il "fare da soli" è tradizione. Non lavori solo per aziende: fai anche progetti freelance, consulenze.\n\nPartita IVA, regime forfettario. Ogni mese è diverso: a volte guadagni bene (progetti grossi), a volte zero (nessun cliente).\n\nGestisci tutto: tasse, contratti, sviluppo. Sei libero, ma anche solo. Nessun collega, nessun sindacato, nessuna sicurezza.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'consulente': `Sei nato a Firenze nel 2000, dove "vendere competenze" è un'arte. Non fai solo progetti: sei anche consulente per altre aziende.\n\nVendi la tua esperienza: strategie, analisi, soluzioni. €50/ora sembra tanto, ma tra tasse e tempi morti...\n\nI clienti ti chiamano per "una consulenza veloce" che diventa un progetto. Fatturi a ore, ma le ore non bastano mai.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'faccio-cose-vedo-gente': `Sei nato a Milano nel 2000, in una famiglia ricca. Papà ha un'azienda tech, mamma fa la designer. Tu? "Devo capire cosa fare", dici.\n\nHai studiato, viaggiato, fatto "esperienze". I soldi arrivano comunque. Fai "cose": corsi online, workshop, "progetti digitali".\n\nVivi di "passioni momentanee" e "sperimentazioni". Ogni progetto è un'opportunità per "scoprire te stesso". Ma non lavori mai.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'minimalista': `Sei nato a Genova nel 2000, dove il "meno è meglio" è filosofia. Fai progetti, ma solo quando serve. Non ti consumi per le promozioni.\n\nLavori poco, vivi con poco. I progetti li accetti solo se convenienti. Niente notti insonni, niente burnout. Solo il necessario.\n\nLa tua vita è semplice: pochi impegni, pochi soldi, ma anche meno stress. Sei felice. O almeno, meno infelice degli altri.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'escapista': `Sei nato a Palermo nel 2000, dove la "fuga" è un'arte. Progetti è solo una delle tue "gig". Fai anche lavori creativi, passioni.\n\nFuggi nella nicchia. Hobbies, passioni, sopravvivenza. Non diventerai mai ricco, ma almeno mantieni la tua anima.\n\nVivi di progetti occasionali e lavori creativi. La flessibilità? La usi per te, non per il sistema.\n\nEccoti qui. Adesso inizia il gioco della vita.`,
    'antisistema': `Sei nato a Bari nel 2000, dove il "sistema" è sempre stato una truffa. Fai progetti, ma critichi il capitalismo. Partecipi a collettivi, manifestazioni.\n\nDecrescita, baratto, comunità. Utopie necessarie. Vivi con poco, condividi tutto. Il sistema ti sfrutta, ma tu resisti.\n\nOrganizzi collettivi, condividi informazioni, lotti per diritti. Il capitalismo non ti avrà.\n\nEccoti qui. Adesso inizia il gioco della vita.`
  }
}

// Predefined actions for each race/class combination
const ACTIONS: Record<string, Record<string, Array<{ text: string, narrative: string, effects: { budget?: number, burnout?: number, salary?: number, aura?: number } }>>> = {
  'influencer': {
    'obbediente': [
      { text: 'Accetto collaborazione low-budget', narrative: 'Accetti una collaborazione da €200 per un post. Il brand vuole 3 revisioni e diritti in perpetuo. "Certo capo, nessun problema capo".', effects: { budget: 200, burnout: 10 } },
      { text: 'Faccio 10 stories al giorno', narrative: 'Posti 10 stories al giorno per aumentare l\'engagement. I follower aumentano, ma sei esausto. L\'algoritmo ti consuma.', effects: { burnout: 15, aura: -2 } },
      { text: 'Chiedo aumento all\'agenzia', narrative: 'Chiedi un aumento all\'agenzia. Ti dicono "vediamo" e ti promettono un bonus se raggiungi 50K follower. Spoiler: non lo raggiungerai mai.', effects: { burnout: 5 } },
      { text: 'Dico no a una collaborazione', narrative: 'Dici no a una collaborazione perché non ti piace il brand. L\'agenzia si arrabbia. "Non possiamo essere schizzinosi", dicono. Perdi un cliente.', effects: { budget: -300, burnout: -5, aura: 3 } },
      { text: 'Investo in attrezzatura', narrative: 'Compri una nuova camera, luci professionali, software di editing. Spendere per guadagnare, giusto?', effects: { budget: -800, burnout: -3 } }
    ],
    'rampante': [
      { text: 'Studio algoritmi e strategie', narrative: 'Passi ore a studiare algoritmi, A/B testing, timing perfetto. I numeri migliorano, ma il costo mentale è alto.', effects: { burnout: 12, aura: -1 } },
      { text: 'Cerco investitori per agenzia', narrative: 'Cerchi investitori per aprire la tua agenzia di influencer marketing. Fai pitch, networking, promesse. Niente soldi ancora.', effects: { burnout: 8 } },
      { text: 'Faccio collaborazione premium', narrative: 'Accetti una collaborazione da €2000 con un brand importante. Richiede molto lavoro, ma è un buon investimento.', effects: { budget: 2000, burnout: 10 } },
      { text: 'Sacrifico weekend per contenuti', narrative: 'Sacrifichi il weekend per creare contenuti. Posti, stories, reel. Il lavoro non finisce mai.', effects: { burnout: 20, aura: -3 } },
      { text: 'Assumo un assistente', narrative: 'Assumi un assistente part-time per gestire i DM e i contratti. Costoso, ma ti libera tempo.', effects: { budget: -500, burnout: -10, aura: 2 } }
    ],
    'testa-bassa': [
      { text: 'Posto quando mi va', narrative: 'Posti quando ti va, senza ansia per i numeri. I follower diminuiscono leggermente, ma stai meglio mentalmente.', effects: { burnout: -5, aura: 2 } },
      { text: 'Rifiuto collaborazione scomoda', narrative: 'Rifiuti una collaborazione che richiede troppo lavoro per poco pagamento. "Non ne vale la pena", dici. Hai ragione.', effects: { budget: -200, burnout: -8, aura: 3 } },
      { text: 'Esco alle 18:00', narrative: 'Decidi di uscire alle 18:00, anche se significa perdere il "golden hour" per le stories. La vita viene prima dei social.', effects: { burnout: -10, aura: 5 } },
      { text: 'Accetto solo collaborazioni semplici', narrative: 'Accetti solo collaborazioni semplici, senza revisioni infinite. Meno soldi, ma meno stress.', effects: { budget: 300, burnout: -3 } },
      { text: 'Faccio pausa dai social', narrative: 'Fai una pausa di 3 giorni dai social. I follower si lamentano, ma tu ti senti rinato. A volte il distacco è necessario.', effects: { burnout: -15, aura: 5 } }
    ],
    'freelance': [
      { text: 'Cerco nuovi clienti', narrative: 'Cerchi nuovi clienti su LinkedIn, Instagram, gruppi Facebook. Networking, pitch, promesse. Qualche contatto interessante.', effects: { burnout: 5 } },
      { text: 'Fatturo una collaborazione', narrative: 'Fatturi una collaborazione da €500. Partita IVA, tasse, ma almeno è tuo. Gestisci tutto tu: contratti, pagamenti, tasse.', effects: { budget: 500, burnout: 3 } },
      { text: 'Investo in formazione', narrative: 'Fai un corso online su "come monetizzare i social". Costoso, ma potrebbe aiutarti. O forse no.', effects: { budget: -200, burnout: 2 } },
      { text: 'Rifiuto un cliente difficile', narrative: 'Rifiuti un cliente che vuole troppo per troppo poco. "Non ne vale la pena", dici. Hai ragione, ma perdi soldi.', effects: { budget: -400, burnout: -5, aura: 3 } },
      { text: 'Creo pacchetti servizi', narrative: 'Crei pacchetti di servizi (post + stories + reel) per vendere meglio. Marketing per te stesso. Funziona? Vedremo.', effects: { burnout: 3 } }
    ],
    'consulente': [
      { text: 'Faccio consulenza social media', narrative: 'Fai una consulenza da 4 ore per un\'azienda. €200 totali. Spieghi algoritmi, strategie, best practices. Fatturi a ore.', effects: { budget: 200, burnout: 5 } },
      { text: 'Creo strategia content', narrative: 'Crei una strategia content per un cliente. Richiede ricerca, analisi, creatività. €300 per un progetto di 2 settimane.', effects: { budget: 300, burnout: 8 } },
      { text: 'Partecipo a conferenza', narrative: 'Partecipi a una conferenza di marketing come speaker. Networking, visibilità, ma zero soldi. Investimento per il futuro?', effects: { budget: -150, burnout: 3 } },
      { text: 'Rifiuto progetto low-budget', narrative: 'Rifiuti un progetto che paga troppo poco per il lavoro richiesto. "Non posso lavorare a questi prezzi", dici. Hai ragione.', effects: { budget: -500, burnout: -5, aura: 3 } },
      { text: 'Aumento tariffe', narrative: 'Aumenti le tue tariffe. Alcuni clienti se ne vanno, altri accettano. Meno clienti, più soldi per progetto. Funziona?', effects: { budget: 100, burnout: -3 } }
    ],
    'faccio-cose-vedo-gente': [
      { text: 'Trovo una nuova passione', narrative: 'Trovi una nuova passione. "Forse è questa", pensi. Ma tra un mese sarà un\'altra.', effects: { budget: -500, burnout: -5, aura: 2 } },
      { text: 'Viaggio "spirituale"', narrative: 'Fai un viaggio "spirituale". "Devo trovare me stesso", dici. I tuoi genitori pagano.', effects: { budget: -3000, burnout: -15, aura: 5 } },
      { text: 'Stage non pagato', narrative: 'Fai uno stage non pagato. "È per il CV", dici. Ma i soldi arrivano comunque.', effects: { burnout: 8, aura: -1 } },
      { text: 'Networking event', narrative: 'Vai a un networking event. "Sto costruendo relazioni", dici. Ma in realtà bevi solo vino.', effects: { budget: -200, burnout: -2, aura: 1 } },
      { text: 'Weekend a Parigi', narrative: 'Fai un weekend a Parigi. "Ho bisogno di ispirazione", dici. Ma in realtà fai shopping.', effects: { budget: -800, burnout: -10, aura: 3 } }
    ],
    'minimalista': [
      { text: 'Posto solo quando serve', narrative: 'Posti solo quando serve, senza ansia per i numeri. Meno contenuti, ma più autentici. I follower apprezzano? Forse.', effects: { burnout: -5, aura: 3 } },
      { text: 'Rifiuto collaborazioni', narrative: 'Rifiuti collaborazioni che non ti interessano. "Non ne vale la pena", dici. Meno soldi, ma più pace mentale.', effects: { budget: -300, burnout: -10, aura: 5 } },
      { text: 'Vivo con poco', narrative: 'Vivi con poco, spendi poco, lavori poco. La semplicità è la chiave. Sei felice? O almeno, meno infelice degli altri.', effects: { burnout: -8, aura: 5 } },
      { text: 'Investo in esperienze', narrative: 'Investi in esperienze invece che in cose. Viaggi low-cost, corsi interessanti, tempo libero. Soldi spesi bene.', effects: { budget: -200, burnout: -5, aura: 4 } },
      { text: 'Faccio detox digitale', narrative: 'Fai un detox digitale di una settimana. Niente social, niente notifiche, niente ansia. Ti senti rinato.', effects: { burnout: -20, aura: 8 } }
    ],
    'escapista': [
      { text: 'Posto contenuti di nicchia', narrative: 'Posti contenuti di nicchia: libri, mostre, viaggi low-cost. I brand non ti cercano, ma hai una community fedele.', effects: { burnout: -3, aura: 4 } },
      { text: 'Rifiuto collaborazioni commerciali', narrative: 'Rifiuti collaborazioni commerciali che non ti interessano. "Non è il mio stile", dici. Meno soldi, ma più autenticità.', effects: { budget: -400, burnout: -8, aura: 5 } },
      { text: 'Investo in progetti creativi', narrative: 'Investi in progetti creativi: fotografia, scrittura, arte. Non pagano, ma ti fanno sentire vivo.', effects: { budget: -300, burnout: -5, aura: 6 } },
      { text: 'Collaboro con artisti', narrative: 'Collabori con altri artisti invece che con brand. Meno soldi, ma più soddisfazione. L\'arte prima del denaro.', effects: { budget: -200, burnout: -3, aura: 5 } },
      { text: 'Faccio pausa creativa', narrative: 'Fai una pausa per dedicarti a progetti creativi. I follower si lamentano, ma tu crei. A volte l\'arte viene prima.', effects: { burnout: -10, aura: 6 } }
    ],
    'antisistema': [
      { text: 'Critico il capitalismo', narrative: 'Posti contenuti satirici che criticano il capitalismo. I brand ti evitano, ma hai una community fedele che apprezza.', effects: { budget: -500, burnout: -5, aura: 8 } },
      { text: 'Rifiuto tutte le collaborazioni', narrative: 'Rifiuti tutte le collaborazioni commerciali. "Non vendo la mia anima", dici. Zero soldi, ma totale integrità.', effects: { budget: -600, burnout: -10, aura: 10 } },
      { text: 'Organizzo collettivo', narrative: 'Organizzi un collettivo di influencer che lottano per diritti migliori. Networking, manifestazioni, lotta. Il sistema non ti avrà.', effects: { burnout: 5, aura: 7 } },
      { text: 'Condivido risorse', narrative: 'Condividi risorse, conoscenze, contatti con altri creator. La condivisione invece della competizione. Utopia? Forse.', effects: { budget: -200, burnout: -3, aura: 6 } },
      { text: 'Faccio pausa totale', narrative: 'Fai una pausa totale dai social. Il capitalismo non ti avrà. Vivi con poco, condividi tutto. La decrescita è possibile.', effects: { burnout: -15, aura: 10 } }
    ]
  }
}

// Narrative generators based on game state, race, and class
const getJobSearchNarrative = (raceId: string, subclassId: string, attempts: number): string => {
  const narratives: Record<string, Record<string, string[]>> = {
    'influencer': {
      'obbediente': [
        'Invii CV a tutte le agenzie di influencer marketing. "Sono disponibile per qualsiasi collaborazione", dici. Qualcuno risponde.',
        'Fai networking su LinkedIn. Aggiungi tutti, commenti, like. "Devo farmi notare", pensi. Un\'agenzia ti contatta.',
        'Partecipi a un evento di networking. Distribuisci biglietti da visita. "Sono qui per lavorare", dici. Qualcuno si interessa.'
      ],
      'rampante': [
        'Contatti direttamente i brand. "Ho 10K follower, posso portarvi valore", dici. Qualcuno risponde positivamente.',
        'Fai pitch a investitori per la tua "influencer agency". "Scalabilità, crescita, ROI", prometti. Un brand ti offre una collaborazione.',
        'Crei contenuti per dimostrare il tuo valore. "Guardate cosa so fare", mostri. Un\'agenzia ti nota.'
      ],
      'testa-bassa': [
        'Cerchi lavoro, ma senza troppa ansia. "Se arriva, arriva", pensi. Qualcuno ti contatta.',
        'Rispondi a qualche annuncio. "Vediamo cosa succede", dici. Ricevi una proposta.',
        'Fai il minimo necessario. "Non mi stresso", pensi. Un\'offerta arriva comunque.'
      ]
    },
    'faccio-cose-vedo-gente': {
      'obbediente': [
        'I tuoi genitori ti trovano uno stage. "È per il CV", dicono. "Grazie mamma, grazie papà", dici. Inizi lo stage.',
        'Un amico di famiglia ti offre un\'opportunità. "Networking", dicono i tuoi genitori. Accetti.',
        'Fai domanda per progetti interessanti. "Tanto i soldi arrivano comunque", pensi. Qualcuno ti assume.'
      ],
      'rampante': [
        'Cerchi stage prestigiosi. "Devo costruire il mio network", dici. I tuoi genitori ti aiutano. Trovate qualcosa.',
        'Fai networking con amici di famiglia. "Gli affari si fanno così", dicono. Qualcuno ti offre un\'opportunità.',
        'Partecipi a eventi esclusivi. "Sto costruendo relazioni", dici. Qualcuno ti nota.'
      ],
      'testa-bassa': [
        'Fai progetti quando ti va. "Tanto i soldi arrivano", pensi. Qualcuno ti propone qualcosa.',
        'Accetti solo opportunità interessanti. "Non mi stresso", dici. Inizi lentamente.',
        'Fai domanda, ma senza ansia. "Vediamo", pensi. Qualcuno ti assume.'
      ]
    },
    'startup-bro': {
      'obbediente': [
        'Cerchi investitori per la tua startup. "Sono disponibile per qualsiasi progetto", dici. Qualcuno si interessa.',
        'Fai pitch a incubatori. "Posso lavorare anche gratis", dici. Ti offrono un programma.',
        'Accetti qualsiasi collaborazione. "Non posso permettermi di dire no", pensi. Inizi a lavorare.'
      ],
      'rampante': [
        'Fai pitch aggressivi a investitori. "Scalabilità, crescita, exit", prometti. Qualcuno investe.',
        'Cerchi co-founder su LinkedIn. "Voglio costruire qualcosa di grande", dici. Trovate un\'opportunità.',
        'Partecipi a hackathon. "Vincerò", pensi. Qualcuno nota il tuo progetto.'
      ],
      'testa-bassa': [
        'Cerchi lavoro, ma senza fretta. "Quando serve, serve", pensi. Qualcuno ti contatta.',
        'Fai progetti freelance. "Vediamo", dici. Inizi a lavorare lentamente.',
        'Accetti collaborazioni spot. "Va bene così", pensi. Qualcuno ti assume.'
      ]
    },
    'boomer-rentier': {
      'obbediente': [
        'Cerchi opportunità immobiliari. "Sono disponibile per qualsiasi investimento", dici. Trovate un\'opportunità.',
        'Contatti agenzie immobiliari. "Posso investire subito", dici. Ti propongono un immobile.',
        'Accetti qualsiasi affare. "Non posso perdere l\'occasione", pensi. Inizi a investire.'
      ],
      'rampante': [
        'Cerchi immobili da comprare. "Voglio espandere il portafoglio", dici. Trovate un\'opportunità.',
        'Fai networking con altri investitori. "Devo imparare i trucchi", dici. Qualcuno ti aiuta.',
        'Studi mercati immobiliari. "Massimizzerò i rendimenti", pensi. Trovate un affare.'
      ],
      'testa-bassa': [
        'Cerchi opportunità, ma senza fretta. "Quando serve, serve", pensi. Qualcuno ti propone qualcosa.',
        'Accetti solo affari convenienti. "Non mi fregano", dici. Inizi lentamente.',
        'Fai domanda per mutui, ma senza ansia. "Vediamo", pensi. Qualcuno ti finanzia.'
      ]
    },
    'millennial-ansioso': {
      'obbediente': [
        'Invii CV ovunque. "Sono disponibile per qualsiasi lavoro", dici. Qualcuno risponde.',
        'Fai colloqui multipli. "Spero che questa volta...", pensi. Ricevi un\'offerta.',
        'Accetti qualsiasi lavoro. "Non posso permettermi di dire no", pensi. Inizi a lavorare.'
      ],
      'rampante': [
        'Cerchi lavoro con ansia. "Devo trovare qualcosa subito", pensi. Qualcuno ti assume.',
        'Fai networking aggressivo. "Devo farmi notare", dici. Ricevi un\'offerta.',
        'Partecipi a eventi di networking. "Questa volta funzionerà", pensi. Qualcuno ti contatta.'
      ],
      'testa-bassa': [
        'Cerchi lavoro, ma senza troppa ansia. "Se arriva, arriva", pensi. Qualcuno ti contatta.',
        'Rispondi a qualche annuncio. "Vediamo", dici. Ricevi una proposta.',
        'Fai il minimo necessario. "Non mi stresso", pensi. Un\'offerta arriva comunque.'
      ]
    },
    'genz-disilluso': {
      'obbediente': [
        'Cerchi lavoro, sapendo che è una truffa. "Tanto devo farlo", pensi. Qualcuno ti assume.',
        'Fai domanda per lavori che detesti. "Non ho scelta", dici. Ricevi un\'offerta.',
        'Accetti qualsiasi cosa. "Tanto è tutto una truffa", pensi. Inizi a lavorare.'
      ],
      'rampante': [
        'Cerchi lavoro con cinismo. "Tanto non serve a niente", pensi. Ma qualcuno ti assume.',
        'Fai networking, ma senza crederci. "Tanto è tutto finto", dici. Ricevi un\'offerta.',
        'Partecipi a colloqui per dovere. "Tanto non cambierà niente", pensi. Qualcuno ti assume.'
      ],
      'testa-bassa': [
        'Cerchi lavoro, ma senza aspettative. "Tanto è tutto una truffa", pensi. Qualcuno ti contatta.',
        'Rispondi a qualche annuncio. "Vediamo", dici. Ricevi una proposta.',
        'Fai il minimo necessario. "Tanto non serve", pensi. Un\'offerta arriva comunque.'
      ]
    }
  }
  
  const raceNarratives = narratives[raceId]?.[subclassId] || [
    'Cerchi un lavoro. Fai CV, colloqui, networking. Qualche contatto interessante.',
    'Invii candidature. "Speriamo", pensi. Qualcuno risponde.',
    'Fai domanda per vari lavori. "Qualcosa arriverà", dici. Ricevi una proposta.'
  ]
  
  return raceNarratives[Math.min(attempts, raceNarratives.length - 1)] || raceNarratives[raceNarratives.length - 1]
}

const getJobOfferNarrative = (raceId: string, subclassId: string, salary: number): string => {
  const narratives: Record<string, Record<string, string>> = {
    'influencer': {
      'obbediente': `Un'agenzia ti offre una collaborazione. Stipendio: €${salary}/mese. "È poco, ma è un inizio", pensi. Accetti?`,
      'rampante': `Un brand ti offre una collaborazione importante. Stipendio: €${salary}/mese. "Posso negoziare di più", pensi.`,
      'testa-bassa': `Qualcuno ti offre lavoro. Stipendio: €${salary}/mese. "Vediamo", pensi.`
    },
    'faccio-cose-vedo-gente': {
      'obbediente': `I tuoi genitori ti hanno trovato uno stage. Stipendio: €${salary}/mese. "È per il CV", dicono. "Grazie", dici.`,
      'rampante': `Hai trovato un'opportunità interessante. Stipendio: €${salary}/mese. "Sto costruendo il mio network", pensi.`,
      'testa-bassa': `Qualcuno ti offre qualcosa. Stipendio: €${salary}/mese. "Vediamo", pensi.`
    },
    'startup-bro': {
      'obbediente': `Un investitore ti offre un programma. Stipendio: €${salary}/mese. "È poco, ma è un inizio", pensi.`,
      'rampante': `Hai trovato un'opportunità interessante. Stipendio: €${salary}/mese. "Posso negoziare di più", pensi.`,
      'testa-bassa': `Qualcuno ti offre lavoro. Stipendio: €${salary}/mese. "Vediamo", pensi.`
    },
    'boomer-rentier': {
      'obbediente': `Hai trovato un immobile da affittare. Guadagni stimati: €${salary}/mese. "Meglio di niente", pensi.`,
      'rampante': `Hai trovato un'opportunità immobiliare. Guadagni stimati: €${salary}/mese. "Posso fare di meglio", pensi.`,
      'testa-bassa': `Hai trovato qualcosa. Guadagni stimati: €${salary}/mese. "Va bene così", pensi.`
    },
    'millennial-ansioso': {
      'obbediente': `Hai ricevuto un'offerta di lavoro. Stipendio: €${salary}/mese. "Speriamo che questa volta...", pensi.`,
      'rampante': `Hai trovato un lavoro interessante. Stipendio: €${salary}/mese. "Finalmente!", pensi.`,
      'testa-bassa': `Qualcuno ti offre lavoro. Stipendio: €${salary}/mese. "Vediamo", pensi.`
    },
    'genz-disilluso': {
      'obbediente': `Hai ricevuto un'offerta. Stipendio: €${salary}/mese. "Tanto è tutto una truffa", pensi.`,
      'rampante': `Hai trovato qualcosa. Stipendio: €${salary}/mese. "Tanto non cambierà niente", pensi.`,
      'testa-bassa': `Qualcuno ti offre lavoro. Stipendio: €${salary}/mese. "Vediamo", pensi.`
    }
  }
  
  return narratives[raceId]?.[subclassId] || `Hai ricevuto un'offerta di lavoro. Stipendio: €${salary}/mese. Cosa fai?`
}

const getNegotiationNarrative = (raceId: string, subclassId: string, success: boolean): string => {
  if (success) {
    const successNarratives: Record<string, Record<string, string>> = {
      'influencer': {
        'rampante': 'Il brand accetta la tua controfferta! "Sapevo di valere di più", pensi. Stipendio aumentato.',
        'obbediente': 'Chiedi timidamente un aumento. "Forse è troppo?", pensi. Ma funziona! Stipendio aumentato.',
        'testa-bassa': 'Chiedi un aumento, senza troppe aspettative. "Vediamo", dici. Funziona! Stipendio aumentato.'
      },
      'faccio-cose-vedo-gente': {
        'rampante': 'Chiedi condizioni migliori. "Sto costruendo il mio network", dici. Funziona!',
        'obbediente': 'Chiedi timidamente. "Grazie mamma, grazie papà", pensi. Funziona!',
        'testa-bassa': 'Chiedi condizioni migliori. "Vediamo", dici. Funziona.'
      },
      'startup-bro': {
        'rampante': 'L\'investitore accetta la tua controfferta! "Sapevo di valere di più", pensi. Stipendio aumentato.',
        'obbediente': 'Chiedi timidamente più equity. "Forse è troppo?", pensi. Ma funziona!',
        'testa-bassa': 'Chiedi condizioni migliori. "Vediamo", dici. Funziona.'
      },
      'boomer-rentier': {
        'rampante': 'Rinegozi l\'affitto e guadagni di più! "Sapevo di poterlo fare", pensi.',
        'obbediente': 'Chiedi un aumento dell\'affitto. "Spero di non disturbare", pensi. Funziona!',
        'testa-bassa': 'Chiedi condizioni migliori. "Vediamo", dici. Funziona.'
      },
      'millennial-ansioso': {
        'rampante': 'Il capo accetta! "Finalmente!", pensi. Stipendio aumentato.',
        'obbediente': 'Chiedi timidamente un aumento. "Forse è troppo?", pensi. Ma funziona!',
        'testa-bassa': 'Chiedi condizioni migliori. "Vediamo", dici. Funziona.'
      },
      'genz-disilluso': {
        'rampante': 'Chiedi un aumento con cinismo. "Tanto non funzionerà", pensi. Ma funziona!',
        'obbediente': 'Chiedi timidamente. "Tanto è tutto una truffa", pensi. Ma funziona!',
        'testa-bassa': 'Chiedi condizioni migliori. "Vediamo", dici. Funziona.'
      }
    }
    return successNarratives[raceId]?.[subclassId] || 'La negoziazione ha successo! Stipendio aumentato.'
  } else {
    const failNarratives: Record<string, Record<string, string>> = {
      'influencer': {
        'rampante': 'Il brand rifiuta. "Siamo già generosi", dicono. La negoziazione fallisce.',
        'obbediente': 'Chiedi un aumento, ma ti dicono di no. "Forse era troppo", pensi.',
        'testa-bassa': 'Chiedi condizioni migliori. "Non possiamo", dicono. Va bene così.'
      },
      'faccio-cose-vedo-gente': {
        'rampante': 'Chiedi condizioni migliori, ma non funziona. "Forse ho esagerato", pensi.',
        'obbediente': 'Chiedi timidamente, ma non funziona. "Va bene così", pensi.',
        'testa-bassa': 'Chiedi condizioni migliori. "Non possiamo", dicono. Va bene così.'
      },
      'startup-bro': {
        'rampante': 'L\'investitore rifiuta. "Troppo ambizioso", dicono. La negoziazione fallisce.',
        'obbediente': 'Chiedi più equity, ma ti dicono di no. "Forse era troppo", pensi.',
        'testa-bassa': 'Chiedi condizioni migliori. "Non possiamo", dicono. Va bene così.'
      },
      'boomer-rentier': {
        'rampante': 'Gli inquilini rifiutano l\'aumento. "Troppo aggressivo", dicono. La negoziazione fallisce.',
        'obbediente': 'Chiedi un aumento dell\'affitto, ma ti dicono di no. "Forse era troppo", pensi.',
        'testa-bassa': 'Chiedi condizioni migliori. "Non possiamo", dicono. Va bene così.'
      },
      'millennial-ansioso': {
        'rampante': 'Il capo rifiuta. "Non possiamo permettercelo", dicono. L\'ansia aumenta.',
        'obbediente': 'Chiedi un aumento, ma ti dicono di no. "Forse era troppo", pensi.',
        'testa-bassa': 'Chiedi condizioni migliori. "Non possiamo", dicono. Va bene così.'
      },
      'genz-disilluso': {
        'rampante': 'Il capo rifiuta. "Tanto lo sapevo", pensi. La negoziazione fallisce.',
        'obbediente': 'Chiedi un aumento, ma ti dicono di no. "Tanto è tutto una truffa", pensi.',
        'testa-bassa': 'Chiedi condizioni migliori. "Non possiamo", dicono. "Tanto lo sapevo", pensi.'
      }
    }
    return failNarratives[raceId]?.[subclassId] || 'La negoziazione fallisce. Lo stipendio rimane uguale.'
  }
}

const getFiredNarrative = (raceId: string, subclassId: string): string => {
  const narratives: Record<string, Record<string, string>> = {
    'influencer': {
      'obbediente': 'L\'agenzia ti licenzia. "Non sei abbastanza performante", dicono. Torni a cercare lavoro.',
      'rampante': 'Il brand ti licenzia dopo la negoziazione. "Troppo ambizioso", dicono. Torni a cercare lavoro.',
      'testa-bassa': 'Ti licenziano. "Non sei abbastanza coinvolto", dicono. Torni a cercare lavoro.'
    },
    'faccio-cose-vedo-gente': {
      'obbediente': 'Ti licenziano dallo stage. "Non sei abbastanza coinvolto", dicono. "Tanto i soldi arrivano comunque", pensi.',
      'rampante': 'Ti licenziano. "Troppo ambizioso", dicono. "Tanto i soldi arrivano comunque", pensi.',
      'testa-bassa': 'Ti licenziano. "Non abbastanza attivo", dicono. "Tanto i soldi arrivano comunque", pensi.'
    },
    'startup-bro': {
      'obbediente': 'L\'investitore ti licenzia. "Non sei abbastanza performante", dicono. Torni a cercare lavoro.',
      'rampante': 'Ti licenziano dopo la negoziazione. "Troppo ambizioso", dicono. Torni a cercare lavoro.',
      'testa-bassa': 'Ti licenziano. "Non sei abbastanza coinvolto", dicono. Torni a cercare lavoro.'
    },
    'boomer-rentier': {
      'obbediente': 'Perdi l\'affare. "Non sei abbastanza affidabile", dicono. Torni a cercare opportunità.',
      'rampante': 'Ti licenziano dopo la negoziazione. "Troppo aggressivo", dicono. Torni a cercare opportunità.',
      'testa-bassa': 'Perdi l\'affare. "Non sei abbastanza coinvolto", dicono. Torni a cercare opportunità.'
    },
    'millennial-ansioso': {
      'obbediente': 'Ti licenziano. "Non sei abbastanza performante", dicono. L\'ansia aumenta. Torni a cercare lavoro.',
      'rampante': 'Ti licenziano dopo la negoziazione. "Troppo ambizioso", dicono. Torni a cercare lavoro.',
      'testa-bassa': 'Ti licenziano. "Non sei abbastanza coinvolto", dicono. Torni a cercare lavoro.'
    },
    'genz-disilluso': {
      'obbediente': 'Ti licenziano. "Tanto lo sapevo", pensi. "È tutto una truffa", dici. Torni a cercare lavoro.',
      'rampante': 'Ti licenziano dopo la negoziazione. "Tanto non serviva a niente", pensi. Torni a cercare lavoro.',
      'testa-bassa': 'Ti licenziano. "Tanto lo sapevo", pensi. Torni a cercare lavoro.'
    }
  }
  
  return narratives[raceId]?.[subclassId] || 'Vieni licenziato. Torni a cercare lavoro.'
}

// Get available actions based on game state, race and subclass
const getAvailableActions = () => {
  const raceId = character.value.race?.id || ''
  const subclassId = character.value.subclass?.id || ''
  const currentJobState = jobState.value
  
  // NO JOB STATE - Looking for work
  if (currentJobState === 'no-job') {
    return [
      { 
        text: 'Cerco lavoro', 
        narrative: getJobSearchNarrative(raceId, subclassId, character.value.jobSearchAttempts),
        effects: { burnout: 5 },
        onSelect: () => {
          character.value.jobSearchAttempts++
          // Use briscola card with abilità bonus for job search
          const abilitaBonus = Math.floor(character.value.stats.abilita / 2)
          const cardResult = drawBriscolaCard(abilitaBonus)
          
          // Show modal and execute action after
          showCardModalAndExecute(
            { result: cardResult.result, text: cardResult.resultText },
            () => {
              // Successo critico o successo = trova lavoro, fallimenti = continua ricerca
              if (cardResult.result === 'successo-critico' || cardResult.result === 'successo') {
                // Determina se è uno stage o un lavoro normale
                const isStage = subclassId.includes('stage') || subclassId.includes('stagista') || raceId === 'faccio-cose-vedo-gente'
                let baseSalary: number
                if (isStage) {
                  // Stage: 800 euro
                  baseSalary = 800
                } else {
                  // Altri lavori: 1200 euro
                  baseSalary = cardResult.result === 'successo-critico' ? 1200 + Math.floor(Math.random() * 200) : 1200
                }
                const entrySalary = baseSalary
                chatHistory.value.push({
                  type: 'ai',
                  text: getJobOfferNarrative(raceId, subclassId, entrySalary) + ` ${cardResult.result === 'successo-critico' ? '🎯 SUCCESSO CRITICO! Hai impressionato il recruiter!' : '✅ Successo!'}`,
                  effects: null
                })
                jobState.value = 'entry-job'
                character.value.salary = entrySalary
              } else if (cardResult.result === 'fallimento-parziale') {
                // Fallimento parziale = ti propongono lavoro ma con condizioni pessime
                const pessimoStipendio = 200 + Math.floor(Math.random() * 200) // 200-400 euro
                chatHistory.value.push({
                  type: 'ai',
                  text: `Ti propongono un lavoro ma con condizioni pessime: solo €${pessimoStipendio}/mese. ⚠️ Fallimento Parziale. Accetti comunque?`,
                  effects: { burnout: 3 }
                })
                // Offri la possibilità di accettare il lavoro pessimo
                setTimeout(() => {
                  jobState.value = 'entry-job'
                  character.value.salary = pessimoStipendio
                }, 2000)
              } else {
                // Fallimento critico - continua ricerca
                chatHistory.value.push({
                  type: 'ai',
                  text: 'Non hai trovato lavoro questa volta. ❌ Fallimento Critico. Continua a cercare.',
                  effects: { burnout: 5 }
                })
              }
            }
          )
        }
      },
      { 
        text: 'Faccio pausa', 
        narrative: 'Fai una pausa dalla ricerca. "Il lavoro può aspettare", pensi. La salute mentale viene prima.',
        effects: { burnout: -10, aura: 3 }
      },
      { 
        text: 'Esco con gli amici a bere', 
        narrative: 'Esci con gli amici. "Un drink non fa male", dici. Spendere €40 per 3 drink in un locale trendy. "Networking", dici.',
        effects: { budget: -40, burnout: -8, aura: 3 },
        onSelect: () => {
          const cardResult = drawBriscolaCard(Math.floor(character.value.stats.carisma / 2))
          showCardModalAndExecute(
            { result: cardResult.result, text: cardResult.resultText },
            () => {
              let effects = { budget: -40, burnout: -8, aura: 3 }
              if (cardResult.result === 'successo-critico') {
                effects = { budget: -20, burnout: -12, aura: 5 }
              } else if (cardResult.result === 'fallimento-parziale') {
                effects = { budget: -60, burnout: -5, aura: 1 }
              } else if (cardResult.result === 'fallimento-critico') {
                effects = { budget: -80, burnout: 3, aura: -1 }
              }
              character.value.budget += effects.budget
              character.value.burnout = Math.min(100, Math.max(0, character.value.burnout + effects.burnout))
              character.value.aura = Math.max(0, character.value.aura + effects.aura)
              chatHistory.value.push({
                type: 'ai',
                text: '🍻 ' + (cardResult.result === 'successo-critico' ? 'Serata perfetta! Hai conosciuto gente interessante e ti sei divertito.' : cardResult.result === 'successo' ? 'Serata piacevole con gli amici.' : cardResult.result === 'fallimento-parziale' ? 'Hai speso più del previsto ma ti sei divertito.' : 'Hai speso troppo e ti senti in colpa.'),
                effects
              })
            }
          )
        }
      },
      { 
        text: 'Ordino cibo da asporto', 
        narrative: 'Ordini cibo da asporto. "Stasera non ho voglia di cucinare", dici. Spendere €25 per una pizza e una birra. "Meritato", pensi.',
        effects: { budget: -25, burnout: -3, aura: 1 },
        onSelect: () => {
          character.value.budget -= 25
          character.value.burnout = Math.min(100, Math.max(0, character.value.burnout - 3))
          character.value.aura = Math.max(0, character.value.aura + 1)
          chatHistory.value.push({
            type: 'ai',
            text: '🍕 Hai ordinato cibo da asporto. Ti senti meglio, ma il portafoglio piange.',
            effects: { budget: -25, burnout: -3, aura: 1 }
          })
        }
      }
    ]
  }
  
  // ENTRY JOB STATE - Just got a job offer or have entry-level job
  if (currentJobState === 'entry-job') {
    return [
      { 
        text: 'Accetto il lavoro', 
        narrative: `Accetti il lavoro. Stipendio: €${character.value.salary}/mese. "È un inizio", pensi.`,
        effects: { salary: character.value.salary, burnout: 5 },
        onSelect: () => {
          jobState.value = 'stable-job'
          chatHistory.value.push({
            type: 'event',
            text: `💼 HAI TROVATO LAVORO!\n\nStipendio: €${character.value.salary}/mese\n\nOra devi gestire le spese mensili e cercare di migliorare la tua situazione.`,
            effects: { salary: character.value.salary }
          })
        }
      },
      { 
        text: 'Negoziare lo stipendio', 
        narrative: 'Chiedi un aumento. "Merito di più", dici. Rischi di essere licenziato, ma potresti ottenere di più.',
        effects: { burnout: 8 },
        onSelect: () => {
          character.value.negotiationAttempts++
          const raceId = character.value.race?.id || ''
          const subclassId = character.value.subclass?.id || ''
          const carismaBonus = Math.floor(character.value.stats.carisma / 2)
          const cardResult = drawBriscolaCard(carismaBonus)
          
          // Show modal and execute action immediately (atomic)
          showCardModalAndExecute(
            { result: cardResult.result, text: cardResult.resultText },
            () => {
              if (cardResult.result === 'successo-critico' || cardResult.result === 'successo') {
                const salaryIncrease = cardResult.result === 'successo-critico' ? 300 + Math.floor(Math.random() * 200) : 150 + Math.floor(Math.random() * 150)
                const newSalary = character.value.salary + salaryIncrease
                character.value.salary = newSalary
                chatHistory.value.push({
                  type: 'ai',
                  text: getNegotiationNarrative(raceId, subclassId, true) + ` Nuovo stipendio: €${newSalary}/mese. ${cardResult.result === 'successo-critico' ? '🎯 SUCCESSO CRITICO! Hai negoziato brillantemente!' : '✅ Successo!'}`,
                  effects: { salary: newSalary, aura: cardResult.result === 'successo-critico' ? 5 : 2 }
                })
                jobState.value = 'stable-job'
              } else if (cardResult.result === 'fallimento-parziale') {
                const aumentoMinimo = 30 + Math.floor(Math.random() * 50)
                const newSalary = character.value.salary + aumentoMinimo
                character.value.salary = newSalary
                chatHistory.value.push({
                  type: 'ai',
                  text: getNegotiationNarrative(raceId, subclassId, true) + ` Ti danno solo un aumento minimo: +€${aumentoMinimo}/mese. Nuovo stipendio: €${newSalary}/mese. ⚠️ Fallimento Parziale.`,
                  effects: { salary: newSalary, burnout: 10, aura: -1 }
                })
                jobState.value = 'stable-job'
              } else {
                character.value.salary = 0
                chatHistory.value.push({
                  type: 'event',
                  text: `🚫 ${getFiredNarrative(raceId, subclassId)} ❌ Fallimento Critico nella negoziazione.`,
                  effects: { salary: 0, burnout: 20, aura: -2 }
                })
                jobState.value = 'fired'
              }
            }
          )
        }
      },
      { 
        text: 'Rifiuto l\'offerta', 
        narrative: 'Rifiuti l\'offerta. "Merito di meglio", dici. Torni a cercare lavoro.',
        effects: { budget: -200, burnout: -5, aura: 3 },
        onSelect: () => {
          jobState.value = 'no-job'
          character.value.salary = 0
          character.value.jobSearchAttempts = 0
        }
      }
    ]
  }
  
  // NEGOTIATING STATE - Should not exist, negotiation is now atomic
  if (currentJobState === 'negotiating') {
    // This should never happen, but just in case, resolve immediately
    const carismaBonus = Math.floor(character.value.stats.carisma / 2)
    const cardResult = drawBriscolaCard(carismaBonus)
    
    if (cardResult.result === 'successo-critico' || cardResult.result === 'successo') {
      const salaryIncrease = cardResult.result === 'successo-critico' ? 500 + Math.floor(Math.random() * 500) : 300 + Math.floor(Math.random() * 400)
      character.value.salary += salaryIncrease
      jobState.value = 'stable-job'
    } else if (cardResult.result === 'fallimento-parziale') {
      const aumentoMinimo = 50 + Math.floor(Math.random() * 100)
      character.value.salary += aumentoMinimo
      jobState.value = 'stable-job'
    } else {
      character.value.salary = 0
      jobState.value = 'fired'
    }
    return []
  }
  
  // FIRED STATE - Got fired, back to job search
  if (currentJobState === 'fired') {
    return [
      { 
        text: 'Cerco un nuovo lavoro', 
        narrative: 'Torni a cercare lavoro. "Questa volta andrà meglio", pensi. O forse no.',
        effects: { burnout: 5 },
        onSelect: () => {
          jobState.value = 'no-job'
          character.value.jobSearchAttempts = 0
        }
      },
      { 
        text: 'Faccio pausa', 
        narrative: 'Fai una pausa. "Ho bisogno di tempo", pensi. La salute mentale viene prima.',
        effects: { burnout: -10, aura: 3 }
      },
      { 
        text: 'Esco con gli amici a bere', 
        narrative: 'Esci con gli amici. "Un drink non fa male", dici. Spendere €40 per 3 drink in un locale trendy. "Networking", dici.',
        effects: { budget: -40, burnout: -8, aura: 3 },
        onSelect: () => {
          const cardResult = drawBriscolaCard(Math.floor(character.value.stats.carisma / 2))
          showCardModalAndExecute(
            { result: cardResult.result, text: cardResult.resultText },
            () => {
              let effects = { budget: -40, burnout: -8, aura: 3 }
              if (cardResult.result === 'successo-critico') {
                effects = { budget: -20, burnout: -12, aura: 5 }
              } else if (cardResult.result === 'fallimento-parziale') {
                effects = { budget: -60, burnout: -5, aura: 1 }
              } else if (cardResult.result === 'fallimento-critico') {
                effects = { budget: -80, burnout: 3, aura: -1 }
              }
              character.value.budget += effects.budget
              character.value.burnout = Math.min(100, Math.max(0, character.value.burnout + effects.burnout))
              character.value.aura = Math.max(0, character.value.aura + effects.aura)
              chatHistory.value.push({
                type: 'ai',
                text: '🍻 ' + (cardResult.result === 'successo-critico' ? 'Serata perfetta! Hai conosciuto gente interessante e ti sei divertito.' : cardResult.result === 'successo' ? 'Serata piacevole con gli amici.' : cardResult.result === 'fallimento-parziale' ? 'Hai speso più del previsto ma ti sei divertito.' : 'Hai speso troppo e ti senti in colpa.'),
                effects
              })
            }
          )
        }
      },
      { 
        text: 'Vado a spaccarmi di palestra', 
        narrative: 'Vai in palestra. "Il corpo è un tempio", dici. Iscrizione mensile: €50. "Investimento in me stesso", pensi.',
        effects: { budget: -50, burnout: -5, aura: 2 },
        onSelect: () => {
          const cardResult = drawBriscolaCard(Math.floor(character.value.stats.resilienza / 2))
          showCardModalAndExecute(
            { result: cardResult.result, text: cardResult.resultText },
            () => {
              let effects = { budget: -50, burnout: -5, aura: 2 }
              if (cardResult.result === 'successo-critico') {
                effects = { budget: -50, burnout: -10, aura: 4 }
              } else if (cardResult.result === 'fallimento-parziale') {
                effects = { budget: -50, burnout: -2, aura: 1 }
              } else if (cardResult.result === 'fallimento-critico') {
                effects = { budget: -50, burnout: 2, aura: -1 }
              }
              character.value.budget += effects.budget
              character.value.burnout = Math.min(100, Math.max(0, character.value.burnout + effects.burnout))
              character.value.aura = Math.max(0, character.value.aura + effects.aura)
              chatHistory.value.push({
                type: 'ai',
                text: '💪 ' + (cardResult.result === 'successo-critico' ? 'Allenamento perfetto! Ti senti una macchina!' : cardResult.result === 'successo' ? 'Buon allenamento. Ti senti meglio.' : cardResult.result === 'fallimento-parziale' ? 'Hai fatto poco ma meglio di niente.' : 'Ti sei fatto male. Forse era meglio restare a casa.'),
                effects
              })
            }
          )
        }
      }
    ]
  }
  
  // FACCIO-COSE-VEDO-GENTE STATE - Special state for rich kids
  if (currentJobState === 'faccio-cose-vedo-gente') {
    const passions = [
      'Corso di ceramica',
      'Workshop di teatro',
      'Corso di produzione musicale',
      'Corso di yoga',
      'Workshop di scrittura',
      'Corso di fotografia',
      'Corso di cucina',
      'Workshop di meditazione',
      'Corso di lingue',
      'Workshop di arte'
    ]
    
    return [
      { 
        text: 'Trovo una nuova passione', 
        narrative: 'Trovi una nuova passione. "Forse è questa", pensi. Ma tra un mese sarà un\'altra.',
        effects: { budget: -500, burnout: -5, aura: 2 },
        onSelect: () => {
          const passion = passions[Math.floor(Math.random() * passions.length)]
          if (!character.value.passions.includes(passion)) {
            character.value.passions.push(passion)
          }
          chatHistory.value.push({
            type: 'event',
            text: `🎨 Nuova passione: ${passion}\n\n"Sto esplorando me stesso", dici. I tuoi genitori sono contenti: "Finalmente fai qualcosa".`,
            effects: { budget: -500, burnout: -5, aura: 2 }
          })
        }
      },
      { 
        text: 'Viaggio "spirituale"', 
        narrative: 'Fai un viaggio "spirituale". "Devo trovare me stesso", dici.',
        effects: { budget: -3000, burnout: -15, aura: 5 },
        onSelect: () => {
          if (character.value.budget >= 3000) {
            character.value.budget -= 3000
            character.value.burnout = Math.max(0, character.value.burnout - 15)
            character.value.aura += 5
            chatHistory.value.push({
              type: 'event',
              text: '🧘 Viaggio "spirituale" completato. "Ho trovato me stesso", dici. Ma tra un mese sarà un\'altra cosa.',
              effects: { budget: -3000, burnout: -15, aura: 5 }
            })
          } else {
            chatHistory.value.push({
              type: 'ai',
              text: 'Non hai abbastanza soldi per il viaggio. Chiedi ai tuoi genitori?',
              effects: null
            })
          }
        }
      },
      { 
        text: 'Stage non pagato', 
        narrative: 'Fai uno stage non pagato. "È per il CV", dici. Ma i soldi arrivano comunque.',
        effects: { burnout: 8, aura: -1 },
        onSelect: () => {
          character.value.burnout = Math.min(100, character.value.burnout + 8)
          character.value.aura = Math.max(0, character.value.aura - 1)
          chatHistory.value.push({
            type: 'event',
            text: '💼 Stage non pagato completato. "L\'esperienza è importante", dici. Ma i soldi arrivano comunque dai genitori.',
            effects: { burnout: 8, aura: -1 }
          })
        }
      },
      { 
        text: 'Networking event', 
        narrative: 'Vai a un networking event. "Sto costruendo relazioni", dici.',
        effects: { budget: -200, burnout: -2, aura: 1 },
        onSelect: () => {
          if (character.value.budget >= 200) {
            character.value.budget -= 200
            character.value.burnout = Math.max(0, character.value.burnout - 2)
            character.value.aura += 1
            chatHistory.value.push({
              type: 'event',
              text: '🍷 Networking event completato. "Ho conosciuto persone interessanti", dici. Ma in realtà hai solo bevuto vino.',
              effects: { budget: -200, burnout: -2, aura: 1 }
            })
          } else {
            chatHistory.value.push({
              type: 'ai',
              text: 'Non hai abbastanza soldi per l\'evento. I tuoi genitori ti danno più soldi?',
              effects: null
            })
          }
        }
      },
      { 
        text: 'Weekend a Parigi', 
        narrative: 'Fai un weekend a Parigi. "Ho bisogno di ispirazione", dici.',
        effects: { budget: -800, burnout: -10, aura: 3 },
        onSelect: () => {
          if (character.value.budget >= 800) {
            character.value.budget -= 800
            character.value.burnout = Math.max(0, character.value.burnout - 10)
            character.value.aura += 3
            chatHistory.value.push({
              type: 'event',
              text: '✈️ Weekend a Parigi completato. "Ho trovato ispirazione", dici. Ma in realtà hai solo fatto shopping.',
              effects: { budget: -800, burnout: -10, aura: 3 }
            })
          } else {
            chatHistory.value.push({
              type: 'ai',
              text: 'Non hai abbastanza soldi per Parigi. Chiedi ai tuoi genitori?',
              effects: null
            })
          }
        }
      },
      { 
        text: 'Master in "qualcosa"', 
        narrative: 'Ti iscrivi a un master. "Mi serve per crescere", dici.',
        effects: { budget: -8000, burnout: 5 },
        onSelect: () => {
          if (character.value.budget >= 8000) {
            character.value.budget -= 8000
            character.value.burnout = Math.min(100, character.value.burnout + 5)
            chatHistory.value.push({
              type: 'event',
              text: '📚 Master completato. "Ho imparato tanto", dici. I tuoi genitori sono contenti: "L\'istruzione è importante".',
              effects: { budget: -8000, burnout: 5, aura: 2 }
            })
          } else {
            chatHistory.value.push({
              type: 'ai',
              text: 'Non hai abbastanza soldi per il master. I tuoi genitori lo pagheranno?',
              effects: null
            })
          }
        }
      }
    ]
  }
  
  // BOOMER-RENTIER STATE - Special state for boomer-rentier
  if (currentJobState === 'boomer-rentier') {
    return [
      { 
        text: 'Affitto a studenti', 
        narrative: `Affitti una stanza a uno studente. Introito: +€300/mese. "Gli studenti sono affidabili", pensi.`,
        effects: { salary: 300 },
        onSelect: () => {
          character.value.properties++
          chatHistory.value.push({
            type: 'event',
            text: `👨‍🎓 Affitti una stanza a uno studente. Introito: +€300/mese. Immobili totali: ${character.value.properties}`,
            effects: { salary: 300 }
          })
        }
      },
      { 
        text: 'Metti su Airbnb', 
        narrative: 'Metti un appartamento esistente su Airbnb. "Gli affitti brevi rendono di più", pensi. Introito immediato.',
        effects: { salary: 400 },
        onSelect: () => {
          character.value.properties++
          character.value.salary += 400
          const airbnbIncome = 300 + Math.floor(Math.random() * 200) // 300-500 euro guadagno immediato
          character.value.budget += airbnbIncome
          chatHistory.value.push({
            type: 'event',
            text: `🏖️ Messo appartamento su Airbnb. Introito: +€400/mese. Primo affitto: +€${airbnbIncome}. Immobili totali: ${character.value.properties}`,
            effects: { budget: airbnbIncome, salary: 400 }
          })
        }
      },
      { 
        text: 'Ristrutturazione', 
        narrative: 'Ristrutturi un immobile. "Aumenterà il valore", pensi.',
        effects: { budget: -5000 },
        onSelect: () => {
          if (character.value.budget >= 5000) {
            character.value.budget -= 5000
            chatHistory.value.push({
              type: 'event',
              text: '🔧 Ristrutturazione completata. L\'immobile vale di più ora.',
              effects: { budget: -5000, aura: 2 }
            })
          } else {
            chatHistory.value.push({
              type: 'ai',
              text: 'Non hai abbastanza soldi per la ristrutturazione. Ti servono almeno €5000.',
              effects: null
            })
          }
        }
      },
      { 
        text: 'Vacanza alle Maldive', 
        narrative: 'Prenoti una vacanza alle Maldive. "Me lo merito", pensi.',
        effects: { budget: -3000, burnout: -20, aura: 5 },
        onSelect: () => {
          if (character.value.budget >= 3000) {
            character.value.budget -= 3000
            character.value.burnout = Math.max(0, character.value.burnout - 20)
            character.value.aura += 5
            chatHistory.value.push({
              type: 'event',
              text: '🎉 Vacanza alle Maldive completata. Ti senti rigenerato.',
              effects: { budget: -3000, burnout: -20, aura: 5 }
            })
          } else {
            chatHistory.value.push({
              type: 'ai',
              text: 'Non hai abbastanza soldi per le Maldive. Ti servono almeno €3000.',
              effects: null
            })
          }
        }
      },
      { 
        text: 'Cena stellata', 
        narrative: 'Prenoti una cena al ristorante stellato. "La vita è breve", dici.',
        effects: { budget: -250, burnout: -8, aura: 3 },
        onSelect: () => {
          if (character.value.budget >= 250) {
            character.value.budget -= 250
            character.value.burnout = Math.max(0, character.value.burnout - 8)
            character.value.aura += 3
            chatHistory.value.push({
              type: 'event',
              text: '🍾 Cena stellata completata. Il cibo era divino.',
              effects: { budget: -250, burnout: -8, aura: 3 }
            })
          } else {
            chatHistory.value.push({
              type: 'ai',
              text: 'Non hai abbastanza soldi per la cena stellata. Ti servono almeno €250.',
              effects: null
            })
          }
        }
      },
      { 
        text: 'Golf club', 
        narrative: 'Ti iscrivi al golf club. "Networking", dici.',
        effects: { budget: -2000, burnout: -5, aura: 2 },
        onSelect: () => {
          if (character.value.budget >= 2000) {
            character.value.budget -= 2000
            character.value.burnout = Math.max(0, character.value.burnout - 5)
            character.value.aura += 2
            chatHistory.value.push({
              type: 'event',
              text: '🏌️ Iscrizione al golf club completata. "Gli affari si fanno sul green", pensi.',
              effects: { budget: -2000, burnout: -5, aura: 2 }
            })
          } else {
            chatHistory.value.push({
              type: 'ai',
              text: 'Non hai abbastanza soldi per il golf club. Ti servono almeno €2000.',
              effects: null
            })
          }
        }
      }
    ]
  }
  
  // STABLE JOB STATE - Have a stable job, can do various actions
  if (currentJobState === 'stable-job') {
    const negotiateAction = { 
      text: 'Chiedo aumento', 
      narrative: 'Chiedi un aumento al tuo capo. "Merito di più", dici. Rischi di essere licenziato.',
      effects: { burnout: 8 },
      onSelect: () => {
        character.value.negotiationAttempts++
        const raceId = character.value.race?.id || ''
        const subclassId = character.value.subclass?.id || ''
        const carismaBonus = Math.floor(character.value.stats.carisma / 2)
        const cardResult = drawBriscolaCard(carismaBonus)
        
        // Show modal and execute action immediately (atomic)
        showCardModalAndExecute(
          { result: cardResult.result, text: cardResult.resultText },
          () => {
            if (cardResult.result === 'successo-critico' || cardResult.result === 'successo') {
              const salaryIncrease = cardResult.result === 'successo-critico' ? 500 + Math.floor(Math.random() * 500) : 300 + Math.floor(Math.random() * 400)
              const newSalary = character.value.salary + salaryIncrease
              character.value.salary = newSalary
              chatHistory.value.push({
                type: 'ai',
                text: getNegotiationNarrative(raceId, subclassId, true) + ` Nuovo stipendio: €${newSalary}/mese. ${cardResult.result === 'successo-critico' ? '🎯 SUCCESSO CRITICO! Hai negoziato brillantemente!' : '✅ Successo!'}`,
                effects: { salary: newSalary, aura: cardResult.result === 'successo-critico' ? 5 : 2 }
              })
            } else if (cardResult.result === 'fallimento-parziale') {
              const aumentoMinimo = 50 + Math.floor(Math.random() * 100)
              const newSalary = character.value.salary + aumentoMinimo
              character.value.salary = newSalary
              chatHistory.value.push({
                type: 'ai',
                text: getNegotiationNarrative(raceId, subclassId, true) + ` Ti danno solo un aumento minimo: +€${aumentoMinimo}/mese. Nuovo stipendio: €${newSalary}/mese. ⚠️ Fallimento Parziale.`,
                effects: { salary: newSalary, burnout: 10, aura: -1 }
              })
            } else {
              character.value.salary = 0
              chatHistory.value.push({
                type: 'event',
                text: `🚫 ${getFiredNarrative(raceId, subclassId)} ❌ Fallimento Critico nella negoziazione.`,
                effects: { salary: 0, burnout: 20, aura: -2 }
              })
              jobState.value = 'fired'
            }
          }
        )
      }
    }
    
    // Use race/class specific actions if available
    if (ACTIONS[raceId] && ACTIONS[raceId][subclassId]) {
      const baseActions = ACTIONS[raceId][subclassId].map(a => {
        // Add briscola card system to actions that involve skill checks
        const needsCardCheck = a.text.includes('Chiedo') || a.text.includes('Cerco') || a.text.includes('Studio') || a.text.includes('Investo') || a.text.includes('Assumo')
        
        if (needsCardCheck) {
          return {
            ...a,
            onSelect: () => {
              // Determine which stat to use based on action type
              let statBonus = 0
              if (a.text.includes('Chiedo') || a.text.includes('Cerco')) {
                statBonus = Math.floor(character.value.stats.carisma / 2) // Carisma per negoziazioni
              } else if (a.text.includes('Studio') || a.text.includes('Investo')) {
                statBonus = Math.floor(character.value.stats.saggezza / 2) // Saggezza per decisioni
              } else {
                statBonus = Math.floor(character.value.stats.abilita / 2) // Abilità per altre azioni
              }
              
              const cardResult = drawBriscolaCard(statBonus)
              
              // Show modal and execute action after
              showCardModalAndExecute(
                { result: cardResult.result, text: cardResult.resultText },
                () => {
                  // Modify effects based on card result
                  let modifiedEffects = { ...a.effects }
                  if (cardResult.result === 'successo-critico') {
                    // Successo critico = azione perfetta, bonus economico
                    if (modifiedEffects.budget) modifiedEffects.budget = Math.floor(modifiedEffects.budget * 1.5) + 50 + Math.floor(Math.random() * 100)
                    if (modifiedEffects.aura) modifiedEffects.aura = (modifiedEffects.aura || 0) + 3
                    modifiedEffects.burnout = (modifiedEffects.burnout || 0) - 5
                  } else if (cardResult.result === 'successo') {
                    // Successo normale = azione va a buon fine
                    // Effects rimangono invariati
                  } else if (cardResult.result === 'fallimento-parziale') {
                    // Fallimento parziale = azione passa ma pagano poco o rimborso spese
                    if (modifiedEffects.budget && modifiedEffects.budget > 0) {
                      // Se l'azione dovrebbe dare soldi, invece danno rimborso spese o pagano poco
                      const rimborsoSpese = 20 + Math.floor(Math.random() * 30) // 20-50 euro
                      modifiedEffects.budget = rimborsoSpese
                    } else if (modifiedEffects.budget && modifiedEffects.budget < 0) {
                      // Se l'azione costa, costa di più
                      modifiedEffects.budget = Math.floor(modifiedEffects.budget * 1.3)
                    }
                    modifiedEffects.burnout = (modifiedEffects.burnout || 0) + 8
                    if (modifiedEffects.aura) modifiedEffects.aura = Math.max(0, (modifiedEffects.aura || 0) - 1)
                  } else {
                    // Fallimento critico = azione fallita
                    if (modifiedEffects.budget) modifiedEffects.budget = Math.floor(modifiedEffects.budget * 0.3) - 100
                    modifiedEffects.burnout = (modifiedEffects.burnout || 0) + 12
                    if (modifiedEffects.aura) modifiedEffects.aura = Math.max(0, (modifiedEffects.aura || 0) - 3)
                  }
                  
                  // Apply modified effects
                  if (modifiedEffects.budget) character.value.budget += modifiedEffects.budget
                  if (modifiedEffects.burnout) character.value.burnout = Math.min(100, Math.max(0, character.value.burnout + modifiedEffects.burnout))
                  if (modifiedEffects.aura) character.value.aura = Math.max(0, character.value.aura + modifiedEffects.aura)
                  
                  let narrativeText = a.narrative
                  if (cardResult.result === 'fallimento-parziale') {
                    // Aggiungi testo specifico per fallimento parziale
                    const fallimentoTexts = [
                      ' Ti pagano solo il rimborso spese.',
                      ' Ti propongono un rimborso spese invece dello stipendio.',
                      ' Ti offrono solo €' + (modifiedEffects.budget || 0) + ' di rimborso.',
                      ' Ti pagano pochissimo, solo rimborso spese.'
                    ]
                    narrativeText += fallimentoTexts[Math.floor(Math.random() * fallimentoTexts.length)]
                  }
                  
                  const resultText = cardResult.result === 'successo-critico' ? '🎯 SUCCESSO CRITICO! ' : cardResult.result === 'successo' ? '✅ Successo! ' : cardResult.result === 'fallimento-parziale' ? '⚠️ Fallimento Parziale. ' : '❌ Fallimento Critico. '
                  chatHistory.value.push({
                    type: 'ai',
                    text: narrativeText + ' ' + resultText,
                    effects: modifiedEffects
                  })
                }
              )
            }
          }
        }
        return a
      })
      return [...baseActions, negotiateAction]
    }
    
    // Default actions for stable job
    const defaultActions = [
      { 
        text: 'Torni a vivere con i tuoi', 
        narrative: 'Torni a vivere con i tuoi genitori. "È temporaneo", dici. Non paghi più affitto, bollette, spesa e trasporti. Risparmi €1100/mese, ma perdi un po\' di indipendenza.',
        effects: { burnout: -5, aura: -2 },
        onSelect: () => {
          character.value.livesWithParents = true
          selectedActions.value.add('Torni a vivere con i tuoi')
          chatHistory.value.push({
            type: 'event',
            text: '🏠 Ora vivi con i tuoi genitori. Non paghi più spese mensili (affitto, bollette, spesa, trasporti). Risparmi €1100/mese!',
            effects: null
          })
        }
      },
      { 
        text: 'Lavoro normalmente', 
        narrative: 'Fai il tuo lavoro normalmente.',
        effects: { burnout: 5 },
        onSelect: () => {
          // Use briscola card with abilità bonus for work performance
          const abilitaBonus = Math.floor(character.value.stats.abilita / 2)
          const cardResult = drawBriscolaCard(abilitaBonus)
          
          // Show modal and execute action after
          showCardModalAndExecute(
            { result: cardResult.result, text: cardResult.resultText },
            () => {
              let salaryEarned = character.value.salary
              let bonusText = ''
              let burnoutIncrease = 5
              
              if (cardResult.result === 'successo-critico') {
                // Successo critico = bonus performance
                salaryEarned += 100 + Math.floor(Math.random() * 200)
                bonusText = '🎯 SUCCESSO CRITICO! Performance eccellente! Bonus: +€' + (salaryEarned - character.value.salary)
                character.value.aura += 2
                burnoutIncrease = 3
              } else if (cardResult.result === 'successo') {
                // Successo = lavoro normale
                bonusText = '✅ Successo! Lavoro completato.'
                burnoutIncrease = 5
              } else if (cardResult.result === 'fallimento-parziale') {
                // Fallimento parziale = lavoro passa ma pagano poco o rimborso spese
                const rimborsoSpese = 30 + Math.floor(Math.random() * 40) // 30-70 euro
                salaryEarned = rimborsoSpese
                bonusText = `⚠️ Fallimento Parziale. Ti pagano solo €${rimborsoSpese} di rimborso spese invece dello stipendio.`
                burnoutIncrease = 10
              } else {
                // Fallimento critico = lavoro fatto male, meno soldi
                salaryEarned = Math.floor(character.value.salary * 0.5) - 50
                bonusText = '❌ Fallimento Critico. Il lavoro non è andato bene. Stipendio ridotto.'
                burnoutIncrease = 15
              }
              
              character.value.budget += salaryEarned
              chatHistory.value.push({
                type: 'ai',
                text: `Stipendio: €${salaryEarned}/mese. ${bonusText}`,
                effects: { budget: salaryEarned, burnout: burnoutIncrease }
              })
            }
          )
        }
      },
      negotiateAction,
      { 
        text: 'Faccio pausa', 
        narrative: 'Fai una pausa. "Il lavoro può aspettare", pensi. La salute mentale viene prima.',
        effects: { burnout: -10, aura: 5 }
      },
      { 
        text: 'Esco con gli amici a bere', 
        narrative: 'Esci con gli amici. "Un drink non fa male", dici. Spendere €40 per 3 drink in un locale trendy. "Networking", dici.',
        effects: { budget: -40, burnout: -8, aura: 3 },
        onSelect: () => {
          const cardResult = drawBriscolaCard(Math.floor(character.value.stats.carisma / 2))
          showCardModalAndExecute(
            { result: cardResult.result, text: cardResult.resultText },
            () => {
              let effects = { budget: -40, burnout: -8, aura: 3 }
              if (cardResult.result === 'successo-critico') {
                effects = { budget: -20, burnout: -12, aura: 5 }
              } else if (cardResult.result === 'fallimento-parziale') {
                effects = { budget: -60, burnout: -5, aura: 1 }
              } else if (cardResult.result === 'fallimento-critico') {
                effects = { budget: -80, burnout: 3, aura: -1 }
              }
              character.value.budget += effects.budget
              character.value.burnout = Math.min(100, Math.max(0, character.value.burnout + effects.burnout))
              character.value.aura = Math.max(0, character.value.aura + effects.aura)
              chatHistory.value.push({
                type: 'ai',
                text: '🍻 ' + (cardResult.result === 'successo-critico' ? 'Serata perfetta! Hai conosciuto gente interessante e ti sei divertito.' : cardResult.result === 'successo' ? 'Serata piacevole con gli amici.' : cardResult.result === 'fallimento-parziale' ? 'Hai speso più del previsto ma ti sei divertito.' : 'Hai speso troppo e ti senti in colpa.'),
                effects
              })
            }
          )
        }
      },
      { 
        text: 'Vado a spaccarmi di palestra', 
        narrative: 'Vai in palestra. "Il corpo è un tempio", dici. Iscrizione mensile: €50. "Investimento in me stesso", pensi.',
        effects: { budget: -50, burnout: -5, aura: 2 },
        onSelect: () => {
          const cardResult = drawBriscolaCard(Math.floor(character.value.stats.resilienza / 2))
          showCardModalAndExecute(
            { result: cardResult.result, text: cardResult.resultText },
            () => {
              let effects = { budget: -50, burnout: -5, aura: 2 }
              if (cardResult.result === 'successo-critico') {
                effects = { budget: -50, burnout: -10, aura: 4 }
              } else if (cardResult.result === 'fallimento-parziale') {
                effects = { budget: -50, burnout: -2, aura: 1 }
              } else if (cardResult.result === 'fallimento-critico') {
                effects = { budget: -50, burnout: 2, aura: -1 }
              }
              character.value.budget += effects.budget
              character.value.burnout = Math.min(100, Math.max(0, character.value.burnout + effects.burnout))
              character.value.aura = Math.max(0, character.value.aura + effects.aura)
              chatHistory.value.push({
                type: 'ai',
                text: '💪 ' + (cardResult.result === 'successo-critico' ? 'Allenamento perfetto! Ti senti una macchina!' : cardResult.result === 'successo' ? 'Buon allenamento. Ti senti meglio.' : cardResult.result === 'fallimento-parziale' ? 'Hai fatto poco ma meglio di niente.' : 'Ti sei fatto male. Forse era meglio restare a casa.'),
                effects
              })
            }
          )
        }
      },
      { 
        text: 'Faccio un corso online', 
        narrative: 'Ti iscrivi a un corso online. "Devo migliorarmi", dici. Costo: €200. "È un investimento", pensi.',
        effects: { budget: -200, burnout: -3, aura: 3 },
        onSelect: () => {
          const cardResult = drawBriscolaCard(Math.floor(character.value.stats.saggezza / 2))
          showCardModalAndExecute(
            { result: cardResult.result, text: cardResult.resultText },
            () => {
              let effects = { budget: -200, burnout: -3, aura: 3 }
              if (cardResult.result === 'successo-critico') {
                effects = { budget: -200, burnout: -5, aura: 5 }
                character.value.salary += 50
              } else if (cardResult.result === 'fallimento-parziale') {
                effects = { budget: -200, burnout: 0, aura: 1 }
              } else if (cardResult.result === 'fallimento-critico') {
                effects = { budget: -200, burnout: 5, aura: -1 }
              }
              character.value.budget += effects.budget
              character.value.burnout = Math.min(100, Math.max(0, character.value.burnout + effects.burnout))
              character.value.aura = Math.max(0, character.value.aura + effects.aura)
              const salaryText = cardResult.result === 'successo-critico' ? ' Bonus: +€50/mese allo stipendio!' : ''
              chatHistory.value.push({
                type: 'ai',
                text: '📚 ' + (cardResult.result === 'successo-critico' ? 'Corso fantastico! Hai imparato molto e migliorato le tue competenze!' + salaryText : cardResult.result === 'successo' ? 'Corso interessante. Hai imparato qualcosa di nuovo.' : cardResult.result === 'fallimento-parziale' ? 'Il corso era ok ma non hai imparato molto.' : 'Il corso era una truffa. Hai speso soldi per niente.'),
                effects
              })
            }
          )
        }
      },
      { 
        text: 'Ordino cibo da asporto', 
        narrative: 'Ordini cibo da asporto. "Stasera non ho voglia di cucinare", dici. Spendere €25 per una pizza e una birra. "Meritato", pensi.',
        effects: { budget: -25, burnout: -3, aura: 1 },
        onSelect: () => {
          character.value.budget -= 25
          character.value.burnout = Math.min(100, Math.max(0, character.value.burnout - 3))
          character.value.aura = Math.max(0, character.value.aura + 1)
          chatHistory.value.push({
            type: 'ai',
            text: '🍕 Hai ordinato cibo da asporto. Ti senti meglio, ma il portafoglio piange.',
            effects: { budget: -25, burnout: -3, aura: 1 }
          })
        }
      },
      { 
        text: 'Vado al cinema', 
        narrative: 'Vai al cinema. "Ho bisogno di evadere", dici. Biglietto: €12. Popcorn: €8. "È cultura", pensi.',
        effects: { budget: -20, burnout: -5, aura: 2 },
        onSelect: () => {
          character.value.budget -= 20
          character.value.burnout = Math.min(100, Math.max(0, character.value.burnout - 5))
          character.value.aura = Math.max(0, character.value.aura + 2)
          chatHistory.value.push({
            type: 'ai',
            text: '🎬 Serata al cinema. Ti sei rilassato e hai dimenticato i problemi per un paio d\'ore.',
            effects: { budget: -20, burnout: -5, aura: 2 }
          })
        }
      },
      { 
        text: 'Faccio volontariato', 
        narrative: 'Fai volontariato. "Devo dare qualcosa alla comunità", dici. Non paghi niente, anzi ti senti meglio.',
        effects: { burnout: -5, aura: 5 },
        onSelect: () => {
          character.value.burnout = Math.min(100, Math.max(0, character.value.burnout - 5))
          character.value.aura = Math.max(0, character.value.aura + 5)
          chatHistory.value.push({
            type: 'ai',
            text: '❤️ Hai fatto volontariato. Ti senti utile e hai aiutato qualcuno. Il karma ti sorride.',
            effects: { burnout: -5, aura: 5 }
          })
        }
      }
    ]
    
    // Filter out actions that have already been selected
    const filteredActions = defaultActions.filter(action => {
      if (action.text === 'Torni a vivere con i tuoi' && character.value.livesWithParents) {
        return false
      }
      return true
    })
    
    return filteredActions
  }
  
  // Fallback
  return [
    { text: 'Cerco lavoro', narrative: 'Cerchi un lavoro.', effects: { burnout: 5 } }
  ]
}

// Game flow states
type JobState = 'no-job' | 'entry-job' | 'negotiating' | 'stable-job' | 'fired' | 'boomer-rentier' | 'faccio-cose-vedo-gente'

// Briscola card system
type Suit = 'spade' | 'coppe' | 'denari' | 'bastoni'
type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
interface Card {
  suit: Suit
  value: CardValue
  isFigure: boolean // Asso (1), 3, Re (10), Cavallo (9), Fante (8)
}

const BRISCOLA_CARDS: Card[] = [
  // Spade
  { suit: 'spade', value: 1, isFigure: true }, { suit: 'spade', value: 2, isFigure: false },
  { suit: 'spade', value: 3, isFigure: true }, { suit: 'spade', value: 4, isFigure: false },
  { suit: 'spade', value: 5, isFigure: false }, { suit: 'spade', value: 6, isFigure: false },
  { suit: 'spade', value: 7, isFigure: false }, { suit: 'spade', value: 8, isFigure: true },
  { suit: 'spade', value: 9, isFigure: true }, { suit: 'spade', value: 10, isFigure: true },
  // Coppe
  { suit: 'coppe', value: 1, isFigure: true }, { suit: 'coppe', value: 2, isFigure: false },
  { suit: 'coppe', value: 3, isFigure: true }, { suit: 'coppe', value: 4, isFigure: false },
  { suit: 'coppe', value: 5, isFigure: false }, { suit: 'coppe', value: 6, isFigure: false },
  { suit: 'coppe', value: 7, isFigure: false }, { suit: 'coppe', value: 8, isFigure: true },
  { suit: 'coppe', value: 9, isFigure: true }, { suit: 'coppe', value: 10, isFigure: true },
  // Denari
  { suit: 'denari', value: 1, isFigure: true }, { suit: 'denari', value: 2, isFigure: false },
  { suit: 'denari', value: 3, isFigure: true }, { suit: 'denari', value: 4, isFigure: false },
  { suit: 'denari', value: 5, isFigure: false }, { suit: 'denari', value: 6, isFigure: false },
  { suit: 'denari', value: 7, isFigure: false }, { suit: 'denari', value: 8, isFigure: true },
  { suit: 'denari', value: 9, isFigure: true }, { suit: 'denari', value: 10, isFigure: true },
  // Bastoni
  { suit: 'bastoni', value: 1, isFigure: true }, { suit: 'bastoni', value: 2, isFigure: false },
  { suit: 'bastoni', value: 3, isFigure: true }, { suit: 'bastoni', value: 4, isFigure: false },
  { suit: 'bastoni', value: 5, isFigure: false }, { suit: 'bastoni', value: 6, isFigure: false },
  { suit: 'bastoni', value: 7, isFigure: false }, { suit: 'bastoni', value: 8, isFigure: true },
  { suit: 'bastoni', value: 9, isFigure: true }, { suit: 'bastoni', value: 10, isFigure: true }
]

// Get suit name in Italian
const getSuitName = (suit: Suit): string => {
  const names: Record<Suit, string> = {
    'spade': 'spade',
    'coppe': 'coppe',
    'denari': 'denari',
    'bastoni': 'bastoni'
  }
  return names[suit]
}

// Get card name in Italian
const getCardName = (card: Card): string => {
  if (card.value === 1) return 'Asso'
  if (card.value === 3) return 'Tre'
  if (card.value === 8) return 'Fante'
  if (card.value === 9) return 'Cavallo'
  if (card.value === 10) return 'Re'
  return card.value.toString()
}

// Get satirical text for card result
const getCardResultText = (result: 'successo-critico' | 'successo' | 'fallimento-parziale' | 'fallimento-critico', briscolaSuit: Suit, playerCard: Card): string => {
  const briscolaName = getSuitName(briscolaSuit)
  const cardName = getCardName(playerCard)
  const cardSuitName = getSuitName(playerCard.suit)
  
  if (result === 'successo-critico') {
    const texts = [
      `🎯 SUCCESSO CRITICO! La briscola era a ${briscolaName} e ti è uscito ${cardName} di ${briscolaName}! Azione perfetta!`,
      `🎯 SUCCESSO CRITICO! ${cardName} di ${briscolaName} con briscola a ${briscolaName}! Hai fatto un lavoro eccellente!`,
      `🎯 SUCCESSO CRITICO! La briscola era ${briscolaName} e hai pescato ${cardName} di ${briscolaName}! Perfetto!`
    ]
    return texts[Math.floor(Math.random() * texts.length)]
  } else if (result === 'successo') {
    const texts = [
      `✅ Successo! La briscola era a ${briscolaName} e ti è uscito ${cardName} di ${briscolaName}. Azione completata.`,
      `✅ Successo! ${cardName} di ${briscolaName} con briscola a ${briscolaName}. Va bene così.`,
      `✅ Successo! La briscola era ${briscolaName} e hai pescato ${cardName} di ${briscolaName}. Non male!`
    ]
    return texts[Math.floor(Math.random() * texts.length)]
  } else if (result === 'fallimento-parziale') {
    const texts = [
      `⚠️ Fallimento Parziale! La briscola era a ${briscolaName} e ti è uscito ${cardName} di ${cardSuitName}. L'azione è ok ma ci perdi soldi.`,
      `⚠️ Fallimento Parziale! ${cardName} di ${cardSuitName} mentre la briscola era ${briscolaName}. Funziona ma ti costa.`,
      `⚠️ Fallimento Parziale! La briscola era ${briscolaName} e hai pescato ${cardName} di ${cardSuitName}. Va ma ci sono nefaste conseguenze.`
    ]
    return texts[Math.floor(Math.random() * texts.length)]
  } else {
    const texts = [
      `❌ Fallimento Critico! La briscola era a ${briscolaName} e ti è uscito ${cardName} di ${cardSuitName}. Poraccio, azione fallita.`,
      `❌ Fallimento Critico! ${cardName} di ${cardSuitName} mentre la briscola era ${briscolaName}. Che sfortuna.`,
      `❌ Fallimento Critico! La briscola era ${briscolaName} e hai pescato ${cardName} di ${cardSuitName}. Non è andata bene.`,
      `❌ Fallimento Critico! ${cardName} di ${cardSuitName} con briscola a ${briscolaName}. Disastro totale.`
    ]
    return texts[Math.floor(Math.random() * texts.length)]
  }
}

// Draw a briscola card and evaluate result
const drawBriscolaCard = (statBonus: number = 0): { card: Card, briscolaSuit: Suit, result: 'successo-critico' | 'successo' | 'fallimento-parziale' | 'fallimento-critico', value: number, resultText: string } => {
  const briscolaSuit: Suit = ['spade', 'coppe', 'denari', 'bastoni'][Math.floor(Math.random() * 4)] as Suit
  const playerCard = BRISCOLA_CARDS[Math.floor(Math.random() * BRISCOLA_CARDS.length)]
  
  let result: 'successo-critico' | 'successo' | 'fallimento-parziale' | 'fallimento-critico'
  let value: number
  
  const isBriscola = playerCard.suit === briscolaSuit
  const isHighValue = [1, 3].includes(playerCard.value) || playerCard.isFigure // 1,3 o figure (8,9,10)
  const isLowValue = [2, 4, 5, 6, 7].includes(playerCard.value) // 2,4,5,6,7
  
  // Successo critico: carte 1,2,3 o figure (8,9,10) del seme della briscola
  // Nota: 2 è considerato successo critico se è briscola (secondo le specifiche)
  if (isBriscola && ([1, 2, 3].includes(playerCard.value) || playerCard.isFigure)) {
    result = 'successo-critico'
    value = 20 + statBonus
  }
  // Successo normale: carte 2,4,5,6,7 del seme della briscola (ma il 2 è già coperto sopra, quindi solo 4,5,6,7)
  else if (isBriscola && isLowValue && playerCard.value !== 2) {
    result = 'successo'
    value = 12 + Math.floor(Math.random() * 5) + statBonus // 12-16 + bonus
  }
  // Fallimento parziale: carte 1,3 o figure (8,9,10) di semi NON di briscola
  else if (!isBriscola && isHighValue) {
    result = 'fallimento-parziale'
    value = 5 + Math.floor(Math.random() * 5) + statBonus // 5-9 + bonus
  }
  // Fallimento critico: carte 2,4,5,6,7 di semi NON di briscola
  else if (!isBriscola && isLowValue) {
    result = 'fallimento-critico'
    value = 2 + Math.floor(Math.random() * 3) + statBonus // 2-4 + bonus
  }
  // Fallback (non dovrebbe mai arrivare qui)
  else {
    result = 'fallimento-critico'
    value = 2 + statBonus
  }
  
  const resultText = getCardResultText(result, briscolaSuit, playerCard)
  
  return { card: playerCard, briscolaSuit, result, value, resultText }
}

// Side quest types
interface SideQuest {
  id: string
  title: string
  description: string
  requirements?: { minAura?: number, minBudget?: number, maxBurnout?: number, race?: string, class?: string }
  rewards: { budget?: number, burnout?: number, aura?: number, salary?: number }
  narrative: string
  completionNarrative: string
}

// State
const gameState = ref<'intro' | 'race' | 'class' | 'character-form' | 'generating-backstory' | 'backstory-display' | 'familiar-quiz' | 'sheet' | 'game'>('intro')
const jobState = ref<JobState>('no-job')
const activeSideQuests = ref<SideQuest[]>([])
const completedSideQuests = ref<string[]>([])
const showCardModal = ref(false)
const cardModalResult = ref<{ result: 'successo-critico' | 'successo' | 'fallimento-parziale' | 'fallimento-critico', text: string } | null>(null)
const pendingAction = ref<(() => void) | null>(null)
const showCardResult = ref(false)
const character = ref({
  name: '',
  race: null as typeof RACES[0] | null,
  class: null as string | null,
  subclass: null as typeof CLASSES[0]['subclasses'][0] | null,
  familiar: null as typeof FAMILIARS[0] | null,
  backstory: '',
  stats: { abilita: 10, resilienza: 10, carisma: 10, saggezza: 10 },
  level: 1,
  salary: 0,
  budget: 0,
  burnout: 0,
  aura: 0,
  jobSearchAttempts: 0,
  negotiationAttempts: 0,
  properties: 0, // For boomer-rentier: number of properties
  passions: [] as string[], // For faccio-cose-vedo-gente: temporary passions
  livesWithParents: false // Track if character lives with parents (no monthly expenses)
})
const quizAnswers = ref<Record<number, string>>({})
const characterForm = ref({ name: '' })
const chatHistory = ref<Array<{ type: 'user' | 'ai' | 'event', text: string, effects?: any }>>([])
const month = ref(1)
const actionCounter = ref(0)
const currentTime = ref('')
const selectedActions = ref<Set<string>>(new Set()) // Track selected actions to avoid duplicates

// Computed
const isGameOver = computed(() => character.value.burnout >= 100 || character.value.budget <= -10000)
const isGameWon = computed(() => character.value.aura >= 50)
const isGameFinished = ref(false) // New state for when actions run out
const availableActions = computed(() => {
  const actions = getAvailableActions()
  
  // Filter out actions that have already been selected, but keep at least one action available
  const filteredActions = actions.filter(action => {
    if (selectedActions.value.has(action.text)) {
      return false
    }
    return true
  })
  
  // Add available side quests as actions
  const sideQuestActions = getAvailableSideQuests().map(quest => ({
    text: `📋 ${quest.title}`,
    narrative: quest.narrative,
    effects: quest.rewards,
    onSelect: () => startSideQuest(quest),
    isSideQuest: true
  }))
  
  // Add active side quests as completion actions
  const activeQuestActions = activeSideQuests.value.map(quest => ({
    text: `✅ Completa: ${quest.title}`,
    narrative: quest.completionNarrative,
    effects: quest.rewards,
    onSelect: () => completeSideQuest(quest.id),
    isSideQuest: true
  }))
  
  const allActions = [...filteredActions, ...sideQuestActions, ...activeQuestActions]
  
  // If no actions available and not already finished, trigger game end
  if (allActions.length === 0 && !isGameFinished.value) {
    // Keep at least one fallback action available to prevent empty state
    // But mark game as finished
    setTimeout(() => {
      isGameFinished.value = true
      chatHistory.value.push({
        type: 'event',
        text: `🎭 FINE DEL GIOCO\n\nHai esaurito tutte le azioni disponibili. Hai vissuto tutte le esperienze possibili nel capitalismo.\n\nSei bravissimo, ricco e bellissimo. Non hai raggiunto la realizzazione spirituale in questa vita, ma nel capitalismo sì.\n\nHai accumulato €${character.value.budget}, ${character.value.aura} punti Aura, e ${character.value.burnout}% di burnout. Complimenti, hai vinto il gioco del capitalismo! 🏆`,
        effects: null
      })
    }, 100)
    
    // Return a fallback action that doesn't do anything but prevents empty state
    return [{
      text: 'Hai completato tutte le azioni',
      narrative: 'Hai esaurito tutte le possibilità. Il gioco è finito.',
      effects: {},
      onSelect: () => {}
    }]
  }
  
  // If we have actions but they're all selected, keep at least one available
  if (filteredActions.length === 0 && actions.length > 0 && sideQuestActions.length === 0 && activeQuestActions.length === 0) {
    // Reset selected actions for this state to keep at least one action available
    // Or return a generic action that can be repeated
    const genericAction = actions[0]
    if (genericAction) {
      const actionWithOnSelect = genericAction as any
      return [{
        ...genericAction,
        text: genericAction.text + ' (ripetibile)',
        onSelect: () => {
          if (actionWithOnSelect.onSelect) {
            actionWithOnSelect.onSelect()
          } else {
            // Apply effects directly if no onSelect
            if (genericAction.effects) {
              const effects = genericAction.effects as any
              if (effects.budget) character.value.budget += effects.budget
              if (effects.burnout) character.value.burnout = Math.min(100, Math.max(0, character.value.burnout + effects.burnout))
              if (effects.aura) character.value.aura = Math.max(0, character.value.aura + (effects.aura || 0))
              if (effects.salary) character.value.salary += effects.salary
            }
            chatHistory.value.push({
              type: 'ai',
              text: genericAction.narrative,
              effects: genericAction.effects
            })
          }
        }
      }]
    }
  }
  
  return allActions
})

// Methods
const goBack = () => {
  router.push('/capitalism-simulator')
}

const restartGame = () => {
  if (confirm('🔄 RESET completo? Perderai tutto il progresso!')) {
    isGameFinished.value = false
    selectedActions.value.clear()
    character.value = {
      name: '',
      race: null,
      class: null,
      subclass: null,
      familiar: null,
      backstory: '',
      stats: { abilita: 10, resilienza: 10, carisma: 10, saggezza: 10 },
      level: 1,
      salary: 0,
      budget: 0,
      burnout: 0,
      aura: 0,
      jobSearchAttempts: 0,
      negotiationAttempts: 0,
      properties: 0,
      passions: [],
      livesWithParents: false
    }
    jobState.value = 'no-job'
    gameState.value = 'intro'
    chatHistory.value = []
    quizAnswers.value = {}
    characterForm.value = { name: '' }
    month.value = 1
    actionCounter.value = 0
    activeSideQuests.value = []
    completedSideQuests.value = []
    selectedActions.value.clear()
  }
}

const selectRace = (race: typeof RACES[0]) => {
  // Messaggio sarcastico per le razze "facili"
  if (race.id === 'boomer-rentier' || race.id === 'faccio-cose-vedo-gente') {
    setTimeout(() => {
      alert('Eh bravo, grazie al cazzo, che grande giocatorone che abbiamo qui')
    }, 100)
  }
  
  const newStats = { ...character.value.stats }
  Object.keys(race.stats).forEach(stat => {
    newStats[stat as keyof typeof newStats] += race.stats[stat as keyof typeof race.stats]
  })
  character.value = { ...character.value, race, stats: newStats }
  gameState.value = 'class'
}

const selectClass = (classId: string, subclassId: string) => {
  const cls = CLASSES.find(c => c.id === classId)
  const sub = cls?.subclasses.find(s => s.id === subclassId)
  if (cls && sub) {
    character.value = { ...character.value, class: cls.name, subclass: sub }
    gameState.value = 'character-form'
  }
}

const generateBackstory = () => {
  if (!characterForm.value.name) return
  
  gameState.value = 'generating-backstory'
  character.value = { ...character.value, name: characterForm.value.name }
  
  // Use predefined backstory based on race and subclass
  const raceId = character.value.race?.id || ''
  const subclassId = character.value.subclass?.id || ''
  
  let backstory = `Sei ${characterForm.value.name}, ${character.value.race?.name}. La tua storia è un mistero anche per te. Ma eccoti qui, pronto a giocare il gioco della vita capitalista.`
  
  if (BACKSTORIES[raceId] && BACKSTORIES[raceId][subclassId]) {
    backstory = BACKSTORIES[raceId][subclassId].replace('{name}', characterForm.value.name)
  }
  
  setTimeout(() => {
    character.value = { ...character.value, backstory }
    gameState.value = 'backstory-display'
  }, 1000) // Simulate loading time
}

const selectAnswer = (questionIndex: number, familiarId: string) => {
  quizAnswers.value = { ...quizAnswers.value, [questionIndex]: familiarId }
}

const submitFamiliarQuiz = () => {
  const familiarCounts: Record<string, number> = {}
  Object.values(quizAnswers.value).forEach(famId => {
    familiarCounts[famId] = (familiarCounts[famId] || 0) + 1
  })
  
  const winningFamiliarId = Object.keys(familiarCounts).reduce((a, b) => 
    familiarCounts[a] > familiarCounts[b] ? a : b
  )
  
  const selectedFamiliar = FAMILIARS.find(f => f.id === winningFamiliarId)
  if (selectedFamiliar) {
    character.value = { ...character.value, familiar: selectedFamiliar }
    gameState.value = 'sheet'
  }
}

const startGame = () => {
  gameState.value = 'game'
  activeSideQuests.value = []
  completedSideQuests.value = []
  character.value.jobSearchAttempts = 0
  character.value.negotiationAttempts = 0
  
  const raceId = character.value.race?.id || ''
  const raceName = character.value.race?.name || ''
  const subclassName = character.value.subclass?.name || ''
  
  // Special start for boomer-rentier
  if (raceId === 'boomer-rentier') {
    jobState.value = 'boomer-rentier'
    character.value.properties = 1 // Starts with 1 property
    character.value.salary = 2500 + Math.floor(Math.random() * 1000) // Initial rental income: minimo 2500
    character.value.budget = 5000 // Starting capital
    const introText = `🎮 ${character.value.backstory}\n\n🏠 Eccoti qui. Hai ${character.value.properties} immobile in affitto. Introito mensile: €${character.value.salary}. Budget: €${character.value.budget}.\n\nCome ${raceName} ${subclassName}, gestisci i tuoi affitti. Cosa fai?`
    chatHistory.value = [{
      type: 'ai',
      text: introText,
      effects: null
    }]
    // Trigger initial boomer event
    setTimeout(() => triggerBoomerEvent(), 2000)
  } else if (raceId === 'faccio-cose-vedo-gente') {
    // Special start for faccio-cose-vedo-gente
    jobState.value = 'faccio-cose-vedo-gente'
    character.value.salary = 2000 // Monthly allowance from parents
    character.value.budget = 10000 // Starting money from family
    character.value.passions = [] // Track temporary passions
    const introText = `🎮 ${character.value.backstory}\n\n💰 Eccoti qui. I tuoi genitori ti danno €${character.value.salary}/mese. Budget: €${character.value.budget}.\n\nCome ${raceName} ${subclassName}, devi "capire cosa fare da grande". Ma intanto i soldi arrivano. Cosa fai?`
    chatHistory.value = [{
      type: 'ai',
      text: introText,
      effects: null
    }]
    // Trigger initial rich kid event
    setTimeout(() => triggerRichKidEvent(), 2000)
  } else {
    jobState.value = 'no-job'
    const introText = `🎮 ${character.value.backstory}\n\n💼 Eccoti qui. Budget: €0. Stipendio: €0. Devi iniziare a guadagnare.\n\nCome ${raceName} ${subclassName}, il tuo percorso nel capitalismo inizia ora. Cosa fai?`
    chatHistory.value = [{
      type: 'ai',
      text: introText,
      effects: null
    }]
  }
}

const applyMonthlyCosts = () => {
  if (jobState.value === 'faccio-cose-vedo-gente') {
    // Rich kid receives allowance and has different costs
    const allowance = character.value.salary
    const lifestyle = -800 // Rich lifestyle: caffè, ristoranti, shopping
    const passions = -400 // Monthly passion costs: corsi, workshop
    const total = allowance - lifestyle - passions
    
    character.value.budget += total
    character.value.burnout = Math.min(100, character.value.burnout + 2)
    
    chatHistory.value.push({
      type: 'event',
      text: `💸 FINE MESE - RICCO DI FAMIGLIA\n\n💰 Paghetta genitori: +${allowance}€\n☕ Stile di vita: -${Math.abs(lifestyle)}€\n🎨 Passioni: -${Math.abs(passions)}€\n\nTotale: ${total > 0 ? '+' : ''}${total}€`,
      effects: { budget: total, burnout: 2 }
    })
  } else if (jobState.value === 'boomer-rentier') {
    // Boomer-rentier receives rental income and has different costs
    const rentalIncome = character.value.salary
    const medicine = -200 // Rich people medicine
    const maintenance = -300 // Property maintenance
    const lifestyle = -500 // Rich lifestyle costs
    const total = rentalIncome - medicine - maintenance - lifestyle
    
    character.value.budget += total
    character.value.burnout = Math.min(100, character.value.burnout + 3)
    
    chatHistory.value.push({
      type: 'event',
      text: `💸 FINE MESE - BOOMER RENTIER\n\n💰 Introiti affitti: +${rentalIncome}€\n💊 Medicine private: -${Math.abs(medicine)}€\n🔧 Manutenzioni: -${Math.abs(maintenance)}€\n🍾 Stile di vita: -${Math.abs(lifestyle)}€\n\nTotale: ${total > 0 ? '+' : ''}${total}€`,
      effects: { budget: total, burnout: 3 }
    })
  } else if (character.value.salary > 0 && !character.value.livesWithParents) {
    const affitto = -650
    const bollette = -120
    const spesa = -250
    const trasporti = -80
    const totalCosts = affitto + bollette + spesa + trasporti
    
    character.value.budget += totalCosts
    character.value.burnout = Math.min(100, character.value.burnout + 5)
    
    chatHistory.value.push({
      type: 'event',
      text: `💸 FINE MESE - SPESE FISSE\n\n🏠 Affitto: ${affitto}€\n⚡ Bollette: ${bollette}€\n🛒 Spesa: ${spesa}€\n🚌 Trasporti: ${trasporti}€\n\nTotale: ${totalCosts}€`,
      effects: { budget: totalCosts, burnout: 5 }
    })
  } else if (character.value.salary > 0 && character.value.livesWithParents) {
    // Se vivi con i tuoi, non paghi spese mensili
    chatHistory.value.push({
      type: 'event',
      text: `💸 FINE MESE - VIVI CON I TUOI\n\n🏠 Affitto: €0 (vivi con i tuoi)\n⚡ Bollette: €0\n🛒 Spesa: €0\n🚌 Trasporti: €0\n\nRisparmi €1100/mese!`,
      effects: { budget: 0, burnout: 2 }
    })
  }
}

// Get available side quests - only show when specific critical situations occur
const getAvailableSideQuests = (): SideQuest[] => {
  // Don't show new quests if there are active ones
  if (activeSideQuests.value.length > 0) return []
  
  const burnout = character.value.burnout
  const budget = character.value.budget
  const aura = character.value.aura
  
  // Only show side quests in CRITICAL situations
  let relevantQuests: SideQuest[] = []
  
  // CRITICAL: Very high burnout (>80) - urgent need for help
  if (burnout > 80) {
    relevantQuests = SIDE_QUESTS.filter(quest => 
      !completedSideQuests.value.includes(quest.id) &&
      (quest.id === 'therapy' || quest.id === 'detox')
    )
  }
  // CRITICAL: Very low budget (<-400) - financial crisis
  else if (budget < -400) {
    relevantQuests = SIDE_QUESTS.filter(quest => 
      !completedSideQuests.value.includes(quest.id) &&
      (quest.id === 'volunteer' || quest.id === 'community')
    )
  }
  // CRITICAL: High burnout (>70) - need intervention
  else if (burnout > 70) {
    relevantQuests = SIDE_QUESTS.filter(quest => 
      !completedSideQuests.value.includes(quest.id) &&
      (quest.id === 'therapy' || quest.id === 'hobby' || quest.id === 'say-no')
    )
  }
  // CRITICAL: Very low aura (<5) - existential crisis
  else if (aura < 5) {
    relevantQuests = SIDE_QUESTS.filter(quest => 
      !completedSideQuests.value.includes(quest.id) &&
      (quest.id === 'volunteer' || quest.id === 'creative-project' || quest.id === 'community')
    )
  }
  // CRITICAL: Low budget (<-300) - financial stress
  else if (budget < -300) {
    relevantQuests = SIDE_QUESTS.filter(quest => 
      !completedSideQuests.value.includes(quest.id) &&
      (quest.id === 'volunteer' || quest.id === 'community')
    )
  }
  
  // Return only 1 random quest if any are available
  if (relevantQuests.length > 0) {
    const randomQuest = relevantQuests[Math.floor(Math.random() * relevantQuests.length)]
    return [randomQuest]
  }
  
  return []
}

// Trigger side quest
const startSideQuest = (quest: SideQuest) => {
  activeSideQuests.value.push(quest)
  chatHistory.value.push({
    type: 'event',
    text: `📋 SIDE QUEST: ${quest.title}\n\n${quest.description}\n\n${quest.narrative}`,
    effects: null
  })
}

// Complete side quest
const completeSideQuest = (questId: string) => {
  const quest = activeSideQuests.value.find(q => q.id === questId)
  if (!quest) return
  
  const rewards = quest.rewards
  if (rewards.budget) character.value.budget += rewards.budget
  if (rewards.burnout) character.value.burnout = Math.min(100, Math.max(0, character.value.burnout + rewards.burnout))
  if (rewards.aura) character.value.aura = Math.max(0, character.value.aura + rewards.aura)
  if (rewards.salary) character.value.salary += rewards.salary
  
  activeSideQuests.value = activeSideQuests.value.filter(q => q.id !== questId)
  completedSideQuests.value.push(questId)
  
  chatHistory.value.push({
    type: 'event',
    text: `✅ SIDE QUEST COMPLETATA: ${quest.title}\n\n${quest.completionNarrative}`,
    effects: rewards
  })
  
  // Check if critical situation is resolved - remove side quest from available if conditions changed
  // This will be handled by getAvailableSideQuests automatically
}

// Trigger rich kid specific events
const triggerRichKidEvent = () => {
  // Favorisci eventi con grandi somme (10000€) - 40% probabilità
  let evt
  if (Math.random() < 0.4) {
    // Eventi con grandi somme (10000€)
    const bigMoneyEvents = RICH_KID_EVENTS.filter(e => e.budget && e.budget >= 10000)
    if (bigMoneyEvents.length > 0) {
      evt = bigMoneyEvents[Math.floor(Math.random() * bigMoneyEvents.length)]
    } else {
      evt = RICH_KID_EVENTS[Math.floor(Math.random() * RICH_KID_EVENTS.length)]
    }
  } else {
    evt = RICH_KID_EVENTS[Math.floor(Math.random() * RICH_KID_EVENTS.length)]
  }
  
  if (evt.budget) character.value.budget += evt.budget
  if (evt.burnout) character.value.burnout = Math.min(100, Math.max(0, character.value.burnout + evt.burnout))
  if (evt.aura) character.value.aura = Math.max(0, character.value.aura + evt.aura)
  
  chatHistory.value.push({
    type: 'event',
    text: `💸 EVENTO RICCO!\n\n${evt.narrative || evt.text}`,
    effects: evt
  })
}

// Trigger boomer-rentier specific events
const triggerBoomerEvent = () => {
  // Favorisci eventi positivi (70% probabilità)
  let evt
  if (Math.random() < 0.7) {
    // Eventi positivi (guadagni o spese di lusso)
    const positiveEvents = BOOMER_EVENTS.filter(e => 
      (e.budget && e.budget > 0) || (e.salary && e.salary > 0) || 
      (e.budget && e.budget < 0 && Math.abs(e.budget) > 1000) // Spese di lusso
    )
    if (positiveEvents.length > 0) {
      // Favorisci eventi con grandi somme (10000€) - 35% probabilità tra gli eventi positivi
      if (Math.random() < 0.35) {
        const bigMoneyEvents = positiveEvents.filter(e => e.budget && e.budget >= 10000)
        if (bigMoneyEvents.length > 0) {
          evt = bigMoneyEvents[Math.floor(Math.random() * bigMoneyEvents.length)]
        } else {
          evt = positiveEvents[Math.floor(Math.random() * positiveEvents.length)]
        }
      } else {
        evt = positiveEvents[Math.floor(Math.random() * positiveEvents.length)]
      }
    } else {
      evt = BOOMER_EVENTS[Math.floor(Math.random() * BOOMER_EVENTS.length)]
    }
  } else {
    // Eventi negativi (solo 30% probabilità)
    const negativeEvents = BOOMER_EVENTS.filter(e => 
      e.budget && e.budget < 0 && Math.abs(e.budget) < 1000 // Solo piccole spese
    )
    if (negativeEvents.length > 0) {
      evt = negativeEvents[Math.floor(Math.random() * negativeEvents.length)]
    } else {
      evt = BOOMER_EVENTS[Math.floor(Math.random() * BOOMER_EVENTS.length)]
    }
  }
  if (evt.budget) character.value.budget += evt.budget
  if (evt.burnout) character.value.burnout = Math.min(100, Math.max(0, character.value.burnout + evt.burnout))
  if (evt.aura) character.value.aura = Math.max(0, character.value.aura + evt.aura)
  if (evt.salary) {
    character.value.salary += evt.salary
    if (evt.salary > 0) character.value.properties++
  }
  
  chatHistory.value.push({
    type: 'event',
    text: `🏠 EVENTO IMMOBILIARE!\n\n${evt.narrative || evt.text}`,
    effects: evt
  })
}

// Trigger parameterized events based on character state
const triggerParameterizedEvent = () => {
  const raceId = character.value.race?.id || ''
  const aura = character.value.aura
  const budget = character.value.budget
  const burnout = character.value.burnout
  
  // Events based on aura (high aura = positive events)
  if (aura >= 30 && Math.random() > 0.6) {
    chatHistory.value.push({
      type: 'event',
      text: '✨ La tua aura positiva attira opportunità. Qualcuno ti offre un progetto interessante.',
      effects: { budget: 400, aura: 3 }
    })
    return
  }
  
  if (aura >= 20 && Math.random() > 0.7) {
    chatHistory.value.push({
      type: 'event',
      text: '🌟 La tua energia positiva contagia. Un collega ti propone una collaborazione.',
      effects: { budget: 300, aura: 2 }
    })
    return
  }
  
  // Events based on low budget
  if (budget < -400 && Math.random() > 0.5) {
    chatHistory.value.push({
      type: 'event',
      text: '💸 Sei in difficoltà economica. Un amico ti presta €200. "Te lo restituisco", dici.',
      effects: { budget: 200, burnout: 5 }
    })
    return
  }
  
  if (budget < -300 && Math.random() > 0.6) {
    chatHistory.value.push({
      type: 'event',
      text: '💰 Trovi €50 per strada. "Fortuna!", pensi.',
      effects: { budget: 50, burnout: -2 }
    })
    return
  }
  
  // Events based on high burnout
  if (burnout > 80 && Math.random() > 0.4) {
    chatHistory.value.push({
      type: 'event',
      text: '😰 Il burnout è altissimo. Un collega ti consiglia di prenderti una pausa. "Hai ragione", pensi.',
      effects: { burnout: -20, aura: 5 }
    })
    return
  }
  
  if (burnout > 70 && Math.random() > 0.5) {
    chatHistory.value.push({
      type: 'event',
      text: '😓 Sei esausto. Decidi di prenderti un giorno di riposo. "Ne ho bisogno", pensi.',
      effects: { burnout: -15, aura: 3 }
    })
    return
  }
  
  // Events based on low burnout (positive state)
  if (burnout < 20 && aura >= 10 && Math.random() > 0.7) {
    chatHistory.value.push({
      type: 'event',
      text: '😊 Ti senti in equilibrio. La tua energia positiva attira buone opportunità.',
      effects: { budget: 200, aura: 4 }
    })
    return
  }
  
  // Race-specific events
  if (raceId === 'influencer' && Math.random() > 0.7) {
    chatHistory.value.push({
      type: 'event',
      text: '📱 Un brand ti contatta per una collaborazione. "Interessante", pensi.',
      effects: { budget: 400, burnout: 8 }
    })
    return
  }
  
  if (raceId === 'faccio-cose-vedo-gente' && Math.random() > 0.7) {
    chatHistory.value.push({
      type: 'event',
      text: '💸 I tuoi genitori ti aumentano la paghetta. "Hai bisogno di più soldi per le tue passioni", dicono.',
      effects: { salary: 300, aura: -2 }
    })
    return
  }
  
  if (raceId === 'startup-bro' && Math.random() > 0.7) {
    chatHistory.value.push({
      type: 'event',
      text: '💡 Un investitore si interessa al tuo progetto. "Potrebbe essere la volta buona", pensi.',
      effects: { budget: 500, burnout: 10 }
    })
    return
  }
  
  if (raceId === 'millennial-ansioso' && Math.random() > 0.7) {
    chatHistory.value.push({
      type: 'event',
      text: '😰 L\'ansia sale. Decidi di fare una pausa. "Devo calmarmi", pensi.',
      effects: { burnout: -10, aura: 2 }
    })
    return
  }
  
  if (raceId === 'genz-disilluso' && Math.random() > 0.7) {
    chatHistory.value.push({
      type: 'event',
      text: '🎭 Partecipi a un collettivo. "Finalmente persone che capiscono", pensi.',
      effects: { burnout: -5, aura: 8 }
    })
    return
  }
  
  // Default random event
  const evt = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]
  if (evt.budget) character.value.budget += evt.budget
  if (evt.burnout) character.value.burnout = Math.min(100, Math.max(0, character.value.burnout + evt.burnout))
  
  chatHistory.value.push({
    type: 'event',
    text: `🎲 EVENTO CASUALE!\n\n${evt.text}`,
    effects: evt
  })
}

const triggerRandomEvent = () => {
  if (jobState.value === 'boomer-rentier') {
    triggerBoomerEvent()
  } else if (jobState.value === 'faccio-cose-vedo-gente') {
    triggerRichKidEvent()
  } else {
    triggerParameterizedEvent()
  }
}

// Show card modal and execute action after
const showCardModalAndExecute = (cardResult: { result: 'successo-critico' | 'successo' | 'fallimento-parziale' | 'fallimento-critico', text: string }, callback: () => void) => {
  showCardModal.value = true
  showCardResult.value = false
  cardModalResult.value = null
  pendingAction.value = callback
  
  // Show loading for 1 second, then show result
  setTimeout(() => {
    cardModalResult.value = { result: cardResult.result, text: cardResult.text }
    showCardResult.value = true
    
    // Auto-close modal after 10 seconds and execute action
    setTimeout(() => {
      closeCardModal()
      if (pendingAction.value) {
        pendingAction.value()
        pendingAction.value = null
      }
    }, 10000)
  }, 1000)
}

const closeCardModal = () => {
  showCardModal.value = false
  showCardResult.value = false
  cardModalResult.value = null
}

const handleAction = (action: { text: string, narrative: string, effects: { budget?: number, burnout?: number, salary?: number, aura?: number }, onSelect?: () => void, needsCardCheck?: boolean }) => {
  // Track selected action (except for repeatable actions)
  const repeatableActions = ['Cerco lavoro', 'Lavoro normalmente', 'Cerco un nuovo lavoro', 'Faccio pausa']
  if (!repeatableActions.includes(action.text)) {
    selectedActions.value.add(action.text)
  }
  
  chatHistory.value.push({ type: 'user', text: action.text })
  
  // If action needs card check and has onSelect, we'll handle it in onSelect
  // Otherwise apply effects immediately
  if (!action.needsCardCheck) {
    const eff = action.effects || {}
    if (eff.budget) character.value.budget += eff.budget
    if (eff.burnout) character.value.burnout = Math.min(100, Math.max(0, character.value.burnout + eff.burnout))
    if (eff.salary !== undefined) character.value.salary = eff.salary
    if (eff.aura) character.value.aura = Math.max(0, character.value.aura + eff.aura)
    
    chatHistory.value.push({
      type: 'ai',
      text: action.narrative,
      effects: eff
    })
  }
  
  // Execute callback if present
  if (action.onSelect) {
    action.onSelect()
  }
  
  actionCounter.value++
  
  // Check if side quest conditions are still met - remove if situation changed
  if (activeSideQuests.value.length > 0) {
    activeSideQuests.value = activeSideQuests.value.filter(quest => {
      const burnout = character.value.burnout
      const budget = character.value.budget
      const aura = character.value.aura
      
      // Remove quest if critical situation is resolved
      if (quest.id === 'therapy' || quest.id === 'detox') {
        if (burnout <= 70) {
          chatHistory.value.push({
            type: 'event',
            text: `📋 La side quest "${quest.title}" non è più necessaria. La situazione è migliorata.`,
            effects: null
          })
          return false
        }
      }
      if (quest.id === 'volunteer' || quest.id === 'community') {
        if (budget >= -300 && aura >= 5) {
          chatHistory.value.push({
            type: 'event',
            text: `📋 La side quest "${quest.title}" non è più necessaria. La situazione è migliorata.`,
            effects: null
          })
          return false
        }
      }
      return true
    })
  }
  
  // Trigger events for stable job, boomer-rentier, or rich kid (ogni 4-5 interazioni)
  if ((actionCounter.value % 4 === 0 || actionCounter.value % 5 === 0) && (jobState.value === 'stable-job' || jobState.value === 'boomer-rentier' || jobState.value === 'faccio-cose-vedo-gente')) {
    setTimeout(() => triggerRandomEvent(), 1500)
  }
  
  // Apply monthly costs for stable job, boomer-rentier, or rich kid
  if (actionCounter.value % 4 === 0 && character.value.salary > 0 && (jobState.value === 'stable-job' || jobState.value === 'boomer-rentier' || jobState.value === 'faccio-cose-vedo-gente')) {
    setTimeout(() => applyMonthlyCosts(), 3000)
  }
  
  month.value++
}

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  updateTime()
  const timeInterval = setInterval(updateTime, 1000)
  onUnmounted(() => clearInterval(timeInterval))
})
</script>

<style scoped>
.rpg-container {
  position: relative;
  min-height: 100vh;
  background: #008080;
  overflow: hidden;
}


.window {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #c0c0c0;
  border: 2px outset #c0c0c0;
  box-shadow: 2px 2px 10px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  max-width: 95vw;
  max-height: 95vh;
  z-index: 10;
}

.intro-window {
  width: 800px;
  height: 550px;
}

.race-window, .class-window {
  width: 90%;
  height: 85%;
}

.form-window, .generating-window, .backstory-window {
  width: 500px;
  height: auto;
}

.quiz-window {
  width: 700px;
  height: auto;
  max-height: 85%;
}

.sheet-window {
  width: 800px;
  height: auto;
  max-height: 85%;
}

.game-window {
  width: 98%;
  height: 95%;
}

.title-bar {
  background: linear-gradient(90deg, #000080, #1084d0);
  padding: 3px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-bar-text {
  color: white;
  font-weight: bold;
  font-size: 11px;
}

.title-bar-controls {
  display: flex;
  gap: 2px;
}

.title-bar-controls button {
  width: 16px;
  height: 14px;
  background: #c0c0c0;
  border: 1px outset #c0c0c0;
  font-size: 8px;
  padding: 0;
  cursor: pointer;
}

.title-bar-controls button:active {
  border: 1px inset #c0c0c0;
}

.window-body {
  background: #c0c0c0;
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.intro-body {
  padding: 60px 40px;
  text-align: center;
}

.intro-body h1 {
  font-size: 48px;
  margin-bottom: 20px;
  color: #000080;
}

.intro-body p {
  font-size: 20px;
  margin-bottom: 40px;
  color: #000;
}

.start-game-btn {
  font-size: 18px;
  padding: 15px 40px;
}

.race-instructions {
  text-align: center;
  margin: 15px 0;
  font-style: italic;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

body.theme-night .race-instructions {
  color: #ccc;
}

.races-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.race-card {
  background: #c0c0c0;
  border: 2px outset #c0c0c0;
  padding: 15px;
  cursor: pointer;
  text-align: center;
  transition: all 0.1s;
}

.race-card:hover {
  border: 2px inset #c0c0c0;
}

.race-card:active {
  transform: translateY(2px);
}

.race-avatar {
  font-size: 60px;
  margin-bottom: 10px;
}

.race-card h3 {
  margin-bottom: 10px;
  font-size: 18px;
}

.race-card p {
  font-size: 13px;
  margin-bottom: 10px;
  color: #555;
}

.race-stats {
  font-size: 11px;
  text-align: left;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
}

.stat-name {
  text-transform: capitalize;
}

.stat-value.positive {
  color: green;
  font-weight: bold;
}

.stat-value.negative {
  color: red;
  font-weight: bold;
}

.classes-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.class-section {
  background: #c0c0c0;
  border: 2px groove #c0c0c0;
  padding: 15px;
}

.class-section h3 {
  font-size: 20px;
  margin-bottom: 5px;
}

.class-section > p {
  font-size: 13px;
  margin-bottom: 15px;
  color: #555;
}

.subclasses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.subclass-card {
  background: #c0c0c0;
  border: 2px outset #c0c0c0;
  padding: 15px;
  cursor: pointer;
  text-align: center;
}

.subclass-card:hover {
  border: 2px inset #c0c0c0;
}

.subclass-avatar {
  font-size: 40px;
  margin-bottom: 8px;
}

.subclass-card h4 {
  margin-bottom: 5px;
  font-size: 15px;
}

.subclass-card p {
  font-size: 12px;
  color: #555;
}

.field-row-stacked {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 20px;
}

.field-row-stacked label {
  font-weight: normal;
}

.field-row-stacked input {
  width: 100%;
  padding: 8px;
}

.generate-btn, .continue-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
}

.generating-body {
  padding: 40px;
  text-align: center;
}

.generating-body h2 {
  margin-bottom: 20px;
}

.generating-icon {
  margin: 20px 0;
  font-size: 48px;
}

.backstory-body {
  padding: 30px;
  overflow-y: auto;
}

.backstory-body h2 {
  margin-bottom: 20px;
  font-size: 28px;
  text-align: center;
}

.backstory-text {
  line-height: 1.8;
  font-size: 15px;
  margin-bottom: 30px;
  white-space: pre-wrap;
}

.quiz-questions {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.quiz-question {
  background: #c0c0c0;
  border: 2px groove #c0c0c0;
  padding: 15px;
}

.quiz-question h3 {
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: bold;
}

.quiz-answers {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quiz-answer {
  padding: 10px 15px;
  text-align: left;
  font-size: 13px;
  background-color: #c0c0c0;
  color: black;
  border: 2px outset #c0c0c0;
  cursor: pointer;
}

.quiz-answer.selected {
  background-color: #000080;
  color: white;
  border: 2px inset #c0c0c0;
}

.quiz-complete {
  margin-top: 20px;
  padding: 20px;
  background: #ffffcc;
  border: 2px solid #000;
  text-align: center;
}

.quiz-complete p {
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: bold;
}

.sheet-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.sheet-left, .sheet-right {
  border: 2px solid #000;
  padding: 20px;
}

.character-avatar {
  font-size: 60px;
  text-align: center;
  margin-bottom: 10px;
}

.sheet-left h3 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 15px;
}

.sheet-right h4 {
  margin-bottom: 15px;
  font-size: 18px;
}

.stat-display {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.familiar-box {
  margin-top: 20px;
  padding: 15px;
  background: #ffffcc;
  border: 2px solid #000;
  text-align: center;
}

.familiar-avatar {
  font-size: 30px;
  margin-bottom: 5px;
}

.familiar-box h5 {
  font-size: 14px;
  margin-bottom: 5px;
}

.familiar-box p {
  font-size: 11px;
  color: #555;
}

.game-body {
  display: flex;
  height: calc(100% - 60px);
  padding: 0;
}

.game-sidebar {
  width: 250px;
  border-right: 2px solid #000;
  padding: 15px;
  overflow-y: auto;
  background: #c0c0c0;
}

.character-preview {
  text-align: center;
  margin-bottom: 20px;
}

.preview-avatar {
  font-size: 50px;
  margin-bottom: 10px;
}

.game-stats-box {
  margin-bottom: 15px;
  padding: 10px;
  background: #ffffff;
  border: 2px inset #c0c0c0;
  font-size: 11px;
}

.game-stats-box > div {
  margin-bottom: 5px;
}

.positive {
  color: green;
}

.negative {
  color: red;
}

.burnout-bar {
  background: #000;
  height: 15px;
  margin-top: 5px;
  position: relative;
}

.burnout-fill {
  height: 100%;
}

.burnout-text {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: white;
  line-height: 15px;
}

.aura-bar {
  background: #000;
  height: 15px;
  margin-top: 5px;
  position: relative;
}

.aura-fill {
  height: 100%;
}

.aura-text {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: white;
  line-height: 15px;
}

.familiar-preview {
  padding: 10px;
  background: #ffffcc;
  border: 2px solid #000;
  text-align: center;
}

.game-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #c0c0c0;
}

.chat-message {
  margin-bottom: 15px;
  display: flex;
  max-width: 70%;
}

.chat-message.user {
  justify-content: flex-end;
  margin-left: auto;
}

.chat-message.ai, .chat-message.event {
  justify-content: flex-start;
}

.message-text {
  padding: 12px 15px;
  border: 2px solid #000;
  box-shadow: 2px 2px 0 #000;
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.6;
}

.chat-message.user .message-text {
  background: #000080;
  color: white;
}

.chat-message.ai .message-text {
  background: #ffffff;
  color: black;
}

.chat-message.event .message-text {
  background: #ffcc00;
  color: black;
}

.chat-message.loading .message-text {
  background: #c0c0c0;
  color: black;
}

.message-effects {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #000;
  font-size: 12px;
}

.chat-input-area {
  border-top: 2px solid #000;
  padding: 15px;
  background: #c0c0c0;
  display: flex;
  flex-direction: column;
  max-height: 40vh;
  overflow-y: auto;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.action-btn {
  width: 100%;
  padding: 8px 10px;
  text-align: left;
  font-size: 12px;
  background: #c0c0c0;
  border: 2px outset #c0c0c0;
  cursor: pointer;
}

.action-btn:hover {
  background: #d4d0c8;
}

.action-btn:active {
  border: 2px inset #c0c0c0;
}

.action-btn.side-quest-action {
  background: #ffffcc;
  font-size: 11px;
}

.action-btn.side-quest-action:hover {
  background: #ffff99;
}

.game-won-screen {
  border-top: 2px solid #000;
  padding: 20px;
  background: #00ff00;
  text-align: center;
}

.game-won-screen h3 {
  color: #000;
  margin-bottom: 10px;
  font-size: 24px;
}

.game-won-screen p {
  color: #000;
  margin-bottom: 15px;
}

.side-quests-section, .active-side-quests-section {
  margin-top: 10px;
  padding: 5px;
  background: #ffffff;
  border: 2px inset #c0c0c0;
  max-height: 120px;
  overflow-y: auto;
}

.side-quests-title {
  font-size: 9px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #000080;
}

.side-quests-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.side-quest-btn {
  padding: 4px 6px;
  text-align: left;
  font-size: 9px;
  background: #c0c0c0;
  border: 2px outset #c0c0c0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.side-quest-btn:hover {
  background: #d4d0c8;
}

.side-quest-btn:active {
  border: 2px inset #c0c0c0;
}

.side-quest-btn strong {
  color: #000080;
  font-size: 9px;
}

.quest-desc {
  font-size: 8px;
  color: #555;
  line-height: 1.2;
}

.active-quest-item {
  padding: 4px 6px;
  background: #ffffcc;
  border: 2px solid #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 9px;
}

.complete-quest-btn {
  padding: 2px 6px;
  font-size: 8px;
  background: #00ff00;
  border: 2px outset #c0c0c0;
  cursor: pointer;
}

.complete-quest-btn:hover {
  background: #00cc00;
}

.complete-quest-btn:active {
  border: 2px inset #c0c0c0;
}


.game-finished-screen {
  border-top: 2px solid #000;
  padding: 20px;
  background: #ffd700;
  text-align: center;
}

.game-finished-screen h3 {
  color: #000;
  margin-bottom: 10px;
  font-size: 24px;
}

.game-finished-screen p {
  color: #000;
  margin-bottom: 15px;
}

.game-finished-screen strong {
  font-size: 18px;
  color: #8b4513;
}

.game-over-screen {
  border-top: 2px solid #000;
  padding: 20px;
  background: #ff0000;
  text-align: center;
}

.game-over-screen h3 {
  color: white;
  margin-bottom: 10px;
  font-size: 24px;
}

.game-over-screen p {
  color: white;
  margin-bottom: 15px;
}

.restart-btn {
  padding: 12px 30px;
  font-size: 16px;
}

.status-bar {
  background: #c0c0c0;
  border-top: 1px solid #808080;
  padding: 2px;
  display: flex;
  gap: 2px;
}

.status-bar-field {
  padding: 2px 8px;
  border: 1px inset #c0c0c0;
  font-size: 11px;
}

.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 28px;
  background: #c0c0c0;
  border-top: 2px solid white;
  display: flex;
  align-items: center;
  padding: 2px;
  z-index: 1000;
}

.start-btn {
  background: #c0c0c0;
  border: 2px outset #c0c0c0;
  padding: 2px 8px;
  font-weight: bold;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  min-width: 54px;
}

.start-icon {
  margin-right: 5px;
}

.start-btn:active {
  border: 2px inset #c0c0c0;
}

.taskbar-tasks {
  flex: 1;
  display: flex;
  gap: 2px;
  margin-left: 5px;
}

.taskbar-task {
  background: #c0c0c0;
  border: 2px outset #c0c0c0;
  padding: 2px 8px;
  font-size: 11px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.taskbar-task.active {
  border: 2px inset #c0c0c0;
}

.taskbar-clock {
  background: #c0c0c0;
  border: 1px inset #c0c0c0;
  padding: 2px 8px;
  font-size: 11px;
}

button {
  background: #c0c0c0;
  border: 2px outset #c0c0c0;
  padding: 5px 12px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  cursor: pointer;
}

button:active:not(:disabled) {
  border: 2px inset #c0c0c0;
}

button:disabled {
  color: #808080;
  cursor: not-allowed;
}

input[type="text"] {
  background: white;
  border: 2px inset #c0c0c0;
  padding: 4px;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  outline: none;
}

input[type="text"]:focus {
  outline: 1px dotted #000080;
}

/* Day theme */
body.theme-day .rpg-container {
  background: #c0c0c0;
}

body.theme-day .window {
  background: #f4f0e5;
  border-color: #1a1a1a;
}

body.theme-day .title-bar {
  background: linear-gradient(90deg, #1a1a1a, #333);
}

body.theme-day .window-body {
  background: #f4f0e5;
}

body.theme-day .chat-messages {
  background: #f4f0e5;
}

body.theme-day .game-stats-box {
  background: #ffffff;
  border-color: #1a1a1a;
}

body.theme-day .taskbar {
  background: #f4f0e5;
  border-top-color: #1a1a1a;
}


body.theme-night .title-bar-text {
  color: #000000;
}

body.theme-night .burnout-text {
  color: #000000;
}

body.theme-night .aura-text {
  color: #000000;
}

/* Keep user messages white in night theme (like light theme) */
body.theme-night .chat-message.user .message-text {
  color: #ffffff;
}

body.theme-night .game-over-screen h3 {
  color: #000000;
}

body.theme-night .game-over-screen p {
  color: #000000;
}

body.theme-night .quiz-btn.selected {
  color: #000000;
}

/* Night theme - window body text colors */
body.theme-night .window-body {
  color: #000000;
}

body.theme-night .window-body h1,
body.theme-night .window-body h2,
body.theme-night .window-body h3 {
  color: #000000;
}

body.theme-night .window-body p {
  color: #000000;
}

body.theme-night .backstory-text {
  color: #000000;
}

body.theme-night .class-body h2,
body.theme-night .class-body p,
body.theme-night .form-body h2,
body.theme-night .backstory-body h2 {
  color: #000000;
}

/* Card Modal Styles */
.card-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.card-modal {
  background: #c0c0c0;
  border: 3px outset #c0c0c0;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
  min-width: 400px;
  max-width: 500px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.card-modal-header {
  background: #000080;
  color: white;
  padding: 8px 12px;
  border-bottom: 2px solid #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-modal-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  color: white;
}

.card-modal-body {
  padding: 20px;
  background: #c0c0c0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.card-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.card-result-icon {
  font-size: 48px;
  animation: bounce 0.5s ease-in-out;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.card-result-text {
  font-size: 14px;
  color: #000;
  text-align: center;
  line-height: 1.6;
  font-weight: bold;
  padding: 10px;
  background: #fff;
  border: 2px inset #c0c0c0;
  width: 100%;
}

.card-modal-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #c0c0c0;
  border-top: 4px solid #000080;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.card-modal-loading p {
  font-size: 12px;
  color: #000;
  margin: 0;
}

body.theme-night .card-modal {
  background: #2d2d2d;
  border-color: #555;
}

body.theme-night .card-modal-header {
  background: #1a1a1a;
  border-color: #000;
}

body.theme-night .card-modal-body {
  background: #2d2d2d;
}

body.theme-night .card-result-text {
  background: #1a1a1a;
  color: #fff;
  border-color: #555;
}

body.theme-night .card-modal-loading p {
  color: #fff;
}

body.theme-night .loading-spinner {
  border-color: #555;
  border-top-color: #fff;
}
</style>



