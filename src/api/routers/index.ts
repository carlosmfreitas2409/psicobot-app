import { createChatReport } from "./report";
import { getAnalyticsRoute } from "./analytics";
import { generateRecommendations } from "./recommendations";

import { createQuestion, getTotals, listQuestions } from "./questions";

export const router = {
  analytics: {
    totals: getAnalyticsRoute("totals"),
    wellbeingTotals: getAnalyticsRoute("wellbeing_totals"),
    wellbeingTimeseries: getAnalyticsRoute("wellbeing_timeseries"),
    chatTimeseries: getAnalyticsRoute("chat_timeseries"),
    chatTotals: getAnalyticsRoute("chat_totals"),
    topTopics: getAnalyticsRoute("top_topics"),
    riskTotals: getAnalyticsRoute("risk_totals"),
  },
  recommendations: {
    generate: generateRecommendations,
  },
  chats: {
    createReport: createChatReport,
  },
  questions: {
    totals: getTotals,
    list: listQuestions,
    create: createQuestion,
  },
};
