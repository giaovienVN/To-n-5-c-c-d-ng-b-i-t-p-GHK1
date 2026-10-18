import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Player } from '../types/game';
import { sound } from '../utils/audio';
import { Trophy, Sparkles, RotateCcw, Award, CheckCircle2 } from 'lucide-react';

interface VictoryModalProps {
  winner: Player;
  onRematch: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ winner, onRematch }) => {
  useEffect(() => {
    sound.playWin();

    // Fire fireworks confetti
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-4 border-amber-400 text-center p-6 sm:p-8 relative animate-in zoom-in-90 duration-300">
        
        {/* Golden Trophy Animation */}
        <div className="relative inline-block mb-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 mx-auto flex items-center justify-center shadow-lg border-4 border-amber-500 animate-bounce-gentle">
            <Trophy className="w-14 h-14 sm:w-16 sm:h-16 text-amber-700" />
          </div>
          <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1 animate-spin" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-amber-900 uppercase tracking-wide font-display">
          Chúc mừng chiến thắng!
        </h2>

        <div className="my-3 py-2 px-4 rounded-2xl bg-amber-50 border-2 border-amber-200 inline-flex items-center gap-2">
          <span className="text-3xl">{winner.avatar}</span>
          <span className="text-lg sm:text-xl font-black text-slate-800">
            {winner.name}
          </span>
          <span className="text-xs bg-red-500 text-white font-extrabold px-2 py-0.5 rounded-full">
            ĐÃ VỀ ĐÍCH!
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mb-5 font-semibold">
          Xuất sắc hoàn thành đường đua số thập phân và vượt qua mọi thử thách cầu thang, cầu trượt!
        </p>

        {/* Stats recap */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 mb-6 text-xs text-slate-700 grid grid-cols-2 gap-2 text-left">
          <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold">Số câu trả lời đúng</div>
              <div className="font-black text-sm text-slate-800">{winner.correctCount} câu</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl shadow-2xs">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold">Số lần leo thang</div>
              <div className="font-black text-sm text-slate-800">{winner.laddersClimbed} lần</div>
            </div>
          </div>
        </div>

        {/* Rematch Button */}
        <button
          onClick={() => {
            sound.playClick();
            onRematch();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 hover:from-red-600 hover:to-orange-600 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-orange-300/50 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Chơi lại ván mới</span>
        </button>
      </div>
    </div>
  );
};
