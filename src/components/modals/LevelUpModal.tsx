import React from 'react';
import { useGame } from '../../context/GameContext';
import { Award, Zap, ChevronRight, Gift, Target } from 'lucide-react';

export const LevelUpModal: React.FC = () => {
  const { isLevelUpModalOpen, closeLevelUpModal, levelUpData, userStats, allocateStatPoint } =
    useGame();

  if (!isLevelUpModalOpen || !levelUpData) return null;

  const { oldLevel, newLevel, newRank, tierName, tierNumber, focus, unlock } = levelUpData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-surface-container-low rounded-3xl p-5 border border-primary-container/50 shadow-[0_0_50px_rgba(0,255,135,0.3)] space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Celebration Header */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-secondary/40 shadow-amber-glow">
            <Zap className="w-3.5 h-3.5 text-secondary" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-secondary font-bold">
              {tierNumber ? `Tier ${tierNumber}: ${tierName}` : 'New Tier Milestone'}
            </span>
          </div>

          <h2 className="font-headline text-2xl font-bold uppercase tracking-tight text-primary drop-shadow-[0_2px_12px_rgba(0,255,135,0.4)]">
            Level {newLevel} Reached!
          </h2>
          <p className="font-body text-xs text-on-surface-variant">
            Rank Promoted to <strong className="text-secondary font-headline">{newRank}</strong>
          </p>
        </div>

        {/* Level Step Tags */}
        <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/30 flex items-center justify-between font-mono">
          <div className="text-center">
            <span className="text-[10px] text-outline uppercase block">Previous</span>
            <span className="text-xs font-bold text-on-surface-variant">Lvl {oldLevel}</span>
          </div>
          <span className="material-symbols-outlined text-primary-container text-lg">
            double_arrow
          </span>
          <div className="text-center bg-primary-container/15 px-3 py-1 rounded-xl border border-primary-container/30">
            <span className="text-[9px] text-primary-container uppercase block font-bold">
              Current
            </span>
            <span className="text-sm font-bold text-primary-container">Lvl {newLevel}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-outline" />
          <div className="text-center">
            <span className="text-[10px] text-outline uppercase block">Next Goal</span>
            <span className="text-xs font-bold text-on-surface-variant">
              {newLevel < 15 ? `Lvl ${newLevel + 1}` : 'Atlas Max'}
            </span>
          </div>
        </div>

        {/* Tier Gameplay Focus */}
        {focus && (
          <div className="p-3 rounded-2xl bg-surface-container-high/60 border border-outline-variant/25 space-y-1">
            <div className="flex items-center gap-1.5 text-primary-container font-mono text-[11px] font-bold">
              <Target className="w-3.5 h-3.5" />
              <span>Current Mechanics & Focus</span>
            </div>
            <p className="font-body text-xs text-on-surface leading-relaxed pl-5">
              {focus}
            </p>
          </div>
        )}

        {/* Unlocked Loot & Privileges */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="font-headline text-xs font-bold text-on-surface">
              Unlocked Loot & Privileges
            </span>
            <span className="font-mono text-[10px] text-primary-container bg-surface-container-high px-2 py-0.5 rounded-full font-bold border border-primary-container/30">
              New Unlocks
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {/* Newly Unlocked Gear / Privilege */}
            {unlock && (
              <div className="p-3 rounded-2xl bg-surface-container-high border border-primary-container/30 flex items-start gap-2.5 shadow-sm">
                <Gift className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="font-headline font-bold text-on-surface text-xs flex items-center gap-1.5">
                    <span>Rank Perk Unlocked</span>
                    <span className="text-[8px] bg-secondary-container/20 text-secondary px-1.5 py-0.2 rounded font-bold uppercase">
                      New
                    </span>
                  </div>
                  <div className="text-[11px] text-on-surface-variant font-body mt-0.5 leading-relaxed">
                    {unlock}
                  </div>
                </div>
              </div>
            )}

            {/* Stat Points */}
            <div className="p-2.5 rounded-2xl bg-surface-container-high border border-outline-variant/20 flex items-start gap-2.5">
              <Award className="w-5 h-5 text-primary-container shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-on-surface text-xs">+2 Attribute Points</div>
                <div className="text-[10px] text-on-surface-variant font-body">
                  Ready to allocate to Strength, Stamina, or Agility pools.
                </div>
                {/* Instant Allocation Bar */}
                <div className="flex items-center gap-1.5 mt-2">
                  <button
                    onClick={() => allocateStatPoint('strength')}
                    className="px-2 py-0.5 rounded-lg bg-primary-container text-surface-container-lowest font-bold text-[9px] active:scale-95"
                  >
                    +STR ({userStats.attributes.strength})
                  </button>
                  <button
                    onClick={() => allocateStatPoint('stamina')}
                    className="px-2 py-0.5 rounded-lg bg-tertiary-container text-surface-container-lowest font-bold text-[9px] active:scale-95"
                  >
                    +STA ({userStats.attributes.stamina})
                  </button>
                  <button
                    onClick={() => allocateStatPoint('agility')}
                    className="px-2 py-0.5 rounded-lg bg-secondary-container text-surface-container-lowest font-bold text-[9px] active:scale-95"
                  >
                    +AGI ({userStats.attributes.agility})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={closeLevelUpModal}
          className="w-full h-12 bg-primary-container text-surface-container-lowest font-headline font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-neon-glow active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Claim Rewards & Continue</span>
        </button>
      </div>
    </div>
  );
};
