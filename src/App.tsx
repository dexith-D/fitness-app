import React, { useState } from 'react';
import { useGame } from './context/GameContext';
import { MobileFrame } from './components/mobile/MobileFrame';
import { TopBar } from './components/navigation/TopBar';
import { BottomNav } from './components/navigation/BottomNav';
import { QuestsDashboard } from './components/quests/QuestsDashboard';
import { MuscleLogScreen } from './components/muscle/MuscleLogScreen';
import { WorkoutResultsScreen } from './components/results/WorkoutResultsScreen';
import { LeaderboardScreen } from './components/leaderboard/LeaderboardScreen';
import { WorkoutSessionModal } from './components/modals/WorkoutSessionModal';
import { LevelUpModal } from './components/modals/LevelUpModal';
import { CreateQuestModal } from './components/modals/CreateQuestModal';
import { AvatarCustomizationModal } from './components/modals/AvatarCustomizationModal';
import { ProfileScreen } from './components/profile/ProfileScreen';

export const App: React.FC = () => {
  const { currentTab } = useGame();
  const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  return (
    <MobileFrame>
      <div className="flex-1 w-full h-full flex flex-col bg-surface text-on-surface overflow-hidden relative">
        {/* Mobile Top HUD */}
        <TopBar onOpenAvatarModal={() => setIsAvatarModalOpen(true)} />

        {/* Tab Viewport */}
        <main className="flex-1 w-full overflow-hidden flex flex-col relative">
          {currentTab === 'quests' && (
            <QuestsDashboard onOpenCreateQuest={() => setIsCreateQuestOpen(true)} />
          )}
          {currentTab === 'muscles' && <MuscleLogScreen />}
          {currentTab === 'results' && <WorkoutResultsScreen />}
          {currentTab === 'leaderboard' && <LeaderboardScreen />}
          {currentTab === 'profile' && <ProfileScreen />}
        </main>

        {/* Mobile Bottom Fixed Navigation */}
        <BottomNav />

        {/* Interactive Modals */}
        <WorkoutSessionModal />
        <LevelUpModal />
        <CreateQuestModal
          isOpen={isCreateQuestOpen}
          onClose={() => setIsCreateQuestOpen(false)}
        />
        <AvatarCustomizationModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
        />
      </div>
    </MobileFrame>
  );
};
