import React, { useEffect, useMemo, useState } from 'react';
import {
  formatRelativeTime,
  INITIAL_CROWD_REPORTS,
  INITIAL_FRIENDS,
  INITIAL_MEETUPS,
  INITIAL_USER,
  levelToStatus,
  reduceReportsToCafes,
} from './data/mockData';
import { supabase } from './lib/supabase';
import {
  ActiveMeetup,
  Cafe,
  CampusId,
  CrowdReportInsert,
  CrowdReportRow,
  FriendItem,
  TabId,
  UserStats,
} from './types';
import { OnboardingScreen } from './components/OnboardingScreen';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { MapScreen } from './components/MapScreen';
import { ReportScreen } from './components/ReportScreen';
import { FriendsScreen } from './components/FriendsScreen';
import { ProfileScreen } from './components/ProfileScreen';

const TAB_TITLES: Record<TabId, string> = {
  map: 'Map',
  report: 'Report',
  friends: 'Friends',
  profile: 'Profile',
};

const CROWD_REPORT_COLUMNS =
  'id, cafe_name, campus_zone, crowd_level, free_seats, avg_check_kgs, has_wifi, reporter_name, lat, lng, created_at';

export default function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('map');

  // Saved from Onboarding
  const [selectedCampus, setSelectedCampus] = useState<CampusId>('KNU');
  const [campusFilter, setCampusFilter] = useState<CampusId | 'ALL'>('KNU');
  const [reporterName, setReporterName] = useState<string>('Aizat Dzhaksybekov');

  // Live public.crowd_reports rows (with mock fallback when placeholders are unchanged)
  const [crowdReports, setCrowdReports] = useState<CrowdReportRow[]>(INITIAL_CROWD_REPORTS);

  const [selectedCafeId, setSelectedCafeId] = useState<string | null>(null);
  const [reportTargetCafeId, setReportTargetCafeId] = useState<string>('shokoladnitsa');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [checkedInCafeIds, setCheckedInCafeIds] = useState<string[]>([]);

  const [friends, setFriends] = useState<FriendItem[]>(INITIAL_FRIENDS);
  const [meetups, setMeetups] = useState<ActiveMeetup[]>(INITIAL_MEETUPS);
  const [user, setUser] = useState<UserStats>(INITIAL_USER);

  const [searchFocusTrigger, setSearchFocusTrigger] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2600);
  };

  // Derive latest state per cafe_name from crowd_reports ordered desc
  const cafes = useMemo(() => reduceReportsToCafes(crowdReports), [crowdReports]);

  // Live activity banner text from newest crowd_report
  const recentActivityText = useMemo(() => {
    const newest = crowdReports[0];
    if (!newest) return 'Arsen checked in at Shokoladnitsa • 2 min ago';
    const who = newest.reporter_name || 'Anonymous';
    const status = levelToStatus(newest.crowd_level);
    return `${who} reported ${newest.cafe_name} (${status}) • ${formatRelativeTime(
      newest.created_at
    )}`;
  }, [crowdReports]);

  // Fetch initial crowd_reports & subscribe to Supabase Realtime postgres_changes
  useEffect(() => {
    const client = supabase;
    if (!client) return;

    let isMounted = true;

    const loadReports = async () => {
      const { data, error } = await client
        .from('crowd_reports')
        .select(CROWD_REPORT_COLUMNS)
        .order('created_at', { ascending: false });

      if (!isMounted) return;
      if (!error && Array.isArray(data) && data.length > 0) {
        setCrowdReports(data as CrowdReportRow[]);
      }
    };

    loadReports();

    const channel = client
      .channel('public:crowd_reports')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'crowd_reports' },
        (payload) => {
          if (!isMounted) return;

          if (payload.eventType === 'INSERT') {
            const newRow = payload.new as CrowdReportRow;
            setCrowdReports((prev) => {
              if (prev.some((r) => r.id === newRow.id)) return prev;
              return [newRow, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedRow = payload.new as CrowdReportRow;
            setCrowdReports((prev) =>
              prev.map((r) => (r.id === updatedRow.id ? updatedRow : r))
            );
          } else if (payload.eventType === 'DELETE') {
            const oldRow = payload.old as { id?: string };
            if (oldRow?.id) {
              setCrowdReports((prev) => prev.filter((r) => r.id !== oldRow.id));
            }
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      client.removeChannel(channel);
    };
  }, []);

  const handleSelectCampus = (campus: CampusId) => {
    setSelectedCampus(campus);
    setCampusFilter(campus);
    setUser((prev) => ({ ...prev, campus }));
    const firstCafeForCampus = cafes.find((c) => c.campus === campus);
    if (firstCafeForCampus) {
      setReportTargetCafeId(firstCafeForCampus.id);
    }
  };

  const handleChangeReporterName = (name: string) => {
    setReporterName(name);
    setUser((prev) => ({
      ...prev,
      name: name.trim() || 'Aizat Dzhaksybekov',
    }));
  };

  const handleCompleteOnboarding = () => {
    setCampusFilter(selectedCampus);
    setHasCompletedOnboarding(true);
    setActiveTab('map');
    setSelectedCafeId(null);
  };

  const handleSelectTab = (tab: TabId) => {
    setActiveTab(tab);
    if (tab !== 'map') {
      setSelectedCafeId(null);
    }
  };

  const handleOpenSearch = () => {
    setActiveTab('map');
    setSelectedCafeId(null);
    setSearchFocusTrigger((n) => n + 1);
  };

  const handleToggleBookmark = (cafeId: string) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(cafeId);
      showToast(exists ? 'Removed from saved cafes' : 'Saved cafe to bookmarks');
      return exists ? prev.filter((id) => id !== cafeId) : [...prev, cafeId];
    });
  };

  const insertCrowdReportRow = async (
    payload: CrowdReportInsert
  ): Promise<{ ok: boolean; errorMsg?: string }> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('crowd_reports')
        .insert([payload])
        .select(CROWD_REPORT_COLUMNS)
        .single();

      if (error) {
        return { ok: false, errorMsg: error.message };
      }

      if (data) {
        const inserted = data as CrowdReportRow;
        setCrowdReports((prev) =>
          prev.some((r) => r.id === inserted.id) ? prev : [inserted, ...prev]
        );
      }
      return { ok: true };
    }

    // Fallback when SUPABASE_URL / SUPABASE_ANON_KEY placeholders are unchanged
    const localRow: CrowdReportRow = {
      ...payload,
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `local-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setCrowdReports((prev) => [localRow, ...prev]);
    return { ok: true };
  };

  const handleCheckIn = async (cafe: Cafe) => {
    if (checkedInCafeIds.includes(cafe.id)) return;
    setCheckedInCafeIds((prev) => [...prev, cafe.id]);

    const checkInPayload: CrowdReportInsert = {
      cafe_name: cafe.name,
      campus_zone: cafe.campus,
      crowd_level: cafe.crowdLevel,
      free_seats: cafe.freeSeats,
      avg_check_kgs: cafe.avgCheckKgs,
      has_wifi: cafe.hasWifi,
      reporter_name: reporterName.trim() || 'Student',
      lat: cafe.coords[0],
      lng: cafe.coords[1],
    };

    await insertCrowdReportRow(checkInPayload);

    setUser((prev) => ({
      ...prev,
      xp: prev.xp + 10,
      cafesFound: prev.cafesFound + 1,
    }));
    showToast(`Checked in at ${cafe.name} (+10 XP)`);
  };

  const handleGoToReport = (cafe: Cafe) => {
    setReportTargetCafeId(cafe.id);
    setSelectedCafeId(null);
    setActiveTab('report');
  };

  const handleSubmitReport = async (payload: CrowdReportInsert) => {
    const result = await insertCrowdReportRow(payload);
    if (!result.ok) {
      showToast(`Report failed: ${result.errorMsg || 'Check Supabase connection'}`);
      return;
    }

    setUser((prev) => ({
      ...prev,
      xp: prev.xp + 10,
      totalReports: prev.totalReports + 1,
    }));

    showToast(`Report submitted for ${payload.cafe_name} (+10 XP)`);
    setSelectedCafeId(null);
    setActiveTab('map');
  };

  const handleToggleJoinMeetup = (meetupId: string) => {
    setMeetups((prev) =>
      prev.map((m) => {
        if (m.id !== meetupId) return m;
        const nextJoined = !m.joined;
        showToast(nextJoined ? `Joined ${m.title} at ${m.cafeName}` : `Left ${m.title}`);
        return { ...m, joined: nextJoined };
      })
    );
  };

  const handleToggleJoinFriend = (friendId: string) => {
    setFriends((prev) =>
      prev.map((f) => {
        if (f.id !== friendId) return f;
        const nextJoined = !f.joined;
        showToast(
          nextJoined ? `On your way to join ${f.name} at ${f.cafeName}` : `Left ${f.name}'s table`
        );
        return { ...f, joined: nextJoined };
      })
    );
  };

  const handleCreateMeetup = ({
    title,
    cafeId,
    timeLabel,
  }: {
    title: string;
    cafeId: string;
    timeLabel: string;
  }) => {
    const cafe = cafes.find((c) => c.id === cafeId) || cafes[0];
    const newMeetup: ActiveMeetup = {
      id: `m-${Date.now()}`,
      title,
      cafeId: cafe.id,
      cafeName: cafe.name,
      status: cafe.status,
      timeLabel,
      joined: true,
    };
    setMeetups((prev) => [newMeetup, ...prev]);
    showToast(`Meetup created at ${cafe.name}!`);
  };

  const handleAddFriend = (name: string, campus: CampusId) => {
    const campusCafe = cafes.find((c) => c.campus === campus) || cafes[0];
    const newFriend: FriendItem = {
      id: `f-${Date.now()}`,
      name,
      campus,
      cafeId: campusCafe.id,
      cafeName: campusCafe.name,
      status: campusCafe.status,
      checkedInAgo: 'just added',
      avatarId: 'arsen',
      joined: false,
    };
    setFriends((prev) => [newFriend, ...prev]);
    showToast(`Added ${name} (${campus}) to Your People`);
  };

  const handleOpenCafeDetail = (cafeId: string) => {
    setActiveTab('map');
    setSelectedCafeId(cafeId);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#E8E0D4] flex items-center justify-center sm:p-5">
      {/* Sleek 390px Mobile Phone Frame */}
      <div className="relative w-full h-[100dvh] sm:w-[390px] sm:h-[844px] sm:max-h-[94dvh] bg-[#FAF7F0] sm:rounded-[42px] sm:border-[8px] sm:border-[#231710] sm:shadow-[0_28px_70px_rgba(35,23,16,0.28)] overflow-hidden flex flex-col">
        {/* Global Feedback Toast */}
        {toastMessage && (
          <div className="pointer-events-none absolute top-[62px] left-1/2 -translate-x-1/2 z-[900] px-3.5 py-1.5 rounded-full bg-[#231710] text-white text-[11.5px] font-bold shadow-lg whitespace-nowrap">
            {toastMessage}
          </div>
        )}

        {!hasCompletedOnboarding ? (
          <OnboardingScreen
            selectedCampus={selectedCampus}
            reporterName={reporterName}
            onSelectCampus={handleSelectCampus}
            onChangeReporterName={handleChangeReporterName}
            onComplete={handleCompleteOnboarding}
          />
        ) : (
          <>
            <TopBar
              title={TAB_TITLES[activeTab]}
              activeTab={activeTab}
              onOpenSearch={handleOpenSearch}
              onOpenProfile={() => handleSelectTab('profile')}
            />

            <main className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
              {activeTab === 'map' && (
                <MapScreen
                  selectedCampus={selectedCampus}
                  campusFilter={campusFilter}
                  onChangeCampusFilter={setCampusFilter}
                  cafes={cafes}
                  selectedCafeId={selectedCafeId}
                  bookmarkedIds={bookmarkedIds}
                  checkedInCafeIds={checkedInCafeIds}
                  recentActivityText={recentActivityText}
                  onSelectCafe={setSelectedCafeId}
                  onToggleBookmark={handleToggleBookmark}
                  onCheckIn={handleCheckIn}
                  onGoToReport={handleGoToReport}
                  searchFocusTrigger={searchFocusTrigger}
                />
              )}

              {activeTab === 'report' && (
                <ReportScreen
                  cafes={cafes}
                  targetCafeId={reportTargetCafeId}
                  reporterName={reporterName}
                  userAccuracy={user.accuracyRate}
                  onSelectTargetCafe={setReportTargetCafeId}
                  onSubmitReport={handleSubmitReport}
                />
              )}

              {activeTab === 'friends' && (
                <FriendsScreen
                  selectedCampus={selectedCampus}
                  cafes={cafes}
                  crowdReports={crowdReports}
                  friends={friends}
                  meetups={meetups}
                  onToggleJoinMeetup={handleToggleJoinMeetup}
                  onToggleJoinFriend={handleToggleJoinFriend}
                  onCreateMeetup={handleCreateMeetup}
                  onAddFriend={handleAddFriend}
                  onOpenCafeDetail={handleOpenCafeDetail}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileScreen
                  user={user}
                  crowdReports={crowdReports}
                  onChangeCampus={(campus) => {
                    handleSelectCampus(campus);
                    showToast(`Switched campus to ${campus}`);
                  }}
                  onReplayOnboarding={() => setHasCompletedOnboarding(false)}
                />
              )}
            </main>

            <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />
          </>
        )}
      </div>
    </div>
  );
}
