// Web Audio API Synthesizer for high-fidelity audio feedback without external audio files

class SoundFX {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch (e) {
      console.warn('AudioContext failed:', e);
      return null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Pleasant click / button tap
  public playPop() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio playPop failed:', e);
    }
  }

  // Scratch card friction sound
  public playScratch() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.04;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800 + Math.random() * 800;
    filter.Q.value = 3;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  }

  // Celebration fanfare on reveal
  public playCelebration() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);

      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + index * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.1 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.1);
      osc.stop(ctx.currentTime + index * 0.1 + 0.65);
    });
  }

  // Envelope swoosh
  public playSwoosh() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(250, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  // Dramatic bass drop / air horn for roast
  public playAirhorn() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }

  // Soft magical chime for sweet/sentimental
  public playChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  }

  // Active music loop intervals
  private musicInterval: any = null;
  private currentTrack: string | null = null;

  public isTrackPlaying(trackId?: string): boolean {
    if (!this.currentTrack) return false;
    if (trackId) return this.currentTrack === trackId;
    return true;
  }

  public stopTrack() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.currentTrack = null;
  }

  public playTrack(trackId: string) {
    if (this.currentTrack === trackId) {
      this.stopTrack();
      return;
    }
    this.stopTrack();
    if (trackId === 'none') return;
    this.currentTrack = trackId;

    const ctx = this.getContext();
    if (!ctx) return;

    if (trackId === '8bit') {
      // 8-bit chiptune birthday melody (C4, C4, D4, C4, F4, E4...)
      const notes = [261.63, 261.63, 293.66, 261.63, 349.23, 329.63, 261.63, 261.63, 293.66, 261.63, 392.00, 349.23];
      let step = 0;
      const playStep = () => {
        if (!this.currentTrack || this.isMuted) return;
        const c = this.getContext();
        if (!c) return;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(notes[step % notes.length], c.currentTime);
        gain.gain.setValueAtTime(0.06, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start();
        osc.stop(c.currentTime + 0.24);
        step++;
      };
      playStep();
      this.musicInterval = setInterval(playStep, 250);
    } else if (trackId === 'lofi') {
      // Warm lofi chords (Cmaj7, Am7, Dm7, G7)
      const chordFreqs = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [293.66, 349.23, 440.00, 523.25], // Dm7
        [196.00, 246.94, 293.66, 349.23], // G7
      ];
      let step = 0;
      const playStep = () => {
        if (!this.currentTrack || this.isMuted) return;
        const c = this.getContext();
        if (!c) return;
        const chord = chordFreqs[step % chordFreqs.length];
        chord.forEach((freq) => {
          const osc = c.createOscillator();
          const filter = c.createBiquadFilter();
          const gain = c.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, c.currentTime);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, c.currentTime);
          gain.gain.setValueAtTime(0.04, c.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.2);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(c.destination);
          osc.start();
          osc.stop(c.currentTime + 1.3);
        });
        step++;
      };
      playStep();
      this.musicInterval = setInterval(playStep, 1400);
    } else if (trackId === 'synthwave') {
      // Pumping synthwave bassline
      const bassNotes = [110, 110, 130.81, 146.83, 110, 110, 164.81, 146.83];
      let step = 0;
      const playStep = () => {
        if (!this.currentTrack || this.isMuted) return;
        const c = this.getContext();
        if (!c) return;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(bassNotes[step % bassNotes.length], c.currentTime);
        gain.gain.setValueAtTime(0.08, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, c.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start();
        osc.stop(c.currentTime + 0.2);
        step++;
      };
      playStep();
      this.musicInterval = setInterval(playStep, 200);
    } else if (trackId === 'acoustic') {
      // Gentle fingerpicked acoustic guitar arpeggios
      const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63];
      let step = 0;
      const playStep = () => {
        if (!this.currentTrack || this.isMuted) return;
        const c = this.getContext();
        if (!c) return;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(notes[step % notes.length], c.currentTime);
        gain.gain.setValueAtTime(0.08, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start();
        osc.stop(c.currentTime + 0.45);
        step++;
      };
      playStep();
      this.musicInterval = setInterval(playStep, 260);
    } else if (trackId === 'fanfare') {
      // Triumphant brass fanfare
      const fanfareChords = [
        [392.00, 523.25, 659.25],
        [440.00, 554.37, 659.25],
        [523.25, 659.25, 783.99],
        [523.25, 659.25, 1046.50],
      ];
      let step = 0;
      const playStep = () => {
        if (!this.currentTrack || this.isMuted) return;
        const c = this.getContext();
        if (!c) return;
        const chord = fanfareChords[step % fanfareChords.length];
        chord.forEach((freq) => {
          const osc = c.createOscillator();
          const gain = c.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, c.currentTime);
          gain.gain.setValueAtTime(0.07, c.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5);
          osc.connect(gain);
          gain.connect(c.destination);
          osc.start();
          osc.stop(c.currentTime + 0.55);
        });
        step++;
      };
      playStep();
      this.musicInterval = setInterval(playStep, 500);
    }
  }
}

export const soundFX = new SoundFX();
