import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface Dice3DProps {
  value: number; // 1 to 6
  isRolling: boolean;
  canRoll: boolean;
  onRoll: () => void;
  playerName: string;
  themeColor: 'red' | 'blue';
  isAI?: boolean;
}

export const Dice3D: React.FC<Dice3DProps> = ({
  value,
  isRolling,
  canRoll,
  onRoll,
  playerName,
  themeColor,
  isAI,
}) => {
  const [internalRollAnim, setInternalRollAnim] = useState(false);

  const handleRollClick = () => {
    if (!canRoll || isRolling || isAI) return;
    setInternalRollAnim(true);
    sound.playDiceRoll();
    onRoll();
    setTimeout(() => {
      setInternalRollAnim(false);
    }, 1100);
  };

  // Render dots for a given face value (1 to 6)
  const renderDots = (num: number) => {
    switch (num) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <span className="w-6 h-6 rounded-full bg-red-600 shadow-inner"></span>
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full flex justify-between p-3">
            <span className="w-4 h-4 rounded-full bg-slate-800 shadow-inner"></span>
            <span className="w-4 h-4 rounded-full bg-slate-800 shadow-inner self-end"></span>
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex justify-between p-3">
            <span className="w-4 h-4 rounded-full bg-slate-800 shadow-inner"></span>
            <span className="w-4 h-4 rounded-full bg-slate-800 shadow-inner self-center"></span>
            <span className="w-4 h-4 rounded-full bg-slate-800 shadow-inner self-end"></span>
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full grid grid-cols-2 p-2.5 gap-2 content-between">
            <span className="w-4 h-4 rounded-full bg-red-500 shadow-inner"></span>
            <span className="w-4 h-4 rounded-full bg-red-500 shadow-inner justify-self-end"></span>
            <span className="w-4 h-4 rounded-full bg-red-500 shadow-inner"></span>
            <span className="w-4 h-4 rounded-full bg-red-500 shadow-inner justify-self-end"></span>
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full relative p-2.5">
            <div className="flex justify-between">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner"></span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-4 h-4 rounded-full bg-red-600 shadow-inner"></span>
            </div>
            <div className="flex justify-between absolute bottom-2.5 left-2.5 right-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner"></span>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full grid grid-cols-2 grid-rows-3 p-2.5 gap-x-3 gap-y-1 content-between">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner justify-self-center"></span>
            <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner justify-self-center"></span>
            <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner justify-self-center"></span>
            <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner justify-self-center"></span>
            <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner justify-self-center"></span>
            <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner justify-self-center"></span>
          </div>
        );
      default:
        return null;
    }
  };

  const rollingActive = isRolling || internalRollAnim;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* 3D Dice Display Box */}
      <div
        onClick={handleRollClick}
        className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-white via-amber-50 to-orange-100 border-3 ${
          themeColor === 'red' ? 'border-orange-400' : 'border-blue-400'
        } shadow-lg cursor-pointer transition-all duration-300 select-none flex items-center justify-center ${
          canRoll && !isAI ? 'hover:scale-105 hover:shadow-xl active:scale-95 animate-pulse-ring' : ''
        } ${rollingActive ? 'animate-dice-roll' : ''}`}
        title={canRoll && !isAI ? 'Bấm để gieo xúc xắc!' : isAI ? 'Robot đang gieo...' : 'Đợi đến lượt'}
      >
        {/* Dice face */}
        <div className="w-full h-full p-2 flex items-center justify-center">
          {renderDots(value)}
        </div>

        {/* Gloss highlight */}
        <div className="absolute top-1 left-2 right-2 h-4 bg-white/60 rounded-full blur-[1px] pointer-events-none"></div>

        {/* Rolling badge */}
        {rollingActive && (
          <div className="absolute -bottom-2 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm animate-bounce">
            Đang lắc...
          </div>
        )}
      </div>

      {/* Button to roll */}
      <button
        onClick={handleRollClick}
        disabled={!canRoll || isRolling || isAI}
        className={`mt-2.5 px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl font-extrabold text-sm sm:text-base transition-all shadow-md flex items-center gap-2 ${
          canRoll && !isAI
            ? themeColor === 'red'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white active:scale-95 cursor-pointer ring-2 ring-orange-300'
              : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white active:scale-95 cursor-pointer ring-2 ring-blue-300'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
        }`}
      >
        <span>🎲 Gieo xúc xắc</span>
      </button>

      {/* Helper text */}
      <div className="mt-1 text-center">
        {canRoll && !isAI ? (
          <span className="text-xs font-bold text-amber-800 animate-pulse">
            Lượt của <span className={themeColor === 'red' ? 'text-red-600' : 'text-blue-600'}>{playerName}</span>!
          </span>
        ) : isAI && canRoll ? (
          <span className="text-xs font-bold text-slate-600">
            🤖 Robot đang chuẩn bị gieo...
          </span>
        ) : (
          <span className="text-xs font-semibold text-slate-500">
            Kết quả: <strong className="text-slate-800 text-sm">{value} chấm</strong>
          </span>
        )}
      </div>
    </div>
  );
};
