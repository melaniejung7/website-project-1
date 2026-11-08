/**
 * Cheerful Music Engine for PawPath Adoption Hub
 * Built entirely with Web Audio API - 100% self-contained, no external MP3 dependencies!
 */

class CheerfulAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.currentTrackIndex = 0;
    this.masterGain = null;
    this.volume = 0.6;
    this.isMuted = false;
    this.schedulerTimer = null;
    this.currentStep = 0;
    this.nextNoteTime = 0.0;
    this.tempo = 112; // BPM
    this.secondsPerStep = 60.0 / this.tempo / 4; // 16th note subdivision
    this.lookahead = 25.0; // ms
    this.scheduleAheadTime = 0.1; // seconds

    // Tracks definitions (cheerful chord progressions and melodies in C Major / G Major)
    this.tracks = [
      {
        title: "Sunny Paws Ukulele",
        mood: "Upbeat & Joyful",
        tempo: 114,
        scale: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "G5"],
        // 4 bars of 16 steps (64 steps total)
        chords: [
          ["C4", "E4", "G4", "C5"], // C
          ["G3", "B3", "D4", "G4"], // G
          ["A3", "C4", "E4", "A4"], // Am
          ["F3", "A3", "C4", "F4"]  // F
        ],
        melody: [
          // Bar 1 (C)
          { step: 0, note: "G4", len: 0.3 },
          { step: 2, note: "E4", len: 0.2 },
          { step: 4, note: "G4", len: 0.3 },
          { step: 6, note: "C5", len: 0.4 },
          { step: 10, note: "B4", len: 0.2 },
          { step: 12, note: "A4", len: 0.3 },
          { step: 14, note: "G4", len: 0.3 },
          // Bar 2 (G)
          { step: 16, note: "D4", len: 0.3 },
          { step: 18, note: "F4", len: 0.2 },
          { step: 20, note: "G4", len: 0.3 },
          { step: 22, note: "B4", len: 0.4 },
          { step: 26, note: "A4", len: 0.2 },
          { step: 28, note: "G4", len: 0.3 },
          { step: 30, note: "F4", len: 0.2 },
          // Bar 3 (Am)
          { step: 32, note: "E4", len: 0.3 },
          { step: 34, note: "A4", len: 0.3 },
          { step: 36, note: "C5", len: 0.4 },
          { step: 40, note: "E5", len: 0.4 },
          { step: 44, note: "D5", len: 0.3 },
          { step: 46, note: "C5", len: 0.3 },
          // Bar 4 (F)
          { step: 48, note: "A4", len: 0.4 },
          { step: 52, note: "C5", len: 0.4 },
          { step: 56, note: "G4", len: 0.4 },
          { step: 60, note: "C4", len: 0.4 }
        ],
        bass: [
          { step: 0, note: "C3" }, { step: 8, note: "G2" },
          { step: 16, note: "G2" }, { step: 24, note: "D3" },
          { step: 32, note: "A2" }, { step: 40, note: "E2" },
          { step: 48, note: "F2" }, { step: 56, note: "C3" }
        ]
      },
      {
        title: "Wagging Tails Marimba",
        mood: "Bouncy & Carefree",
        tempo: 120,
        chords: [
          ["F3", "A3", "C4", "E4"], // Fmaj7
          ["G3", "B3", "D4", "G4"], // G
          ["E3", "G3", "B3", "E4"], // Em
          ["A3", "C4", "E4", "A4"]  // Am
        ],
        melody: [
          // Bar 1
          { step: 0, note: "C5", len: 0.25 },
          { step: 3, note: "A4", len: 0.25 },
          { step: 6, note: "C5", len: 0.25 },
          { step: 8, note: "E5", len: 0.3 },
          { step: 12, note: "D5", len: 0.3 },
          // Bar 2
          { step: 16, note: "B4", len: 0.25 },
          { step: 19, note: "G4", len: 0.25 },
          { step: 22, note: "B4", len: 0.25 },
          { step: 24, note: "D5", len: 0.3 },
          { step: 28, note: "C5", len: 0.3 },
          // Bar 3
          { step: 32, note: "G4", len: 0.25 },
          { step: 35, note: "E4", len: 0.25 },
          { step: 38, note: "G4", len: 0.25 },
          { step: 40, note: "B4", len: 0.3 },
          { step: 44, note: "A4", len: 0.3 },
          // Bar 4
          { step: 48, note: "A4", len: 0.2 },
          { step: 51, note: "C5", len: 0.2 },
          { step: 54, note: "E5", len: 0.25 },
          { step: 58, note: "G5", len: 0.35 },
          { step: 62, note: "E5", len: 0.3 }
        ],
        bass: [
          { step: 0, note: "F2" }, { step: 8, note: "C3" },
          { step: 16, note: "G2" }, { step: 24, note: "D3" },
          { step: 32, note: "E2" }, { step: 40, note: "B2" },
          { step: 48, note: "A2" }, { step: 56, note: "E3" }
        ]
      },
      {
        title: "Happy Home Bossa",
        mood: "Warm & Cozy",
        tempo: 104,
        chords: [
          ["C4", "E4", "G4", "B4"], // Cmaj7
          ["D4", "F4", "A4", "C5"], // Dm7
          ["G3", "B3", "D4", "F4"], // G7
          ["C4", "E4", "G4", "A4"]  // C6
        ],
        melody: [
          { step: 0, note: "E4", len: 0.3 },
          { step: 4, note: "G4", len: 0.3 },
          { step: 8, note: "B4", len: 0.4 },
          { step: 14, note: "A4", len: 0.3 },
          { step: 16, note: "F4", len: 0.3 },
          { step: 20, note: "A4", len: 0.3 },
          { step: 24, note: "C5", len: 0.4 },
          { step: 30, note: "B4", len: 0.3 },
          { step: 32, note: "D5", len: 0.3 },
          { step: 36, note: "B4", len: 0.3 },
          { step: 40, note: "G4", len: 0.4 },
          { step: 46, note: "F4", len: 0.3 },
          { step: 48, note: "E4", len: 0.4 },
          { step: 52, note: "G4", len: 0.4 },
          { step: 56, note: "C5", len: 0.5 }
        ],
        bass: [
          { step: 0, note: "C3" }, { step: 6, note: "G2" }, { step: 10, note: "C3" },
          { step: 16, note: "D3" }, { step: 22, note: "A2" }, { step: 26, note: "D3" },
          { step: 32, note: "G2" }, { step: 38, note: "D3" }, { step: 42, note: "G2" },
          { step: 48, note: "C3" }, { step: 54, note: "G2" }, { step: 58, note: "C3" }
        ]
      }
    ];

    // Note frequencies table
    this.noteFrequencies = {
      "C2": 65.41, "D2": 73.42, "E2": 82.41, "F2": 87.31, "G2": 98.00, "A2": 110.00, "B2": 123.47,
      "C3": 130.81, "D3": 146.83, "E3": 164.81, "F3": 174.61, "G3": 196.00, "A3": 220.00, "B3": 246.94,
      "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.00, "A4": 440.00, "B4": 493.88,
      "C5": 523.25, "D5": 587.33, "E5": 659.25, "F5": 698.46, "G5": 783.99, "A5": 880.00, "B5": 987.77,
      "C6": 1046.50
    };

    // Observers for UI sync
    this.onStateChange = null;
    this.onTrackChange = null;
    this.onBeat = null;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();

      // Master output
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);

      // Gentle compressor to keep tone smooth, bright and balanced
      const compressor = this.audioCtx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-18, this.audioCtx.currentTime);
      compressor.knee.setValueAtTime(12, this.audioCtx.currentTime);
      compressor.ratio.setValueAtTime(4, this.audioCtx.currentTime);
      compressor.attack.setValueAtTime(0.01, this.audioCtx.currentTime);
      compressor.release.setValueAtTime(0.2, this.audioCtx.currentTime);

      this.masterGain.connect(compressor);
      compressor.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  getCurrentTrack() {
    return this.tracks[this.currentTrackIndex];
  }

  play() {
    this.initContext();
    if (this.isPlaying) return;

    this.isPlaying = true;
    const track = this.getCurrentTrack();
    this.tempo = track.tempo;
    this.secondsPerStep = 60.0 / this.tempo / 4;
    this.nextNoteTime = this.audioCtx.currentTime + 0.05;
    this.currentStep = 0;

    this.schedulerTimer = setInterval(() => this.scheduleLoop(), this.lookahead);

    if (this.onStateChange) this.onStateChange(true);
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    if (this.onStateChange) this.onStateChange(false);
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  nextTrack() {
    const wasPlaying = this.isPlaying;
    this.pause();
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    if (this.onTrackChange) this.onTrackChange(this.getCurrentTrack());
    if (wasPlaying) {
      this.play();
    }
  }

  prevTrack() {
    const wasPlaying = this.isPlaying;
    this.pause();
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    if (this.onTrackChange) this.onTrackChange(this.getCurrentTrack());
    if (wasPlaying) {
      this.play();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
    }
    return this.isMuted;
  }

  scheduleLoop() {
    while (this.nextNoteTime < this.audioCtx.currentTime + this.scheduleAheadTime) {
      this.scheduleStep(this.currentStep, this.nextNoteTime);
      this.advanceStep();
    }
  }

  advanceStep() {
    this.nextNoteTime += this.secondsPerStep;
    this.currentStep = (this.currentStep + 1) % 64; // 4-bar loop of 16 steps
  }

  scheduleStep(step, time) {
    const track = this.getCurrentTrack();

    // Beat visual callback (on quarter notes)
    if (step % 4 === 0 && this.onBeat) {
      setTimeout(() => {
        if (this.isPlaying && this.onBeat) this.onBeat(step / 4);
      }, Math.max(0, (time - this.audioCtx.currentTime) * 1000));
    }

    // 1. Play Chord strumming (cheerful acoustic pluck on beats 1 and 3 offbeat)
    const chordIndex = Math.floor(step / 16);
    const chord = track.chords[chordIndex];
    if (step % 8 === 2 || step % 8 === 6) {
      this.playUkuleleStrum(chord, time, 0.16);
    }

    // 2. Play Bass notes
    const bassNote = track.bass.find(b => b.step === step);
    if (bassNote) {
      this.playBassTone(bassNote.note, time, 0.35);
    }

    // 3. Play Melody notes
    const melodyNote = track.melody.find(m => m.step === step);
    if (melodyNote) {
      this.playCheerfulLead(melodyNote.note, time, melodyNote.len);
    }

    // 4. Soft joyful percussion
    // Soft shaker/hihat on 16th notes
    if (step % 2 === 0) {
      this.playShaker(time, step % 4 === 0 ? 0.08 : 0.04);
    }
    // Soft maraca / click on upbeat
    if (step % 8 === 4) {
      this.playWoodblock(time, 0.1);
    }
  }

  // Instrument synthesizers
  playCheerfulLead(noteName, time, duration = 0.3) {
    const freq = this.noteFrequencies[noteName];
    if (!freq) return;

    // Dual oscillator: sine + gentle triangle for warm marimba/xylophone bell tone
    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const noteGain = this.audioCtx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2, time); // 1 octave overtone

    // Filter for organic warmth
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * 3, time);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, time + duration);

    // Envelope (percussive plucky attack)
    noteGain.gain.setValueAtTime(0.001, time);
    noteGain.gain.linearRampToValueAtTime(0.22, time + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(filter);
    filter.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 0.05);
    osc2.stop(time + duration + 0.05);
  }

  playUkuleleStrum(chordNotes, time, gainLevel = 0.12) {
    chordNotes.forEach((noteName, idx) => {
      const freq = this.noteFrequencies[noteName];
      if (!freq) return;

      const strumDelay = idx * 0.02; // Strum spread
      const strumTime = time + strumDelay;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, strumTime);

      gain.gain.setValueAtTime(0.0001, strumTime);
      gain.gain.linearRampToValueAtTime(gainLevel, strumTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, strumTime + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(strumTime);
      osc.stop(strumTime + 0.3);
    });
  }

  playBassTone(noteName, time, duration = 0.35) {
    const freq = this.noteFrequencies[noteName];
    if (!freq) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.24, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  playShaker(time, vol = 0.05) {
    // Noise buffer for cheerful rhythm shaker
    const bufferSize = this.audioCtx.sampleRate * 0.05;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(6500, time);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
  }

  playWoodblock(time, vol = 0.08) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(950, time);
    osc.frequency.exponentialRampToValueAtTime(600, time + 0.04);

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.06);
  }

  // Sound effects for interactive UI actions (quiz completion, checklist item checked)
  playJoyfulChime() {
    this.initContext();
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    chords.forEach((freq, idx) => {
      const time = this.audioCtx.currentTime + idx * 0.08;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.18, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.55);
    });
  }

  playCheckPop() {
    this.initContext();
    const time = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, time);
    osc.frequency.exponentialRampToValueAtTime(880, time + 0.09);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.13);
  }
}

// Global instance
window.cheerfulMusic = new CheerfulAudioEngine();
