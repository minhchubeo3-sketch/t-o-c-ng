export type Grade = "6" | "7" | "8" | "9" | "10" | "11" | "12";
export type Level = "THCS" | "THPT";
export type Semester = "1" | "2" | "Cả năm";
export type ExamType = "Giữa học kỳ" | "Cuối học kỳ";

export interface Topic {
  id: string;
  title: string;
  grade: Grade;
  level: Level;
  semester: Semester;
  category: "Số học" | "Đại số" | "Giải tích" | "Hình học" | "Thống kê & Xác suất";
}

export interface Exercise {
  id: string;
  question: string;
  solution: string;
  level: "Nhận biết" | "Thông hiểu" | "Vận dụng" | "Vận dụng cao";
  type: "Lý thuyết" | "Thực tế" | "Hình học";
}

export interface Example {
  title: string;
  content: string;
  solution: string;
}

export interface StudyGuide {
  id: string;
  topicId: string;
  theory: string;
  formulas: string[];
  examples: Example[];
  exercises: Exercise[];
}

export interface ReviewGuide {
  id: string;
  title: string;
  grade: Grade;
  semester: Semester;
  examType: ExamType;
  topics: StudyGuide[];
  examStructure?: {
    tracNghiem: number;
    tuLuan: number;
  };
}

export interface ExamQuestion extends Exercise {
  options?: string[];
  correctAnswer?: string;
}

export interface MockExam {
  id: string;
  title: string;
  grade: Grade;
  semester: Semester;
  examType: ExamType;
  duration: number; // minutes
  questions: ExamQuestion[];
}
