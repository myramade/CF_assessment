import {
  type Assessment,
  type InsertAssessment,
  type AssessmentResponse,
  type InsertAssessmentResponse,
  type AssessmentResult,
  type InsertAssessmentResult,
  assessments,
  assessmentResponses,
  assessmentResults,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Assessment operations
  createAssessment(data: InsertAssessment): Promise<Assessment>;
  getAssessment(id: string): Promise<Assessment | undefined>;
  updateAssessment(id: string, data: Partial<InsertAssessment>): Promise<Assessment | undefined>;
  
  // Assessment response operations
  createAssessmentResponse(data: InsertAssessmentResponse): Promise<AssessmentResponse>;
  getAssessmentResponses(assessmentId: string): Promise<AssessmentResponse[]>;
  
  // Assessment result operations
  createAssessmentResult(data: InsertAssessmentResult): Promise<AssessmentResult>;
  getAssessmentResult(assessmentId: string): Promise<AssessmentResult | undefined>;
}

export class DbStorage implements IStorage {
  async createAssessment(data: InsertAssessment): Promise<Assessment> {
    const [assessment] = await db.insert(assessments).values(data).returning();
    return assessment;
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    const [assessment] = await db.select().from(assessments).where(eq(assessments.id, id));
    return assessment;
  }

  async updateAssessment(id: string, data: Partial<InsertAssessment>): Promise<Assessment | undefined> {
    const [assessment] = await db
      .update(assessments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(assessments.id, id))
      .returning();
    return assessment;
  }

  async createAssessmentResponse(data: InsertAssessmentResponse): Promise<AssessmentResponse> {
    const [response] = await db.insert(assessmentResponses).values(data).returning();
    return response;
  }

  async getAssessmentResponses(assessmentId: string): Promise<AssessmentResponse[]> {
    return await db
      .select()
      .from(assessmentResponses)
      .where(eq(assessmentResponses.assessmentId, assessmentId));
  }

  async createAssessmentResult(data: InsertAssessmentResult): Promise<AssessmentResult> {
    const [result] = await db.insert(assessmentResults).values(data).returning();
    return result;
  }

  async getAssessmentResult(assessmentId: string): Promise<AssessmentResult | undefined> {
    const [result] = await db
      .select()
      .from(assessmentResults)
      .where(eq(assessmentResults.assessmentId, assessmentId));
    return result;
  }
}

export const storage = new DbStorage();
