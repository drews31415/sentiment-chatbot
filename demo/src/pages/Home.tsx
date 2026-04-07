import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link, useNavigate } from "react-router-dom";
import { Camera, MapPin } from "lucide-react";
import L from "leaflet";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

// Custom marker icon creation
const createCustomIcon = (imageUrl: string, label: string, emoji: string, colorClass: string, tag: string, delay: string) => {
  return L.divIcon({
    className: "custom-glass-marker",
    html: `
      <div class="animate-float" style="animation-delay: ${delay};" role="img" aria-label="${label}">
        <div class="bg-white/70 backdrop-blur-md p-2 rounded-2xl shadow-xl flex items-center gap-3 min-w-[140px] border border-white/30">
          <div class="relative">
            <div class="w-12 h-12 rounded-xl overflow-hidden shadow-inner">
              <img class="w-full h-full object-cover" src="${imageUrl}" alt="${label} 사진" />
            </div>
            <div class="absolute -bottom-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm">${emoji}</div>
          </div>
          <div class="flex flex-col">
            <span class="text-[11px] font-bold text-primary leading-tight">${label}</span>
            <span class="text-[9px] px-1.5 py-0.5 ${colorClass} rounded-full w-max mt-1">${tag}</span>
          </div>
        </div>
        <div class="w-0.5 h-6 bg-primary/20 mx-auto mt-0.5"></div>
      </div>
    `,
    iconSize: [160, 80],
    iconAnchor: [80, 80],
  });
};

const markers = [
  {
    id: 1,
    position: [37.5665, 126.9780] as [number, number], // Seoul
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfEY8sqZk1gRQmuaY8Dw60Ir-hmJq3AG7gnZoYtrmT4fmzg_cJWW9iz73kBgk2HBpbwpUx3bsWnmitn2had1aJlljeGVjiwPfUnm_KQfctp_xePJohwKHi5yEpI3yVW2UQhkYtJ5XjYMqMll83ffzT0ar4r75Akrj05-K-5lqPBGFUlyjkepjFDwBBnnTyqZUWbBJuxiDK9seHaEMX64wiGD9Fq7OWrO-Z5H--XFHexgkZQsKPe97X_Qm1dwC4w1b29DddTHeleMU",
    label: "들꽃",
    emoji: "🌿",
    colorClass: "bg-primary/10 text-primary",
    tag: "자연",
    delay: "0s",
  },
  {
    id: 2,
    position: [37.5500, 126.9900] as [number, number],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCd0qn8svWsRsuT6DkG-9SOglqXxONGZ3DCRGMIMJ9GM2wy4y3wKZ2JO5MS4FgIJ5-ZImV9t6yvnCvXLUCTxg87aGTq0IjgWoufVj70dBLsgHtCVXLhAVDgfDUYkSSj32sSQaoa0zGML_jgXSVQ6ss5zXqWl2TafLsUgqpEOpzbt_GGm2bg48EmcQpeCrxIYQ4KiW5T5qjqub6t68Kg--9M9qR_flE9UEi_ebq7NyfV5UtPM6QoJ0VCYntgEJRqKgttb-yDcH7S08w",
    label: "조용한 카페",
    emoji: "☕",
    colorClass: "bg-secondary-container/50 text-on-secondary-container",
    tag: "여유",
    delay: "1.5s",
  },
  {
    id: 3,
    position: [37.5700, 127.0000] as [number, number],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDovZqhvyRC96WTu1C98VPbThsUUf8zmFjoEz43PwZWO21J2Kuw-908Br57h37KnCaePfSTbhsv8CGICjCc0uW4bQUHVjgqzwL5g95QKDCgfYIWy2ATncCGoStMsfzS_7kY6c1ZrwDkRAq1nLCrfrPsg1srLoXDUNFBhNNmC2K6vPAHLQXP0o2rau-Igg_YLc_H15Cs8mHp9VAnlLt0Hi2l8fZsQqQwNkOYEDK0Lb2ZzHx_Sz5tTNZm2HOF07Vt_3q3jYfP8zX7q-I",
    label: "노을 산책",
    emoji: "😊",
    colorClass: "bg-tertiary-container/50 text-on-tertiary-container",
    tag: "행복",
    delay: "0.8s",
  },
];

