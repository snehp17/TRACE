import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Radio, Disc, Train, Moon, Sparkles, X } from 'lucide-react';
import { useAudioAmbience } from '../hooks/useAudioAmbience';

export default function AudioAmbiencePlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { isPlaying, soundscape, volume, togglePlay, selectSoundscape, updateVolume } = useAudioAmbience();

  const soundscapes = [
    { id: 'vinyl', label: 'Vinyl Crackle', icon: Disc, desc: 'Warm analog nostalgia' },
    { id: 'train', label: 'Night Train', icon: Train, desc: 'Rhythmic commuter rail' },
    { id: 'drone', label: 'Harmonic Drone', icon: Moon, desc: 'Nocturnal ambient focus' }
  ];

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative font-mono text-xs">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
          isPlaying
            ? 'bg-amber-accent/15 border-amber-accent/50 text-amber-accent shadow-glow-amber'
            : 'bg-archive-900 hover:bg-archive-850 border-archive-700/60 text-archive-300 hover:text-white'
        }`}
        title="Museum Ambient Soundscape Player"
        aria-label="Toggle Museum Audio Companion"
        aria-expanded={isOpen}
      >
        <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse text-amber-accent' : 'text-archive-400'}`} />
        <span className="hidden sm:inline font-medium">
          {isPlaying ? `Audio: ${soundscape}` : 'Ambience'}
        </span>
        {isPlaying && (
          <span className="flex space-x-0.5 items-end h-3 w-3">
            <span className="w-0.5 bg-amber-accent h-full animate-pulse" />
            <span className="w-0.5 bg-amber-accent h-2/3 animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 bg-amber-accent h-4/5 animate-pulse" style={{ animationDelay: '300ms' }} />
          </span>
        )}
      </button>

      {/* Floating Audio HUD Drawer */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-4 rounded-2xl bg-archive-900 border border-archive-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50 space-y-3.5 animate-slide-up text-left">
          <div className="flex items-center justify-between border-b border-archive-700/60 pb-2">
            <div className="flex items-center space-x-1.5 text-amber-accent">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">Museum Soundscape</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={togglePlay}
                className={`p-1.5 rounded-lg border transition-all ${
                  isPlaying
                    ? 'bg-amber-accent text-archive-950 border-amber-accent'
                    : 'bg-archive-800 text-white border-archive-700 hover:border-amber-accent/50'
                }`}
                aria-label={isPlaying ? 'Pause soundscape' : 'Play soundscape'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-archive-400 hover:text-white hover:bg-archive-800 border border-transparent hover:border-archive-700 transition-colors"
                aria-label="Close soundscape menu"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-archive-400 font-sans leading-tight">
            Synthetic procedural sound generator running 100% client-side via Web Audio API.
          </p>

          {/* Soundscape Options */}
          <div className="space-y-1.5">
            {soundscapes.map(s => {
              const Icon = s.icon;
              const isSelected = soundscape === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => selectSoundscape(s.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-archive-800 border-amber-accent/50 text-paper'
                      : 'bg-archive-950/40 border-archive-800 text-archive-400 hover:text-archive-200 hover:border-archive-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-accent' : 'text-archive-500'}`} />
                    <div>
                      <div className="font-semibold text-xs">{s.label}</div>
                      <div className="text-[10px] text-archive-500">{s.desc}</div>
                    </div>
                  </div>
                  {isSelected && isPlaying && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-accent animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Volume Slider */}
          <div className="pt-2 border-t border-archive-700/50 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => updateVolume(volume === 0 ? 0.3 : 0)}
              className="text-archive-400 hover:text-white"
              aria-label="Toggle mute"
            >
              {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => updateVolume(parseFloat(e.target.value))}
              className="w-full accent-amber-accent h-1 bg-archive-750 rounded cursor-pointer"
              aria-label="Soundscape Volume"
            />
          </div>
        </div>
      )}
    </div>
  );
}
