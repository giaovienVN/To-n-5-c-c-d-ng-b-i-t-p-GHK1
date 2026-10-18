import React from 'react';
import { BookOpen, Sparkles, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenGuide: () => void;
  onResetGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenGuide,
  onResetGame,
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto mb-4 bg-white/90 backdrop-blur-sm border-2 border-orange-200 rounded-2xl shadow-sm p-4 sm:p-5 relative transition-all">
      {/* Top action row */}
      <div className="flex items-start justify-between gap-4 mb-3">
        {/* Top-left: Robot holding Rubik's Cube & "Trò chơi" badge */}
        <div className="flex items-center gap-2.5">
          {/* Cute SVG Robot holding a colorful Rubik cube */}
          <div className="relative group cursor-pointer" title="Robot Trợ Lý Học Tập">
            <svg
              className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow transition-transform group-hover:scale-105"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Antenna */}
              <circle cx="50" cy="12" r="5" fill="#EF4444" />
              <line x1="50" y1="17" x2="50" y2="28" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
              
              {/* Ears / Head Bolts */}
              <rect x="20" y="38" width="6" height="12" rx="3" fill="#F97316" />
              <rect x="74" y="38" width="6" height="12" rx="3" fill="#F97316" />

              {/* Head */}
              <rect x="25" y="26" width="50" height="36" rx="10" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
              {/* Screen Face */}
              <rect x="32" y="33" width="36" height="22" rx="6" fill="#0F172A" />
              {/* Glowing Eyes */}
              <circle cx="41" cy="44" r="3.5" fill="#34D399" className="animate-pulse" />
              <circle cx="59" cy="44" r="3.5" fill="#34D399" className="animate-pulse" />
              {/* Smile */}
              <path d="M44 49 Q50 53 56 49" stroke="#F8FAFC" strokeWidth="2.2" strokeLinecap="round" fill="none" />

              {/* Body */}
              <rect x="30" y="64" width="40" height="28" rx="8" fill="#F1F5F9" stroke="#64748B" strokeWidth="3" />
              {/* Chest Gauge / Heart */}
              <circle cx="50" cy="76" r="6" fill="#F43F5E" />
              <path d="M47 76 L53 76 M50 73 L50 79" stroke="white" strokeWidth="1.5" strokeLinecap="round" />

              {/* Left Hand */}
              <path d="M30 68 Q20 74 24 82" stroke="#64748B" strokeWidth="4" strokeLinecap="round" fill="none" />
              
              {/* Right Hand holding Rubik's cube */}
              <path d="M70 68 Q78 72 75 80" stroke="#64748B" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Mini Rubik Cube */}
              <g transform="translate(68, 68) rotate(12)">
                <rect x="0" y="0" width="18" height="18" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
                {/* 2x2 colored faces */}
                <rect x="1.5" y="1.5" width="7" height="7" rx="1" fill="#EF4444" />
                <rect x="9.5" y="1.5" width="7" height="7" rx="1" fill="#3B82F6" />
                <rect x="1.5" y="9.5" width="7" height="7" rx="1" fill="#EAB308" />
                <rect x="9.5" y="9.5" width="7" height="7" rx="1" fill="#22C55E" />
              </g>
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="inline-block bg-gradient-to-r from-red-600 to-rose-500 text-white font-extrabold text-sm sm:text-base px-3 py-0.5 rounded-full shadow-sm tracking-wide border-2 border-red-400/50">
              Trò chơi
            </span>
            <span className="text-[11px] font-semibold text-slate-500 mt-0.5">Toán 5 • Vở Bài Tập</span>
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onOpenGuide();
            }}
            className="flex items-center gap-1 text-xs sm:text-sm font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-300 transition-colors shadow-xs"
            title="Bí kíp so sánh số thập phân"
          >
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Bí kíp</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 transition-colors flex items-center gap-1"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">Âm thanh: Bật</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline">Âm thanh: Tắt</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onResetGame();
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs sm:text-sm font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 transition-colors flex items-center gap-1"
            title="Chơi ván mới"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Ván mới</span>
          </button>
        </div>
      </div>

      {/* Main Title: Stylized vibrant red-orange text */}
      <div className="text-center my-1 sm:my-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide uppercase bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent drop-shadow-sm select-none py-1">
          CẦU THANG – CẦU TRƯỢT
        </h1>
        <p className="text-xs sm:text-sm text-amber-800 font-semibold mt-0.5 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Hành trình so sánh các số thập phân kì thú!
          <Sparkles className="w-4 h-4 text-amber-500" />
        </p>
      </div>

      {/* Rules Box: Exactly matching prompt description */}
      <div className="mt-3 bg-amber-50/70 border border-amber-200/90 rounded-xl p-3 sm:p-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <div className="font-extrabold text-amber-900 text-sm sm:text-base mb-1.5 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
          Cách chơi:
        </div>
        <ul className="space-y-1.5 text-slate-700 pl-1">
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
            <span><strong className="text-slate-900">Chơi theo cặp đôi</strong> (hoặc thử thách với Bạn Robot thông minh).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
            <span>
              Người chơi bắt đầu từ ô xuất phát. Khi đến lượt, người chơi gieo xúc xắc rồi di chuyển số ô bằng số chấm nhận được.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
            <span>
              <strong className="text-amber-900">Đọc số lớn hơn trong ô đó</strong> trong thời gian quy định. Nếu đọc sai thì phải <span className="text-rose-600 font-semibold underline decoration-rose-300">quay về ô xuất phát trước đó</span>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
            <span>
              Khi đến chân <strong className="text-amber-700">cầu thang vàng</strong>, em được leo lên. Khi đến đỉnh <strong className="text-emerald-700">cầu trượt xanh</strong>, em bị trượt xuống. Gặp <strong className="text-pink-600">bông hoa</strong> thì tự vượt qua an toàn.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
            <span>
              Trò chơi kết thúc khi có người <strong className="text-red-600 font-bold">về đích</strong>.
            </span>
          </li>
        </ul>
      </div>
    </header>
  );
};
