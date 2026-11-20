import React from 'react';
import { Flag, MapPin, User, Users } from 'lucide-react';
import { TabId } from '../types';

interface BottomNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; Icon: React.FC<{ className?: string; strokeWidth?: number }> }[] = [
  { id: 'map', label: 'Map', Icon: MapPin },
  { id: 'report', label: 'Report', Icon: Flag },
  { id: 'friends', label: 'Friends', Icon: Users },
  { id: 'profile', label: 'Profile', Icon: User },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav
      aria-label="Primary navigation"
      className="shrink-0 h-[62px] bg-white border-t border-[#EAE2D6] grid grid-cols-4 items-center px-2 z-40"
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelectTab(id)}
            aria-current={isActive ? 'page' : undefined}
            className={`min-h-[46px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors cursor-pointer ${
              isActive
                ? 'text-[#2E1D12]'
                : 'text-[#847569] hover:text-[#4D3A2D]'
            }`}
          >
            <Icon
              className={`w-[20px] h-[20px] transition-transform ${isActive ? 'scale-105' : ''}`}
              strokeWidth={isActive ? 2.4 : 1.9}
            />
            <span
              className={`text-[10.5px] leading-tight whitespace-nowrap ${
                isActive ? 'font-bold text-[#2E1D12]' : 'font-medium text-[#847569]'
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
