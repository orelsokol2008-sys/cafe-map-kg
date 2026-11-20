import React, { useEffect, useState } from 'react';
import {
  Check,
  ChevronDown,
  Lock,
  MapPin,
  Send,
  Star,
  Users,
  Wifi,
  WifiOff,
} from 'lucide-react';
import {
  Cafe,
  CrowdLevel,
  CrowdReportInsert,
  NoiseLevel,
  SeatBucket,
} from '../types';
import { CafePhotoThumb } from './Artwork';

interface ReportScreenProps {
  cafes: Cafe[];
  targetCafeId: string;
  reporterName: string;
  userAccuracy: number;
  onSelectTargetCafe: (cafeId: string) => void;
  onSubmitReport: (payload: CrowdReportInsert) => Promise<void>;
}

const SEAT_PRESETS: { label: SeatBucket; value: number }[] = [
  { label: '0', value: 0 },
  { label: '1–5', value: 3 },
  { label: '6–10', value: 8 },
  { label: '11–20', value: 15 },
  { label: '20+', value: 22 },
];

const NOISE_OPTIONS: { value: NoiseLevel; emoji: string }[] = [
  { value: 'Quiet', emoji: '🤫' },
  { value: 'Moderate', emoji: '🗣️' },
  { value: 'Loud', emoji: '📢' },
];

