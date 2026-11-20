import React from 'react';
import { ArrowRight, Check, User, Users } from 'lucide-react';
import { CAMPUSES } from '../data/mockData';
import { CampusId } from '../types';
import { OnboardingEmblem } from './Artwork';

interface OnboardingScreenProps {
  selectedCampus: CampusId;
  reporterName: string;
  onSelectCampus: (campus: CampusId) => void;
  onChangeReporterName: (name: string) => void;
  onComplete: () => void;
}

const CAMPUS_ORDER: CampusId[] = ['KNU', 'KRSU', 'AUCA'];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  selectedCampus,
  reporterName,
  onSelectCampus,
  onChangeReporterName,
  onComplete,
}) => {
  const currentCampus = CAMPUSES[selectedCampus];

  return (
    <div className="h-full w-full bg-[#FAF7F0] flex flex-col justify-between px-5 pt-4 pb-5 overflow-y-auto no-scrollbar">
      {/* Top Progress Dots + Quick Skip */}
      <div className="relative flex items-center justify-center pt-1 pb-1">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="w-2 h-2 rounded-full bg-[#D5CCC0]" />
          <span className="w-2 h-2 rounded-full bg-[#D5CCC0]" />
          <span className="w-6 h-2 rounded-full bg-[#382418]" />
        </div>
        <button
          type="button"
          onClick={onComplete}
          className="absolute right-0 top-0.5 px-2.5 py-1 text-[12px] font-semibold text-[#736459] hover:text-[#2E1D12] rounded-lg hover:bg-[#EFE9DF] transition-colors cursor-pointer"
        >
          Skip →
        </button>
      </div>

      {/* Hero Illustration & Headline */}
      <div className="flex flex-col items-center text-center mt-1">
        <OnboardingEmblem className="w-[78px] h-[78px] mb-3.5" />

        <h1 className="text-[25px] leading-[1.18] font-extrabold tracking-[-0.025em] text-[#231710] max-w-[295px] text-balance">
          Tired of walking to a packed cafe?
        </h1>

        <p className="mt-2 text-[13.5px] leading-[1.45] text-[#6E5E52] max-w-[285px]">
          Pick your campus. We&apos;ll show you what&apos;s free right now.
        </p>

        {/* Social Proof Pill */}
        <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1ECE2] text-[#382418] text-[11.5px] font-semibold">
          <Users className="w-3.5 h-3.5 text-[#382418] shrink-0" strokeWidth={2.2} />
          <span className="tabular-nums">
            {currentCampus.studentCount.toLocaleString()} {currentCampus.shortName} students already use Cafe Map KG
          </span>
        </div>
      </div>

      {/* Campus Cards */}
      <div className="mt-4 flex flex-col gap-2.5">
        {CAMPUS_ORDER.map((id) => {
          const campus = CAMPUSES[id];
          const isSelected = selectedCampus === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectCampus(id)}
              className={`relative w-full text-left bg-white rounded-2xl overflow-hidden pl-5 pr-4 py-3 flex items-center justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'ring-2 ring-[#382418] shadow-[0_6px_18px_rgba(56,36,24,0.08)]'
                  : 'border border-[#EAE2D6] shadow-[0_2px_8px_rgba(45,32,22,0.04)] hover:border-[#C9BCAF]'
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 bottom-0 w-[6px]"
                style={{ backgroundColor: campus.accentColor }}
              />

              <div className="min-w-0 pr-3">
                <div className="text-[15.5px] font-bold text-[#231710] leading-tight">
                  {campus.shortName}
                </div>
                <div className="mt-0.5 text-[11.5px] leading-snug text-[#6E5E52]">
                  {campus.fullName} — {campus.street}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[12px] font-semibold text-[#4D3A2D] whitespace-nowrap tabular-nums">
                  {campus.cafeCount} cafes →
                </span>
                {isSelected && (
                  <span className="w-[22px] h-[22px] rounded-full bg-[#382418] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" strokeWidth={2.8} />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Compact Reporter Name Input + Primary CTA */}
      <div className="mt-4">
        <div className="mb-2.5 flex items-center gap-2 bg-white rounded-xl border border-[#EAE2D6] px-3 h-[40px]">
          <User className="w-3.5 h-3.5 text-[#736459] shrink-0" strokeWidth={2.2} />
          <input
            type="text"
            value={reporterName}
            onChange={(e) => onChangeReporterName(e.target.value)}
            placeholder="Your student handle (optional)"
            aria-label="Reporter name"
            className="flex-1 min-w-0 bg-transparent text-[12.5px] font-medium text-[#231710] placeholder:text-[#9A8B7E] focus:outline-none"
          />
          <span className="text-[10.5px] font-semibold text-[#8A7B6E] shrink-0">
            Handle
          </span>
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="w-full h-[50px] rounded-2xl bg-[#382418] hover:bg-[#2A1A11] active:scale-[0.985] text-white text-[15px] font-bold flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(56,36,24,0.22)] transition-all cursor-pointer"
        >
          <span>Find My Cafes</span>
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
        <p className="mt-2.5 text-center text-[11.5px] text-[#736459]">
          No sign-up needed. Start exploring anonymously.
        </p>
      </div>
    </div>
  );
};
