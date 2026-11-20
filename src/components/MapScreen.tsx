import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Coffee,
  Crosshair,
  Croissant,
  Leaf,
  Search,
  SlidersHorizontal,
  Utensils,
  X,
} from 'lucide-react';
import { CAMPUSES } from '../data/mockData';
import { Cafe, CampusId, CrowdStatus } from '../types';
import { CafeDetailSheet } from './CafeDetailSheet';

interface MapScreenProps {
  selectedCampus: CampusId;
  campusFilter: CampusId | 'ALL';
  onChangeCampusFilter: (zone: CampusId | 'ALL') => void;
  cafes: Cafe[];
  selectedCafeId: string | null;
  bookmarkedIds: string[];
  checkedInCafeIds: string[];
  recentActivityText: string;
  onSelectCafe: (cafeId: string | null) => void;
  onToggleBookmark: (cafeId: string) => void;
  onCheckIn: (cafe: Cafe) => void;
  onGoToReport: (cafe: Cafe) => void;
  searchFocusTrigger: number;
}

const STATUS_COLORS: Record<CrowdStatus, { fill: string; ring: string }> = {
  FREE: { fill: '#098C44', ring: 'rgba(9, 140, 68, 0.2)' },
  BUSY: { fill: '#F39C12', ring: 'rgba(243, 156, 18, 0.22)' },
  FULL: { fill: '#D92626', ring: 'rgba(217, 38, 38, 0.24)' },
};

const BISHKEK_CENTER: [number, number] = [42.8768, 74.6025];

