import React, { useEffect, useState, useRef } from 'react';
import { BoardCell, Player, MathTopic } from '../types/game';
import { getCellQuestion } from '../data/boardData';
import { sound } from '../utils/audio';
import { Clock, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

interface QuestionModalProps {
  cell: BoardCell;
  player: Player;
  topic: MathTopic;
  timeLimit: number; // in seconds, 0 = unlimited
  onAnswer: (selectedAnswer: string, isCorrect: boolean) => void;
  isAI?: boolean;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  cell,
  player,
  topic,
  timeLimit,
  onAnswer,
  isAI,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit > 0 ? timeLimit : 15);
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [resultState, setResultState] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const questionData = getCellQuestion(cell, topic);
  const { questionPrompt, options, correctAnswer, explanation, topicLabel } = questionData;

  // If AI's turn, simulate AI thinking and choosing
  useEffect(() => {
    if (isAI && !isAnswered) {
      const thinkTime = 1600 + Math.random() * 800;
      const aiTimer = setTimeout(() => {
        // AI accuracy is 88%
        const isSmart = Math.random() < 0.88;
        if (isSmart) {
          handleSelect(correctAnswer);
        } else {
          // pick a wrong one
          const wrongOptions = options.filter((o) => o !== correctAnswer);
          const wrongChoice = wrongOptions.length > 0 ? wrongOptions[0] : correctAnswer;
          handleSelect(wrongChoice);
        }
      }, thinkTime);
      return () => clearTimeout(aiTimer);
    }
  }, [isAI, isAnswered, correctAnswer, options]);

  // Timer countdown
  useEffect(() => {
    if (timeLimit <= 0 || isAnswered || isAI) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        // Play tick sound when 4 seconds or less remain
        if (prev <= 4) {
          sound.playTick(true);
        } else {
          sound.playTick(false);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLimit, isAnswered, isAI]);

  const handleTimeout = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setResultState('timeout');
    sound.playWrong();
  };

  const handleSelect = (choice: string) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelected(choice);
    setIsAnswered(true);

    const isCorrect = choice === correctAnswer;
    if (isCorrect) {
      setResultState('correct');
      sound.playCorrect();
    } else {
      setResultState('wrong');
      sound.playWrong();
    }
  };

  const handleContinue = () => {
    sound.playClick();
    const isCorrect = resultState === 'correct';
    onAnswer(selected || '', isCorrect);
  };

  // Percentage for progress bar
  const progressPercent = timeLimit > 0 ? (timeLeft / timeLimit) * 100 : 100;
  const isUrgent = timeLimit > 0 && timeLeft <= 4;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border-4 border-amber-300 transform transition-all animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className={`p-4 text-white text-center font-extrabold flex items-center justify-between px-5 sm:px-6 ${
          player.themeColor === 'red' 
            ? 'bg-gradient-to-r from-red-500 via-orange-500 to-amber-500' 
            : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{player.avatar}</span>
            <span className="text-sm sm:text-base tracking-wide font-black">{player.name} • Ô {cell.id}</span>
          </div>

          {/* Timer Display */}
          {timeLimit > 0 && !isAI && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-black shadow-xs ${
              isUrgent ? 'bg-red-600 text-white animate-pulse' : 'bg-black/20 text-white'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          )}

          {isAI && (
            <div className="bg-white/20 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
              <span className="animate-spin text-xs">⚙️</span> Robot đang tính...
            </div>
          )}
        </div>

        {/* Timer Bar */}
        {timeLimit > 0 && !isAI && !isAnswered && (
          <div className="w-full bg-slate-100 h-2">
            <div
              className={`h-full transition-all duration-1000 linear ${
                isUrgent ? 'bg-red-500' : timeLeft <= timeLimit / 2 ? 'bg-amber-400' : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 text-center">
          {/* Topic Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2 border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{topicLabel}</span>
          </div>

          {/* Question Prompt */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 mb-5 leading-snug">
            {questionPrompt}
          </h3>

          {/* Answer Options Grid */}
          <div className={`grid gap-3 my-2 ${options.length === 2 ? 'grid-cols-2' : options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {options.map((optStr, idx) => {
              const isThisCorrect = optStr === correctAnswer;
              const isThisSelected = selected === optStr;
              
              let btnClass = 'bg-amber-50/80 border-3 border-amber-300 text-slate-900 hover:bg-amber-100 hover:scale-102 hover:border-amber-400 active:scale-98 shadow-sm';
              
              if (isAnswered) {
                if (isThisCorrect) {
                  btnClass = 'bg-emerald-100 border-3 border-emerald-500 text-emerald-950 font-black shadow-md ring-2 ring-emerald-300';
                } else if (isThisSelected && !isThisCorrect) {
                  btnClass = 'bg-rose-100 border-3 border-rose-500 text-rose-950 font-bold line-through opacity-70';
                } else {
                  btnClass = 'bg-slate-50 border-2 border-slate-200 text-slate-400 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(optStr)}
                  disabled={isAnswered || isAI}
                  className={`p-3.5 sm:p-4 rounded-2xl text-lg sm:text-2xl font-extrabold transition-all relative flex flex-col items-center justify-center cursor-pointer ${btnClass}`}
                >
                  <span className="font-display tracking-wide">{optStr}</span>
                  {isAnswered && isThisCorrect && (
                    <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-200/90 px-2 py-0.5 rounded-full mt-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Đáp án đúng
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* AI Thinking Animation */}
          {isAI && !isAnswered && (
            <div className="mt-4 p-3 bg-sky-50 rounded-xl text-sky-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 animate-pulse">
              <span className="animate-spin text-base">⚙️</span> Robot Bé Bi đang phân tích và tìm câu trả lời...
            </div>
          )}

          {/* Result Feedback Banner */}
          {resultState && (
            <div className={`mt-4 p-4 rounded-2xl text-left border-2 animate-in fade-in slide-in-from-bottom-2 ${
              resultState === 'correct' 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="flex items-center gap-2 font-black text-sm sm:text-base mb-1">
                {resultState === 'correct' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Hoan hô! Em đã trả lời chính xác!</span>
                  </>
                ) : resultState === 'timeout' ? (
                  <>
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Đã hết thời gian suy nghĩ!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>Chưa đúng rồi! Cố gắng câu sau nhé!</span>
                  </>
                )}
              </div>

              {/* Step-by-step mathematical explanation */}
              <div className="text-xs sm:text-sm font-medium mt-1 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-black/5">
                <span className="font-bold text-slate-900">Cách giải: </span>
                {explanation}
              </div>

              {/* Consequence rule */}
              <div className="mt-2 text-xs font-bold">
                {resultState === 'correct' ? (
                  <span className="text-emerald-700">
                    ✨ Em được giữ nguyên vị trí ở ô {cell.id}!
                    {cell.ladderTo && ' Đồng thời được leo cầu thang lên ô cao hơn!'}
                  </span>
                ) : (
                  <span className="text-rose-700">
                    ⚠️ Theo luật chơi: Em phải quay về ô xuất phát trước đó (Ô {player.previousPosition})!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Continue Button */}
          {isAnswered && (
            <button
              onClick={handleContinue}
              className={`mt-4 w-full py-3 px-6 rounded-2xl font-black text-sm sm:text-base text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer ${
                resultState === 'correct'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-200'
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-orange-200'
              }`}
            >
              <span>{resultState === 'correct' ? 'Tiếp tục hành trình' : 'Quay về ô trước'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
