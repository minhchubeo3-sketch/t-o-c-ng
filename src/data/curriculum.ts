import { Topic, StudyGuide } from "../types/math";

export const CURRICULUM_TOPICS: Topic[] = [
  // THCS - Số học
  { id: "thcs-6-sh-1", title: "Tập hợp số tự nhiên", grade: "6", level: "THCS", semester: "1", category: "Số học" },
  { id: "thcs-6-sh-2", title: "Số nguyên", grade: "6", level: "THCS", semester: "1", category: "Số học" },
  { id: "thcs-7-sh-1", title: "Số hữu tỉ", grade: "7", level: "THCS", semester: "1", category: "Số học" },
  { id: "thcs-6-sh-3", title: "Phân số, số thập phân", grade: "6", level: "THCS", semester: "2", category: "Số học" },
  { id: "thcs-7-sh-2", title: "Lũy thừa, căn bậc hai", grade: "7", level: "THCS", semester: "1", category: "Số học" },
  
  // THCS - Đại số
  { id: "thcs-8-ds-1", title: "Hằng đẳng thức đáng nhớ", grade: "8", level: "THCS", semester: "1", category: "Đại số" },
  { id: "thcs-8-ds-2", title: "Phân tích đa thức thành nhân tử", grade: "8", level: "THCS", semester: "1", category: "Đại số" },
  { id: "thcs-9-ds-1", title: "Phương trình bậc nhất", grade: "9", level: "THCS", semester: "2", category: "Đại số" },
  
  // THCS - Hình học
  { id: "thcs-7-hh-1", title: "Định lý Pythagore", grade: "7", level: "THCS", semester: "2", category: "Hình học" },
  { id: "thcs-9-hh-1", title: "Đường tròn", grade: "9", level: "THCS", semester: "1", category: "Hình học" },

  // THPT - Đại số & Giải tích
  { id: "thpt-10-ds-1", title: "Hàm số bậc hai", grade: "10", level: "THPT", semester: "1", category: "Đại số" },
  { id: "thpt-11-gt-1", title: "Hàm số lượng giác", grade: "11", level: "THPT", semester: "1", category: "Giải tích" },
  { id: "thpt-12-gt-1", title: "Đạo hàm và ứng dụng", grade: "12", level: "THPT", semester: "1", category: "Giải tích" },
  { id: "thpt-12-gt-2", title: "Tích phân và ứng dụng", grade: "12", level: "THPT", semester: "2", category: "Giải tích" },

  // THPT - Hình học
  { id: "thpt-10-hh-1", title: "Vector trong mặt phẳng", grade: "10", level: "THPT", semester: "1", category: "Hình học" },
  { id: "thpt-12-hh-1", title: "Thể tích khối đa diện", grade: "12", level: "THPT", semester: "1", category: "Hình học" },
];

export const SAMPLE_GUIDES: Record<string, StudyGuide> = {
  "thcs-8-ds-1": {
    id: "guide-1",
    topicId: "thcs-8-ds-1",
    theory: "Hằng đẳng thức đáng nhớ là những biểu thức đại số có dạng đặc biệt, giúp ta thực hiện các phép toán nhân đa thức và phân tích đa thức thành nhân tử một cách nhanh chóng.",
    formulas: [
      "(a + b)^2 = a^2 + 2ab + b^2",
      "(a - b)^2 = a^2 - 2ab + b^2",
      "a^2 - b^2 = (a - b)(a + b)",
      "(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3",
      "(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3",
      "a^3 + b^3 = (a + b)(a^2 - ab + b^2)",
      "a^3 - b^3 = (a - b)(a^2 + ab + b^2)"
    ],
    examples: [
      {
        title: "Khai triển biểu thức",
        content: "Khai triển $(x + 2y)^2$",
        solution: "Áp dụng hằng đẳng thức $(a+b)^2 = a^2 + 2ab + b^2$ với $a=x, b=2y$:\n$(x + 2y)^2 = x^2 + 2 \\cdot x \\cdot 2y + (2y)^2 = x^2 + 4xy + 4y^2$"
      }
    ],
    exercises: [
      {
        id: "ex-1",
        question: "Tính $(3x - 1)^2$",
        solution: "$(3x - 1)^2 = (3x)^2 - 2 \\cdot 3x \\cdot 1 + 1^2 = 9x^2 - 6x + 1$",
        level: "Nhận biết",
        type: "Lý thuyết"
      },
      {
        id: "ex-2",
        question: "Một mảnh vườn hình vuông có cạnh là $x+5$ (m). Tính diện tích mảnh vườn theo $x$.",
        solution: "Diện tích $S = (x+5)^2 = x^2 + 10x + 25$ ($m^2$)",
        level: "Thông hiểu",
        type: "Thực tế"
      }
    ]
  },
  "thpt-12-gt-2": {
    id: "guide-2",
    topicId: "thpt-12-gt-2",
    theory: "Tích phân là một khái niệm quan trọng trong giải tích, dùng để tính diện tích hình phẳng, thể tích vật thể và giải quyết nhiều bài toán thực tế.",
    formulas: [
      "\\int_{a}^{b} f(x) dx = F(b) - F(a)",
      "\\int k \\cdot f(x) dx = k \\int f(x) dx",
      "\\int [f(x) \\pm g(x)] dx = \\int f(x) dx \\pm \\int g(x) dx"
    ],
    examples: [
      {
        title: "Tính tích phân cơ bản",
        content: "Tính $I = \\int_{0}^{1} x^2 dx$",
        solution: "$I = \\left[ \\frac{x^3}{3} \\right]_{0}^{1} = \\frac{1^3}{3} - \\frac{0^3}{3} = \\frac{1}{3}$"
      }
    ],
    exercises: [
      {
        id: "ex-3",
        question: "Tính diện tích hình phẳng giới hạn bởi đồ thị hàm số $y = x^2$, trục hoành và hai đường thẳng $x=0, x=2$.",
        solution: "$S = \\int_{0}^{2} |x^2| dx = \\int_{0}^{2} x^2 dx = \\left[ \\frac{x^3}{3} \\right]_{0}^{2} = \\frac{8}{3}$",
        level: "Vận dụng",
        type: "Hình học"
      }
    ]
  },
  "thcs-7-hh-1": {
    id: "guide-3",
    topicId: "thcs-7-hh-1",
    theory: "Trong một tam giác vuông, bình phương của cạnh huyền bằng tổng bình phương của hai cạnh góc vuông.",
    formulas: [
      "a^2 + b^2 = c^2 \\text{ (với } c \\text{ là cạnh huyền)}"
    ],
    examples: [
      {
        title: "Tính cạnh huyền",
        content: "Cho tam giác $ABC$ vuông tại $A$ có $AB=3cm, AC=4cm$. Tính $BC$.",
        solution: "Áp dụng định lý Pythagore: $BC^2 = AB^2 + AC^2 = 3^2 + 4^2 = 9 + 16 = 25$. Suy ra $BC = \\sqrt{25} = 5cm$."
      }
    ],
    exercises: [
      {
        id: "ex-4",
        question: "Một chiếc thang dài 5m dựa vào tường. Chân thang cách tường 3m. Hỏi đầu thang chạm tường ở độ cao bao nhiêu?",
        solution: "Gọi độ cao là $h$. Ta có $h^2 + 3^2 = 5^2 \\Rightarrow h^2 = 25 - 9 = 16 \\Rightarrow h = 4m$.",
        level: "Thông hiểu",
        type: "Thực tế"
      }
    ]
  }
};
