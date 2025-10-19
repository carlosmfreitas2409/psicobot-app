import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { organization, user } from "./auth";

export const questionFrequency = pgEnum("question_frequency", [
  "rare",
  "occasional",
  "frequent",
]);

export const questionStatus = pgEnum("question_status", [
  "approved",
  "rejected",
  "pending",
]);

export const question = pgTable("question", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  frequency: questionFrequency("frequency").notNull(),
  status: questionStatus("status").notNull(),
  rejectionReason: text("rejection_reason"),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const questionRelations = relations(question, ({ one }) => ({
  organization: one(organization, {
    fields: [question.organizationId],
    references: [organization.id],
  }),
  author: one(user, {
    fields: [question.authorId],
    references: [user.id],
  }),
}));
