import React from 'react';
import { BoardCell, Player, MathTopic } from '../types/game';
import { BOARD_CELLS, getCellQuestion } from '../data/boardData';
import { ArrowLeft, ArrowRight, ArrowUp, Flag, Sparkles } from 'lucide-react';

interface BoardProps {
  players: Player[];
  activePlayerId: 1 | 2;
  currentTopic: MathTopic;
  highlightedCellId?: number | null;
  onCellClick?: (cell: BoardCell) => void;
}

export const Board: React.FC<BoardProps> = ({
  players,
  activePlayerId,
  currentTopic,
  highlightedCellId,
  onCellClick,
}) => {
  // Map cells by (row, col) for easy grid rendering
  const gridCells: (BoardCell | undefined)[][] = [
    [undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined],
  ];

  BOARD_CELLS.forEach((cell) => {
    gridCells[cell.gridRow][cell.gridCol] = cell;
  });

  // Calculate coordinates for SVG overlay (based on 5 cols x 4 rows)
  // Grid width = 100%, height = 100% -> col center = (col + 0.5) * 20%, row center = (row + 0.5) * 25%
  // Ladder 1: Cell 3 (row 3, col 2) -> Cell 6 (row 2, col 0)
  // Ladder 2: Cell 13 (row 1, col 2) -> Cell 17 (row 0, col 1)
  // Slide 1: Cell 12 (row 1, col 3) -> Cell 10 (row 2, col 4)

  return (
    <div className="relative w-full max-w-5xl mx-auto my-2 select-none">
      {/* Outer warm orange wooden border */}
      <div className="p-3 sm:p-5 rounded-3xl bg-gradient-to-b from-amber-400 via-orange-400 to-amber-500 shadow-xl border-4 border-amber-600/60 relative">
        {/* Inner white notebook paper board */}
        <div className="relative w-full rounded-2xl bg-notebook p-2 sm:p-4 border-2 border-orange-200 shadow-inner overflow-hidden">
          
          {/* Decorative Corner Stars */}
          <span className="absolute top-2 left-2 text-amber-300 text-lg opacity-40">★</span>
          <span className="absolute top-2 right-2 text-amber-300 text-lg opacity-40">★</span>
          <span className="absolute bottom-2 left-2 text-amber-300 text-lg opacity-40">★</span>
          <span className="absolute bottom-2 right-2 text-amber-300 text-lg opacity-40">★</span>

          {/* 4 Rows x 5 Cols Grid */}
          <div className="grid grid-cols-5 grid-rows-4 gap-2 sm:gap-3 relative z-10">
            {gridCells.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                if (!cell) return <div key={`${rIdx}-${cIdx}`} className="aspect-square"></div>;

                const isCurrentActive = highlightedCellId === cell.id;
                const cellPlayers = players.filter((p) => p.position === cell.id);

                return (
                  <div
                    key={cell.id}
                    onClick={() => onCellClick?.(cell)}
                    className={`relative aspect-[1/0.95] sm:aspect-square rounded-xl sm:rounded-2xl transition-all duration-300 flex flex-col justify-between p-1.5 sm:p-2 border-2 ${
                      cell.type === 'start'
                        ? 'bg-rose-50/90 border-red-400 shadow-sm'
                        : cell.type === 'finish'
                        ? 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-500 shadow-md ring-2 ring-amber-300/60'
                        : cell.type === 'flower'
                        ? 'bg-pink-50/90 border-pink-300 shadow-xs'
                        : 'bg-white/95 border-amber-200/90 hover:border-amber-400 shadow-xs'
                    } ${isCurrentActive ? 'ring-4 ring-amber-400 scale-[1.03] z-20 shadow-lg' : ''}`}
                  >
                    {/* Top Row inside Cell: Cell Number Badge + Path Arrow */}
                    <div className="flex items-center justify-between w-full">
                      <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-100/90 text-amber-900 text-[10px] sm:text-xs font-black shadow-2xs">
                        {cell.id}
                      </span>

                      {/* Directional Hints along the serpentine path */}
                      {cell.id < 20 && (
                        <span className="text-amber-400/80 hidden sm:inline-block">
                          {/* Row 1: moves left */}
                          {cell.id >= 1 && cell.id <= 4 && <ArrowLeft className="w-3.5 h-3.5" />}
                          {/* Row 1 -> Row 2 turn */}
                          {cell.id === 5 && <ArrowUp className="w-3.5 h-3.5 text-orange-500 animate-pulse" />}
                          {/* Row 2: moves right */}
                          {cell.id >= 6 && cell.id <= 9 && <ArrowRight className="w-3.5 h-3.5" />}
                          {/* Row 2 -> Row 3 turn */}
                          {cell.id === 10 && <ArrowUp className="w-3.5 h-3.5 text-orange-500 animate-pulse" />}
                          {/* Row 3: moves left */}
                          {cell.id >= 11 && cell.id <= 14 && <ArrowLeft className="w-3.5 h-3.5" />}
                          {/* Row 3 -> Row 4 turn */}
                          {cell.id === 15 && <ArrowUp className="w-3.5 h-3.5 text-orange-500 animate-pulse" />}
                          {/* Row 4: moves right */}
                          {cell.id >= 16 && cell.id <= 19 && <ArrowRight className="w-3.5 h-3.5" />}
                        </span>
                      )}
                    </div>

                    {/* Cell Content */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center my-0.5">
                      {/* START CELL */}
                      {cell.type === 'start' && (
                        <div className="flex flex-col items-center justify-center">
                          <span className="font-display font-black text-xs sm:text-base md:text-lg text-red-600 tracking-wider">
                            XUẤT PHÁT
                          </span>
                          <span className="text-[10px] text-red-500 font-bold hidden sm:flex items-center gap-0.5 mt-0.5">
                            <ArrowLeft className="w-3 h-3 animate-pulse" /> Sang ô 2
                          </span>
                        </div>
                      )}

                      {/* FINISH CELL */}
                      {cell.type === 'finish' && (
                        <div className="flex flex-col items-center justify-center">
                          <div className="flex items-center gap-1 text-amber-600">
                            <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 fill-red-600" />
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                          </div>
                          <span className="font-display font-black text-sm sm:text-lg md:text-xl text-red-600 tracking-wider">
                            ĐÍCH
                          </span>
                        </div>
                      )}

                      {/* FLOWER CELL */}
                      {cell.type === 'flower' && (
                        <div className="flex flex-col items-center justify-center group" title="Bông hoa cúc cười - Tự vượt qua!">
                          {/* Cute Pink Smiling Daisy SVG */}
                          <svg className="w-7 h-7 sm:w-10 sm:h-10 text-pink-400 animate-bounce-gentle" viewBox="0 0 100 100" fill="none">
                            {/* Petals */}
                            <circle cx="50" cy="20" r="14" fill="#F472B6" />
                            <circle cx="50" cy="80" r="14" fill="#F472B6" />
                            <circle cx="20" cy="50" r="14" fill="#F472B6" />
                            <circle cx="80" cy="50" r="14" fill="#F472B6" />
                            <circle cx="28" cy="28" r="14" fill="#FBCFE8" />
                            <circle cx="72" cy="28" r="14" fill="#FBCFE8" />
                            <circle cx="28" cy="72" r="14" fill="#FBCFE8" />
                            <circle cx="72" cy="72" r="14" fill="#FBCFE8" />
                            {/* Flower Center */}
                            <circle cx="50" cy="50" r="22" fill="#FBBF24" stroke="#F59E0B" strokeWidth="3" />
                            {/* Smiling Face */}
                            <circle cx="43" cy="45" r="3" fill="#1E293B" />
                            <circle cx="57" cy="45" r="3" fill="#1E293B" />
                            {/* Cheeks */}
                            <ellipse cx="38" cy="53" rx="3" ry="1.5" fill="#F43F5E" opacity="0.6" />
                            <ellipse cx="62" cy="53" rx="3" ry="1.5" fill="#F43F5E" opacity="0.6" />
                            {/* Mouth */}
                            <path d="M43 53 Q50 61 57 53" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                          </svg>
                          <span className="text-[9px] sm:text-[11px] font-bold text-pink-700 mt-0.5 hidden xs:inline">
                            Tự vượt qua
                          </span>
                        </div>
                      )}

                      {/* MATH CHALLENGE CELL */}
                      {cell.type === 'number' && (() => {
                        const qData = getCellQuestion(cell, currentTopic);
                        return (
                          <div className="flex flex-col items-center justify-center w-full px-1">
                            <div className="font-display font-black text-slate-900 text-[11px] sm:text-sm md:text-base leading-tight tracking-tight text-center break-words">
                              {qData.cellDisplay}
                            </div>

                            {/* Ladder or Slide Tag */}
                            {cell.ladderTo && (
                              <span className="mt-1 px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] sm:text-[10px] font-black rounded-md border border-amber-300 shadow-2xs flex items-center gap-0.5">
                                🪜 Lên ô {cell.ladderTo}
                              </span>
                            )}
                            {cell.slideTo && (
                              <span className="mt-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-black rounded-md border border-emerald-300 shadow-2xs flex items-center gap-0.5">
                                🛝 Xuống ô {cell.slideTo}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Bottom Row inside Cell: Player Tokens */}
                    <div className="h-5 sm:h-7 w-full flex items-center justify-center gap-1 z-20">
                      {cellPlayers.map((player) => {
                        const isActive = player.id === activePlayerId;
                        return (
                          <div
                            key={player.id}
                            className={`flex items-center justify-center rounded-full transition-all duration-300 ${
                              player.themeColor === 'red'
                                ? 'bg-gradient-to-r from-red-500 to-rose-600 border-2 border-white text-white ring-2 ring-red-400'
                                : 'bg-gradient-to-r from-blue-500 to-cyan-600 border-2 border-white text-white ring-2 ring-blue-400'
                            } shadow-md px-1.5 py-0.5 ${
                              isActive ? 'animate-bounce-gentle scale-110 z-30' : 'opacity-90'
                            }`}
                            title={`${player.name} (${player.avatar})`}
                          >
                            <span className="text-xs sm:text-sm">{player.avatar}</span>
                            <span className="text-[10px] font-black hidden md:inline ml-0.5">
                              {player.id === 1 ? 'P1' : 'P2'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* SVG Overlay: Hand-Drawn Ladders & Chutes in 2D illustration style */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-15"
            viewBox="0 0 1000 800"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Bamboo gradient for ladders */}
              <linearGradient id="bambooGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              {/* Green gradient for slides */}
              <linearGradient id="slideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>

              <filter id="softDropShadow" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="3" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* LADDER 1: From Cell 3 (Row 3, Col 2 -> x: 500, y: 700) to Cell 6 (Row 2, Col 0 -> x: 100, y: 500) */}
            <g filter="url(#softDropShadow)">
              {/* Rails */}
              <line x1="480" y1="710" x2="110" y2="495" stroke="#92400E" strokeWidth="12" strokeLinecap="round" />
              <line x1="480" y1="710" x2="110" y2="495" stroke="url(#bambooGrad)" strokeWidth="8" strokeLinecap="round" />

              <line x1="510" y1="685" x2="140" y2="470" stroke="#92400E" strokeWidth="12" strokeLinecap="round" />
              <line x1="510" y1="685" x2="140" y2="470" stroke="url(#bambooGrad)" strokeWidth="8" strokeLinecap="round" />

              {/* Rungs */}
              {[0.15, 0.32, 0.5, 0.68, 0.85].map((t, idx) => {
                const rx1 = 480 + (110 - 480) * t;
                const ry1 = 710 + (495 - 710) * t;
                const rx2 = 510 + (140 - 510) * t;
                const ry2 = 685 + (470 - 685) * t;
                return (
                  <g key={`l1-${idx}`}>
                    <line x1={rx1} y1={ry1} x2={rx2} y2={ry2} stroke="#78350F" strokeWidth="9" strokeLinecap="round" />
                    <line x1={rx1} y1={ry1} x2={rx2} y2={ry2} stroke="#FDE68A" strokeWidth="5" strokeLinecap="round" />
                  </g>
                );
              })}
            </g>

            {/* LADDER 2: From Cell 13 (Row 1, Col 2 -> x: 500, y: 300) to Cell 17 (Row 0, Col 1 -> x: 300, y: 100) */}
            <g filter="url(#softDropShadow)">
              {/* Rails */}
              <line x1="485" y1="310" x2="295" y2="95" stroke="#92400E" strokeWidth="12" strokeLinecap="round" />
              <line x1="485" y1="310" x2="295" y2="95" stroke="url(#bambooGrad)" strokeWidth="8" strokeLinecap="round" />

              <line x1="515" y1="285" x2="325" y2="70" stroke="#92400E" strokeWidth="12" strokeLinecap="round" />
              <line x1="515" y1="285" x2="325" y2="70" stroke="url(#bambooGrad)" strokeWidth="8" strokeLinecap="round" />

              {/* Rungs */}
              {[0.2, 0.4, 0.6, 0.8].map((t, idx) => {
                const rx1 = 485 + (295 - 485) * t;
                const ry1 = 310 + (95 - 310) * t;
                const rx2 = 515 + (325 - 515) * t;
                const ry2 = 285 + (70 - 285) * t;
                return (
                  <g key={`l2-${idx}`}>
                    <line x1={rx1} y1={ry1} x2={rx2} y2={ry2} stroke="#78350F" strokeWidth="9" strokeLinecap="round" />
                    <line x1={rx1} y1={ry1} x2={rx2} y2={ry2} stroke="#FDE68A" strokeWidth="5" strokeLinecap="round" />
                  </g>
                );
              })}
            </g>

            {/* SLIDE 1 (Green Chute): From Cell 12 (Row 1, Col 3 -> x: 700, y: 300) to Cell 10 (Row 2, Col 4 -> x: 900, y: 500) */}
            <g filter="url(#softDropShadow)">
              {/* Slide Outer Track with shadow */}
              <path
                d="M 690 300 C 650 370, 780 430, 890 510"
                fill="none"
                stroke="#065F46"
                strokeWidth="32"
                strokeLinecap="round"
              />
              {/* Slide Chute Body */}
              <path
                d="M 690 300 C 650 370, 780 430, 890 510"
                fill="none"
                stroke="url(#slideGrad)"
                strokeWidth="24"
                strokeLinecap="round"
              />
              {/* Slide Highlight Reflection */}
              <path
                d="M 685 295 C 645 365, 775 425, 885 505"
                fill="none"
                stroke="#A7F3D0"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.8"
              />

              {/* Slide Top Entrance Arch */}
              <circle cx="690" cy="300" r="14" fill="#047857" stroke="#A7F3D0" strokeWidth="3" />
              
              {/* Slide Bottom Exit Splash/Ramp */}
              <path
                d="M 875 510 Q 900 525 920 520"
                stroke="#047857"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
