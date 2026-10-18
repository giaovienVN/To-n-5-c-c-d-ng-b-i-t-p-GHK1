import React, { useState } from 'react';
import { X, BookOpen, Lightbulb, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { MathTopic } from '../types/game';

interface DecimalGuideModalProps {
  onClose: () => void;
  initialTopic?: MathTopic;
}

export const DecimalGuideModal: React.FC<DecimalGuideModalProps> = ({ onClose, initialTopic = 'decimal_compare' }) => {
  const [activeTab, setActiveTab] = useState<MathTopic>(
    initialTopic === 'mixed' ? 'decimal_compare' : initialTopic
  );

  const tabs: { id: MathTopic; title: string; icon: string }[] = [
    { id: 'decimal_compare', title: 'Số thập phân', icon: '🔢' },
    { id: 'fraction_vs_decimal', title: 'Phân số & Thập phân', icon: '⚖️' },
    { id: 'unit_conversion', title: 'Đổi đơn vị đo', icon: '📏' },
    { id: 'rounding', title: 'Làm tròn số', icon: '🎯' },
    { id: 'fraction_arithmetic', title: 'Phép tính phân số', icon: '🧮' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border-4 border-amber-300 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between px-5 sm:px-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-100" />
            <h3 className="text-base sm:text-xl font-black font-display tracking-wide">
              Sổ Tay Bí Kíp Toán Tiểu Học
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Topic Tab navigation */}
        <div className="flex border-b border-amber-200 bg-amber-50/60 px-3 pt-2 gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id);
                }}
                className={`px-3 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white text-amber-950 border-t-2 border-x border-amber-300 font-black shadow-xs'
                    : 'text-slate-600 hover:text-amber-900 hover:bg-amber-100/60'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* TAB 1: SO SÁNH SỐ THẬP PHÂN */}
          {activeTab === 'decimal_compare' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="bg-amber-50/90 border-2 border-amber-200 rounded-2xl p-3.5">
                <div className="font-black text-amber-900 text-sm mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">1</span>
                  So sánh PHẦN NGUYÊN trước
                </div>
                <p className="text-slate-600">
                  Số thập phân nào có <strong className="text-amber-900">phần nguyên lớn hơn</strong> thì số đó lớn hơn.
                </p>
                <div className="mt-2 bg-white p-2 rounded-xl border border-amber-200 font-bold text-amber-950 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Ví dụ: <strong>41,72 &gt; 31,27</strong> (vì phần nguyên 41 &gt; 31)</span>
                </div>
              </div>

              <div className="bg-blue-50/90 border-2 border-blue-200 rounded-2xl p-3.5">
                <div className="font-black text-blue-900 text-sm mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">2</span>
                  Khi phần nguyên bằng nhau: So sánh PHẦN MƯỜI
                </div>
                <p className="text-slate-600">
                  So sánh hàng phần mười ngay sau dấu phẩy. Chữ số nào lớn hơn thì số đó lớn hơn.
                </p>
                <div className="mt-2 bg-white p-2 rounded-xl border border-blue-200 font-bold text-blue-950 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Ví dụ: <strong>3,81 &gt; 3,74</strong> (vì 3 = 3, nhưng ở phần mười 8 &gt; 7)</span>
                </div>
              </div>

              <div className="bg-emerald-50/90 border-2 border-emerald-200 rounded-2xl p-3.5">
                <div className="font-black text-emerald-900 text-sm mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold">3</span>
                  Khi phần mười bằng nhau: So sánh PHẦN TRĂM
                </div>
                <div className="mt-2 bg-white p-2 rounded-xl border border-emerald-200 font-bold text-emerald-950 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Ví dụ: <strong>35,09 &gt; 35,08</strong> (vì 35 = 35, 0 = 0, nhưng 9 &gt; 8)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SO SÁNH PHÂN SỐ VỚI SỐ THẬP PHÂN */}
          {activeTab === 'fraction_vs_decimal' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-3.5">
                <div className="font-black text-indigo-900 text-sm mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Bí quyết: Đổi phân số thành số thập phân
                </div>
                <p className="text-slate-600">
                  Lấy <strong>tử số chia cho mẫu số</strong> (hoặc quy đồng mẫu số về 10, 100, 1000) rồi so sánh hai số thập phân với nhau!
                </p>
              </div>

              <div className="bg-white border-2 border-slate-200 rounded-2xl p-3.5 space-y-2">
                <div className="font-black text-slate-800 text-xs uppercase tracking-wide">
                  Các phân số thường gặp cần ghi nhớ:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 font-bold">
                    • <strong>1/2</strong> = 0,5
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 font-bold">
                    • <strong>1/4</strong> = 0,25
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 font-bold">
                    • <strong>3/4</strong> = 0,75
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 font-bold">
                    • <strong>1/5</strong> = 0,2
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 font-bold">
                    • <strong>2/5</strong> = 0,4
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 font-bold">
                    • <strong>3/5</strong> = 0,6
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 font-bold">
                    • <strong>4/5</strong> = 0,8
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 font-bold">
                    • <strong>1/8</strong> = 0,125
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 font-bold text-emerald-950 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Ví dụ: So sánh <strong>3/4</strong> và <strong>0,7</strong>: Đổi 3/4 = 0,75. Vì 0,75 &gt; 0,70 nên <strong>3/4 &gt; 0,7</strong>!</span>
              </div>
            </div>
          )}

          {/* TAB 3: ĐỔI ĐƠN VỊ ĐO & DIỆN TÍCH */}
          {activeTab === 'unit_conversion' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3.5">
                <div className="font-black text-emerald-900 text-sm mb-1">
                  1. Đơn vị diện tích (Mỗi đơn vị gấp 100 lần đơn vị liền sau)
                </div>
                <div className="text-slate-700 space-y-1 mt-1 text-xs font-semibold">
                  <div>• <strong>1 m² = 100 dm² = 10 000 cm²</strong></div>
                  <div>• <strong>1 dm² = 0,01 m²</strong> (25 dm² = 0,25 m²)</div>
                  <div>• <strong>1 ha (héc-ta) = 10 000 m²</strong> (0,5 ha = 5 000 m²)</div>
                  <div>• <strong>1 km² = 100 ha = 1 000 000 m²</strong></div>
                </div>
              </div>

              <div className="bg-cyan-50 border-2 border-cyan-200 rounded-2xl p-3.5">
                <div className="font-black text-cyan-900 text-sm mb-1">
                  2. Đơn vị độ dài & khối lượng
                </div>
                <div className="text-slate-700 space-y-1 mt-1 text-xs font-semibold">
                  <div>• <strong>1 km = 1000 m</strong> (50m = 0,05km &rarr; 2km 50m = 2,05 km)</div>
                  <div>• <strong>1 m = 10 dm = 100 cm</strong> (3m 4dm = 3,4 m)</div>
                  <div>• <strong>1 tấn = 10 tạ = 1000 kg</strong> (50kg = 0,05 tấn &rarr; 8 tấn 50kg = 8,05 tấn)</div>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 font-bold text-amber-950 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Ví dụ: <strong>5m² 25dm²</strong> = 5 + 25/100 = <strong>5,25 m²</strong>!</span>
              </div>
            </div>
          )}

          {/* TAB 4: LÀM TRÒN SỐ */}
          {activeTab === 'rounding' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="bg-violet-50 border-2 border-violet-200 rounded-2xl p-3.5">
                <div className="font-black text-violet-900 text-sm mb-1">
                  Quy tắc vàng khi làm tròn số:
                </div>
                <p className="text-slate-600">
                  Nhìn chữ số ngay sau hàng cần làm tròn:
                </p>
                <div className="mt-2 space-y-1.5 text-xs font-bold text-slate-800">
                  <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-violet-200">
                    <span className="text-rose-600">&bull; Nhỏ hơn 5 (0, 1, 2, 3, 4):</span>
                    <span><strong>Làm tròn xuống</strong> (giữ nguyên hàng cần làm tròn).</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-violet-200">
                    <span className="text-emerald-600">&bull; Từ 5 trở lên (5, 6, 7, 8, 9):</span>
                    <span><strong>Làm tròn lên</strong> (cộng thêm 1 vào hàng cần làm tròn).</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-slate-200 rounded-2xl p-3 space-y-1.5 text-xs">
                <div className="font-black text-slate-800 mb-1">Ví dụ minh họa cụ thể:</div>
                <div>• Làm tròn <strong>34,76</strong> đến số tự nhiên: phần mười là 7 (&ge; 5) &rarr; làm tròn lên thành <strong>35</strong>.</div>
                <div>• Làm tròn <strong>12,34</strong> đến hàng phần mười: phần trăm là 4 (&lt; 5) &rarr; giữ nguyên thành <strong>12,3</strong>.</div>
                <div>• Làm tròn <strong>85,2</strong> đến hàng chục: hàng đơn vị là 5 (&ge; 5) &rarr; làm tròn lên thành <strong>90</strong>.</div>
                <div>• Làm tròn <strong>7,865</strong> đến hàng phần trăm: phần nghìn là 5 (&ge; 5) &rarr; thành <strong>7,87</strong>.</div>
              </div>
            </div>
          )}

          {/* TAB 5: PHÉP TÍNH PHÂN SỐ */}
          {activeTab === 'fraction_arithmetic' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-3.5">
                <div className="font-black text-orange-900 text-sm mb-1">
                  1. Cộng, trừ phân số khác mẫu
                </div>
                <p className="text-slate-600 text-xs">
                  <strong>Bước 1:</strong> Quy đồng mẫu số hai phân số để có mẫu số chung.
                  <br />
                  <strong>Bước 2:</strong> Cộng (hoặc trừ) các tử số với nhau, giữ nguyên mẫu số chung.
                  <br />
                  <strong>Bước 3:</strong> Rút gọn phân số về phân số tối giản (nếu có thể).
                </p>
                <div className="mt-2 bg-white p-2 rounded-xl border border-orange-200 font-bold text-orange-950">
                  Ví dụ: 1/3 + 2/5 = 5/15 + 6/15 = <strong>11/15</strong>.
                </div>
              </div>

              <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-3.5">
                <div className="font-black text-rose-900 text-sm mb-1">
                  2. Nhân hai phân số
                </div>
                <p className="text-slate-600 text-xs">
                  Lấy <strong>tử số nhân với tử số</strong>, <strong>mẫu số nhân với mẫu số</strong>:
                </p>
                <div className="mt-2 bg-white p-2 rounded-xl border border-rose-200 font-bold text-rose-950">
                  Ví dụ: 2/3 × 4/5 = (2 × 4) / (3 × 5) = <strong>8/15</strong>.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 text-center flex items-center justify-between px-6">
          <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
            Kiến thức bám sát chương trình Toán Tiểu Học
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-sm shadow-sm cursor-pointer transition-colors"
          >
            Đã hiểu bí kíp! Tiếp tục chơi
          </button>
        </div>
      </div>
    </div>
  );
};
