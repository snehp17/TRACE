import { useState, useEffect, useRef } from 'react';

/**
 * Custom React hook providing 100% client-side synthetic ambient museum soundscapes
 * using the Web Audio API. Requires zero external audio assets or network downloads.
 */
export function useAudioAmbience() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundscape, setSoundscape] = useState('vinyl'); // 'vinyl' | 'train' | 'drone'
  const [volume, setVolume] = useState(0.3);

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const noiseNodeRef = useRef(null);
  const oscNodeRef = useRef(null);
  const lfoNodeRef = useRef(null);

  const initAudio = () => {
    if (audioCtxRef.current) return audioCtxRef.current;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    const ctx = new AudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);

    audioCtxRef.current = ctx;
    gainNodeRef.current = masterGain;
    return ctx;
  };

  const startSoundscape = (type) => {
    const ctx = initAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    stopSoundscape();

    if (type === 'vinyl') {
      // Warm vinyl crackle & dust generator using pink noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        // occasional dust pop
        const pop = Math.random() > 0.9985 ? (Math.random() - 0.5) * 1.8 : 0;
        data[i] = (b0 + b1 + b2) * 0.04 + pop;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1800;

      noise.connect(filter);
      filter.connect(gainNodeRef.current);
      noise.start();
      noiseNodeRef.current = noise;
    } else if (type === 'train') {
      // Rhythmic rail sleeper cadence
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = 65; // low rumble

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 1.6; // ~96 bpm rail clicks
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.4;

      lfo.connect(lfoGain.gain);
      osc.connect(lfoGain);
      lfoGain.connect(gainNodeRef.current);

      osc.start();
      lfo.start();
      oscNodeRef.current = osc;
      lfoNodeRef.current = lfo;
    } else if (type === 'drone') {
      // Nocturnal ambient harmonic drone
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 110; // A2 warm harmonic

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;

      osc.connect(filter);
      filter.connect(gainNodeRef.current);
      osc.start();
      oscNodeRef.current = osc;
    }
  };

  const stopSoundscape = () => {
    if (noiseNodeRef.current) {
      try { noiseNodeRef.current.stop(); } catch (e) {}
      noiseNodeRef.current = null;
    }
    if (oscNodeRef.current) {
      try { oscNodeRef.current.stop(); } catch (e) {}
      oscNodeRef.current = null;
    }
    if (lfoNodeRef.current) {
      try { lfoNodeRef.current.stop(); } catch (e) {}
      lfoNodeRef.current = null;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSoundscape();
      setIsPlaying(false);
    } else {
      startSoundscape(soundscape);
      setIsPlaying(true);
    }
  };

  const selectSoundscape = (type) => {
    setSoundscape(type);
    if (isPlaying) {
      startSoundscape(type);
    }
  };

  const updateVolume = (newVol) => {
    const v = Math.max(0, Math.min(1, newVol));
    setVolume(v);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = v;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSoundscape();
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch (e) {}
      }
    };
  }, []);

  return {
    isPlaying,
    soundscape,
    volume,
    togglePlay,
    selectSoundscape,
    updateVolume
  };
}
