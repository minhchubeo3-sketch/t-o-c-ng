import React from "react";
import { MockExam } from "../types/math";
import { RichTextRenderer } from "./MathRenderer";
import { FileText, Clock, CheckCircle2, Download, AlertCircle } from "lucide-react";

interface MockExamViewProps {
  exam: MockExam;
  onExportPDF: () => void;
}

export const MockExamView: React.FC<MockExamViewProps> = ({ exam, onExportPDF }) => {
  const [showSolutions, setShowSolutions] = React.useState(false);

  return (
    <div id="study-guide-content" className="max-w-4xl mx-auto p-8 bg-white dark:bg-zinc-950 shadow-sm rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between items-start mb-8 border-b border-zinc-100 dark:border-zinc-900 pb-6">
        <div>
          <div className="text-sm font-medium text-rose-600 dark:text-rose-400 mb-1 uppercase tracking-wider">
            Đề thi thử • Lớp {exam.grade} • Học kỳ {exam.semester}
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            {exam.title}
          </h1>
          <div className="flex gap-4 mt-2 text-zinc-500 text-sm">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              Thời gian: {exam.duration} phút
            </div>
            <div className="flex items-center gap-1">
              <FileText size={14} />
              Số câu: {exam.questions.length} câu
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowSolutions(!showSolutions)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium"
          >
            <CheckCircle2 size={16} />
            {showSolutions ? "Ẩn đáp án" : "Hiện đáp án"}
          </button>
          <button 
            onClick={onExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <Download size={16} />
            Xuất PDF
          </button>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-lg mb-8 flex gap-3 items-start">
        <AlertCircle className="text-amber-600 shrink-0" size={20} />
        <p className="text-sm text-amber-800 dark:text-amber-400">
          Đây là đề thi thử được tạo bởi AI dựa trên cấu trúc đề thi minh họa của Bộ GD&ĐT. 
          Hãy tự làm bài trong thời gian quy định trước khi xem đáp án.
        </p>
      </div>

      <div className="space-y-8">
        {exam.questions.map((q, idx) => (
          <div key={q.id || idx} className="relative pl-10">
            <span className="absolute left-0 top-0 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-600 dark:text-zinc-400">
              {idx + 1}
            </span>
            <div className="mb-4 text-zinc-900 dark:text-white font-medium leading-relaxed">
              <RichTextRenderer text={q.question} />
            </div>

            {q.options && q.options.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {q.options.map((opt, i) => (
                  <div 
                    key={i}
                    className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 flex gap-3"
                  >
                    <span className="font-bold text-zinc-400">{String.fromCharCode(65 + i)}.</span>
                    <RichTextRenderer text={opt} />
                  </div>
                ))}
              </div>
            )}

            {showSolutions && (
              <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg">
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase mb-2">Đáp án & Hướng dẫn:</div>
                <div className="text-zinc-700 dark:text-zinc-300 text-sm">
                  <RichTextRenderer text={q.solution} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
