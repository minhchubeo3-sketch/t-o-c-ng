import React from "react";
import { Topic, Level, Grade, Semester, ExamType } from "../types/math";
import { CURRICULUM_TOPICS } from "../data/curriculum";
import { cn } from "../lib/utils";
import { GraduationCap, Book, ChevronRight, Search } from "lucide-react";

interface SidebarProps {
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
  isReviewMode: boolean;
  onToggleReviewMode: (val: boolean) => void;
  reviewConfig: { grade: Grade; semester: Semester; examType: ExamType };
  onUpdateReviewConfig: (config: { grade: Grade; semester: Semester; examType: ExamType }) => void;
  isGenerating?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  selectedTopicId, 
  onSelectTopic,
  isReviewMode,
  onToggleReviewMode,
  reviewConfig,
  onUpdateReviewConfig,
  isGenerating = false
}) => {
  const [level, setLevel] = React.useState<Level>("THCS");
  const [search, setSearch] = React.useState("");

  const filteredTopics = CURRICULUM_TOPICS.filter(t => 
    t.level === level && 
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const grades = level === "THCS" ? ["6", "7", "8", "9"] : ["10", "11", "12"];

  return (
    <div className="w-80 h-screen bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="font-bold text-zinc-900 dark:text-white leading-tight">MathGuide</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Vietnam Edition</p>
          </div>
        </div>

        <div className="flex p-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-4">
          <button 
            onClick={() => setLevel("THCS")}
            className={cn(
              "flex-1 py-1.5 text-xs font-bold rounded-md transition-all",
              level === "THCS" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500"
            )}
          >
            THCS
          </button>
          <button 
            onClick={() => setLevel("THPT")}
            className={cn(
              "flex-1 py-1.5 text-xs font-bold rounded-md transition-all",
              level === "THPT" ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500"
            )}
          >
            THPT
          </button>
        </div>

        <div className="flex p-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-6">
          <button 
            onClick={() => onToggleReviewMode(false)}
            className={cn(
              "flex-1 py-1.5 text-xs font-bold rounded-md transition-all",
              !isReviewMode ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500"
            )}
          >
            Chuyên đề
          </button>
          <button 
            onClick={() => onToggleReviewMode(true)}
            className={cn(
              "flex-1 py-1.5 text-xs font-bold rounded-md transition-all",
              isReviewMode ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500"
            )}
          >
            Ôn tập thi
          </button>
        </div>

        {!isReviewMode ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
            <input 
              type="text"
              placeholder="Tìm chuyên đề..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <select 
                value={reviewConfig.grade}
                onChange={(e) => onUpdateReviewConfig({ ...reviewConfig, grade: e.target.value as Grade })}
                className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs p-2 focus:outline-none"
              >
                {grades.map(g => <option key={g} value={g}>Lớp {g}</option>)}
              </select>
              <select 
                value={reviewConfig.semester}
                onChange={(e) => onUpdateReviewConfig({ ...reviewConfig, semester: e.target.value as Semester })}
                className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs p-2 focus:outline-none"
              >
                <option value="1">Học kỳ 1</option>
                <option value="2">Học kỳ 2</option>
                <option value="Cả năm">Cả năm</option>
              </select>
            </div>
            <select 
              value={reviewConfig.examType}
              onChange={(e) => onUpdateReviewConfig({ ...reviewConfig, examType: e.target.value as ExamType })}
              className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs p-2 focus:outline-none"
            >
              <option value="Giữa học kỳ">Ôn thi Giữa học kỳ</option>
              <option value="Cuối học kỳ">Ôn thi Cuối học kỳ</option>
            </select>
            <div className="flex gap-2">
              <button 
                onClick={() => onSelectTopic("generate-review")}
                disabled={isGenerating}
                className={cn(
                  "flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-500/20",
                  isGenerating ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                )}
              >
                {isGenerating ? "Đang tạo..." : "Tạo đề cương"}
              </button>
              <button 
                onClick={() => onSelectTopic("generate-exam")}
                disabled={isGenerating}
                className={cn(
                  "flex-1 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-rose-500/20",
                  isGenerating ? "opacity-50 cursor-not-allowed" : "hover:bg-rose-700"
                )}
              >
                {isGenerating ? "Đang tạo..." : "Tạo đề thi"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {!isReviewMode && grades.map(grade => {
          const gradeTopics = filteredTopics.filter(t => t.grade === grade);
          if (gradeTopics.length === 0) return null;

          return (
            <div key={grade}>
              <h3 className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Lớp {grade}</h3>
              <div className="space-y-1">
                {gradeTopics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => onSelectTopic(topic.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all group",
                      selectedTopicId === topic.id 
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium" 
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Book size={14} className={cn(selectedTopicId === topic.id ? "text-blue-500" : "text-zinc-400")} />
                      <span className="truncate">{topic.title}</span>
                    </div>
                    <ChevronRight size={14} className={cn(
                      "transition-transform",
                      selectedTopicId === topic.id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    )} />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
