import React from 'react';
import { Coffee, Search, User } from 'lucide-react';
import { TabId } from '../types';
import { StudentAvatar } from './Artwork';

interface TopBarProps {
  title: string;
  activeTab: TabId;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  showAvatarVariant?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  activeTab,
  onOpenSearch,
  onOpenProfile,
  showAvatarVariant,
}) => {
  const usePhotoAvatar = showAvatarVariant ?? (activeTab === 'friends' || activeTab === 'profile');

  return (
    <header className="shrink-0 h-[54px] px-4 bg-[#FAF7F0] border-b border-[#EAE2D6] flex items-center justify-between z-30">
      <div className="flex items-center gap-2">
        <Coffee className="w-[19px] h-[19px] text-[#2E1D12]" strokeWidth={2.2} />
        <h1 className="text-[18px] font-bold tracking-[-0.02em] text-[#231710]">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search cafes"
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#382418] hover:bg-[#EFE9DF] active:scale-95 transition-all cursor-pointer"
        >
          <Search className="w-[19px] h-[19px]" strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={onOpenProfile}
          aria-label="Open profile"
          className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden active:scale-95 transition-transform cursor-pointer"
        >
          {usePhotoAvatar ? (
            <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#382418]/15">
              <StudentAvatar
                variant={activeTab === 'friends' ? 'arsen' : 'user'}
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#382418] flex items-center justify-center text-white">
              <User className="w-4 h-4" strokeWidth={2.2} />
            </div>
          )}
        </button>
      </div>
    </header>
  );
};
