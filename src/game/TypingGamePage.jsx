import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { TYPING_WORDS } from './typingWords.js'
import {
  GAME_STATUS,
  createInitialState,
  createTarget,
  gameReducer,
  getGameStats,
} from './gameState.js'
import { loadBestRecord, saveBestRecord } from './bestRecord.js'
import { RetroAudioEngine } from './retroAudio.js'
import './typing-game.css'

function targetText(target, input) {
  if (!target) return { matched: '', remaining: '—' }
  return {
    matched: target.text.slice(0, input.length),
    remaining: target.text.slice(input.length),
  }
}

function formatElapsed(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000)
  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
}

function finishGame(finalState, best, setBest, audio) {
  const finalStats = getGameStats(finalState)
  audio.gameOver()
  const record = {
    score: finalState.score,
    wave: finalState.wave,
    accuracy: finalStats.accuracy,
    wpm: finalStats.wpm,
    savedAt: Date.now(),
  }
  if ((!best || record.score > best.score) && saveBestRecord(record)) setBest(record)
}

export default function TypingGamePage() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState)
  const stateRef = useRef(state)
  const [best, setBest] = useState(loadBestRecord)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const inputRef = useRef(null)
  const audioRef = useRef(new RetroAudioEngine())
  const sequenceRef = useRef(0)
  const previousIndexRef = useRef(-1)
  const previousSnapshotRef = useRef({ status: state.status, lives: state.lives, wave: state.wave, completed: 0 })

  const stats = useMemo(() => getGameStats(state), [state])
  const text = targetText(state.target, state.input)
  const isPlaying = state.status === GAME_STATUS.PLAYING
  const isPaused = state.status === GAME_STATUS.PAUSED
  const isIdle = state.status === GAME_STATUS.IDLE
  const isGameOver = state.status === GAME_STATUS.GAME_OVER

  const nextTarget = (wave = state.wave) => {
    let index = Math.floor(Math.random() * TYPING_WORDS.length)
    if (index === previousIndexRef.current) index = (index + 1) % TYPING_WORDS.length
    previousIndexRef.current = index
    sequenceRef.current += 1
    return createTarget(TYPING_WORDS[index], sequenceRef.current, sequenceRef.current % 3, wave)
  }

  const focusInput = () => requestAnimationFrame(() => inputRef.current?.focus())

  const startGame = () => {
    audioRef.current.setEnabled(soundEnabled)
    dispatch({ type: 'START', target: nextTarget(1) })
    focusInput()
  }
  const resumeGame = () => {
    dispatch({ type: 'RESUME' })
    focusInput()
  }

  const toggleSound = () => {
    const enabled = !soundEnabled
    setSoundEnabled(enabled)
    audioRef.current.setEnabled(enabled)
    if (enabled) audioRef.current.correct()
  }

  const onInput = (event) => {
    const value = event.target.value
    const normalizedValue = value.toLocaleLowerCase('id-ID')
    const normalizedTarget = state.target?.text.toLocaleLowerCase('id-ID') ?? ''
    const isComplete = normalizedValue === normalizedTarget
    const waveAfterCompletion = isComplete && state.completedInWave === 4 ? state.wave + 1 : state.wave
    const action = { type: 'TYPE', value, nextTarget: isComplete ? nextTarget(waveAfterCompletion) : undefined }
    if (!normalizedTarget.startsWith(normalizedValue) && state.lives === 1) {
      finishGame(gameReducer(state, action), best, setBest, audioRef.current)
    }
    dispatch(action)
  }


  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    if (!isPlaying) return undefined
    let previous = performance.now()
    const interval = window.setInterval(() => {
      const now = performance.now()
      const deltaMs = now - previous
      previous = now
      const snapshot = stateRef.current
      const expires = snapshot.target && snapshot.target.timeoutMs <= deltaMs
      const action = {
        type: 'TICK',
        deltaMs,
        nextTarget: expires ? nextTarget(snapshot.wave) : undefined,
      }
      if (expires && snapshot.lives === 1) {
        finishGame(gameReducer(snapshot, action), best, setBest, audioRef.current)
      }
      dispatch(action)
    }, 200)
    return () => window.clearInterval(interval)
  }, [best, isPlaying])

  useEffect(() => {
    const previous = previousSnapshotRef.current
    if (state.lives < previous.lives) audioRef.current.wrong()
    if (state.wave > previous.wave) audioRef.current.waveUp()
    else if (state.completedTargets > previous.completed) audioRef.current.correct()
    if (state.status === GAME_STATUS.GAME_OVER && previous.status !== GAME_STATUS.GAME_OVER) {
      inputRef.current?.blur()
    }
    previousSnapshotRef.current = {
      status: state.status,
      lives: state.lives,
      wave: state.wave,
      completed: state.completedTargets,
    }
  }, [state.completedTargets, state.lives, state.status, state.wave])

  return (
    <main className="typing-game-wrapper">
      <div className="typing-game-shell">
        <header className="typing-game-topbar">
          <a href="#/" className="typing-game-btn">◄ QUIT GAME</a>
          <button type="button" className="typing-game-btn" onClick={toggleSound} aria-pressed={soundEnabled}>
            SFX: {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </header>

        <h1 className="typing-game-title">Typing Survival</h1>
        <p className="typing-game-subtitle">Ketik target. Jaga 3 nyawa. Bertahan selama mungkin.</p>

        <section className="typing-game-console" aria-labelledby="game-heading">
          <h2 id="game-heading" className="typing-game-target-label">ARCADE CONSOLE // MIXED ID–EN</h2>
          <div className="typing-game-screen">
            <div className="typing-game-hud" aria-live="polite">
              <div className="typing-game-stat"><span className="typing-game-stat-label">SCORE</span><span className="typing-game-stat-value">{state.score}</span></div>
              <div className="typing-game-stat"><span className="typing-game-stat-label">LIVES</span><span className="typing-game-stat-value typing-game-lives">{state.lives} ♥</span></div>
              <div className="typing-game-stat"><span className="typing-game-stat-label">WAVE</span><span className="typing-game-stat-value">{state.wave}</span></div>
              <div className="typing-game-stat"><span className="typing-game-stat-label">COMBO</span><span className="typing-game-stat-value">×{state.combo}</span></div>
              <div className="typing-game-stat"><span className="typing-game-stat-label">BEST</span><span className="typing-game-stat-value">{best?.score ?? '—'}</span></div>
            </div>

            <p className="typing-game-status" role="status" aria-live="polite">{state.feedback}</p>

            {isGameOver ? (
              <div className="typing-game-overlay">
                <h2>Game Over</h2>
                <dl>
                  <dt>Final score</dt><dd>{state.score}</dd>
                  <dt>Wave</dt><dd>{state.wave}</dd>
                  <dt>Accuracy</dt><dd>{stats.accuracy}%</dd>
                  <dt>WPM</dt><dd>{stats.wpm}</dd>
                </dl>
                {best && <p className="typing-game-best">BEST tersimpan: {best.score} pts · wave {best.wave} · {best.accuracy}% · {best.wpm} WPM</p>}
                <button type="button" className="typing-game-btn typing-game-btn-primary" onClick={startGame}>Play Again</button>
              </div>
            ) : (
              <div className="typing-game-target-area" onClick={focusInput}>
                <span className="typing-game-target-label typing-game-target-header">
                  <span>ACTIVE TARGET // LANE {state.target ? state.target.lane + 1 : '—'}</span>
                  <span>TIME {Math.ceil((state.target?.timeoutMs ?? 0) / 1000)}s // CLEAR {state.completedInWave}/5</span>
                </span>
                <div className="typing-game-target" aria-label={state.target ? `Target: ${state.target.text}` : 'Belum ada target'}>
                  <span className="typing-game-target-match">{text.matched}</span><span className="typing-game-target-rest">{text.remaining}</span>
                </div>
                <div className="typing-game-progress" aria-label={`Waktu target ${Math.ceil((state.target?.timeoutMs ?? 0) / 1000)} detik`}>
                  <div className="typing-game-progress-bar" style={{ width: `${state.target?.progress ?? 0}%` }} />
                </div>
              </div>
            )}

            <div className="typing-game-input-wrap">
              <label htmlFor="typing-game-input" className="typing-game-target-label">Ketik target</label>
              <input
                ref={inputRef}
                id="typing-game-input"
                className="typing-game-input"
                aria-label="Ketik target"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck="false"
                disabled={!isPlaying}
                value={state.input}
                onChange={onInput}
                placeholder={isPlaying ? 'Ketik di sini…' : 'Start atau Resume untuk mengetik'}
              />
            </div>

            <div className="typing-game-controls">
              {isIdle && <button type="button" className="typing-game-btn typing-game-btn-primary" onClick={startGame}>Start</button>}
              {isPlaying && <button type="button" className="typing-game-btn" onClick={() => dispatch({ type: 'PAUSE' })}>Pause</button>}
              {isPaused && <button type="button" className="typing-game-btn typing-game-btn-primary" onClick={resumeGame}>Resume</button>}
              {!isIdle && <button type="button" className="typing-game-btn typing-game-btn-danger" onClick={() => dispatch({ type: 'RESET' })}>Reset</button>}
            </div>

            <div className="typing-game-meta">
              <span>STATE: {state.status.toUpperCase()}</span>
              <span>TIME: {formatElapsed(state.elapsedMs)}</span>
              <span>ACC: {stats.accuracy}% · WPM: {stats.wpm}</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
