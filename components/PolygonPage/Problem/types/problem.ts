export type Language = "en" | "vi" | "zh-CN";

export interface MultiLangText {
  en: string;
  vi: string;
  "zh-CN": string;
}

export interface Problem {
  id: string | null;
  displayTitle: string;
  category: string;
  difficulty: number;
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

export const defaultMultiLangText: MultiLangText = {
  en: "",
  vi: "",
  "zh-CN": "",
};

export const defaultProblem: Problem = {
  id: null,
  displayTitle: "",
  category: "",
  difficulty: 0,
  content: {
    title: defaultMultiLangText,
    description: defaultMultiLangText,
    solution: defaultMultiLangText,
  },
};

export type ProblemUpdate = Partial<Problem>;
export type ContentUpdate = Partial<Problem["content"]>;