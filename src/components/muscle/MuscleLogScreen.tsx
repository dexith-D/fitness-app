import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { AnatomyDiagram } from './AnatomyDiagram';
import { MuscleView } from '../../types';
import { Zap, RotateCcw, CheckCircle, Flame, Dumbbell, Sparkles } from 'lucide-react';

export const MuscleLogScreen: React.FC = () => {
  const {
    muscleGroups,
    selectedMuscleId,
    setSelectedMuscleId,
    logMuscleWorkout,
    resetMuscleStrain,
    claimDayXP,
  } = useGame();
  const [currentView, setCurrentView] = useState<MuscleView>('front');
  const [filterMode, setFilterMode] = useState<'all' | 'worked' | 'rested'>('all');

  const workedMuscles = muscleGroups.filter((m) => m.effort !== 'rested');
  const restedMuscles = muscleGroups.filter((m) => m.effort === 'rested');

  const selectedMuscle =
    muscleGroups.find((m) => m.id === selectedMuscleId) ||
    workedMuscles[0] ||
    muscleGroups[0];

  const totalSets = workedMuscles.reduce((acc, curr) => acc + curr.sets, 0);

  const displayedMuscles =
    filterMode === 'worked'
      ? workedMuscles
      : filterMode === 'rested'
      ? restedMuscles
      : muscleGroups;

  // Auto-switch view if user selects a muscle in the opposing view
  const handleSelectMuscle = (muscleId: string) => {
    setSelectedMuscleId(muscleId);
    const m = muscleGroups.find((item) => item.id === muscleId);
    if (m && m.view !== currentView) {
      setCurrentView(m.view);
    }
  };

  const frontWorkedCount = muscleGroups.filter((m) => m.view === 'front' && m.effort !== 'rested').length;
  const backWorkedCount = muscleGroups.filter((m) => m.view === 'back' && m.effort !== 'rested').length;

  return (
    <div className="flex-1 w-full overflow-y-auto pb-24 px-4 pt-3 space-y-4">
      {/* 1. HUD Telemetry Summary Card */}
      <section className="bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low p-4 rounded-3xl relative overflow-hidden border border-outline-variant/30 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-wider text-primary-fixed-dim font-bold">
              Hypertrophy Heatmap & Telemetry
            </span>
          </div>
          <span className="font-mono text-[11px] text-secondary bg-surface-container-high/90 px-2.5 py-0.5 rounded-full font-bold border border-secondary/25 shadow-sm">
            {workedMuscles.length} Trained Today
          </span>
        </div>

        <div className="space-y-0.5">
          <h2 className="font-headline text-lg font-bold text-on-surface">
            {workedMuscles.length > 0 ? 'Hypertrophy Recovery Active' : 'All Muscle Groups Rested'}
          </h2>
          <p className="font-body text-xs text-on-surface-variant flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span>
              {workedMuscles.length > 0
                ? `${workedMuscles.map((m) => m.name.split(' ')[0]).join(', ')} undergoing progressive cellular recovery.`
                : 'All muscle groups fully recovered and primed for peak overload!'}
            </span>
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between font-mono text-xs text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            {workedMuscles.length} / {muscleGroups.length} Groups Trained
          </span>
          <span className="text-primary-fixed-dim font-semibold uppercase">
            {totalSets} Sets Completed
          </span>
        </div>
      </section>

      {/* 2. Interactive Anatomical View Switcher & Legend */}
      <section className="space-y-2">
        <div className="flex items-center justify-between bg-surface-container-lowest p-1.5 rounded-2xl border border-outline-variant/30 shadow-sm">
          <button
            onClick={() => setCurrentView('front')}
            className={`flex-1 py-2 text-center font-headline text-xs font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              currentView === 'front'
                ? 'bg-primary-container text-surface-container-lowest shadow-neon-glow border border-primary-container'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Anterior (Front)</span>
            {frontWorkedCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${currentView === 'front' ? 'bg-surface-container-lowest text-primary-container' : 'bg-surface-container text-on-surface'}`}>
                {frontWorkedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentView('back')}
            className={`flex-1 py-2 text-center font-headline text-xs font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              currentView === 'back'
                ? 'bg-primary-container text-surface-container-lowest shadow-neon-glow border border-primary-container'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Posterior (Back)</span>
            {backWorkedCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${currentView === 'back' ? 'bg-surface-container-lowest text-primary-container' : 'bg-surface-container text-on-surface'}`}>
                {backWorkedCount}
              </span>
            )}
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-around px-2 py-1 font-mono text-[11px] text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff87] shadow-[0_0_8px_#00ff87]"></span>
            High Strain (Trained)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#39b8fd] shadow-[0_0_8px_#39b8fd]"></span>
            Moderate Strain
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#222736] border border-outline"></span>
            Rested & Ready
          </span>
        </div>
      </section>

      {/* 3. Anatomical Showcase Display with Precise Sketch & Overlays */}
      <section className="bg-surface-container-low rounded-3xl p-3 border border-outline-variant/30 shadow-md">
        <div className="flex items-center justify-between px-2 pb-1 text-on-surface-variant font-mono text-xs">
          <span className="flex items-center gap-1.5 text-on-surface font-bold">
            <Sparkles className="w-3.5 h-3.5 text-primary-container" />
            Interactive Sketch Model
          </span>
          <span className="text-[10px] text-on-surface-variant">Tap any muscle on the sketch</span>
        </div>

        {/* Refined Vector-Sketch Anatomy Model */}
        <AnatomyDiagram currentView={currentView} />

        {/* Selected Muscle Interactive Control Card */}
        {selectedMuscle && (
          <div className="bg-surface-container-high p-4 rounded-2xl border border-outline-variant/30 shadow-md mt-2 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-inner ${
                    selectedMuscle.effort === 'high'
                      ? 'bg-primary-container/20 text-primary-container border-primary-container/40'
                      : selectedMuscle.effort === 'moderate'
                      ? 'bg-tertiary-container/20 text-tertiary-fixed-dim border-tertiary-fixed-dim/40'
                      : 'bg-surface-container-highest text-outline border-outline-variant/20'
                  }`}
                >
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-headline text-base font-bold text-on-surface truncate">
                    {selectedMuscle.name}
                  </div>
                  <div className="font-mono text-[11px] text-on-surface-variant truncate">
                    {selectedMuscle.secondaryName}
                  </div>
                </div>
              </div>

              {/* Strain Badge */}
              <div className="text-right shrink-0">
                <span
                  className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full inline-block border ${
                    selectedMuscle.effort === 'high'
                      ? 'bg-primary-container/20 text-primary-container border-primary-container/30'
                      : selectedMuscle.effort === 'moderate'
                      ? 'bg-tertiary-container/20 text-tertiary-fixed-dim border-tertiary-fixed-dim/30'
                      : 'bg-surface-container text-outline border-outline-variant/20'
                  }`}
                >
                  {selectedMuscle.effort === 'high'
                    ? 'HIGH STRAIN'
                    : selectedMuscle.effort === 'moderate'
                    ? 'MODERATE'
                    : 'RESTED & READY'}
                </span>
                <div className="font-mono text-[10px] text-on-surface-variant mt-0.5">
                  {selectedMuscle.sets} sets logged today
                </div>
              </div>
            </div>

            {/* Recovery Meter */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
              <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/15">
                <div className="text-[10px] text-on-surface-variant">Recovery Status</div>
                <div className="font-bold text-on-surface mt-0.5">
                  {selectedMuscle.effort === 'rested'
                    ? '100% (Primed to train)'
                    : `${selectedMuscle.recoveryHoursLeft}h recovery left`}
                </div>
              </div>

              <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/15">
                <div className="text-[10px] text-on-surface-variant">Last Trained</div>
                <div className="font-bold text-on-surface mt-0.5">
                  {selectedMuscle.lastWorked || 'Fully rested'}
                </div>
              </div>
            </div>

            {/* Exercises Performed */}
            {selectedMuscle.exercises.length > 0 && (
              <div className="text-[11px] font-mono text-on-surface-variant bg-surface-container-lowest/70 px-3 py-1.5 rounded-xl border border-outline-variant/15 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-primary-container shrink-0" />
                <span className="truncate">
                  {selectedMuscle.exercises.join(' • ')}
                </span>
              </div>
            )}

            {/* Interactive Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => logMuscleWorkout(selectedMuscle.id)}
                className="flex-1 h-10 bg-primary-container text-surface-container-lowest font-headline font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-neon-glow active:scale-95 transition-all"
              >
                <Zap className="w-4 h-4 fill-surface-container-lowest" />
                <span>
                  {selectedMuscle.effort === 'rested'
                    ? `Train ${selectedMuscle.name.split(' ')[0]} (+4 Sets)`
                    : `Log More Sets (+4 Sets)`}
                </span>
              </button>

              {selectedMuscle.effort !== 'rested' && (
                <button
                  onClick={() => resetMuscleStrain(selectedMuscle.id)}
                  className="px-3 h-10 bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-mono text-xs rounded-xl flex items-center justify-center gap-1 border border-outline-variant/30 active:scale-95 transition-all"
                  title="Reset to rested state"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rest</span>
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 4. Muscles Breakdown List with Filter Bar */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary-container">
              format_list_bulleted
            </span>
            <h3 className="font-headline text-base font-bold text-on-surface">
              Muscle Groups Directory
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-xl border border-outline-variant/30 text-[10px] font-mono">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                filterMode === 'all'
                  ? 'bg-surface-container-high text-primary-container font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All ({muscleGroups.length})
            </button>
            <button
              onClick={() => setFilterMode('worked')}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                filterMode === 'worked'
                  ? 'bg-surface-container-high text-primary-container font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Trained ({workedMuscles.length})
            </button>
            <button
              onClick={() => setFilterMode('rested')}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                filterMode === 'rested'
                  ? 'bg-surface-container-high text-primary-container font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Rested ({restedMuscles.length})
            </button>
          </div>
        </div>

        {displayedMuscles.length === 0 ? (
          <div className="p-4 rounded-2xl bg-surface-container-low text-center text-xs text-on-surface-variant border border-outline-variant/20 space-y-1">
            <p className="font-bold text-on-surface">No muscles matching this filter.</p>
          </div>
        ) : (
          displayedMuscles.map((muscle) => (
            <div
              key={muscle.id}
              onClick={() => handleSelectMuscle(muscle.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                selectedMuscleId === muscle.id
                  ? 'bg-surface-container-high border-primary-container/60 shadow-md ring-1 ring-primary-container/30'
                  : 'bg-surface-container-low border-outline-variant/20 hover:bg-surface-container'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        muscle.effort === 'high'
                          ? 'bg-[#00ff87] shadow-[0_0_6px_#00ff87]'
                          : muscle.effort === 'moderate'
                          ? 'bg-[#39b8fd] shadow-[0_0_6px_#39b8fd]'
                          : 'bg-[#222736] border border-outline'
                      }`}
                    ></span>
                    <span className="font-headline text-sm font-bold text-on-surface">
                      {muscle.name}
                    </span>
                    <span
                      className={`font-mono text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        muscle.effort === 'high'
                          ? 'bg-primary-container/20 text-primary-container border border-primary-container/30'
                          : muscle.effort === 'moderate'
                          ? 'bg-tertiary-container/20 text-tertiary-fixed-dim border border-tertiary-fixed-dim/30'
                          : 'bg-surface-container text-outline border border-outline-variant/20'
                      }`}
                    >
                      {muscle.effort === 'high'
                        ? 'High Effort'
                        : muscle.effort === 'moderate'
                        ? 'Moderate'
                        : 'Rested'}
                    </span>
                  </div>
                  <div className="font-body text-xs text-on-surface-variant mt-1 pl-4">
                    {muscle.exercises.length > 0
                      ? muscle.exercises.join(' • ')
                      : 'Primed & ready for training'}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-mono text-sm font-bold block ${
                      muscle.effort === 'high'
                        ? 'text-primary-container'
                        : muscle.effort === 'moderate'
                        ? 'text-tertiary-fixed-dim'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    {muscle.effort === 'rested'
                      ? 'Ready'
                      : `${Math.round((muscle.recoveryHoursLeft / 24) * 10) / 10} Days`}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant">
                    {muscle.effort === 'rested' ? 'Status' : 'Recovery'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 pl-4 font-mono text-[11px] text-on-surface-variant">
                <span className="flex items-center gap-1 text-primary-fixed-dim">
                  <CheckCircle className="w-3.5 h-3.5 text-primary-container" />
                  {muscle.sets} Sets Completed
                </span>
                <span>•</span>
                <span className="uppercase text-[10px] text-outline">
                  {muscle.view === 'front' ? 'Anterior' : 'Posterior'}
                </span>
              </div>
            </div>
          ))
        )}
      </section>

      {/* 5. Claim Day XP Micro Action */}
      <section className="bg-surface-container-lowest p-4 rounded-3xl border border-outline-variant/30 space-y-3 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-secondary text-lg">🎉</span>
          <span className="font-headline text-sm font-bold text-on-surface">Recovery Telemetry</span>
        </div>
        <p className="font-body text-xs text-on-surface-variant leading-relaxed">
          You worked {workedMuscles.length} muscle groups today with progressive overload. Rest
          adequately to rebuild fibers and maximize hypertrophy adaptations.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={claimDayXP}
            className="flex-1 h-11 bg-primary-container text-surface-container-lowest font-headline font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-neon-glow active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>Claim Day XP (+210 XP)</span>
          </button>
        </div>
      </section>
    </div>
  );
};