export const ReportScreen: React.FC<ReportScreenProps> = ({
  cafes,
  targetCafeId,
  reporterName,
  userAccuracy,
  onSelectTargetCafe,
  onSubmitReport,
}) => {
  const targetCafe = cafes.find((c) => c.id === targetCafeId) || cafes[0];

  const [selectedCrowdLevel, setSelectedCrowdLevel] = useState<CrowdLevel>(
    targetCafe.crowdLevel
  );
  const [selectedSeats, setSelectedSeats] = useState<SeatBucket>('6–10');
  const [selectedNoise, setSelectedNoise] = useState<NoiseLevel>('Quiet');
  const [hasWifi, setHasWifi] = useState<boolean>(targetCafe.hasWifi);
  const [anonymous, setAnonymous] = useState(true);
  const [cafePickerOpen, setCafePickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync defaults when target cafe changes (e.g. coming from Detail sheet)
  useEffect(() => {
    setSelectedCrowdLevel(targetCafe.crowdLevel);
    setHasWifi(targetCafe.hasWifi);
  }, [targetCafe.id, targetCafe.crowdLevel, targetCafe.hasWifi]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const seatPreset = SEAT_PRESETS.find((s) => s.label === selectedSeats);
      const freeSeats = seatPreset ? seatPreset.value : 8;
      const finalReporter =
        anonymous || !reporterName.trim() ? 'Anonymous' : reporterName.trim();

      const insertPayload: CrowdReportInsert = {
        cafe_name: targetCafe.name,
        campus_zone: targetCafe.campus,
        crowd_level: selectedCrowdLevel,
        free_seats: freeSeats,
        avg_check_kgs: targetCafe.avgCheckKgs,
        has_wifi: hasWifi,
        reporter_name: finalReporter,
        lat: targetCafe.coords[0],
        lng: targetCafe.coords[1],
      };

      await onSubmitReport(insertPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FAF7F0] px-4 pt-3 pb-6">
      {/* Reporting For Card */}
      <div className="relative bg-white rounded-2xl p-3.5 border border-[#EAE2D6] shadow-[0_2px_10px_rgba(35,23,16,0.04)] flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11.5px] font-medium text-[#736459]">Reporting for:</span>
            <button
              type="button"
              onClick={() => setCafePickerOpen((v) => !v)}
              className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#382418] bg-[#F2ECE1] hover:bg-[#E7DFD1] px-2 py-0.5 rounded-md transition-colors cursor-pointer"
            >
              <span>Change</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <h2 className="mt-0.5 text-[18px] font-extrabold text-[#231710] leading-tight truncate">
            {targetCafe.name}
          </h2>
          <div className="mt-1 flex items-center gap-1 text-[11.5px] text-[#6E5E52] truncate">
            <MapPin className="w-3.5 h-3.5 text-[#736459] shrink-0" />
            <span className="truncate">
              {targetCafe.address} • {targetCafe.walkMinutes} min walk from {targetCafe.campus}
            </span>
          </div>
        </div>

        <CafePhotoThumb
          variant={targetCafe.thumbVariant}
          className="w-[56px] h-[56px] rounded-xl shrink-0"
        />

        {cafePickerOpen && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white rounded-2xl border border-[#EAE2D6] shadow-xl p-2 max-h-56 overflow-y-auto">
            {cafes.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onSelectTargetCafe(c.id);
                  setCafePickerOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-[12.5px] flex items-center justify-between transition-colors cursor-pointer ${
                  c.id === targetCafe.id
                    ? 'bg-[#382418] text-white font-bold'
                    : 'hover:bg-[#FAF7F0] text-[#231710]'
                }`}
              >
                <span className="truncate">{c.name}</span>
                <span className="text-[11px] opacity-75 shrink-0 ml-2">{c.campus}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Social Proof Pill */}
      <div className="mt-3 flex justify-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EFE9DF] text-[#382418] text-[11.5px] font-semibold">
          <Users className="w-3.5 h-3.5" strokeWidth={2.2} />
          <span>47 students reported today — join them</span>
        </div>
      </div>

      {/* Section Prompt */}
      <div className="mt-4">
        <h3 className="text-[18px] font-extrabold text-[#231710] tracking-[-0.015em]">
          How busy is it right now?
        </h3>
        <p className="mt-0.5 text-[12.5px] text-[#6E5E52]">
          Your report helps 1,200+ students choose where to go
        </p>
      </div>

      {/* Crowd Level Radio Cards */}
      <div className="mt-3 flex flex-col gap-2.5">
        {(
          [
            {
              level: 'free' as CrowdLevel,
              label: 'FREE',
              pillBg: 'bg-[#098C44] text-white',
              stripe: '#098C44',
              border: 'ring-2 ring-[#098C44]',
              desc: 'Plenty of seats — come on in!',
            },
            {
              level: 'busy' as CrowdLevel,
              label: 'BUSY',
              pillBg: 'bg-[#FAD79B] text-[#8E5300]',
              stripe: '#F39C12',
              border: 'ring-2 ring-[#F39C12]',
              desc: 'Some seats left — it may be a wait.',
            },
            {
              level: 'full' as CrowdLevel,
              label: 'FULL',
              pillBg: 'bg-[#D62828] text-white',
              stripe: '#D62828',
              border: 'ring-2 ring-[#D62828]',
              desc: 'No seats — try another cafe nearby.',
            },
          ] as const
        ).map((item) => {
          const isSelected = selectedCrowdLevel === item.level;
          return (
            <button
              key={item.level}
              type="button"
              onClick={() => setSelectedCrowdLevel(item.level)}
              className={`relative w-full text-left bg-white rounded-2xl overflow-hidden pl-4 pr-3.5 py-3 transition-all cursor-pointer ${
                isSelected
                  ? `${item.border} shadow-[0_6px_16px_rgba(35,23,16,0.07)]`
                  : 'border border-[#EAE2D6] shadow-[0_2px_8px_rgba(35,23,16,0.03)] hover:border-[#C9BCAF]'
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 bottom-0 w-[5px]"
                style={{ backgroundColor: item.stripe }}
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide ${item.pillBg}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-85" />
                    {item.label}
                  </span>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#098C44]">
                      <Check className="w-3.5 h-3.5" strokeWidth={2.8} />
                      Selected
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#098C44] text-white text-[10px] font-bold">
                  <Star className="w-2.5 h-2.5" fill="currentColor" />
                  +10 pts
                </span>
              </div>

              <div className="mt-1.5 text-[12.5px] text-[#5A473A] font-medium">
                {item.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Seat Count, Noise & WiFi Card */}
      <div className="mt-3.5 bg-white rounded-2xl p-3.5 border border-[#EAE2D6] shadow-[0_2px_8px_rgba(35,23,16,0.04)]">
        <div className="text-[13px] font-bold text-[#231710]">Approximate free seats?</div>
        <div className="mt-2.5 grid grid-cols-5 gap-1.5">
          {SEAT_PRESETS.map(({ label }) => {
            const active = selectedSeats === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setSelectedSeats(label)}
                className={`h-9 rounded-xl text-[12px] font-bold transition-colors tabular-nums cursor-pointer ${
                  active
                    ? 'bg-[#382418] text-white'
                    : 'bg-[#F4EFE6] text-[#4D3A2D] hover:bg-[#EAE2D6]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="my-3.5 border-t border-[#F1ECE2]" />

        <div className="flex items-center justify-between">
          <div className="text-[13px] font-bold text-[#231710]">Noise level?</div>
          <button
            type="button"
            onClick={() => setHasWifi((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
              hasWifi
                ? 'bg-[#DCF5E7] text-[#098C44]'
                : 'bg-[#F4EFE6] text-[#736459]'
            }`}
          >
            {hasWifi ? (
              <>
                <Wifi className="w-3 h-3" strokeWidth={2.4} />
                <span>WiFi working</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" strokeWidth={2.2} />
                <span>No WiFi</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {NOISE_OPTIONS.map(({ value, emoji }) => {
            const active = selectedNoise === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedNoise(value)}
                className={`h-9 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#382418] text-white'
                    : 'bg-[#F4EFE6] text-[#4D3A2D] hover:bg-[#EAE2D6]'
                }`}
              >
                <span>{emoji}</span>
                <span>{value}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Anonymously Toggle Card */}
      <div className="mt-3 bg-white rounded-2xl p-3.5 border border-[#EAE2D6] shadow-[0_2px_8px_rgba(35,23,16,0.04)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#F4EFE6] flex items-center justify-center text-[#736459] shrink-0">
            <Lock className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="text-[13.5px] font-bold text-[#231710]">Report anonymously</div>
            <div className="text-[11px] text-[#736459] truncate">
              {anonymous
                ? 'Your student handle stays hidden'
                : `Reporting as ${reporterName.trim() || 'Student'}`}
            </div>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={anonymous}
          aria-label="Toggle anonymous reporting"
          onClick={() => setAnonymous((v) => !v)}
          className={`w-12 h-7 rounded-full p-1 transition-colors shrink-0 cursor-pointer ${
            anonymous ? 'bg-[#382418]' : 'bg-[#D5CCC0]'
          }`}
        >
          <span
            className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
              anonymous ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Top Reporter Pill */}
      <div className="mt-3.5 flex justify-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#098C44] text-white text-[11.5px] font-bold tabular-nums">
          <Star className="w-3.5 h-3.5" strokeWidth={2.2} />
          <span>Your accuracy: {userAccuracy}% — Top Reporter</span>
        </div>
      </div>

      {/* Submit Report Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-3 w-full h-[50px] rounded-2xl bg-[#382418] hover:bg-[#2A1A11] active:scale-[0.985] disabled:opacity-70 text-white text-[14.5px] font-bold flex items-center justify-center gap-2 shadow-[0_8px_18px_rgba(56,36,24,0.2)] transition-all cursor-pointer"
      >
        <Send className="w-4 h-4" strokeWidth={2.2} />
        <span>{isSubmitting ? 'Submitting Report...' : 'Submit Report'}</span>
      </button>

      <p className="mt-2.5 text-center text-[11px] text-[#736459]">
        Reports are verified by the community for accuracy.
      </p>
    </div>
  );
};
