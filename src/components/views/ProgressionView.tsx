import React from 'react';
import { useGame } from '../../context/GameContext';
import { useLocale } from '../../context/LocaleContext';
import { ProgressionSubTab } from '../../types';
import { cyberAudio } from '../../utils/cyberAudio';
import { MissionsView } from './MissionsView';
import { CollectiblesView } from './CollectiblesView';
import { ObjectivesView } from './ObjectivesView';
import { Compass, Sparkles, Trophy } from 'lucide-react';

interface ProgressionViewProps {
  onOpenNewItemModal: (defaultType?: 'mission' | 'collectible' | 'vehicle' | 'note') => void;
}

export const ProgressionView: React.FC<ProgressionViewProps> = ({ onOpenNewItemModal }) => {
  const { progressionSubTab, setProgressionSubTab, stats } = useGame();
  const { appCopy } = useLocale();
  const t = appCopy.progression;

  const subTabs: {
    id: ProgressionSubTab;
    label: string;
    counter: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'missions',
      label: t.tabMissions,
      counter: `${stats.missionsDone}/${stats.missionsTotal}`,
      icon: Compass,
    },
    {
      id: 'collectibles',
      label: t.tabCollectibles,
      counter: `${stats.collectiblesDone}/${stats.collectiblesTotal}`,
      icon: Sparkles,
    },
    {
      id: 'objectives',
      label: t.tabObjectives,
      counter: `${stats.objectivesDone}/${stats.objectivesTotal}`,
      icon: Trophy,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="jitalx-panel p-1.5 flex flex-wrap items-center gap-1.5">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const active = progressionSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                cyberAudio.playClick();
                setProgressionSubTab(tab.id);
              }}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-hud font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                active
                  ? 'bg-gradient-to-r from-[#ff2a85]/25 to-[#ff7b00]/20 text-[#00f0ff] border-[#ff2a85]/60'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              <span className="text-[11px] font-mono-code tabular-nums opacity-85">
                ({tab.counter})
              </span>
            </button>
          );
        })}
      </div>

      {progressionSubTab === 'missions' && (
        <MissionsView onOpenNewItemModal={() => onOpenNewItemModal('mission')} />
      )}
      {progressionSubTab === 'collectibles' && (
        <CollectiblesView onOpenNewItemModal={() => onOpenNewItemModal('collectible')} />
      )}
      {progressionSubTab === 'objectives' && <ObjectivesView />}
    </div>
  );
};
