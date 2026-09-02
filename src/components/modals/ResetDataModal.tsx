'use client';

import React, { useState } from 'react';
import { arcadeSound } from '../../lib/audio';
import { haptics } from '../../lib/haptics';

interface ResetDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetDataModal: React.FC<ResetDataModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  const [confirmText, setConfirmText] = useState('');

  if (!isOpen) return null;

  const isMatch = confirmText.trim().toUpperCase() === 'RESET';

  const handleExecute = () => {
    if (!isMatch) return;
    arcadeSound.playPop(200);
    haptics.tap();
    onConfirmReset();
    setConfirmText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn select-none">
      <div className="w-full max-w-md rounded-4xl bg-goon-surface border-2 border-goon-coral/60 shadow-2xl p-6 space-y-4 text-center relative">
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-3xl bg-goon-coral/10 border-2 border-goon-coral/40 mx-auto flex items-center justify-center text-3xl shadow-chunky-pink">
          💀
        </div>

        <div>
          <h2 className="text-xl font-black text-goon-coral tracking-tight">
            FACTORY RESET ALL DATA?
          </h2>
          <p className="text-xs font-bold text-goon-muted mt-1 leading-relaxed">
            This will permanently wipe all your logged sessions, active streaks, unlocked achievements, XP, and history. This action cannot be undone.
          </p>
        </div>

        {/* Confirmation Input */}
        <div className="space-y-1.5 text-left">
          <label className="text-[11px] font-black text-goon-muted uppercase tracking-wider block">
            TYPE <span className="text-goon-coral font-black">"RESET"</span> TO CONFIRM:
          </label>
          <input
            type="text"
            placeholder="RESET"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-goon-surfaceLight border-2 border-goon-surfaceBorder text-sm font-black text-center text-goon-text placeholder-goon-muted focus:outline-none focus:border-goon-coral uppercase tracking-widest shadow-sm"
          />
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleExecute}
            disabled={!isMatch}
            className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all ${
              isMatch
                ? 'bg-goon-coral text-slate-950 shadow-chunky-pink hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-goon-surfaceLight text-goon-muted border border-goon-surfaceBorder cursor-not-allowed opacity-50'
            }`}
          >
            PERMANENTLY PURGE ALL DATA
          </button>

          <button
            onClick={() => {
              arcadeSound.playPop(400);
              haptics.tap();
              onClose();
            }}
            className="w-full py-2 text-xs font-bold text-goon-muted hover:text-goon-text"
          >
            Cancel & Keep My Data
          </button>
        </div>
      </div>
    </div>
  );
};
