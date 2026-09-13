// Web Audio API Synthesizer for Life RPG Mini-Games
// Generates responsive, high-quality 8-bit & synth fantasy audio without external files

let audioCtx = null

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

// 1. Sword / Rune Slash Sound
export function playSlashSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // White noise swoosh
    const bufferSize = ctx.sampleRate * 0.12
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2))
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1800, now)
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.12)
    filter.Q.value = 3

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    noise.start(now)
  } catch {
    // Audio context error fallback
  }
}

// 2. Crystal Rune Tone (for memory tiles)
const RUNE_PITCHES = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25, 587.33]
export function playRuneTone(index = 0) {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const freq = RUNE_PITCHES[index % RUNE_PITCHES.length]

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now)

    // Bell envelope
    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.35)
  } catch {
    // Audio fallback
  }
}

// 3. Star Catch Ping
export function playCatchSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(587.33, now) // D5
    osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.08) // A5

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.15)
  } catch {
    // Audio fallback
  }
}

// 4. Typing Key Click / Blip
export function playTypeSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(420 + Math.random() * 80, now)

    gain.gain.setValueAtTime(0.05, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.04)
  } catch {
    // Audio fallback
  }
}

// 5. Impact / Target Hit
export function playHitSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.1)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.12)
  } catch {
    // Audio fallback
  }
}

// 6. Miss / Damage Buzz
export function playMissSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.linearRampToValueAtTime(90, now + 0.2)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.2)
  } catch {
    // Audio fallback
  }
}

// 7. Victory Fanfare (Heroic Chord Progression)
export function playVictoryFanfare() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Notes: C5, E5, G5, C6 triumph
    const notes = [
      { freq: 523.25, delay: 0, dur: 0.15 },
      { freq: 659.25, delay: 0.14, dur: 0.15 },
      { freq: 783.99, delay: 0.28, dur: 0.2 },
      { freq: 1046.5, delay: 0.45, dur: 0.6 },
    ]

    notes.forEach(({ freq, delay, dur }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + delay)

      gain.gain.setValueAtTime(0.25, now + delay)
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + delay)
      osc.stop(now + delay + dur)
    })
  } catch {
    // Audio fallback
  }
}

// 8. Defeat Sound
export function playDefeatSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    const notes = [
      { freq: 392.0, delay: 0, dur: 0.2 },
      { freq: 349.23, delay: 0.18, dur: 0.2 },
      { freq: 329.63, delay: 0.36, dur: 0.2 },
      { freq: 261.63, delay: 0.54, dur: 0.5 },
    ]

    notes.forEach(({ freq, delay, dur }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, now + delay)

      gain.gain.setValueAtTime(0.15, now + delay)
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + delay)
      osc.stop(now + delay + dur)
    })
  } catch {
    // Audio fallback
  }
}
