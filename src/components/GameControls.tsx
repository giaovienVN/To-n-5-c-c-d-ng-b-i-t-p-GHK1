import React from 'react';
import { GameMode, Player, TurnPhase, GameSettings, MathTopic } from '../types/game';
import { MATH_TOPICS } from '../data/boardData';
import { Dice3D } from './Dice3D';
import { Users, User, Clock, Award, BookMarked } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameControlsProps {
  gameMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  players: Player[];
  activePlayerId: 1 | 2;
  turnPhase: TurnPhase;
  diceValue: number;
  isRolling: boolean;
  onRollDice: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  statusMessage: string;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  onSelectMode,
  players,
  activePlayerId,
  turnPhase,
  diceValue,
  isRolling,
  onRollDice,
  settings,
  onUpdateSettings,
  statusMessage,
}) => {
  const activePlayer = players.find((p) => p.id === activePlayerId) || players[0];
  const canRoll = turnPhase === 'waiting_for_roll';
  const currentTopicInfo = MATH_TOPICS.find((t) => t.id === settings.mathTopic) || MATH_TOPICS[0];

  return (
    <div className="w-full max-w-5xl mx-auto my-3 space-y-3">
      {/* Math Topic Selector Banner */}
      <div className="bg-white/95 rounded-2xl p-3 sm:p-4 border-2 border-orange-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            <span className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wide">
              Chọn dạng bài tập toán học:
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            {currentTopicInfo.description}
          </span>
        </div>

        {/* Topic Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {MATH_TOPICS.map((topic) => {
            const isSelected = settings.mathTopic === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => {
                  sound.playClick();
                  onUpdateSettings({ mathTopic: topic.id });
                }}
                className={`p-2 rounded-xl text-left transition-all duration-200 flex flex-col justify-between cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300 scale-[1.02]'
                    : 'bg-amber-50/70 hover:bg-amber-100 text-slate-800 border-amber-200/80 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">{topic.icon}</span>
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/30 text-white' : 'bg-amber-200/80 text-amber-900'
                    }`}
                  >
                    {topic.badge}
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs font-black leading-tight line-clamp-1">
                  {topic.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
        {/* Col 1: Game Mode & Timer Settings Card */}
        <div className="bg-white/95 rounded-2xl p-4 border-2 border-orange-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-black text-amber-900 uppercase tracking-wider block mb-2">
              Chế độ người chơi
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectMode('single');
                }}
                className={`p-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  gameMode === 'single'
                    ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                    : 'bg-amber-50 text-slate-700 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>1 Người (vs Robot)</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onSelectMode('two_players');
                }}
                className={`p-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  gameMode === 'two_players'
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                    : 'bg-blue-50 text-slate-700 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>2 Người (Cặp đôi)</span>
              </button>
            </div>

            {/* Time Limit Setting */}
            <div className="mt-3 pt-3 border-t border-amber-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Thời gian trả lời:
                </span>
                <span className="font-black text-amber-900">
                  {settings.timeLimit === 0 ? 'Không giới hạn' : `${settings.timeLimit} giây`}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                {[10, 15, 20, 0].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      sound.playClick();
                      onUpdateSettings({ timeLimit: sec });
                    }}
                    className={`py-1 rounded-lg text-center transition-all cursor-pointer ${
                      settings.timeLimit === sec
                        ? 'bg-amber-600 text-white font-black shadow-xs'
                        : 'bg-slate-100 hover:bg-amber-100 text-slate-700'
                    }`}
                  >
                    {sec === 0 ? 'Tắt' : `${sec}s`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Status message */}
          <div className="mt-2 text-xs font-semibold text-slate-600 bg-amber-50/80 p-2 rounded-xl border border-amber-200/60 text-center">
            💡 <span className="text-slate-800">{statusMessage}</span>
          </div>
        </div>

        {/* Col 2: Active Player & 3D Dice */}
        <div className="bg-white/95 rounded-2xl p-4 border-2 border-orange-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          {/* Background glow of active player color */}
          <div
            className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none ${
              activePlayer.themeColor === 'red' ? 'bg-red-500' : 'bg-blue-500'
            }`}
          ></div>

          {/* Turn Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{activePlayer.avatar}</span>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                {activePlayer.isAI ? 'Lượt của Máy' : 'Lượt người chơi'}
              </div>
              <div
                className={`text-base font-black ${
                  activePlayer.themeColor === 'red' ? 'text-red-600' : 'text-blue-600'
                }`}
              >
                {activePlayer.name}
              </div>
            </div>
          </div>

          {/* 3D Tumbling Dice */}
          <Dice3D
            value={diceValue}
            isRolling={isRolling}
            canRoll={canRoll}
            onRoll={onRollDice}
            playerName={activePlayer.name}
            themeColor={activePlayer.themeColor}
            isAI={activePlayer.isAI}
          />
        </div>

        {/* Col 3: Scoreboard & Player Stats */}
        <div className="bg-white/95 rounded-2xl p-4 border-2 border-orange-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-black text-amber-900 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              Bảng theo dõi vị trí
            </span>

            <div className="space-y-2">
              {players.map((p) => {
                const isActive = p.id === activePlayerId;
                return (
                  <div
                    key={p.id}
                    className={`p-2.5 rounded-xl border-2 transition-all flex items-center justify-between ${
                      isActive
                        ? p.themeColor === 'red'
                          ? 'bg-rose-50 border-red-400 ring-2 ring-red-200'
                          : 'bg-blue-50 border-blue-400 ring-2 ring-blue-200'
                        : 'bg-slate-50/70 border-slate-200 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{p.avatar}</span>
                      <div>
                        <div className="text-xs font-black text-slate-800 flex items-center gap-1">
                          <span>{p.name}</span>
                          {p.isAI && (
                            <span className="text-[10px] bg-slate-200 px-1 rounded text-slate-600 font-bold">
                              AI
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">
                          Đúng: <strong className="text-emerald-600">{p.correctCount}</strong> | Sai:{' '}
                          <strong className="text-rose-500">{p.wrongCount}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-amber-900">Ô {p.position}</div>
                      <div className="text-[10px] text-slate-500 font-bold">
                        {p.position === 1
                          ? 'Xuất phát'
                          : p.position === 20
                          ? 'Đã về đích!'
                          : `Cách đích ${20 - p.position} ô`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Small legend */}
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-around text-[11px] font-bold text-slate-600">
            <span className="flex items-center gap-1 text-amber-700">🪜 Thang: Leo lên</span>
            <span className="flex items-center gap-1 text-emerald-700">🛝 Trượt: Xuống</span>
            <span className="flex items-center gap-1 text-pink-600">🌸 Hoa: An toàn</span>
          </div>
        </div>
      </div>
    </div>
  );
};
