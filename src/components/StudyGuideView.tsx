import React from "react";
import { StudyGuide, Topic } from "../types/math";
import { MathRenderer, RichTextRenderer } from "./MathRenderer";
import { GeometryViewer } from "./GeometryViewer";
import { BookOpen, FileText, Lightbulb, PenTool, Download, Sparkles } from "lucide-react";

interface StudyGuideViewProps {
  guide: StudyGuide;
  topic: Topic;
  onExportPDF: () => void;
  onGenerateAI: () => void;
  isGenerating?: boolean;
}

export const StudyGuideView: React.FC<StudyGuideViewProps> = ({ 
  guide, 
  topic, 
  onExportPDF, 
  onGenerateAI,
  isGenerating 
}) => {
  return (
    <div id="study-guide-content" className="max-w-4xl mx-auto p-8 bg-white dark:bg-zinc-950 shadow-sm rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between items-start mb-8 border-b border-zinc-100 dark:border-zinc-900 pb-6">
        <div>
          <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wider">
            Lớp {topic.grade} • {topic.category}
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Đề cương: {topic.title}
          </h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onGenerateAI}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Sparkles size={16} />
            {isGenerating ? "Đang tạo..." : "AI Sinh Bài Tập"}
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

      {/* Lý thuyết */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white font-semibold text-xl">
          <BookOpen className="text-blue-500" size={24} />
          <h2>I. Tóm tắt lý thuyết</h2>
        </div>
        <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <RichTextRenderer text={guide.theory} />
        </div>
      </section>

      {/* Công thức */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white font-semibold text-xl">
          <FileText className="text-emerald-500" size={24} />
          <h2>II. Các công thức cần nhớ</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guide.formulas?.map((formula, idx) => (
            <div key={idx} className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
              <MathRenderer content={formula} block />
            </div>
          ))}
        </div>
      </section>

      {/* Ví dụ mẫu */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white font-semibold text-xl">
          <Lightbulb className="text-amber-500" size={24} />
          <h2>III. Ví dụ mẫu</h2>
        </div>
        <div className="space-y-6">
          {guide.examples?.map((example, idx) => (
            <div key={idx} className="p-6 bg-amber-50/30 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl">
              <h3 className="font-bold text-amber-900 dark:text-amber-400 mb-2">Ví dụ {idx + 1}: {example.title}</h3>
              <div className="mb-4 text-zinc-800 dark:text-zinc-200">
                <RichTextRenderer text={example.content} />
              </div>
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-amber-100 dark:border-amber-900/30">
                <div className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase mb-2">Lời giải chi tiết:</div>
                <div className="text-zinc-700 dark:text-zinc-300">
                  <RichTextRenderer text={example.solution} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hình học trực quan (nếu có) */}
      {topic.category === "Hình học" && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white font-semibold text-xl">
            <PenTool className="text-indigo-500" size={24} />
            <h2>IV. Hình vẽ minh họa</h2>
          </div>
          <GeometryViewer type={topic.title.includes("tròn") ? "circle" : topic.title.includes("Pythagore") ? "triangle" : "cube"} />
        </section>
      )}

      {/* Bài tập */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white font-semibold text-xl">
          <PenTool className="text-rose-500" size={24} />
          <h2>{topic.category === "Hình học" ? "V" : "IV"}. Bài tập tự luyện</h2>
        </div>
        <div className="space-y-8">
          {["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"].map((level) => {
            const levelExercises = (guide.exercises || []).filter(ex => ex.level === level);
            if (levelExercises.length === 0) return null;
            
            return (
              <div key={level}>
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Mức độ {level}
                </h3>
                <div className="space-y-4 ml-4">
                  {levelExercises.map((ex, idx) => (
                    <div key={ex.id || idx} className="group">
                      <div className="flex gap-3">
                        <span className="font-bold text-zinc-400">Bài {idx + 1}:</span>
                        <div className="flex-1">
                          <div className="text-zinc-800 dark:text-zinc-200">
                            <RichTextRenderer text={ex.question} />
                          </div>
                          <details className="mt-2">
                            <summary className="text-xs font-medium text-zinc-500 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                              Xem hướng dẫn giải
                            </summary>
                            <div className="mt-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 text-sm italic text-zinc-600 dark:text-zinc-400">
                              <RichTextRenderer text={ex.solution} />
                            </div>
                          </details>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
