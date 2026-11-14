import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';

interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateQuestModal: React.FC<CreateQuestModalProps> = ({ isOpen, onClose }) => {
  const { addCustomQuest } = useGame();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [durationMins, setDurationMins] = useState(30);
  const [xpReward, setXpReward] = useState(300);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(['chest']);

  if (!isOpen) return null;

  const availableMuscles = [
    { id: 'chest', label: 'Chest' },
    { id: 'delts', label: 'Shoulders' },
    { id: 'biceps', label: 'Biceps' },
    { id: 'triceps', label: 'Triceps' },
    { id: 'core', label: 'Core / Abs' },
    { id: 'lats', label: 'Back / Lats' },
    { id: 'quads', label: 'Quadriceps' },
    { id: 'hamstrings', label: 'Hamstrings' },
    { id: 'calves', label: 'Calves' },
  ];

  const toggleMuscle = (id: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCustomQuest({
      title,
      subtitle: subtitle || 'Custom workout routine',
      category: 'custom',
      xpReward: Number(xpReward) || 250,
      durationMins: Number(durationMins) || 30,
      targetMuscles: selectedMuscles.length > 0 ? selectedMuscles : ['chest'],
      goal: 1,
      exercises: [
        { name: `${title} Main Exercise`, sets: 4, reps: 10, weightKg: 50 },
        { name: 'Secondary Movement', sets: 3, reps: 12, weightKg: 20 },
      ],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-surface-container-low rounded-3xl p-5 border border-outline-variant/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-[20px]">
              add_task
            </span>
            <h2 className="font-headline text-base font-bold text-on-surface">
              Create Custom Quest
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface text-xs font-mono px-2 py-0.5 rounded bg-surface-container-high"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
          <div className="space-y-1">
            <label className="text-on-surface-variant uppercase text-[10px] tracking-wider block">
              Quest Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Leg Annihilation & Calves"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-lowest rounded-xl border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary-container text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-on-surface-variant uppercase text-[10px] tracking-wider block">
              Routine Notes / Exercises
            </label>
            <input
              type="text"
              placeholder="e.g. Squats, Leg Press & Calf Raises"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-lowest rounded-xl border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary-container text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-on-surface-variant uppercase text-[10px] tracking-wider block">
                Duration (mins)
              </label>
              <input
                type="number"
                min="5"
                max="180"
                value={durationMins}
                onChange={(e) => setDurationMins(Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container-lowest rounded-xl border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary-container text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-on-surface-variant uppercase text-[10px] tracking-wider block">
                XP Bounty
              </label>
              <input
                type="number"
                min="50"
                max="1000"
                step="50"
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container-lowest rounded-xl border border-outline-variant/40 text-primary-container font-bold focus:outline-none focus:border-primary-container text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="text-on-surface-variant uppercase text-[10px] tracking-wider block">
              Target Muscle Groups
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {availableMuscles.map((muscle) => {
                const isSelected = selectedMuscles.includes(muscle.id);
                return (
                  <button
                    key={muscle.id}
                    type="button"
                    onClick={() => toggleMuscle(muscle.id)}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-mono transition-all border ${
                      isSelected
                        ? 'bg-primary-container text-surface-container-lowest border-primary-container font-bold shadow-sm'
                        : 'bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:border-outline'
                    }`}
                  >
                    {muscle.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-primary-container text-surface-container-lowest font-headline font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-neon-glow active:scale-95 transition-all mt-3"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Add Quest to Dashboard</span>
          </button>
        </form>
      </div>
    </div>
  );
};
