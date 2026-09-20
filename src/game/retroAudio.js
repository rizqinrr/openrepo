export class RetroAudioEngine {
  constructor() {
    this.context = null
    this.enabled = false
  }

  setEnabled(enabled) {
    this.enabled = enabled
    if (enabled) this.ensureContext()
  }

  ensureContext() {
    if (this.context || typeof window === 'undefined') return this.context
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      this.context = AudioContextClass ? new AudioContextClass() : null
    } catch {
      this.context = null
    }
    return this.context
  }

  tone(frequency, duration = 0.08, endFrequency = frequency) {
    if (!this.enabled) return
    const context = this.ensureContext()
    if (!context) return

    try {
      if (context.state === 'suspended') context.resume().catch(() => {})
      const now = context.currentTime
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(frequency, now)
      oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration)
      gain.gain.setValueAtTime(0.07, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration)
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start(now)
      oscillator.stop(now + duration)
    } catch {
      // Audio is optional; blocked or unavailable contexts never stop the game.
    }
  }

  correct() {
    this.tone(660, 0.08, 880)
  }

  wrong() {
    this.tone(180, 0.16, 90)
  }

  waveUp() {
    this.tone(520, 0.22, 1040)
  }

  gameOver() {
    this.tone(240, 0.45, 60)
  }
}
