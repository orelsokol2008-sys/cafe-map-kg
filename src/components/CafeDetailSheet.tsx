import React from 'react';
import {
  Bookmark,
  Clock,
  Navigation,
  Plug,
  User,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import { formatRelativeTime, levelToStatus } from '../data/mockData';
import { Cafe } from '../types';
import { CafePhotoThumb, StudentAvatar } from './Artwork';

interface CafeDetailSheetProps {
  cafe: Cafe;
  isBookmarked: boolean;
  hasCheckedIn: boolean;
  showingDirections: boolean;
  onToggleBookmark: (cafeId: string) => void;
  onCheckIn: (cafe: Cafe) => void;
  onToggleDirections: () => void;
  onGoToReport: (cafe: Cafe) => void;
  onClose: () => void;
}

export const CafeDetailSheet: React.FC<CafeDetailSheetProps> = ({
  cafe,
  isBookmarked,
  hasCheckedIn,
  showingDirections,
  onToggleBookmark,
  onCheckIn,
  onToggleDirections,
  onGoToReport,
  onClose,
}) => {
  const bannerStyles = {
    FREE: {
      bg: 'bg-[#098C44]',
      subtext: 'text-white/90',
    },
    BUSY: {
      bg: 'bg-[#E58D07]',
      subtext: 'text-white/95',
    },
    FULL: {
      bg: 'bg-[#D62828]',
      subtext: 'text-white/90',
    },
  }[cafe.status];

  const barColor =
    cafe.status === 'FREE'
      ? 'bg-[#098C44]'
      : cafe.status === 'BUSY'
      ? 'bg-[#E58D07]'
      : 'bg-[#D62828]';

  return (
    <div className="absolute inset-x-0 bottom-0 top-[29%] z-[500] bg-[#FAF7F0] rounded-t-[26px] shadow-[0_-10px_30px_rgba(35,23,16,0.18)] border-t border-[#EAE2D6] flex flex-col overflow-hidden">
      {/* Grab handle + close button */}
      <div className="relative pt-2.5 pb-1 flex items-center justify-center shrink-0">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close cafe details"
          className="w-10 h-1 rounded-full bg-[#D5CCC0] hover:bg-[#B8ADA0] transition-colors cursor-pointer"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to map"
          className="absolute right-3.5 top-2 w-7 h-7 rounded-full bg-[#EFE9DF] hover:bg-[#E4DCCF] flex items-center justify-center text-[#5A473A] transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" strokeWidth={2.4} />
        </button>
      </div>

      {/* Scrollable Sheet Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-5">
        {/* Cafe Title Row */}
        <div className="flex items-start justify-between gap-3 mt-1">
          <div className="flex items-center gap-3 min-w-0">
            <CafePhotoThumb
              variant={cafe.thumbVariant}
              className="w-[58px] h-[58px] rounded-xl shrink-0 shadow-sm"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-[19px] font-extrabold text-[#231710] leading-tight truncate">
                  {cafe.name}
                </h2>
                <span className="px-1.5 py-[1px] rounded-md bg-[#EFE9DF] text-[#382418] text-[9.5px] font-extrabold tracking-wide shrink-0">
                  {cafe.campus}
                </span>
              </div>
              <p className="text-[12px] text-[#6E5E52] mt-0.5 truncate">
                {cafe.walkMinutes} min walk from {cafe.campus}
              </p>
              <p className="text-[12px] font-medium text-[#5A473A] mt-0.5 tabular-nums">
                💰💰 {cafe.avgCheckKgs} KGS avg check
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleBookmark(cafe.id)}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark cafe'}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
              isBookmarked
                ? 'bg-[#382418] text-white'
                : 'bg-[#F2ECE1] text-[#382418] hover:bg-[#E7DFD1]'
            }`}
          >
            <Bookmark
              className="w-4 h-4"
              strokeWidth={2.1}
              fill={isBookmarked ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        {/* Big Crowd Status Banner */}
        <div
          className={`mt-3.5 rounded-2xl py-4 px-4 text-center text-white shadow-sm ${bannerStyles.bg}`}
        >
          <div className="text-[28px] font-extrabold tracking-wide leading-none">
            {cafe.status}
          </div>
          <div className={`mt-1.5 text-[12.5px] font-medium tabular-nums ${bannerStyles.subtext}`}>
            {cafe.seatEstimate} ({cafe.freeSeats} free seats)
          </div>
        </div>

        {/* Report Accuracy Progress */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="font-semibold text-[#231710]">Report accuracy</span>
            <span className="font-bold text-[#231710] tabular-nums">{cafe.accuracy}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#E6DFD3] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${barColor}`}
              style={{ width: `${cafe.accuracy}%` }}
            />
          </div>
        </div>

        {/* Confirmed Students Avatars + Latest Reporter */}
        <div className="mt-3 flex items-center gap-2.5">
          <div className="flex -space-x-2 shrink-0">
            <div className="w-7 h-7 rounded-full ring-2 ring-[#FAF7F0] overflow-hidden">
              <StudentAvatar variant="dinara" className="w-full h-full" />
            </div>
            <div className="w-7 h-7 rounded-full ring-2 ring-[#FAF7F0] overflow-hidden">
              <StudentAvatar variant="arsen" className="w-full h-full" />
            </div>
            <div className="w-7 h-7 rounded-full ring-2 ring-[#FAF7F0] overflow-hidden">
              <StudentAvatar variant="kamila" className="w-full h-full" />
            </div>
          </div>
          <span className="text-[11.5px] text-[#6E5E52] tabular-nums truncate">
            Latest by <strong className="text-[#231710]">{cafe.reporterName}</strong> •{' '}
            {cafe.confirmedCount} confirmations
          </span>
        </div>

        {/* 3 Utility Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFE9DF] text-[#382418] text-[11px] font-semibold">
            <Clock className="w-3 h-3 text-[#6E5E52]" />
            Updated {cafe.updatedAgo}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFE9DF] text-[#382418] text-[11px] font-semibold">
            {cafe.hasWifi ? (
              <>
                <Wifi className="w-3 h-3 text-[#098C44]" />
                WiFi available
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-[#8A7B6E]" />
                No WiFi
              </>
            )}
          </span>
          {cafe.hasOutlets && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFE9DF] text-[#382418] text-[11px] font-semibold">
              <Plug className="w-3 h-3 text-[#6E5E52]" />
              Outlets
            </span>
          )}
        </div>

        {/* Recent crowd_reports for this cafe */}
        <div className="mt-4">
          <div className="text-[10.5px] font-bold tracking-[0.06em] uppercase text-[#7A6B60]">
            RECENT REPORTS
          </div>
          <div className="mt-2 flex flex-col gap-2">
            {cafe.recentReports.map((rep) => {
              const statusLabel = levelToStatus(rep.crowd_level);
              const badgeColor =
                rep.crowd_level === 'free'
                  ? 'bg-[#DCF5E7] text-[#098C44]'
                  : rep.crowd_level === 'busy'
                  ? 'bg-[#FBE6C2] text-[#8E5300]'
                  : 'bg-[#FADBD8] text-[#B02020]';

              return (
                <div
                  key={rep.id}
                  className="flex items-center justify-between gap-2 text-[11.5px] bg-white rounded-xl px-2.5 py-2 border border-[#EAE2D6]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`px-1.5 py-[1px] rounded text-[9.5px] font-extrabold shrink-0 ${badgeColor}`}
                    >
                      {statusLabel}
                    </span>
                    <span className="text-[#231710] font-semibold tabular-nums truncate">
                      {rep.free_seats} seats • {rep.avg_check_kgs} KGS
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10.5px] text-[#736459] shrink-0 whitespace-nowrap">
                    <User className="w-3 h-3" />
                    <span>{rep.reporter_name}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(rep.created_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Refresh Micro-Copy */}
        <p className="mt-3.5 text-center text-[11.5px] text-[#7A6B60]">
          Still unsure? Reports refresh live via Supabase Realtime.
        </p>

        {/* Actions */}
        <div className="mt-3 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => onCheckIn(cafe)}
            disabled={hasCheckedIn}
            className={`w-full h-[46px] rounded-xl font-bold text-[14px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              hasCheckedIn
                ? 'bg-[#098C44] text-white'
                : 'bg-[#382418] hover:bg-[#2A1A11] active:scale-[0.985] text-white shadow-[0_6px_16px_rgba(56,36,24,0.2)]'
            }`}
          >
            {hasCheckedIn ? (
              <span>Checked In! +10 Points Earned ✓</span>
            ) : (
              <span>Check In Here — Get 10 Points ☆</span>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleDirections}
            className={`w-full h-[44px] rounded-xl font-bold text-[13.5px] flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              showingDirections
                ? 'bg-[#EFE9DF] border-[#382418] text-[#231710]'
                : 'bg-white border-[#382418]/75 text-[#231710] hover:bg-[#F5F0E6]'
            }`}
          >
            <Navigation className="w-4 h-4" strokeWidth={2.2} />
            <span>
              {showingDirections
                ? `Hide Route (${cafe.walkMinutes} min walk)`
                : 'Get Directions'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onGoToReport(cafe)}
            className="mx-auto mt-0.5 py-1 text-[12px] font-semibold text-[#5A473A] hover:text-[#231710] underline underline-offset-4 decoration-[#C8BDB0] cursor-pointer"
          >
            Report crowd level →
          </button>
        </div>
      </div>
    </div>
  );
};
