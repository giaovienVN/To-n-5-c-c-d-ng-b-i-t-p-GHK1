export type GameMode = 'single' | 'two_players';

export type PlayerId = 1 | 2;

export type MathTopic = 
  | 'decimal_compare'      // So sánh số thập phân (chuẩn SGK)
  | 'fraction_vs_decimal'  // So sánh phân số với số thập phân
  | 'unit_conversion'      // Đổi đơn vị độ dài & diện tích
  | 'rounding'             // Làm tròn tới số tự nhiên, hàng chục, hàng phần mười, phần trăm
  | 'fraction_arithmetic'  // Cộng, trừ, nhân 2 phân số
  | 'mixed';               // Tổng hợp tất cả các dạng bài

export interface Player {
  id: PlayerId;
  name: string;
  isAI: boolean;
  avatar: string;
  themeColor: 'red' | 'blue';
  position: number; // 1 to 20
  previousPosition: number; // where they rolled from
  correctCount: number;
  wrongCount: number;
  laddersClimbed: number;
  slidesTaken: number;
}

export type CellType = 'start' | 'finish' | 'number' | 'flower';

export interface QuestionData {
  topic: MathTopic;
  topicLabel: string;
  cellDisplay: string; // text displayed on the board cell
  questionPrompt: string; // question title
  options: string[]; // 2 to 4 answer options
  correctAnswer: string;
  explanation: string;
}

export interface BoardCell {
  id: number; // 1 to 20
  gridRow: number; // 0 (top) to 3 (bottom)
  gridCol: number; // 0 (left) to 4 (right)
  type: CellType;
  ladderTo?: number; // target cell ID if climbing up
  slideTo?: number; // target cell ID if sliding down
  title?: string;
  // Multi-topic questions dictionary for this cell
  topicQuestions?: Record<MathTopic, QuestionData>;
  // Fallback defaults for backwards compatibility
  numA?: string;
  numB?: string;
  largerNum?: string;
  explanation?: string;
}

export type TurnPhase = 
  | 'waiting_for_roll' 
  | 'rolling' 
  | 'moving' 
  | 'answering' 
  | 'climbing' 
  | 'sliding' 
  | 'flower_bonus'
  | 'turn_ended' 
  | 'game_over';

export interface GameSettings {
  timeLimit: number; // in seconds (e.g. 10, 15, 20, 0 = unlimited)
  soundEnabled: boolean;
  aiDifficulty: 'normal' | 'smart';
  mathTopic: MathTopic;
}

export interface GameLog {
  id: string;
  playerId: PlayerId;
  playerName: string;
  text: string;
  type: 'roll' | 'correct' | 'wrong' | 'ladder' | 'slide' | 'flower' | 'win';
  timestamp: Date;
}
