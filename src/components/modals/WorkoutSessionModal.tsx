import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

export const WorkoutSessionModal: React.FC = () => {
  const { activeWorkoutQuest, cancelWorkout, completeWorkout } = useGame();

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [completedSets, setCompletedSets] = useState<{ [exerciseIdx: number]: boolean[] }>({});

  useEffect(() => {
    if (!activeWorkoutQuest) return;

    // Initialize set checkboxes
    const initialSets: { [key: number]: boolean[] } = {};
    activeWorkoutQuest.exercises.forEach((ex, idx) => {
      initialSets[idx] = new Array(ex.sets).fill(false);
    });
    setCompletedSets(initialSets);
    setSecondsElapsed(0);

    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeWorkoutQuest]);

  if (!activeWorkoutQuest) return null;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSet = (exerciseIdx: number, setIdx: number) => {
    setCompletedSets((prev) => {
      const current = prev[exerciseIdx] ? [...prev[exerciseIdx]] : [];
      current[setIdx] = !current[setIdx];
      return { ...prev, [exerciseIdx]: current };
    });
  };

  const totalPossibleSets = activeWorkoutQuest.exercises.reduce((acc, e) => acc + e.sets, 0);
  const totalCompleted = Object.values(completedSets).reduce(
    (acc, sets) => acc + sets.filter(Boolean).length,
    0
  );

  const handleFinish = () => {
    const duration = Math.max(1, Math.round(secondsElapsed / 60));
    completeWorkout(activeWorkoutQuest.id, {
      durationMins: duration > 0 ? duration : activeWorkoutQuest.durationMins,
      calories: Math.round(activeWorkoutQuest.durationMins * 9.5),
      volumeKg: 12650,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-surface-container-low rounded-3xl p-5 border border-primary-container/40 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-wider text-primary-fixed-dim font-bold">
              Live Session
            </span>
          </div>
          <button
            onClick={cancelWorkout}
            className="text-on-surface-variant hover:text-on-surface text-xs font-mono px-2 py-0.5 rounded bg-surface-container-high"
          >
            Cancel
          </button>
        </div>

        {/* Quest Info & Clock */}
        <div className="text-center space-y-1">
          <h2 className="font-headline text-lg font-bold text-on-surface">
            {activeWorkoutQuest.title}
          </h2>
          <div className="font-mono text-2xl font-bold text-primary-container tracking-wider py-1">
            {formatTimer(secondsElapsed)}
          </div>
          <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-outline">
            <span>
              Targeting:{' '}
              <strong className="text-on-surface">
                {activeWorkoutQuest.targetMuscles.join(', ')}
              </strong>
            </span>
          </div>
        </div>

        {/* Set Progress Meter */}
        <div className="space-y-1 font-mono text-xs">
          <div className="flex justify-between text-[11px] text-on-surface-variant">
            <span>Overall Progress</span>
            <span className="text-primary-container font-bold">
              {totalCompleted} / {totalPossibleSets} Sets
            </span>
          </div>
          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="bg-primary-container h-full transition-all duration-300"
              style={{
                width: `${
                  totalPossibleSets > 0 ? (totalCompleted / totalPossibleSets) * 100 : 0
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Exercises & Interactive Sets Checklist */}
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {activeWorkoutQuest.exercises.map((exercise, eIdx) => (
            <div
              key={eIdx}
              className="bg-surface-container-high/70 p-3 rounded-2xl border border-outline-variant/20 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-headline text-xs font-bold text-on-surface">
                  {exercise.name}
                </span>
                <span className="font-mono text-[10px] text-secondary">
                  {exercise.weightKg ? `${exercise.weightKg} kg` : ''} • {exercise.reps} reps
                </span>
              </div>

              {/* Set Checkboxes */}
              <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
                {Array.from({ length: exercise.sets }).map((_, sIdx) => {
                  const isDone = completedSets[eIdx]?.[sIdx] || false;
                  return (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => toggleSet(eIdx, sIdx)}
                      className={`py-1.5 px-2 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                        isDone
                          ? 'bg-primary-container text-surface-container-lowest border-primary-container font-bold shadow-[0_0_8px_rgba(0,255,135,0.4)]'
                          : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/40 hover:border-outline'
                      }`}
                    >
                      <span className="text-[9px] uppercase opacity-75">Set {sIdx + 1}</span>
                      <span className="text-xs font-bold mt-0.5">{isDone ? '✓' : exercise.reps}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Complete Action Button */}
        <button
          onClick={handleFinish}
          className="w-full h-12 bg-primary-container text-surface-container-lowest font-headline font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-neon-glow active:scale-95 transition-all mt-2"
        >
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Complete Workout (+{activeWorkoutQuest.xpReward} XP)</span>
        </button>
      </div>
    </div>
  );
};
