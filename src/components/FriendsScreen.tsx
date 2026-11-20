import React, { useState } from 'react';
import {
  CalendarPlus,
  Check,
  Footprints,
  Lightbulb,
  Plus,
  Send,
  UserPlus,
  X,
  Zap,
} from 'lucide-react';
import { formatRelativeTime, slugifyCafeName } from '../data/mockData';
import {
  ActiveMeetup,
  Cafe,
  CampusId,
  CrowdReportRow,
  FriendItem,
} from '../types';
import { StudentAvatar } from './Artwork';

interface FriendsScreenProps {
  selectedCampus: CampusId;
  cafes: Cafe[];
  crowdReports: CrowdReportRow[];
  friends: FriendItem[];
  meetups: ActiveMeetup[];
  onToggleJoinMeetup: (meetupId: string) => void;
  onToggleJoinFriend: (friendId: string) => void;
  onCreateMeetup: (payload: { title: string; cafeId: string; timeLabel: string }) => void;
  onAddFriend: (name: string, campus: CampusId) => void;
  onOpenCafeDetail: (cafeId: string) => void;
}

export const FriendsScreen: React.FC<FriendsScreenProps> = ({
  selectedCampus,
  cafes,
  crowdReports,
  friends,
  meetups,
  onToggleJoinMeetup,
  onToggleJoinFriend,
  onCreateMeetup,
  onAddFriend,
  onOpenCafeDetail,
}) => {
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [newMeetupTitle, setNewMeetupTitle] = useState('Study Session');
  const [newMeetupCafeId, setNewMeetupCafeId] = useState('meridian');
  const [newMeetupTime, setNewMeetupTime] = useState('Today 17:00');
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendCampus, setNewFriendCampus] = useState<CampusId>(selectedCampus);

  const recommendedCafe =
    cafes.find((c) => c.id === 'meridian') ||
    cafes.find((c) => c.status === 'FREE') ||
    cafes[0];

  // Live activity from latest non-anonymous crowd_reports row (or latest row)
  const liveAlertReport =
    crowdReports.find((r) => r.reporter_name && r.reporter_name !== 'Anonymous') ||
    crowdReports[0];
  const liveAlertCafe = liveAlertReport
    ? cafes.find((c) => c.name === liveAlertReport.cafe_name)
    : null;

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetupTitle.trim()) return;
    onCreateMeetup({
      title: newMeetupTitle.trim(),
      cafeId: newMeetupCafeId,
      timeLabel: newMeetupTime.trim() || 'Today 17:00',
    });
    setPlanModalOpen(false);
  };

  const handleAddFriendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;
    onAddFriend(newFriendName.trim(), newFriendCampus);
    setNewFriendName('');
    setAddFriendOpen(false);
  };

  return (
    <div className="relative flex-1 overflow-y-auto no-scrollbar bg-[#FAF7F0] px-4 pt-3.5 pb-20">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-[20px] font-extrabold text-[#231710] tracking-[-0.02em] leading-tight">
            Your People
          </h2>
          <p className="text-[12px] text-[#6E5E52] mt-0.5 tabular-nums">
            {friends.length + 1} friends active today in Bishkek
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddFriendOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFE9DF] hover:bg-[#E4DCCF] text-[#231710] text-[12px] font-bold transition-colors shrink-0 cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" strokeWidth={2.2} />
          <span>Add Friends</span>
        </button>
      </div>

      {/* ACTIVE MEETUPS Card */}
      <div className="mt-3.5 flex flex-col gap-2.5">
        {meetups.map((meetup) => {
          const liveCafe = cafes.find((c) => c.id === meetup.cafeId);
          const liveStatus = liveCafe ? liveCafe.status : meetup.status;
          return (
            <div
              key={meetup.id}
              className="bg-white rounded-2xl p-3.5 border border-[#EAE2D6] shadow-[0_2px_10px_rgba(35,23,16,0.04)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold tracking-[0.06em] uppercase text-[#7A6B60]">
                  ACTIVE MEETUPS
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#098C44]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#098C44]" />
                  Happening now
                </span>
              </div>

              <div className="mt-2.5 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex -space-x-2.5 shrink-0">
                    <div className="w-8 h-8 rounded-full ring-2 ring-white overflow-hidden">
                      <StudentAvatar variant="aizat" className="w-full h-full" />
                    </div>
                    <div className="w-8 h-8 rounded-full ring-2 ring-white overflow-hidden">
                      <StudentAvatar variant="arsen" className="w-full h-full" />
                    </div>
                    <div className="w-8 h-8 rounded-full ring-2 ring-white overflow-hidden">
                      <StudentAvatar variant="kamila" className="w-full h-full" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-extrabold text-[#231710] truncate">
                        {meetup.title}
                      </span>
                      <span
                        className={`px-1.5 py-[1px] rounded-md text-[9.5px] font-extrabold tracking-wide ${
                          liveStatus === 'FREE'
                            ? 'bg-[#DCF5E7] text-[#098C44]'
                            : liveStatus === 'BUSY'
                            ? 'bg-[#FBE6C2] text-[#8E5300]'
                            : 'bg-[#FADBD8] text-[#B02020]'
                        }`}
                      >
                        {liveStatus}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenCafeDetail(meetup.cafeId)}
                      className="text-[11.5px] text-[#6E5E52] hover:text-[#231710] truncate block text-left cursor-pointer"
                    >
                      {meetup.cafeName} • {meetup.timeLabel}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleJoinMeetup(meetup.id)}
                  className={`px-3.5 h-8 rounded-xl text-[12px] font-bold transition-colors shrink-0 cursor-pointer ${
                    meetup.joined
                      ? 'bg-[#098C44] text-white'
                      : 'bg-[#382418] hover:bg-[#2A1A11] text-white'
                  }`}
                >
                  {meetup.joined ? 'Joined ✓' : 'Join'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live crowd_reports Activity Alert Banner */}
      {liveAlertReport && (
        <div className="relative mt-3 bg-white rounded-2xl overflow-hidden border border-[#EAE2D6] shadow-[0_2px_8px_rgba(35,23,16,0.03)] pl-4 pr-3.5 py-2.5 flex items-center justify-between gap-2">
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#F39C12]"
          />
          <div className="flex items-center gap-1.5 min-w-0 text-[12px] text-[#231710]">
            <Zap className="w-3.5 h-3.5 text-[#F39C12] shrink-0" fill="#F39C12" />
            <span className="truncate">
              <strong className="font-bold">{liveAlertReport.reporter_name}</strong> reported{' '}
              {liveAlertReport.cafe_name} ({formatRelativeTime(liveAlertReport.created_at)}) —
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              onOpenCafeDetail(
                liveAlertCafe ? liveAlertCafe.id : slugifyCafeName(liveAlertReport.cafe_name)
              )
            }
            className="text-[12px] font-extrabold text-[#231710] hover:underline shrink-0 cursor-pointer"
          >
            View →
          </button>
        </div>
      )}

      {/* FRIENDS NEARBY Section */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[10.5px] font-bold tracking-[0.06em] uppercase text-[#7A6B60]">
          FRIENDS NEARBY
        </span>
        <span className="text-[11px] text-[#7A6B60]">Auto-updated glance</span>
      </div>

      <div className="mt-2.5 flex flex-col gap-2.5">
        {friends.map((friend) => {
          const matchedCafe = cafes.find(
            (c) => c.id === friend.cafeId || c.name === friend.cafeName
          );
          const liveStatus = matchedCafe ? matchedCafe.status : friend.status;
          const isFree = liveStatus === 'FREE';
          const isDinaraHighlight = Boolean(friend.justArrived);

          return (
            <div
              key={friend.id}
              className="bg-white rounded-2xl p-3 border border-[#EAE2D6] shadow-[0_2px_8px_rgba(35,23,16,0.04)] flex items-center justify-between gap-2.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-11 h-11 shrink-0">
                  <div className="w-11 h-11 rounded-full overflow-hidden ring-1 ring-[#EAE2D6]">
                    <StudentAvatar variant={friend.avatarId} className="w-full h-full" />
                  </div>
                  <span
                    className={`absolute -bottom-1 -right-1 px-1.5 py-[1px] rounded-full text-[8.5px] font-extrabold tracking-tight border border-white ${
                      friend.campus === 'KNU'
                        ? 'bg-[#382418] text-white'
                        : friend.campus === 'KRSU'
                        ? 'bg-[#EAE2D6] text-[#382418]'
                        : 'bg-[#2E1D12] text-white'
                    }`}
                  >
                    {friend.campus}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-extrabold text-[#231710] truncate">
                      {friend.name}
                    </span>
                    <span
                      className={`px-2 py-[1px] rounded-full text-[9.5px] font-extrabold tracking-wide ${
                        isFree
                          ? 'bg-[#098C44] text-white'
                          : liveStatus === 'BUSY'
                          ? 'bg-[#FBE6C2] text-[#8E5300]'
                          : 'bg-[#D62828] text-white'
                      }`}
                    >
                      {liveStatus}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenCafeDetail(matchedCafe ? matchedCafe.id : friend.cafeId)}
                    className="mt-0.5 text-[11.5px] text-[#5A473A] hover:underline truncate block text-left cursor-pointer"
                  >
                    At: {friend.cafeName}
                    {!isDinaraHighlight && (
                      <span className="text-[#847569]"> • {friend.checkedInAgo}</span>
                    )}
                  </button>

                  {isDinaraHighlight && (
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-[#098C44]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#098C44]" />
                      <span>{friend.checkedInAgo}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleJoinFriend(friend.id)}
                className={`h-8 px-3.5 rounded-xl text-[12px] font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer ${
                  friend.joined
                    ? 'bg-[#382418] text-white'
                    : isDinaraHighlight
                    ? 'bg-[#098C44] hover:bg-[#077639] text-white shadow-sm'
                    : 'bg-[#F3EDE3] hover:bg-[#E7DFD1] text-[#231710]'
                }`}
              >
                {friend.joined ? (
                  <>
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span>Joined</span>
                  </>
                ) : (
                  <>
                    {isDinaraHighlight && <Send className="w-3 h-3" />}
                    <span>Join</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* BEST SPOT FOR YOUR GROUP Dark Card */}
      {recommendedCafe && (
        <div className="mt-4 bg-[#382418] rounded-2xl p-4 text-white shadow-[0_8px_22px_rgba(56,36,24,0.22)]">
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-[0.06em] uppercase text-[#E2C29E]">
            <Lightbulb className="w-3.5 h-3.5 text-[#F4B459]" />
            <span>BEST SPOT FOR YOUR GROUP</span>
          </div>

          <h3 className="mt-1.5 text-[20px] font-extrabold leading-tight">
            {recommendedCafe.name === 'Meridian' ? 'Meridian Cafe' : recommendedCafe.name}
          </h3>

          <div className="mt-1.5 flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-md bg-[#098C44] text-white text-[10px] font-extrabold tracking-wide">
              CURRENTLY {recommendedCafe.status}
            </span>
            <span className="inline-flex items-center gap-1 text-[11.5px] text-[#DED3C8]">
              <Footprints className="w-3.5 h-3.5" />
              {recommendedCafe.walkMinutes} min walk from {recommendedCafe.campus}
            </span>
          </div>

          <p className="mt-2.5 text-[12px] leading-relaxed text-[#E7DDD2]">
            Equal midpoint for you, Arsen &amp; Dinara. {recommendedCafe.freeSeats} seats reported
            open.
          </p>

          <button
            type="button"
            onClick={() => {
              setNewMeetupCafeId(recommendedCafe.id);
              setNewMeetupTitle('Group Study Meetup');
              setPlanModalOpen(true);
            }}
            className="mt-3.5 w-full h-[44px] rounded-xl bg-white hover:bg-[#FAF7F0] active:scale-[0.985] text-[#231710] text-[13.5px] font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4" strokeWidth={2.2} />
            <span>Plan Meetup Here</span>
          </button>
        </div>
      )}

      {/* Floating Create Meetup FAB */}
      <div className="fixed bottom-[76px] right-4 sm:absolute sm:bottom-4 sm:right-4 z-30 flex flex-col items-end gap-1">
        <span className="px-2 py-0.5 rounded-full bg-white text-[#231710] text-[10px] font-bold shadow border border-[#EAE2D6]">
          Create Meetup
        </span>
        <button
          type="button"
          onClick={() => setPlanModalOpen(true)}
          aria-label="Create Meetup"
          className="w-12 h-12 rounded-full bg-[#382418] hover:bg-[#2A1A11] text-white shadow-[0_6px_18px_rgba(35,23,16,0.3)] flex items-center justify-center active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-6 h-6" strokeWidth={2.5} />
        </button>
      </div>

      {/* Plan Meetup Modal */}
      {planModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex items-end justify-center p-3">
          <form
            onSubmit={handlePlanSubmit}
            className="w-full bg-[#FAF7F0] rounded-3xl p-4 border border-[#EAE2D6] shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[16px] font-extrabold text-[#231710]">Plan a Cafe Meetup</h3>
              <button
                type="button"
                onClick={() => setPlanModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#EFE9DF] flex items-center justify-center text-[#382418] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <label className="block text-[11.5px] font-bold text-[#5A473A]">Meetup Name</label>
            <input
              type="text"
              value={newMeetupTitle}
              onChange={(e) => setNewMeetupTitle(e.target.value)}
              className="mt-1 w-full h-10 px-3 rounded-xl bg-white border border-[#EAE2D6] text-[13px] text-[#231710] focus:outline-none focus:ring-2 focus:ring-[#382418]"
              placeholder="e.g., Econ Exam Prep"
            />

            <label className="block mt-2.5 text-[11.5px] font-bold text-[#5A473A]">Cafe</label>
            <select
              value={newMeetupCafeId}
              onChange={(e) => setNewMeetupCafeId(e.target.value)}
              className="mt-1 w-full h-10 px-3 rounded-xl bg-white border border-[#EAE2D6] text-[13px] text-[#231710] focus:outline-none"
            >
              {cafes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.status} • {c.campus})
                </option>
              ))}
            </select>

            <label className="block mt-2.5 text-[11.5px] font-bold text-[#5A473A]">Time</label>
            <input
              type="text"
              value={newMeetupTime}
              onChange={(e) => setNewMeetupTime(e.target.value)}
              className="mt-1 w-full h-10 px-3 rounded-xl bg-white border border-[#EAE2D6] text-[13px] text-[#231710] focus:outline-none"
              placeholder="Today 17:00"
            />

            <button
              type="submit"
              className="mt-4 w-full h-11 rounded-xl bg-[#382418] text-white text-[13.5px] font-bold cursor-pointer"
            >
              Post Meetup to Friends
            </button>
          </form>
        </div>
      )}

      {/* Add Friend Modal */}
      {addFriendOpen && (
        <div className="absolute inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex items-end justify-center p-3">
          <form
            onSubmit={handleAddFriendSubmit}
            className="w-full bg-[#FAF7F0] rounded-3xl p-4 border border-[#EAE2D6] shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[16px] font-extrabold text-[#231710]">Add Student Friend</h3>
              <button
                type="button"
                onClick={() => setAddFriendOpen(false)}
                className="w-7 h-7 rounded-full bg-[#EFE9DF] flex items-center justify-center text-[#382418] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <label className="block text-[11.5px] font-bold text-[#5A473A]">Friend Name</label>
            <input
              type="text"
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              placeholder="e.g., Timur S."
              className="mt-1 w-full h-10 px-3 rounded-xl bg-white border border-[#EAE2D6] text-[13px] text-[#231710] focus:outline-none focus:ring-2 focus:ring-[#382418]"
            />

            <label className="block mt-2.5 text-[11.5px] font-bold text-[#5A473A]">Campus</label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {(['KNU', 'KRSU', 'AUCA'] as CampusId[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewFriendCampus(c)}
                  className={`h-9 rounded-xl text-[12px] font-bold cursor-pointer ${
                    newFriendCampus === c
                      ? 'bg-[#382418] text-white'
                      : 'bg-white border border-[#EAE2D6] text-[#382418]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="mt-4 w-full h-11 rounded-xl bg-[#382418] text-white text-[13.5px] font-bold cursor-pointer"
            >
              Add to Your People
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