export const MapScreen: React.FC<MapScreenProps> = ({
  selectedCampus,
  campusFilter,
  onChangeCampusFilter,
  cafes,
  selectedCafeId,
  bookmarkedIds,
  checkedInCafeIds,
  recentActivityText,
  onSelectCafe,
  onToggleBookmark,
  onCheckIn,
  onGoToReport,
  searchFocusTrigger,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | CrowdStatus>('ALL');
  const [wifiOnly, setWifiOnly] = useState(false);
  const [outletsOnly, setOutletsOnly] = useState(false);
  const [showUrgencyToast, setShowUrgencyToast] = useState(true);
  const [showingDirections, setShowingDirections] = useState(false);

  const campusInfo = CAMPUSES[selectedCampus];

  const selectedCafe = useMemo(
    () => cafes.find((c) => c.id === selectedCafeId) || null,
    [cafes, selectedCafeId]
  );

  useEffect(() => {
    if (searchFocusTrigger > 0) {
      searchInputRef.current?.focus();
    }
  }, [searchFocusTrigger]);

  useEffect(() => {
    setShowingDirections(false);
  }, [selectedCafeId]);

  const filteredCafes = useMemo(() => {
    return cafes.filter((cafe) => {
      if (campusFilter !== 'ALL' && cafe.campus !== campusFilter) return false;
      if (statusFilter !== 'ALL' && cafe.status !== statusFilter) return false;
      if (wifiOnly && !cafe.hasWifi) return false;
      if (outletsOnly && !cafe.hasOutlets) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          cafe.name.toLowerCase().includes(q) ||
          cafe.address.toLowerCase().includes(q) ||
          cafe.campus.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [cafes, campusFilter, statusFilter, wifiOnly, outletsOnly, searchQuery]);

  const carouselCafes = useMemo(() => {
    return [...filteredCafes].sort((a, b) => {
      const rank = { FREE: 0, BUSY: 1, FULL: 2 };
      return rank[a.status] - rank[b.status];
    });
  }, [filteredCafes]);

  const freeNearbyCount = useMemo(
    () => carouselCafes.filter((c) => c.status === 'FREE').length,
    [carouselCafes]
  );

  const urgencyCafe = useMemo(
    () =>
      filteredCafes.find((c) => c.urgencyAlert) ||
      cafes.find((c) => c.urgencyAlert) ||
      null,
    [filteredCafes, cafes]
  );

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter = campusFilter === 'ALL' ? BISHKEK_CENTER : CAMPUSES[campusFilter].center;
    const initialZoom = campusFilter === 'ALL' ? 14 : 15;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
      routeLayerRef.current = null;
    };
  }, []);

  // Recenter map when campusFilter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || selectedCafeId) return;
    if (campusFilter === 'ALL') {
      map.flyTo(BISHKEK_CENTER, 14, { duration: 0.65 });
    } else {
      map.flyTo(CAMPUSES[campusFilter].center, 15, { duration: 0.65 });
    }
  }, [campusFilter, selectedCafeId]);

  // Center map smoothly when opening a cafe detail sheet
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedCafe) return;
    const targetLat = selectedCafe.coords[0] - 0.0022;
    map.flyTo([targetLat, selectedCafe.coords[1]], 15, { duration: 0.45 });
  }, [selectedCafe]);

  // Render Cafe Pins at (lat, lng) + User Location Marker
  useEffect(() => {
    const layer = markersLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    const userIcon = L.divIcon({
      className: 'cafe-custom-marker',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      html: `
        <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
          <div class="user-location-pulse" style="position:absolute;inset:0;border-radius:9999px;background:#382418;"></div>
          <div style="position:relative;width:13px;height:13px;border-radius:9999px;background:#231710;border:2.5px solid #FAF7F0;box-shadow:0 2px 6px rgba(0,0,0,0.28);"></div>
        </div>
      `,
    });

    L.marker(campusInfo.center, { icon: userIcon, interactive: false }).addTo(layer);

    filteredCafes.forEach((cafe) => {
      const isSelected = selectedCafeId === cafe.id;
      const palette = STATUS_COLORS[cafe.status];
      const dotHtml =
        cafe.status === 'FREE'
          ? `<span style="display:inline-block;width:6px;height:6px;border-radius:9999px;background:#098C44;margin-left:4px;"></span>`
          : '';

      const pinHtml = isSelected
        ? `
          <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-82%);cursor:pointer;">
            <div style="width:44px;height:44px;border-radius:9999px;background:${palette.fill};border:3px solid #fff;box-shadow:0 6px 18px rgba(0,0,0,0.28);display:flex;align-items:center;justify-content:center;color:#fff;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>
            </div>
            <div style="margin-top:4px;background:#FFFFFF;color:${palette.fill};font-size:10.5px;font-weight:800;padding:2px 9px;border-radius:9999px;box-shadow:0 2px 8px rgba(0,0,0,0.16);letter-spacing:0.04em;">
              ${cafe.status}
            </div>
          </div>
        `
        : `
          <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-82%);cursor:pointer;">
            <div style="position:relative;width:40px;height:40px;border-radius:9999px;background:${palette.fill};box-shadow:0 0 0 5px ${palette.ring}, 0 4px 10px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:800;letter-spacing:0.03em;">
              ${cafe.status}
              <span style="position:absolute;bottom:-5px;left:50%;transform:translateX(-50%) rotate(45deg);width:10px;height:10px;background:${palette.fill};"></span>
            </div>
            <div style="margin-top:5px;background:#FFFFFF;color:#231710;font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:9999px;box-shadow:0 2px 6px rgba(35,23,16,0.14);white-space:nowrap;display:flex;align-items:center;">
              <span>${cafe.name}</span>${dotHtml}
            </div>
          </div>
        `;

      const icon = L.divIcon({
        className: 'cafe-custom-marker',
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        html: pinHtml,
      });

      const marker = L.marker(cafe.coords, { icon });
      marker.on('click', () => {
        onSelectCafe(cafe.id);
      });
      marker.addTo(layer);
    });
  }, [filteredCafes, selectedCafeId, campusInfo.center, onSelectCafe]);

  // Draw walking directions polyline when toggled
  useEffect(() => {
    const routeLayer = routeLayerRef.current;
    const map = mapInstanceRef.current;
    if (!routeLayer || !map) return;
    routeLayer.clearLayers();

    if (showingDirections && selectedCafe) {
      const start = CAMPUSES[selectedCafe.campus].center;
      const end = selectedCafe.coords;
      const mid: [number, number] = [
        (start[0] + end[0]) / 2 + 0.0005,
        (start[1] + end[1]) / 2 - 0.0004,
      ];
      L.polyline([start, mid, end], {
        color: '#382418',
        weight: 4,
        dashArray: '7, 7',
        opacity: 0.9,
      }).addTo(routeLayer);

      map.fitBounds([start, end], { paddingTopLeft: [40, 40], paddingBottomRight: [40, 380] });
    }
  }, [showingDirections, selectedCafe]);

  const handleRecenter = () => {
    if (campusFilter === 'ALL') {
      mapInstanceRef.current?.flyTo(BISHKEK_CENTER, 14, { duration: 0.6 });
    } else {
      mapInstanceRef.current?.flyTo(CAMPUSES[campusFilter].center, 15, { duration: 0.6 });
    }
  };

  const renderCardIcon = (iconType: Cafe['iconType']) => {
    switch (iconType) {
      case 'croissant':
        return <Croissant className="w-5 h-5 text-[#9C5C24]" strokeWidth={2.1} />;
      case 'leaf':
        return <Leaf className="w-5 h-5 text-[#177E54]" strokeWidth={2.1} />;
      case 'utensils':
        return <Utensils className="w-5 h-5 text-[#9C2B2B]" strokeWidth={2.1} />;
      default:
        return <Coffee className="w-5 h-5 text-[#7A4B2A]" strokeWidth={2.1} />;
    }
  };

  const getIconBg = (iconType: Cafe['iconType']) => {
    switch (iconType) {
      case 'croissant':
        return 'bg-[#D6F5E8]';
      case 'leaf':
        return 'bg-[#DCF7EE]';
      case 'utensils':
        return 'bg-[#FCE3DF]';
      default:
        return 'bg-[#FAF0D7]';
    }
  };

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden bg-[#F4EFE6]">
      {/* Real Leaflet OpenStreetMap Canvas */}
      <div ref={mapContainerRef} className="cafemap-tiles w-full h-full z-0" />

      {/* Top Floating Search & Social Proof Overlays */}
      {!selectedCafe && (
        <div className="absolute inset-x-0 top-0 z-[400] px-3.5 pt-3 pointer-events-none flex flex-col items-center">
          {/* Search Input Bar */}
          <div className="w-full bg-white rounded-2xl shadow-[0_6px_18px_rgba(35,23,16,0.1)] border border-[#EAE2D6] px-3.5 h-[46px] flex items-center gap-2 pointer-events-auto">
            <Search className="w-4 h-4 text-[#736459] shrink-0" strokeWidth={2.2} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                campusFilter === 'ALL'
                  ? 'Search cafes across Bishkek...'
                  : `Search cafes near ${campusFilter}...`
              }
              className="flex-1 min-w-0 bg-transparent text-[13.5px] text-[#231710] placeholder:text-[#8A7B6E] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="p-1 text-[#8A7B6E] hover:text-[#231710] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                onChangeCampusFilter(campusFilter === 'ALL' ? selectedCampus : 'ALL')
              }
              className="px-2 py-1 rounded-lg bg-[#F2ECE1] hover:bg-[#E7DFD1] text-[#382418] text-[10.5px] font-extrabold whitespace-nowrap shrink-0 cursor-pointer"
              title="Toggle campus zone or view all zones"
            >
              {campusFilter === 'ALL' ? 'All Zones' : `${campusFilter} Only`}
            </button>
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              aria-label="Filter cafes"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                filterOpen || statusFilter !== 'ALL' || wifiOnly || outletsOnly
                  ? 'bg-[#382418] text-white'
                  : 'text-[#382418] hover:bg-[#F2ECE1]'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" strokeWidth={2.2} />
            </button>
          </div>

          {/* Interactive Filter Chips Drawer (with Campus Zones + Crowd + Amenities) */}
          {filterOpen && (
            <div className="w-full mt-2 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border border-[#EAE2D6] flex flex-col gap-2 pointer-events-auto">
              <div className="flex flex-wrap gap-1.5">
                {(['ALL', 'KNU', 'KRSU', 'AUCA'] as const).map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => onChangeCampusFilter(zone)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                      campusFilter === zone
                        ? 'bg-[#382418] text-white'
                        : 'bg-[#F2ECE1] text-[#4D3A2D] hover:bg-[#E7DFD1]'
                    }`}
                  >
                    {zone === 'ALL' ? 'All Zones' : zone}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['ALL', 'FREE', 'BUSY', 'FULL'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-[#382418] text-white'
                        : 'bg-[#F2ECE1] text-[#4D3A2D] hover:bg-[#E7DFD1]'
                    }`}
                  >
                    {st === 'ALL' ? 'All Crowds' : st}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setWifiOnly((v) => !v)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                    wifiOnly ? 'bg-[#098C44] text-white' : 'bg-[#F2ECE1] text-[#4D3A2D]'
                  }`}
                >
                  WiFi
                </button>
                <button
                  type="button"
                  onClick={() => setOutletsOnly((v) => !v)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                    outletsOnly ? 'bg-[#098C44] text-white' : 'bg-[#F2ECE1] text-[#4D3A2D]'
                  }`}
                >
                  Outlets
                </button>
              </div>
            </div>
          )}

          {/* Live Social Proof Pill */}
          <div className="mt-2.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F0]/95 backdrop-blur-sm border border-[#EAE2D6] shadow-sm pointer-events-auto">
            <span className="text-[11.5px] font-semibold text-[#231710]">
              ☕ 23 students checking in right now
            </span>
            <span className="w-2 h-2 rounded-full bg-[#098C44]" />
          </div>

          {/* Urgency Alert Toast */}
          {showUrgencyToast && urgencyCafe && (
            <div className="self-end mt-2 inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-[#EAE2D6] rounded-xl px-3 py-1.5 shadow-[0_4px_14px_rgba(35,23,16,0.1)] pointer-events-auto">
              <button
                type="button"
                onClick={() => onSelectCafe(urgencyCafe.id)}
                className="text-[11.5px] font-semibold text-[#231710] cursor-pointer"
              >
                ☕ {urgencyCafe.name}:{' '}
                <span className="text-[#D62828] font-bold">
                  {urgencyCafe.freeSeats > 0 ? `${urgencyCafe.freeSeats} seats left!` : 'Packed!'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setShowUrgencyToast(false)}
                aria-label="Dismiss alert"
                className="text-[#8A7B6E] hover:text-[#231710] cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Locate Me FAB */}
      {!selectedCafe && (
        <button
          type="button"
          onClick={handleRecenter}
          aria-label={`Center map on ${campusFilter === 'ALL' ? 'Bishkek' : campusFilter}`}
          className="absolute right-3.5 bottom-[198px] z-[400] w-10 h-10 rounded-full bg-white shadow-[0_4px_14px_rgba(35,23,16,0.16)] border border-[#EAE2D6] flex items-center justify-center text-[#382418] hover:bg-[#FAF7F0] active:scale-95 transition-all cursor-pointer"
        >
          <Crosshair className="w-[18px] h-[18px]" strokeWidth={2.2} />
        </button>
      )}

      {/* Bottom Activity Toast + Free Right Now Carousel */}
      {!selectedCafe && (
        <div className="absolute inset-x-0 bottom-0 z-[400] pb-2.5 pt-6 bg-gradient-to-t from-[#FAF7F0] via-[#FAF7F0]/90 to-transparent pointer-events-none">
          {/* Check-in Activity Pill */}
          <div className="px-3.5 mb-2.5 pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                const first = carouselCafes[0];
                if (first) onSelectCafe(first.id);
              }}
              className="w-full py-2 px-3.5 rounded-full bg-[#FAF7F0] border border-[#E6DEC9] shadow-sm flex items-center justify-center gap-2 text-[11.5px] text-[#382418] hover:bg-white transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[#098C44] shrink-0" />
              <span className="truncate">{recentActivityText}</span>
            </button>
          </div>

          {/* Section Title Row */}
          <div className="px-4 mb-2 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-1.5">
              <h2 className="text-[15px] font-extrabold text-[#231710]">Free Right Now</h2>
              <span className="w-2 h-2 rounded-full bg-[#098C44]" />
            </div>
            <span className="text-[10.5px] font-bold tracking-[0.04em] text-[#736459] uppercase tabular-nums">
              {freeNearbyCount} SPOTS NEARBY
            </span>
          </div>

          {/* Horizontal Cafe Card Scroller */}
          <div className="flex gap-2.5 px-3.5 overflow-x-auto no-scrollbar pointer-events-auto">
            {carouselCafes.length === 0 ? (
              <div className="w-full bg-white rounded-2xl p-3.5 border border-[#EAE2D6] text-center text-[12px] text-[#736459]">
                No cafes match your filters. Try clearing search or viewing All Zones.
              </div>
            ) : (
              carouselCafes.map((cafe) => {
                const badgeBg =
                  cafe.status === 'FREE'
                    ? 'bg-[#098C44]'
                    : cafe.status === 'BUSY'
                    ? 'bg-[#E58D07]'
                    : 'bg-[#D62828]';

                return (
                  <button
                    key={cafe.id}
                    type="button"
                    onClick={() => onSelectCafe(cafe.id)}
                    className="shrink-0 w-[172px] bg-white rounded-2xl p-2.5 border border-[#EAE2D6] shadow-[0_3px_10px_rgba(35,23,16,0.06)] flex items-center gap-2.5 text-left hover:border-[#382418]/40 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getIconBg(
                        cafe.iconType
                      )}`}
                    >
                      {renderCardIcon(cafe.iconType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px] font-bold text-[#231710] leading-tight truncate">
                        {cafe.name}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span
                          className={`inline-block px-2 py-[1px] rounded-md text-[9.5px] font-extrabold text-white tracking-wide ${badgeBg}`}
                        >
                          {cafe.status}
                        </span>
                        <span className="text-[10px] font-semibold text-[#6E5E52] tabular-nums">
                          {cafe.freeSeats} seats
                        </span>
                      </div>
                      <div className="mt-1 text-[10.5px] text-[#736459] truncate tabular-nums">
                        {cafe.walkMinutes} min • {cafe.priceAvg}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Directions Floating Pill when active */}
      {selectedCafe && showingDirections && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[510] bg-[#382418] text-white px-3.5 py-1.5 rounded-full shadow-lg text-[11.5px] font-semibold flex items-center gap-2 whitespace-nowrap">
          <span>
            Walking from {selectedCafe.campus} → {selectedCafe.name} ({selectedCafe.walkMinutes} min)
          </span>
        </div>
      )}

      {/* Screen 3: Cafe Detail Bottom Sheet */}
      {selectedCafe && (
        <CafeDetailSheet
          cafe={selectedCafe}
          isBookmarked={bookmarkedIds.includes(selectedCafe.id)}
          hasCheckedIn={checkedInCafeIds.includes(selectedCafe.id)}
          showingDirections={showingDirections}
          onToggleBookmark={onToggleBookmark}
          onCheckIn={onCheckIn}
          onToggleDirections={() => setShowingDirections((v) => !v)}
          onGoToReport={onGoToReport}
          onClose={() => onSelectCafe(null)}
        />
      )}
    </div>
  );
};
