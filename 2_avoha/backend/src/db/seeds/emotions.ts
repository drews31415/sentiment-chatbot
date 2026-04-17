import type { InferInsertModel } from "drizzle-orm";
import { emotions } from "../schema.js";

// 10종 감정 × 3 카테고리 (PRD v1.1). gemName·hexColor 는 디자이너 확정 전 임시안.
export const EMOTIONS_SEED: InferInsertModel<typeof emotions>[] = [
  // ─ 평온 (calm) ─
  {
    code: "untroubled",
    nameKo: "무탈",
    category: "calm",
    gemName: "일상석",
    hexColor: "#CDD5D8",
    triggerKeywords: ["그냥 그런 하루", "별일 없었어", "무난", "평범", "보통"],
  },
  {
    code: "serenity",
    nameKo: "평온",
    category: "calm",
    gemName: "청옥",
    hexColor: "#3AAFA9",
    triggerKeywords: ["조용히", "차분하게", "한숨 돌렸어", "고요", "여유"],
  },

  // ─ 행복 (happy) ─
  {
    code: "pride",
    nameKo: "뿌듯",
    category: "happy",
    gemName: "황금석",
    hexColor: "#F5D76E",
    triggerKeywords: ["해냈어", "드디어 끝", "나 잘했지", "성공", "완성"],
  },
  {
    code: "joy",
    nameKo: "기쁨",
    category: "happy",
    gemName: "홍옥",
    hexColor: "#E8614D",
    triggerKeywords: ["너무 좋아", "행복", "신나", "좋다", "😊"],
  },
  {
    code: "satisfaction",
    nameKo: "만족",
    category: "happy",
    gemName: "호박석",
    hexColor: "#E8A838",
    triggerKeywords: ["꽤 괜찮네", "충분해", "나쁘지 않아", "흡족"],
  },
  {
    code: "flutter",
    nameKo: "설렘",
    category: "happy",
    gemName: "분홍석영",
    hexColor: "#F6A5B5",
    triggerKeywords: ["두근", "기대돼", "기다림", "주말", "약속"],
  },

  // ─ 부정 (negative) ─
  {
    code: "sadness",
    nameKo: "슬픔",
    category: "negative",
    gemName: "흑요석",
    hexColor: "#4A6B8A",
    triggerKeywords: ["눈물", "서러워", "울컥", "슬퍼"],
  },
  {
    code: "annoyance",
    nameKo: "짜증",
    category: "negative",
    gemName: "적철석",
    hexColor: "#C7502D",
    triggerKeywords: ["빡쳐", "왜 이래", "짜증나", "답답"],
  },
  {
    code: "regret",
    nameKo: "후회",
    category: "negative",
    gemName: "재석",
    hexColor: "#8B7355",
    triggerKeywords: ["~할걸", "괜히", "차라리", "아쉬워"],
  },
  {
    code: "solace",
    nameKo: "위로",
    category: "negative",
    gemName: "월장석",
    hexColor: "#A8B5D1",
    triggerKeywords: ["지쳤어", "힘들어", "토닥", "쉬고 싶다"],
  },
];
