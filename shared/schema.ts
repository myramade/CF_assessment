import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User assessments table - stores intake form data
export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  age: integer("age").notNull(),
  jobInterest: text("job_interest").notNull(),
  roleLevel: text("role_level").notNull(),
  consentAI: boolean("consent_ai").notNull().default(false),
  consentMarketing: boolean("consent_marketing").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Assessment responses table - stores individual question answers
export const assessmentResponses = pgTable("assessment_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assessmentId: varchar("assessment_id").notNull().references(() => assessments.id, { onDelete: "cascade" }),
  questionId: text("question_id").notNull(),
  answerId: integer("answer_id").notNull(),
  answerText: text("answer_text").notNull(),
  trait: text("trait").notNull(),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Assessment results table - stores personality analysis
export const assessmentResults = pgTable("assessment_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assessmentId: varchar("assessment_id").notNull().references(() => assessments.id, { onDelete: "cascade" }),
  personalityKey: text("personality_key").notNull(),
  personalityTitle: text("personality_title").notNull(),
  dominanceScore: integer("dominance_score").notNull(),
  influenceScore: integer("influence_score").notNull(),
  steadinessScore: integer("steadiness_score").notNull(),
  conscientiousnessScore: integer("conscientiousness_score").notNull(),
  aiAnalysis: text("ai_analysis"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssessmentResponseSchema = createInsertSchema(assessmentResponses).omit({
  id: true,
  createdAt: true,
});

export const insertAssessmentResultSchema = createInsertSchema(assessmentResults).omit({
  id: true,
  createdAt: true,
});

// Types
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type AssessmentResponse = typeof assessmentResponses.$inferSelect;
export type InsertAssessmentResponse = z.infer<typeof insertAssessmentResponseSchema>;

export type AssessmentResult = typeof assessmentResults.$inferSelect;
export type InsertAssessmentResult = z.infer<typeof insertAssessmentResultSchema>;
