import React, { useState } from 'react';

interface OnboardingProps {
  onStart: (name: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const isEnabled = name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEnabled) {
      onStart(name.trim());
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-transparent text-[var(--text-primary)] animate-fadeIn">
      <div className="text-center p-8 max-w-sm w-full">
        <div className="animate-slideUp" style={{ animationDelay: '100ms' }}>
          <h1 className="text-4xl font-light tracking-widest mb-2">Leaflet</h1>
          <p className="text-[var(--text-secondary)] mb-8">A quiet companion awaits.</p>
        </div>
        <form onSubmit={handleSubmit} className="animate-slideUp" style={{ animationDelay: '250ms' }}>
          <label htmlFor="plant-name" className="block text-sm text-[var(--text-primary)] mb-2 tracking-wide">
            Give your plant a name.
          </label>
          <input
            id="plant-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--white)] border border-[var(--border-color)] rounded-lg text-center text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition"
            placeholder="e.g., Fern"
            maxLength={15}
          />
          <button
            type="submit"
            disabled={!isEnabled}
            className="w-full mt-6 px-4 py-3 bg-[var(--accent-color)] text-white rounded-lg shadow-md hover:bg-[var(--accent-hover)] disabled:bg-[var(--disabled-bg)] disabled:text-[var(--text-secondary)] disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2"
            style={{ animation: isEnabled ? 'button-glow 3s infinite ease-in-out' : 'none' }}
          >
            Begin
          </button>
        </form>
      </div>
    </div>
  );
};