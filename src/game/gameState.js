export const GAME_STATUS = {
  IDLE: 'idle',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game-over',
}

export const TARGETS_PER_WAVE = 5
export const STARTING_LIVES = 3
const BASE_TIMEOUT_MS = 10000
const TIMEOUT_STEP_MS = 750
const MIN_TIMEOUT_MS = 3500

export function normalizeText(value) {
  return value.toLocaleLowerCase('id-ID')
}

export function timeoutForWave(wave) {
  return Math.max(MIN_TIMEOUT_MS, BASE_TIMEOUT_MS - (wave - 1) * TIMEOUT_STEP_MS)
}

export function createTarget(text, id, lane = 0, wave = 1) {
  return {
    id,
    text,
    progress: 100,
    lane,
    timeoutMs: timeoutForWave(wave),
  }
}

export function createInitialState() {
  return {
    status: GAME_STATUS.IDLE,
    lives: STARTING_LIVES,
    score: 0,
    wave: 1,
    combo: 0,
    input: '',
    target: null,
    completedInWave: 0,
    completedTargets: 0,
    completedCharacters: 0,
    typedCharacters: 0,
    correctCharacters: 0,
    mistakes: 0,
    elapsedMs: 0,
    feedback: 'Siap bermain',
  }
}

function loseLife(state, nextTarget, feedback) {
  const lives = state.lives - 1
  if (lives <= 0) {
    return {
      ...state,
      status: GAME_STATUS.GAME_OVER,
      lives: 0,
      combo: 0,
      input: '',
      target: null,
      feedback: 'Game over',
    }
  }

  return {
    ...state,
    lives,
    combo: 0,
    input: '',
    target: nextTarget,
    feedback,
  }
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'START':
      return {
        ...createInitialState(),
        status: GAME_STATUS.PLAYING,
        target: action.target,
        feedback: `Target baru: ${action.target.text}`,
      }
    case 'PAUSE':
      return state.status === GAME_STATUS.PLAYING
        ? { ...state, status: GAME_STATUS.PAUSED, feedback: 'Game dijeda' }
        : state
    case 'RESUME':
      return state.status === GAME_STATUS.PAUSED
        ? { ...state, status: GAME_STATUS.PLAYING, feedback: 'Game dilanjutkan' }
        : state
    case 'RESET':
      return createInitialState()
    case 'TYPE': {
      if (state.status !== GAME_STATUS.PLAYING || !state.target) return state
      const candidate = normalizeText(action.value)
      const target = normalizeText(state.target.text)
      const addedCharacters = Math.max(0, candidate.length - state.input.length)
      const typedCharacters = state.typedCharacters + addedCharacters

      if (!target.startsWith(candidate)) {
        return loseLife(
          {
            ...state,
            typedCharacters,
            mistakes: state.mistakes + 1,
          },
          state.target,
          'Karakter salah — 1 nyawa hilang',
        )
      }

      const correctCharacters = state.correctCharacters + addedCharacters
      if (candidate !== target) {
        return {
          ...state,
          input: candidate,
          typedCharacters,
          correctCharacters,
          feedback: `${candidate.length} dari ${target.length} karakter benar`,
        }
      }

      const completedInWave = state.completedInWave + 1
      const waveUp = completedInWave === TARGETS_PER_WAVE
      const wave = waveUp ? state.wave + 1 : state.wave
      return {
        ...state,
        score: state.score + 10 * state.wave + state.combo,
        wave,
        combo: state.combo + 1,
        input: '',
        target: action.nextTarget,
        completedInWave: waveUp ? 0 : completedInWave,
        completedTargets: state.completedTargets + 1,
        completedCharacters:
          state.completedCharacters + target.replace(/\s/g, '').length,
        typedCharacters,
        correctCharacters,
        feedback: waveUp ? `Wave ${wave} dimulai` : 'Target selesai',
      }
    }
    case 'TICK': {
      if (state.status !== GAME_STATUS.PLAYING || !state.target) return state
      const elapsedMs = state.elapsedMs + action.deltaMs
      const remainingMs = state.target.timeoutMs - action.deltaMs
      if (remainingMs <= 0) {
        return loseLife(
          { ...state, elapsedMs },
          action.nextTarget,
          'Waktu habis — 1 nyawa hilang',
        )
      }
      return {
        ...state,
        elapsedMs,
        target: {
          ...state.target,
          timeoutMs: remainingMs,
          progress: (remainingMs / timeoutForWave(state.wave)) * 100,
        },
      }
    }
    default:
      return state
  }
}

export function getGameStats(state) {
  const accuracy = Math.round(
    (state.correctCharacters / Math.max(state.typedCharacters, 1)) * 100,
  )
  const activeMinutes = state.elapsedMs / 60000
  const wpm = activeMinutes
    ? Math.round(state.completedCharacters / 5 / activeMinutes)
    : 0
  return { accuracy, wpm }
}
