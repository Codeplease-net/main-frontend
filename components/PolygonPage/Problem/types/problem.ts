export type Language = "en" | "vi" | "zh-CN";

export interface MultiLangText {
  en: string;
  vi: string;
  "zh-CN": string;
}

export interface Problem {
  id: string | null;
  displayTitle: string;
  categories: string[];
  difficulty: number;
  searchableTitle?: string[];
  content: {
    title: MultiLangText;
    description: MultiLangText;
    solution: MultiLangText;
  };
}

export interface ProblemState {
  isLoading: boolean;
  isDone: boolean;
}

// Default title template
export const defaultTitleText: MultiLangText = {
  en: "Problem Title",
  vi: "Tiêu Đề Bài Toán",
  "zh-CN": "问题标题",
};

// Default description template with well-structured sections
export const defaultDescriptionText: MultiLangText = {
  en: `[Describe the problem statement here]

#### Input Format

[Explain the input format here]

#### Output Format

[Explain the expected output format here]

#### Example:

\\begin{example}
...
\`\`\`        
...
\\end{example}

#### Note

[Additional notes or explanations if needed]`,
  vi: `[Mô tả bài toán ở đây]

#### Định Dạng Đầu Vào

[Giải thích định dạng đầu vào ở đây]

#### Định Dạng Đầu Ra

[Giải thích định dạng đầu ra mong đợi ở đây]

#### Ví Dụ:

\\begin{example}
...
\`\`\`        
...
\\end{example}

#### Ghi Chú

[Ghi chú hoặc giải thích thêm nếu cần thiết]`,
  "zh-CN": `[在此处描述问题]

#### 输入格式

[在此处解释输入格式]

#### 输出格式

[在此处解释预期的输出格式]

#### 示例:

\\begin{example}
...
\`\`\`        
...
\\end{example}

### 注释

[如有需要，添加额外的注释或解释]`,
};

// Default solution template with approach and complexity analysis
export const defaultSolutionText: MultiLangText = {
  en: `[Explain your solution approach here]

#### Implementation Details

[Explain key implementation details]

\\begin{detail}
  \\summary Sample Code (C++)

\\begin{cpp}
#include <bits/stdc++.h>

using namespace std;

int main(){
  // Your code here
  return 0;
}
\\end{cpp}
\\end{detail}

#### Time Complexity

- [Analyze the time complexity]

- [e.g., O(n log n) where n is the input size]

#### Space Complexity

- [Analyze the space complexity]

- [e.g., O(n) for storing the input array]`,
  vi: `[Giải thích phương pháp giải của bạn ở đây]

#### Chi Tiết Cài Đặt

[Giải thích các chi tiết cài đặt quan trọng]

\\begin{detail}
  \\summary Code Mẫu (C++)

\\begin{cpp}
#include <bits/stdc++.h>

using namespace std;

int main(){
  // Code ở đây
  return 0;
}
\\end{cpp}
\\end{detail}

#### Độ Phức Tạp Thời Gian

- [Phân tích độ phức tạp thời gian]

- [Ví dụ: O(n log n) với n là kích thước đầu vào]

#### Độ Phức Tạp Không Gian

- [Phân tích độ phức tạp không gian]

- [Ví dụ: O(n) để lưu trữ mảng đầu vào]`,
"zh-CN": `[在此处解释您的解决方案]

#### 实现细节

[解释关键实现细节]

\\begin{detail}
  \\summary 示例代码 (C++)

\\begin{cpp}
#include <bits/stdc++.h>

using namespace std;

int main(){
  // 在此处编写代码
  return 0;
}
\\end{cpp}
\\end{detail}

#### 时间复杂度

- [分析时间复杂度]

- [例如：O(n log n)，其中 n 是输入大小]

#### 空间复杂度

- [分析空间复杂度]

- [例如：O(n) 用于存储输入数组]`
};

// Update the defaultProblem to use these specialized templates
export const defaultProblem: Problem = {
  id: null,
  displayTitle: "",
  categories: [],
  difficulty: 0,
  content: {
    title: defaultTitleText,
    description: defaultDescriptionText,
    solution: defaultSolutionText,
  },
};

export type ProblemUpdate = Partial<Problem>;
export type ContentUpdate = Partial<Problem["content"]>;