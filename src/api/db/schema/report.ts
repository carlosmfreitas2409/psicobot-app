import {
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const conversation = pgTable("conversation", {
  id: text("id").primaryKey(),
  messagesCount: integer("messages_count").notNull(),
  yesCount: integer("yes_count").notNull(),
  noCount: integer("no_count").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const chatReport = pgTable("chat_report", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversation.id, { onDelete: "cascade" }),
  reportJson: jsonb("report_json").notNull(),
  engagementRate: integer("engagement_rate").notNull(),
  wellbeingScore: real("wellbeing_score").notNull(),
  riskCritical: integer("risk_critical").notNull(),
  riskHigh: integer("risk_high").notNull(),
  riskMedium: integer("risk_medium").notNull(),
  riskLow: integer("risk_low").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
