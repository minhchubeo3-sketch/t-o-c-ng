import React from "react";
import { ReviewGuide } from "../types/math";
import { MathRenderer, RichTextRenderer } from "./MathRenderer";
import { BookOpen, FileText, PenTool, Download, ClipboardCheck } from "lucide-react";

interface ReviewGuideViewProps {
  guide: ReviewGuide;
  onExportPDF: () => void;
}

export const ReviewGuideView: React.FC<ReviewGuideViewProps> = ({ 
  guide, 
  onExportPDF
}) => {
  return (
    <div id="study-guide-content" className="max-w-4xl mx-auto p-8 bg-white dark:bg-zinc-950 shadow-sm rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between items-start mb-8 border-b border-zinc-100 dark:border-zinc-900 pb-6">
        <div>
          <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wider">
            Lớp {guide.grade} • Học kỳ {guide.semester} • {guide.examType}
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            {guide.title}
          </h1>
        </div>
        <button 
          onClick={onExportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <Download size={16} />
          Xuất PDF
        </button>
      </div>

      {/* Cấu trúc đề thi (nếu có) */}
      {guide.examStructure && (
        <section className="mb-10 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white font-semibold text-lg">
            <ClipboardCheck className="text-blue-500" size={20} />
            <h2>Cấu trúc đề thi dự kiến</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between p-3 bg-white dark:bg-zinc-900 rounded-lg">
              <span className="text-zinc-500">Trắc nghiệm:</span>
              <span className="font-bold text-blue-600">{guide.examStructure.tracNghiem}%</span>
            </div>
            <div className="flex justify-between p-3 bg-white dark:bg-zinc-900 rounded-lg">
              <span className="text-zinc-500">Tự luận:</span>
              <span className="font-bold text-blue-600">{guide.examStructure.tuLuan}%</span>
            </div>
          </div>
        </section>
      )}

      {/* Danh sách các chuyên đề ôn tập */}
      <div className="space-y-12">
        {guide.topics?.map((topicGuide, idx) => (
          <section key={topicGuide.id || idx} className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm">
                  {idx + 1}
                </span>
                {topicGuide.topicId?.split("-").pop()?.toUpperCase() || "CHUYÊN ĐỀ"}: {topicGuide.theory?.split(".")[0] || "Nội dung trọng tâm"}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Lý thuyết & Công thức */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-zinc-900 dark:text-white font-medium">
                  <BookOpen className="text-blue-500" size={18} />
                  <h3>Trọng tâm lý thuyết</h3>
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  <RichTextRenderer text={topicGuide.theory} />
                </div>
                <div className="space-y-2">
                  {topicGuide.formulas?.slice(0, 3).map((f, i) => (
                    <div key={i} className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 text-xs">
                      <MathRenderer content={f} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bài tập ôn luyện */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-zinc-900 dark:text-white font-medium">
                  <PenTool className="text-rose-500" size={18} />
                  <h3>Bài tập tiêu biểu</h3>
                </div>
                <div className="space-y-4">
                  {topicGuide.exercises?.slice(0, 2).map((ex, i) => (
                    <div key={ex.id || i} className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800">
                      <div className="text-xs font-bold text-rose-500 uppercase mb-1">{ex.level}</div>
                      <div className="text-sm text-zinc-800 dark:text-zinc-200">
                        <RichTextRenderer text={ex.question} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-900 text-center text-zinc-400 text-xs italic">
        Đề cương được tổng hợp tự động bởi MathGuide VN • Chúc các em ôn tập tốt!
      </div>
      {/* Nút tạo đề thi thử */}
      <div className="mt-16 p-8 bg-zinc-900 dark:bg-white rounded-2xl text-center">
        <h3 className="text-xl font-bold text-white dark:text-zinc-900 mb-2">Sẵn sàng kiểm tra kiến thức?</h3>
        <p className="text-zinc-400 dark:text-zinc-500 mb-6">AI sẽ tạo một đề thi thử trắc nghiệm dựa trên các chuyên đề trên.</p>
        <button 
          onClick={() => {
            // We need to pass a callback to trigger exam generation
            // For now, I'll assume the parent handles it via onSelectTopic("generate-exam")
            window.dispatchEvent(new CustomEvent("generate-exam"));
          }}
          className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-500/20"
        >
          Tạo đề thi thử ngay
        </button>
      </div>
    </div>
  );
};
