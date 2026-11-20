import React, { useState } from 'react';
import {
  BarChart3,
  Check,
  CheckCircle2,
  Coffee,
  Lock,
  Settings,
  Share2,
  Target,
  Trophy,
  X,
} from 'lucide-react';
import { CAMPUSES } from '../data/mockData';
import { CampusId, CrowdReportRow, UserStats } from '../types';
import { StudentAvatar } from './Artwork';

interface ProfileScreenProps {
  user: UserStats;
  crowdReports: CrowdReportRow[];
  onChangeCampus: (campus: CampusId) => void;
  onReplayOnboarding: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  crowdReports,
  onChangeCampus,
  onReplayOnboarding,
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);

  const liveCampusReportsCount = crowdReports.filter(
    (r) => r.campus_zone === user.campus
  ).length;

  const nextLevelTarget = 1500;
  const pointsToGo = Math.max(0, nextLevelTarget - user.xp);
  const progressPct = Math.min(100, Math.round((user.xp / nextLevelTarget) * 100));

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressPct / 100);

  const handleShareInvite = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText('https://cafemap.kg/invite/aizat-knu');
      }
    } catch {
      // Clipboard may be restricted in iframe
    }
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2600);
  };

  return (
    <div className="relative flex-1 overflow-y-auto no-scrollbar bg-[#FAF7F0] px-4 pt-3.5 pb-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-extrabold text-[#231710] tracking-[-0.02em]">
          My Profile
        </h2>
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Campus settings"
          className="w-9 h-9 rounded-full hover:bg-[#EFE9DF] flex items-center justify-center text-[#5A473A] transition-colors cursor-pointer"
        >
          <Settings className="w-[19px] h-[19px]" strokeWidth={2} />
        </button>
      </div>

      {/* Avatar & Name */}
      <div className="mt-2 flex flex-col items-center text-center">
        <div className="relative">
          <div className="w-[84px] h-[84px] rounded-full overflow-hidden ring-2 ring-[#382418]/15 shadow-sm">
            <StudentAvatar variant="user" className="w-full h-full" />
          </div>
          <span className="absolute -bottom-1 right-0 px-2 py-[2px] rounded-full bg-[#382418] text-white text-[10px] font-extrabold tracking-wide border-2 border-[#FAF7F0]">
            {user.campus}
          </span>
        </div>

        <h3 className="mt-3 text-[20px] font-extrabold text-[#231710] leading-tight">
          {user.name}
        </h3>
        <p className="mt-0.5 text-[12px] text-[#736459]">
          Reporter since {user.since} • {liveCampusReportsCount} live {user.campus} reports
        </p>
      </div>

      {/* Reporter XP Ring Card */}
      <div className="mt-4 bg-white rounded-2xl p-4 border border-[#EAE2D6] shadow-[0_2px_10px_rgba(35,23,16,0.04)] flex flex-col items-center">
        <div className="relative w-[124px] h-[124px] flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#EAE2D6"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#382418"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[26px] font-extrabold text-[#231710] leading-none tabular-nums">
              {user.xp.toLocaleString()}
            </span>
            <span className="mt-1 text-[9.5px] font-bold tracking-[0.06em] uppercase text-[#736459]">
              REPORTER XP
            </span>
          </div>
        </div>

        <div className="mt-3 text-[13.5px] font-bold text-[#231710]">
          Level 4 Scout <span className="text-[#736459] font-normal">→</span> Level 5 Ranger
        </div>

        <div className="mt-2.5 w-full h-1.5 rounded-full bg-[#EAE2D6] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#382418] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="w-full mt-1.5 text-right text-[11px] font-medium text-[#736459] tabular-nums">
          {pointsToGo} pts to go
        </div>
      </div>

      {/* ACHIEVEMENTS Section */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[10.5px] font-bold tracking-[0.06em] uppercase text-[#7A6B60]">
          ACHIEVEMENTS
        </span>
        <span className="text-[11px] text-[#7A6B60] tabular-nums">3 of 8 unlocked</span>
      </div>

      <div className="mt-2.5 grid grid-cols-4 gap-2">
        <div className="bg-[#FDF4EB] border border-[#F5E1CE] rounded-2xl py-2.5 px-1.5 flex flex-col items-center text-center">
          <Coffee className="w-5 h-5 text-[#382418]" strokeWidth={2} />
          <span className="mt-1.5 text-[10.5px] font-bold text-[#231710] leading-tight">
            Early Bird
          </span>
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E58D07]" />
        </div>

        <div className="relative bg-[#DCFBE8] border border-[#B2ECC9] rounded-2xl py-2.5 px-1.5 flex flex-col items-center text-center">
          <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-white text-[#098C44] flex items-center justify-center border border-[#098C44]">
            <Check className="w-2.5 h-2.5" strokeWidth={3} />
          </span>
          <Target className="w-5 h-5 text-[#098C44]" strokeWidth={2.2} />
          <span className="mt-1.5 text-[10.5px] font-bold text-[#231710] leading-tight">
            Accuracy King
          </span>
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#098C44]" />
        </div>

        <div className="bg-[#FDF4F0] border border-[#F2E0D8] rounded-2xl py-2.5 px-1.5 flex flex-col items-center text-center">
          <BarChart3 className="w-5 h-5 text-[#231710]" strokeWidth={2.2} />
          <span className="mt-1.5 text-[10.5px] font-bold text-[#231710] leading-tight">
            100 Reports
          </span>
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#382418]" />
        </div>

        <div className="relative bg-[#EDE7DD] border border-[#DFD7CB] rounded-2xl py-2.5 px-1.5 flex flex-col items-center text-center opacity-75">
          <Trophy className="w-5 h-5 text-[#736459]" strokeWidth={2} />
          <Lock className="w-3.5 h-3.5 text-[#8A7B6E] absolute top-6 left-1/2 -translate-x-1/2" />
          <span className="mt-1.5 text-[10.5px] font-bold text-[#736459] leading-tight">
            Campus Legend
          </span>
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#B7ACA0]" />
        </div>
      </div>

      {/* 2x2 Stats Grid Card */}
      <div className="mt-4 bg-white rounded-2xl p-3 border border-[#EAE2D6] shadow-[0_2px_10px_rgba(35,23,16,0.04)] grid grid-cols-2 gap-2.5">
        <div className="bg-[#FAF7F0] rounded-xl p-3">
          <div className="text-[22px] font-extrabold text-[#231710] leading-none tabular-nums">
            {user.totalReports}
          </div>
          <div className="mt-1 text-[11px] font-medium text-[#736459]">Total Reports</div>
        </div>

        <div className="bg-[#FAF7F0] rounded-xl p-3">
          <div className="text-[22px] font-extrabold text-[#098C44] leading-none tabular-nums">
            {user.accuracyRate}%
          </div>
          <div className="mt-1 text-[11px] font-medium text-[#736459]">Accuracy Rate</div>
        </div>

        <div className="bg-[#FAF7F0] rounded-xl p-3">
          <div className="text-[22px] font-extrabold text-[#231710] leading-none tabular-nums flex items-center gap-1">
            <span>{user.dayStreak}</span>
            <span className="text-[14px]">♨️</span>
          </div>
          <div className="mt-1 text-[11px] font-medium text-[#736459]">Day Streak</div>
        </div>

        <div className="bg-[#FAF7F0] rounded-xl p-3">
          <div className="text-[22px] font-extrabold text-[#231710] leading-none tabular-nums">
            {user.cafesFound}
          </div>
          <div className="mt-1 text-[11px] font-medium text-[#736459]">Cafes Found</div>
        </div>
      </div>

      {/* YOUR PRIVACY & SAFETY Card */}
      <div className="mt-4 bg-white rounded-2xl p-3.5 border border-[#EAE2D6] shadow-[0_2px_10px_rgba(35,23,16,0.04)]">
        <div className="text-[10.5px] font-bold tracking-[0.06em] uppercase text-[#7A6B60]">
          YOUR PRIVACY &amp; SAFETY
        </div>

        <div className="mt-2.5 flex flex-col gap-2.5 text-[12px] font-medium text-[#231710]">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#DCF5E7] text-[#098C44] flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" strokeWidth={2.8} />
            </span>
            <span>🔒 Your location is never stored on our servers</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#DCF5E7] text-[#098C44] flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" strokeWidth={2.8} />
            </span>
            <span>🔋 Uses less than 1% battery per hour</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#DCF5E7] text-[#098C44] flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" strokeWidth={2.8} />
            </span>
            <span>📶 Works on 3G — no heavy data usage</span>
          </div>
        </div>
      </div>

      {/* Invite Friend Dark Banner */}
      <div className="mt-4 bg-[#382418] rounded-2xl p-4 text-white shadow-[0_8px_22px_rgba(56,36,24,0.22)]">
        <div className="text-[14.5px] font-extrabold leading-snug">
          🎁 Invite a friend to Cafe Map KG
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-[#DED3C8]">
          You both get +50 bonus Reporter Points when they sign up and verify their university
          student status.
        </p>

        <button
          type="button"
          onClick={handleShareInvite}
          className="mt-3.5 w-full h-[42px] rounded-xl bg-[#27180F] hover:bg-[#1E120B] border border-white/10 text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          {inviteCopied ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
              <span>Invite Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Share Invite Link</span>
            </>
          )}
        </button>
      </div>

      {/* Campus & Preferences Settings Modal */}
      {settingsOpen && (
        <div className="absolute inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex items-end justify-center p-3">
          <div className="w-full bg-[#FAF7F0] rounded-3xl p-4 border border-[#EAE2D6] shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[16px] font-extrabold text-[#231710]">Campus &amp; Preferences</h3>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="w-7 h-7 rounded-full bg-[#EFE9DF] flex items-center justify-center text-[#382418] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[12px] font-bold text-[#5A473A] mb-2">Home University Campus</div>
            <div className="flex flex-col gap-2">
              {(['KNU', 'KRSU', 'AUCA'] as CampusId[]).map((id) => {
                const c = CAMPUSES[id];
                const active = user.campus === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      onChangeCampus(id);
                      setSettingsOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl border flex items-center justify-between cursor-pointer ${
                      active
                        ? 'bg-[#382418] text-white border-[#382418]'
                        : 'bg-white text-[#231710] border-[#EAE2D6]'
                    }`}
                  >
                    <div>
                      <div className="text-[13.5px] font-bold">{c.shortName}</div>
                      <div className={`text-[11px] ${active ? 'text-white/80' : 'text-[#736459]'}`}>
                        {c.fullName}
                      </div>
                    </div>
                    {active && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                setSettingsOpen(false);
                onReplayOnboarding();
              }}
              className="mt-3.5 w-full h-10 rounded-xl bg-[#EFE9DF] hover:bg-[#E4DCCF] text-[#382418] text-[12.5px] font-bold cursor-pointer"
            >
              View Onboarding Screen Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
