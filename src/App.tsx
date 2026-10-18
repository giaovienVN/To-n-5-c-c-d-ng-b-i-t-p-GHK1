import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameMode, Player, TurnPhase, GameSettings, BoardCell, GameLog } from './types/game';
import { BOARD_CELLS } from './data/boardData';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { GameControls } from './components/GameControls';
import { QuestionModal } from './components/QuestionModal';
import { VictoryModal } from './components/VictoryModal';
import { DecimalGuideModal } from './components/DecimalGuideModal';
import { sound } from './utils/audio';

export default function App() {
  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [settings, setSettings] = useState<GameSettings>({
    timeLimit: 15,
    soundEnabled: true,
    aiDifficulty: 'normal',
    mathTopic: 'decimal_compare',
  });

  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      name: 'Bé Thông Thái',
      isAI: false,
      avatar: '🧒',
      themeColor: 'red',
      position: 1,
      previousPosition: 1,
      correctCount: 0,
      wrongCount: 0,
      laddersClimbed: 0,
      slidesTaken: 0,
    },
    {
      id: 2,
      name: 'Robot Bé Bi',
      isAI: true,
      avatar: '🤖',
      themeColor: 'blue',
      position: 1,
      previousPosition: 1,
      correctCount: 0,
      wrongCount: 0,
      laddersClimbed: 0,
      slidesTaken: 0,
    },
  ]);

  const [activePlayerId, setActivePlayerId] = useState<1 | 2>(1);
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('waiting_for_roll');
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [currentQuestionCell, setCurrentQuestionCell] = useState<BoardCell | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Chào mừng bạn! Hãy gieo xúc xắc để bắt đầu.');
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [specialActionBanner, setSpecialActionBanner] = useState<{
    text: string;
    type: 'ladder' | 'slide' | 'flower' | 'correct' | 'wrong';
  } | null>(null);

  const activePlayer = players.find((p) => p.id === activePlayerId) || players[0];

  // Sync sound settings
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Handle Game Mode change
  const handleSelectMode = (mode: GameMode) => {
    if (mode === gameMode) return;
    setGameMode(mode);
    if (mode === 'single') {
      setPlayers([
        {
          id: 1,
          name: 'Bé Thông Thái',
          isAI: false,
          avatar: '🧒',
          themeColor: 'red',
          position: 1,
          previousPosition: 1,
          correctCount: 0,
          wrongCount: 0,
          laddersClimbed: 0,
          slidesTaken: 0,
        },
        {
          id: 2,
          name: 'Robot Bé Bi',
          isAI: true,
          avatar: '🤖',
          themeColor: 'blue',
          position: 1,
          previousPosition: 1,
          correctCount: 0,
          wrongCount: 0,
          laddersClimbed: 0,
          slidesTaken: 0,
        },
      ]);
    } else {
      setPlayers([
        {
          id: 1,
          name: 'Người chơi 1 (Đỏ)',
          isAI: false,
          avatar: '🧒',
          themeColor: 'red',
          position: 1,
          previousPosition: 1,
          correctCount: 0,
          wrongCount: 0,
          laddersClimbed: 0,
          slidesTaken: 0,
        },
        {
          id: 2,
          name: 'Người chơi 2 (Xanh)',
          isAI: false,
          avatar: '👧',
          themeColor: 'blue',
          position: 1,
          previousPosition: 1,
          correctCount: 0,
          wrongCount: 0,
          laddersClimbed: 0,
          slidesTaken: 0,
        },
      ]);
    }
    setActivePlayerId(1);
    setTurnPhase('waiting_for_roll');
    setWinner(null);
    setStatusMessage('Đã chuyển chế độ! Hãy gieo xúc xắc để bắt đầu.');
  };

  // Reset entire game
  const handleResetGame = () => {
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        position: 1,
        previousPosition: 1,
        correctCount: 0,
        wrongCount: 0,
        laddersClimbed: 0,
        slidesTaken: 0,
      }))
    );
    setActivePlayerId(1);
    setTurnPhase('waiting_for_roll');
    setWinner(null);
    setCurrentQuestionCell(null);
    setSpecialActionBanner(null);
    setStatusMessage('Ván chơi mới đã sẵn sàng! Gieo xúc xắc nào!');
  };

  // Step-by-step pawn movement
  const stepPawnTo = useCallback((playerId: 1 | 2, startPos: number, targetPos: number, onComplete: () => void) => {
    let currentStep = startPos;
    const direction = targetPos > startPos ? 1 : -1;

    const interval = setInterval(() => {
      currentStep += direction;
      sound.playStep();

      setPlayers((prev) =>
        prev.map((p) => (p.id === playerId ? { ...p, position: currentStep } : p))
      );

      if (currentStep === targetPos) {
        clearInterval(interval);
        setTimeout(onComplete, 350);
      }
    }, 280);
  }, []);

  // Next Turn
  const endTurn = useCallback(() => {
    setCurrentQuestionCell(null);
    setSpecialActionBanner(null);

    const nextPlayerId: 1 | 2 = activePlayerId === 1 ? 2 : 1;
    setActivePlayerId(nextPlayerId);
    setTurnPhase('waiting_for_roll');

    const nextP = players.find((p) => p.id === nextPlayerId);
    if (nextP) {
      setStatusMessage(`Đến lượt của ${nextP.name}. Hãy gieo xúc xắc!`);
    }
  }, [activePlayerId, players]);

  // Roll Dice logic
  const handleRollDice = useCallback(() => {
    if (turnPhase !== 'waiting_for_roll' || isRolling) return;

    setIsRolling(true);
    setTurnPhase('rolling');
    sound.playDiceRoll();

    // Roll random 1 to 6
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceValue(roll);

    setTimeout(() => {
      setIsRolling(false);
      setTurnPhase('moving');

      const currentPos = activePlayer.position;
      const targetPos = Math.min(20, currentPos + roll);

      // Save previous position in case of wrong answer
      setPlayers((prev) =>
        prev.map((p) => (p.id === activePlayer.id ? { ...p, previousPosition: currentPos } : p))
      );

      setStatusMessage(`${activePlayer.name} gieo được ${roll} chấm! Đang tiến đến ô ${targetPos}...`);

      // Step pawn smoothly
      stepPawnTo(activePlayer.id, currentPos, targetPos, () => {
        // Arrived at target cell
        const landedCell = BOARD_CELLS.find((c) => c.id === targetPos);
        if (!landedCell) {
          endTurn();
          return;
        }

        // 1. If WINNER (Cell 20 ĐÍCH)
        if (landedCell.type === 'finish' || targetPos === 20) {
          setTurnPhase('game_over');
          setWinner(activePlayer);
          setStatusMessage(`🎉 ${activePlayer.name} đã về đích xuất sắc!`);
          return;
        }

        // 2. If FLOWER CELL (5 or 16)
        if (landedCell.type === 'flower') {
          setTurnPhase('flower_bonus');
          sound.playFlower();
          setSpecialActionBanner({
            text: '🌸 Gặp bông hoa cúc cười, em tự tin vượt qua an toàn!',
            type: 'flower',
          });
          setStatusMessage(`${activePlayer.name} gặp Bông hoa cười! Tự tin vượt qua an toàn!`);
          setTimeout(() => {
            endTurn();
          }, 2000);
          return;
        }

        // 3. If NUMBER COMPARISON CELL
        if (landedCell.type === 'number') {
          setTurnPhase('answering');
          setCurrentQuestionCell(landedCell);
          setStatusMessage(`${activePlayer.name} đến ô ${targetPos}. Hãy đọc số lớn hơn trong ô đó!`);
          return;
        }

        // Otherwise (fallback)
        endTurn();
      });
    }, 1100);
  }, [turnPhase, isRolling, activePlayer, stepPawnTo, endTurn]);

  // AI Automatic Turn Handler
  useEffect(() => {
    if (activePlayer.isAI && turnPhase === 'waiting_for_roll' && !isRolling && !winner) {
      const timer = setTimeout(() => {
        handleRollDice();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [activePlayer.isAI, turnPhase, isRolling, winner, handleRollDice]);

  // Spacebar hotkey to roll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && turnPhase === 'waiting_for_roll' && !activePlayer.isAI && !isRolling && !winner) {
        e.preventDefault();
        handleRollDice();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [turnPhase, activePlayer.isAI, isRolling, winner, handleRollDice]);

  // Handle Question Answer
  const handleAnswerQuestion = (selectedNum: string, isCorrect: boolean) => {
    if (!currentQuestionCell) return;

    if (isCorrect) {
      // Correct!
      setPlayers((prev) =>
        prev.map((p) => (p.id === activePlayer.id ? { ...p, correctCount: p.correctCount + 1 } : p))
      );

      // Check for Ladder or Slide on this cell
      if (currentQuestionCell.ladderTo) {
        const ladderTarget = currentQuestionCell.ladderTo;
        setTurnPhase('climbing');
        sound.playLadder();
        setSpecialActionBanner({
          text: `🪜 Hoan hô! Em được leo cầu thang tre từ ô ${currentQuestionCell.id} lên ô ${ladderTarget}!`,
          type: 'ladder',
        });
        setStatusMessage(`🪜 ${activePlayer.name} đang leo cầu thang lên ô ${ladderTarget}!`);

        setTimeout(() => {
          setPlayers((prev) =>
            prev.map((p) =>
              p.id === activePlayer.id
                ? { ...p, position: ladderTarget, laddersClimbed: p.laddersClimbed + 1 }
                : p
            )
          );
          setTimeout(() => {
            endTurn();
          }, 1500);
        }, 1200);
        return;
      }

      if (currentQuestionCell.slideTo) {
        const slideTarget = currentQuestionCell.slideTo;
        setTurnPhase('sliding');
        sound.playSlide();
        setSpecialActionBanner({
          text: `🛝 Đỉnh cầu trượt! Em bị trượt từ ô ${currentQuestionCell.id} xuống ô ${slideTarget}!`,
          type: 'slide',
        });
        setStatusMessage(`🛝 ${activePlayer.name} trượt cầu trượt xuống ô ${slideTarget}!`);

        setTimeout(() => {
          setPlayers((prev) =>
            prev.map((p) =>
              p.id === activePlayer.id
                ? { ...p, position: slideTarget, slidesTaken: p.slidesTaken + 1 }
                : p
            )
          );
          setTimeout(() => {
            endTurn();
          }, 1500);
        }, 1200);
        return;
      }

      // No ladder or slide, stays in place
      setCurrentQuestionCell(null);
      endTurn();
    } else {
      // Wrong answer or timeout -> Must return to previous position!
      setPlayers((prev) =>
        prev.map((p) => (p.id === activePlayer.id ? { ...p, wrongCount: p.wrongCount + 1 } : p))
      );

      const prevPos = activePlayer.previousPosition;
      setTurnPhase('moving');
      setCurrentQuestionCell(null);
      setSpecialActionBanner({
        text: `⚠️ Chưa chính xác! Theo luật chơi, em phải quay về ô trước đó (Ô ${prevPos})!`,
        type: 'wrong',
      });
      setStatusMessage(`${activePlayer.name} đọc sai! Phải quay về ô ${prevPos}.`);

      setTimeout(() => {
        // Step back to previous position
        stepPawnTo(activePlayer.id, currentQuestionCell.id, prevPos, () => {
          endTurn();
        });
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-notebook flex flex-col items-center justify-between p-2 sm:p-4 md:p-6 text-slate-800 selection:bg-amber-200">
      {/* Top Header */}
      <Header
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
        onOpenGuide={() => setShowGuide(true)}
        onResetGame={handleResetGame}
      />

      {/* Special Event Banner */}
      {specialActionBanner && (
        <div className="w-full max-w-5xl mx-auto mb-3 animate-in fade-in slide-in-from-top-3">
          <div
            className={`p-3 sm:p-4 rounded-2xl font-black text-xs sm:text-sm text-center shadow-md border-2 flex items-center justify-center gap-2 ${
              specialActionBanner.type === 'ladder'
                ? 'bg-amber-100 border-amber-400 text-amber-950'
                : specialActionBanner.type === 'slide'
                ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                : specialActionBanner.type === 'flower'
                ? 'bg-pink-100 border-pink-400 text-pink-950'
                : 'bg-rose-100 border-rose-400 text-rose-950'
            }`}
          >
            <span>{specialActionBanner.text}</span>
          </div>
        </div>
      )}

      {/* The 4x5 Board */}
      <main className="w-full flex-1 flex flex-col items-center justify-center">
        <Board
          players={players}
          activePlayerId={activePlayerId}
          currentTopic={settings.mathTopic}
          highlightedCellId={currentQuestionCell ? currentQuestionCell.id : activePlayer.position}
        />

        {/* Game Controls & Status */}
        <GameControls
          gameMode={gameMode}
          onSelectMode={handleSelectMode}
          players={players}
          activePlayerId={activePlayerId}
          turnPhase={turnPhase}
          diceValue={diceValue}
          isRolling={isRolling}
          onRollDice={handleRollDice}
          settings={settings}
          onUpdateSettings={(newS) => {
            if (newS.mathTopic && newS.mathTopic !== settings.mathTopic) {
              const topicLabels: Record<string, string> = {
                decimal_compare: 'So sánh số thập phân (SGK)',
                fraction_vs_decimal: 'Phân số & Số thập phân',
                unit_conversion: 'Đổi đơn vị đo & Diện tích',
                rounding: 'Làm tròn số',
                fraction_arithmetic: 'Phép tính phân số (+, -, ×)',
                mixed: 'Tổng hợp tất cả dạng bài',
              };
              setStatusMessage(`Đã chuyển chủ đề sang: ${topicLabels[newS.mathTopic] || newS.mathTopic}!`);
            }
            setSettings((s) => ({ ...s, ...newS }));
          }}
          statusMessage={statusMessage}
        />
      </main>

      {/* Footer copyright and textbook note */}
      <footer className="w-full max-w-5xl mx-auto mt-4 text-center text-[11px] font-bold text-slate-400 pb-2">
        Toán Tiểu Học • Trò chơi Cầu Thang – Cầu Trượt • Vở Bài Tập & Sách Giáo Khoa Toán
      </footer>

      {/* Question Modal with Countdown Timer */}
      {currentQuestionCell && (
        <QuestionModal
          cell={currentQuestionCell}
          player={activePlayer}
          topic={settings.mathTopic}
          timeLimit={settings.timeLimit}
          onAnswer={handleAnswerQuestion}
          isAI={activePlayer.isAI}
        />
      )}

      {/* Victory Celebration Modal */}
      {winner && <VictoryModal winner={winner} onRematch={handleResetGame} />}

      {/* Math Guide Modal */}
      {showGuide && <DecimalGuideModal onClose={() => setShowGuide(false)} initialTopic={settings.mathTopic} />}
    </div>
  );
}