export function Home() {
  const navigate = useNavigate();

  return (
    <main className="relative z-10 pt-24 pb-32 h-full flex flex-col flex-grow overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={[37.5665, 126.9780]} 
          zoom={13} 
          zoomControl={false}
          className="w-full h-full"
          style={{ background: 'var(--color-surface)' }}
        >
          {/* Using CartoDB Positron for a clean, muted look that fits the design */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            className="map-tiles-custom"
          />
          
          {markers.map((marker) => (
            <Marker 
              key={marker.id} 
              position={marker.position}
              icon={createCustomIcon(marker.imageUrl, marker.label, marker.emoji, marker.colorClass, marker.tag, marker.delay)}
              eventHandlers={{
                click: () => navigate("/insight")
              }}
            />
          ))}
        </MapContainer>
        {/* Overlay to give it the warm, sepia tone from the design */}
        <div className="absolute inset-0 z-[400] pointer-events-none bg-surface/20 mix-blend-multiply"></div>
      </div>

      {/* Recent Joys Horizontal Scroll */}
      <section className="pointer-events-auto overflow-visible mt-auto z-[500] pb-8">
        <div className="px-8 mb-4 flex justify-between items-end">
          <span className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant">최근 기록</span>
          <button className="text-[10px] text-primary/60 font-medium">모두 보기</button>
        </div>
        <div className="flex overflow-x-auto gap-5 px-8 pb-4 no-scrollbar scroll-smooth snap-x">
          
          {/* Card 1 */}
          <div className="flex-shrink-0 w-[300px] bg-surface-container-low/95 backdrop-blur-xl rounded-[2rem] p-5 shadow-lg border border-white/40 group snap-center cursor-pointer" onClick={() => navigate("/insight")}>
            <div className="flex flex-col gap-4">
              <div className="relative h-32 rounded-[1.5rem] overflow-hidden shadow-sm">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0RermcoxtQhygVJ9fMyThTSxH32mitksvevXXXYQd94eb41j_58BBi5C_-ZvKPRzq_iQjIWN40f7577ONYqUZoivYOmEgn88tvXl1nvLe2Pgr7Tbnuz-sc6XS3sWh9d-o3VBgkoE0omv_pDdzyWcuYkxA57Dm0m9cfnqZnIA6uvFJ4UfsY-fScw5s7TgE5nYBZefPNu_QahO1d2R_5iIgHU6ZWZeZhXj-pnIKZ9DHS3mc80ofXKppfG5LnkWFUwd_EYj4FMf4zfc" alt="갓 구운 빵 사진" />
                <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="text-xs">🥐</span>
                  <span className="text-[10px] font-bold text-on-secondary-container">따뜻함</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <MapPin size={14} className="text-primary fill-primary" />
                  <span className="text-[10px] font-semibold text-primary tracking-wider">아침 베이커리</span>
                </div>
                <p className="text-[15px] font-medium leading-relaxed font-serif italic text-on-surface">"아침 공기 속 갓 구운 빵 냄새, 완벽한 하루의 시작."</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex-shrink-0 w-[300px] bg-surface-container-low/95 backdrop-blur-xl rounded-[2rem] p-5 shadow-lg border border-white/40 group snap-center cursor-pointer" onClick={() => navigate("/insight")}>
            <div className="flex flex-col gap-4">
              <div className="relative h-32 rounded-[1.5rem] overflow-hidden shadow-sm">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC9exZPwO8faqNu0hwF3yg2hvieiFz77oxRNrxoQha66A2BhLc5R44kmSijgJgBZ_dWvcHeJn4_oKFANU53IFNa27Qqy2pcPdyLvXmYtQg3CaaxDyjoAq6ZJ-0tFBZgHpOSLdItkZsiAWZW42I4n7MiWsn2EnV4J1kEPzF9KGRaY5oWkT_og4b0XAvukGsKuOo6Ba0a24Tut1XP-EimVCoRmNFZnjZCqgdqSbQK7bvHnUNQlRXApivOKnsNb7GJLt_wQ1m_0yt6E4" alt="잔잔한 호수 사진" />
                <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="text-xs">✨</span>
                  <span className="text-[10px] font-bold text-on-secondary-container">평온함</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <MapPin size={14} className="text-primary fill-primary" />
                  <span className="text-[10px] font-semibold text-primary tracking-wider">노을빛 호수</span>
                </div>
                <p className="text-[15px] font-medium leading-relaxed font-serif italic text-on-surface">"고요한 수면 위로 비치는 산 그림자, 완전한 평온."</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Floating Central Record Button */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[600] pointer-events-auto">
        <Link to="/capture" aria-label="소확행 기록하기" className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-primary-container text-on-primary shadow-[0px_12px_32px_rgba(55,58,28,0.2)] flex items-center justify-center hover:scale-105 active:scale-90 transition-all duration-300">
          <Camera size={32} className="fill-current" />
        </Link>
      </div>
    </main>
  );
}
