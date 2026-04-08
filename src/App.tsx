import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { StudyGuideView } from "./components/StudyGuideView";
import { ReviewGuideView } from "./components/ReviewGuideView";
import { MockExamView } from "./components/MockExamView";
import { CURRICULUM_TOPICS, SAMPLE_GUIDES } from "./data/curriculum";
import { StudyGuide, Exercise, Grade, Semester, ReviewGuide, ExamType, MockExam } from "./types/math";
import { GoogleGenAI, Type } from "@google/genai";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { GraduationCap, Sparkles, Layout, Moon, Sun, FileText, BookOpen } from "lucide-react";

export default function App() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [guides, setGuides] = useState<Record<string, StudyGuide>>(SAMPLE_GUIDES);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Review Mode States
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewConfig, setReviewConfig] = useState<{ grade: Grade; semester: Semester; examType: ExamType }>({
    grade: "12",
    semester: "1",
    examType: "Giữa học kỳ"
  });
  const [generatedReview, setGeneratedReview] = useState<ReviewGuide | null>(null);
  const [generatedExam, setGeneratedExam] = useState<MockExam | null>(null);

  const selectedTopic = CURRICULUM_TOPICS.find(t => t.id === selectedTopicId);
  const selectedGuide = selectedTopicId && selectedTopicId !== "generate-review" ? guides[selectedTopicId] : null;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    console.log("GEMINI_API_KEY status:", process.env.GEMINI_API_KEY ? "Present" : "Missing");
  }, []);

  useEffect(() => {
    const handleGenerateExamEvent = () => handleGenerateExam();
    window.addEventListener("generate-exam", handleGenerateExamEvent);
    return () => window.removeEventListener("generate-exam", handleGenerateExamEvent);
  }, [reviewConfig]);

  const handleExportPDF = async () => {
    const element = document.getElementById("study-guide-content");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: isDarkMode ? "#09090b" : "#ffffff"
    });
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    const fileName = isReviewMode 
      ? (generatedExam ? `De_Thi_Thu_${reviewConfig.examType.replace(/\s+/g, "_")}_Lop_${reviewConfig.grade}` : `De_Cuong_On_Tap_${reviewConfig.examType.replace(/\s+/g, "_")}_Lop_${reviewConfig.grade}`)
      : `De_Cuong_Toan_${selectedTopic?.title.replace(/\s+/g, "_")}`;
    pdf.save(`${fileName}.pdf`);
  };

  const handleGenerateExam = async () => {
    setIsGenerating(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key Gemini chưa được thiết lập. Vui lòng kiểm tra cài đặt trong menu Settings.");
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const relevantTopics = CURRICULUM_TOPICS.filter(t => 
        t.grade === reviewConfig.grade && 
        (reviewConfig.semester === "Cả năm" || t.semester === reviewConfig.semester)
      );

      const topicTitles = relevantTopics.map(t => t.title).join(", ");
      
      const prompt = `Bạn là chuyên gia giáo dục toán học Việt Nam. 
      Hãy tạo một ĐỀ THI THỬ (Mock Exam) ${reviewConfig.examType} cho Lớp ${reviewConfig.grade}, Học kỳ ${reviewConfig.semester}.
      Các chủ đề cần bao phủ: ${topicTitles}.
      
      Yêu cầu:
      - Đề thi gồm 10-15 câu hỏi trắc nghiệm (có 4 phương án A, B, C, D).
      - Có đáp án và lời giải chi tiết cho từng câu.
      - Sử dụng LaTeX chuẩn cho công thức.
      - Ngôn ngữ: Tiếng Việt.
      
      Yêu cầu trả về JSON với cấu trúc:
      {
        "title": "Đề thi thử ${reviewConfig.examType} học kỳ ${reviewConfig.semester} môn Toán lớp ${reviewConfig.grade}",
        "grade": "${reviewConfig.grade}",
        "semester": "${reviewConfig.semester}",
        "examType": "${reviewConfig.examType}",
        "duration": 45,
        "questions": [
          {
            "id": "string",
            "question": "Câu hỏi...",
            "options": ["A...", "B...", "C...", "D..."],
            "correctAnswer": "A",
            "solution": "Lời giải chi tiết...",
            "level": "Thông hiểu",
            "type": "Lý thuyết"
          }
        ]
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              grade: { type: Type.STRING },
              semester: { type: Type.STRING },
              examType: { type: Type.STRING },
              duration: { type: Type.NUMBER },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING },
                    solution: { type: Type.STRING },
                    level: { type: Type.STRING },
                    type: { type: Type.STRING }
                  },
                  required: ["question", "options", "correctAnswer", "solution", "level", "type"]
                }
              }
            },
            required: ["title", "grade", "semester", "examType", "duration", "questions"]
          }
        }
      });

      let text = response.text;
      text = text.trim();
      if (text.includes("```")) {
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      }

      const examData: MockExam = JSON.parse(text);
      
      // Ensure IDs
      examData.questions = examData.questions.map((q, i) => ({
        ...q,
        id: q.id || `exam-q-${i}-${Date.now()}`
      }));

      setGeneratedExam(examData);
      setGeneratedReview(null);
      setSelectedTopicId("generate-exam");
      setIsReviewMode(true);
    } catch (error) {
      console.error("AI Exam Generation failed:", error);
      alert(error instanceof Error ? error.message : "Không thể tạo đề thi thử. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateReview = async () => {
    setIsGenerating(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key Gemini chưa được thiết lập. Vui lòng kiểm tra cài đặt trong menu Settings.");
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const relevantTopics = CURRICULUM_TOPICS.filter(t => 
        t.grade === reviewConfig.grade && 
        (reviewConfig.semester === "Cả năm" || t.semester === reviewConfig.semester)
      );

      const topicTitles = relevantTopics.map(t => t.title).join(", ");
      
      const prompt = `Bạn là chuyên gia giáo dục toán học Việt Nam. 
      Hãy tạo một đề cương ôn tập ${reviewConfig.examType} cho Lớp ${reviewConfig.grade}, Học kỳ ${reviewConfig.semester}.
      Các chủ đề cần bao phủ: ${topicTitles}.
      
      Lưu ý quan trọng:
      - Nếu là "Giữa học kỳ", tập trung vào các kiến thức trọng tâm của nửa đầu học kỳ.
      - Nếu là "Cuối học kỳ", bao quát toàn bộ kiến thức của học kỳ đó.
      - Đề cương cần có cấu trúc rõ ràng, tóm tắt lý thuyết và bài tập minh họa.
      
      Yêu cầu trả về JSON với cấu trúc:
      {
        "title": "Đề cương ôn tập ${reviewConfig.examType} học kỳ ${reviewConfig.semester} môn Toán lớp ${reviewConfig.grade}",
        "examStructure": { "tracNghiem": 70, "tuLuan": 30 },
        "topics": [
          {
            "id": "string",
            "topicId": "string",
            "theory": "Tóm tắt ngắn gọn trọng tâm lý thuyết",
            "formulas": ["LaTeX formulas"],
            "examples": [],
            "exercises": [
              { "question": "...", "solution": "...", "level": "Thông hiểu", "type": "Lý thuyết" }
            ]
          }
        ]
      }
      Tạo tối đa 5 chuyên đề trọng tâm nhất. Sử dụng LaTeX chuẩn.`;

      console.log("Generating review with config:", reviewConfig);
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              examStructure: {
                type: Type.OBJECT,
                properties: {
                  tracNghiem: { type: Type.NUMBER },
                  tuLuan: { type: Type.NUMBER }
                },
                required: ["tracNghiem", "tuLuan"]
              },
              topics: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    topicId: { type: Type.STRING },
                    theory: { type: Type.STRING },
                    formulas: { type: Type.ARRAY, items: { type: Type.STRING } },
                    examples: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          content: { type: Type.STRING },
                          solution: { type: Type.STRING }
                        },
                        required: ["title", "content", "solution"]
                      }
                    },
                    exercises: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          question: { type: Type.STRING },
                          solution: { type: Type.STRING },
                          level: { type: Type.STRING },
                          type: { type: Type.STRING }
                        },
                        required: ["question", "solution", "level", "type"]
                      }
                    }
                  },
                  required: ["id", "topicId", "theory", "formulas", "exercises"]
                }
              }
            },
            required: ["title", "examStructure", "topics"]
          }
        }
      });

      console.log("AI Response received:", response);
      
      let text = response.text;
      if (!text) {
        throw new Error("AI returned empty response");
      }

      // Robust JSON parsing
      text = text.trim();
      if (text.includes("```")) {
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      }

      const reviewData: ReviewGuide = JSON.parse(text);
      console.log("Parsed review data:", reviewData);
      
      // Ensure topics array exists and all exercises have IDs
      const processedTopics = (reviewData.topics || []).map((topic) => ({
        ...topic,
        formulas: topic.formulas || [],
        examples: topic.examples || [],
        exercises: (topic.exercises || []).map((ex, i) => ({
          ...ex,
          id: ex.id || `review-ex-${topic.id}-${i}-${Date.now()}`
        }))
      }));

      setGeneratedReview({
        ...reviewData,
        topics: processedTopics,
        grade: reviewConfig.grade,
        semester: reviewConfig.semester,
        examType: reviewConfig.examType
      });
      setSelectedTopicId("generate-review");
      setIsReviewMode(true); // Ensure we stay in review mode
    } catch (error) {
      console.error("AI Review Generation failed:", error);
      alert(error instanceof Error ? error.message : "Không thể tạo đề cương ôn tập. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!selectedTopic || !selectedGuide) return;
    
    setIsGenerating(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key Gemini chưa được thiết lập. Vui lòng kiểm tra cài đặt trong menu Settings.");
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Bạn là chuyên gia giáo dục toán học Việt Nam. 
      Hãy tạo thêm 3 bài tập mới cho chuyên đề "${selectedTopic.title}" (Lớp ${selectedTopic.grade}, ${selectedTopic.category}).
      Yêu cầu:
      - 1 bài mức độ "Thông hiểu"
      - 1 bài mức độ "Vận dụng"
      - 1 bài mức độ "Thực tế"
      - Sử dụng LaTeX chuẩn cho công thức (ví dụ: $x^2 + y^2 = z^2$).
      - Có lời giải chi tiết.
      - Ngôn ngữ: Tiếng Việt.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                solution: { type: Type.STRING },
                level: { type: Type.STRING, enum: ["Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"] },
                type: { type: Type.STRING, enum: ["Lý thuyết", "Thực tế", "Hình học"] }
              },
              required: ["question", "solution", "level", "type"]
            }
          }
        }
      });

      const newExercises: Exercise[] = Array.isArray(JSON.parse(response.text)) ? JSON.parse(response.text) : [];
      
      // Update local state
      const updatedGuide = {
        ...selectedGuide,
        exercises: [
          ...(selectedGuide.exercises || []),
          ...newExercises.map((ex, i) => ({ ...ex, id: `ai-${Date.now()}-${i}` }))
        ]
      };

      setGuides(prev => ({
        ...prev,
        [selectedTopicId]: updatedGuide
      }));

    } catch (error) {
      console.error("AI Generation failed:", error);
      alert(error instanceof Error ? error.message : "Không thể kết nối với AI. Vui lòng kiểm tra API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTopic = (id: string) => {
    if (id === "generate-review") {
      handleGenerateReview();
    } else if (id === "generate-exam") {
      handleGenerateExam();
    } else {
      setSelectedTopicId(id);
      setGeneratedReview(null);
      setGeneratedExam(null);
    }
  };

  const handleGenerateStudyGuide = async (topicId: string) => {
    const topic = CURRICULUM_TOPICS.find(t => t.id === topicId);
    if (!topic) return;

    setIsGenerating(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key Gemini chưa được thiết lập. Vui lòng kiểm tra cài đặt trong menu Settings.");
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Bạn là chuyên gia giáo dục toán học Việt Nam. 
      Hãy tạo một đề cương chi tiết (Study Guide) cho chuyên đề: "${topic.title}" (Lớp ${topic.grade}, ${topic.level}).
      
      Yêu cầu trả về JSON với cấu trúc:
      {
        "id": "guide-${topic.id}",
        "topicId": "${topic.id}",
        "theory": "Tóm tắt lý thuyết trọng tâm, chi tiết và dễ hiểu",
        "formulas": ["Các công thức quan trọng bằng LaTeX"],
        "examples": [
          { "title": "Ví dụ 1", "content": "Đề bài ví dụ", "solution": "Lời giải chi tiết" }
        ],
        "exercises": [
          { "question": "Câu hỏi bài tập", "solution": "Lời giải chi tiết", "level": "Thông hiểu", "type": "Lý thuyết" }
        ]
      }
      Sử dụng LaTeX chuẩn cho các công thức toán học. Hãy tạo ít nhất 3 ví dụ và 5 bài tập.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              topicId: { type: Type.STRING },
              theory: { type: Type.STRING },
              formulas: { type: Type.ARRAY, items: { type: Type.STRING } },
              examples: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.STRING },
                    solution: { type: Type.STRING }
                  },
                  required: ["title", "content", "solution"]
                }
              },
              exercises: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    solution: { type: Type.STRING },
                    level: { type: Type.STRING },
                    type: { type: Type.STRING }
                  },
                  required: ["question", "solution", "level", "type"]
                }
              }
            },
            required: ["id", "topicId", "theory", "formulas", "examples", "exercises"]
          }
        }
      });

      let text = response.text;
      if (!text) throw new Error("AI returned empty response");
      
      text = text.trim();
      if (text.includes("```")) {
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      }

      const guideData: StudyGuide = JSON.parse(text);
      
      // Ensure arrays exist and exercises have IDs
      guideData.formulas = guideData.formulas || [];
      guideData.examples = guideData.examples || [];
      guideData.exercises = (guideData.exercises || []).map((ex, i) => ({
        ...ex,
        id: `ex-${topic.id}-${i}-${Date.now()}`
      }));

      setGuides(prev => ({
        ...prev,
        [topicId]: guideData
      }));
    } catch (error) {
      console.error("Error generating study guide:", error);
      alert("Không thể tạo đề cương: " + (error instanceof Error ? error.message : "Lỗi không xác định"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950 transition-colors">
      <Sidebar 
        selectedTopicId={selectedTopicId} 
        onSelectTopic={handleSelectTopic}
        isReviewMode={isReviewMode}
        onToggleReviewMode={(val) => {
          setIsReviewMode(val);
          setSelectedTopicId("");
          setGeneratedReview(null);
        }}
        reviewConfig={reviewConfig}
        onUpdateReviewConfig={setReviewConfig}
        isGenerating={isGenerating}
      />
      
      <main className="flex-1 overflow-y-auto relative">
        {/* Header Actions */}
        <div className="sticky top-0 z-10 flex justify-end p-4 pointer-events-none">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors pointer-events-auto"
          >
            {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-zinc-600" />}
          </button>
        </div>

        <div className="p-8">
          {isReviewMode && generatedReview ? (
            <ReviewGuideView 
              guide={generatedReview}
              onExportPDF={handleExportPDF}
            />
          ) : isReviewMode && generatedExam ? (
            <MockExamView 
              exam={generatedExam}
              onExportPDF={handleExportPDF}
            />
          ) : selectedTopic && selectedGuide ? (
            <StudyGuideView 
              topic={selectedTopic} 
              guide={selectedGuide} 
              onExportPDF={handleExportPDF}
              onGenerateAI={handleGenerateAI}
              isGenerating={isGenerating}
            />
          ) : selectedTopic ? (
            <div className="h-[80vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8">
                <BookOpen className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                Chuyên đề: {selectedTopic.title}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-8">
                Hiện chưa có đề cương chi tiết cho chuyên đề này. Bạn có muốn sử dụng AI để tạo đề cương tự động không?
              </p>
              <button
                onClick={() => handleGenerateStudyGuide(selectedTopic.id)}
                disabled={isGenerating}
                className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang tạo đề cương...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Tạo đề cương chi tiết bằng AI
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="h-[80vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
              {isGenerating ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                  <h2 className="text-2xl font-bold dark:text-white mb-2">
                    {selectedTopicId === "generate-exam" ? "Đang soạn đề thi thử..." : "Đang tổng hợp đề cương..."}
                  </h2>
                  <p className="text-zinc-500">
                    {selectedTopicId === "generate-exam" 
                      ? "AI đang thiết kế các câu hỏi trắc nghiệm và lời giải." 
                      : "AI đang phân tích các chuyên đề và tạo bài tập ôn tập."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 animate-bounce">
                    <GraduationCap size={40} />
                  </div>
                  <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                    {isReviewMode ? "Ôn tập thi học kỳ" : "Chào mừng đến với MathGuide VN"}
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-8">
                    {isReviewMode 
                      ? "Chọn lớp và học kỳ để AI tự động tổng hợp đề cương và đề thi thử toàn diện cho bạn."
                      : "Hệ thống hỗ trợ học tập và giảng dạy môn Toán theo chương trình GDPT mới. Chọn một chuyên đề ở thanh bên để bắt đầu."}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <Sparkles className="text-purple-500 mb-3" size={24} />
                      <h3 className="font-bold mb-1 dark:text-white">Tổng hợp AI</h3>
                      <p className="text-xs text-zinc-500">Tự động tạo đề cương và đề thi thử từ các chuyên đề.</p>
                    </div>
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <Layout className="text-blue-500 mb-3" size={24} />
                      <h3 className="font-bold mb-1 dark:text-white">Cấu trúc đề</h3>
                      <p className="text-xs text-zinc-500">Phân bổ tỷ lệ trắc nghiệm và tự luận chuẩn.</p>
                    </div>
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <FileText className="text-emerald-500 mb-3" size={24} />
                      <h3 className="font-bold mb-1 dark:text-white">Xuất PDF</h3>
                      <p className="text-xs text-zinc-500">Lưu trữ và in ấn đề cương ôn tập dễ dàng.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
