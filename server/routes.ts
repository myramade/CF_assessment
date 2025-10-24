import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openai } from "./openai";
import { personalities } from "../client/src/data/personalities";
import type { Answer } from "../client/src/data/questions";
import { insertAssessmentSchema, insertAssessmentResponseSchema, insertAssessmentResultSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create new assessment
  app.post("/api/assessments", async (req, res) => {
    try {
      const validatedData = insertAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(validatedData);
      res.json(assessment);
    } catch (error) {
      console.error("Error creating assessment:", error);
      res.status(400).json({ error: "Invalid assessment data" });
    }
  });

  // Save assessment responses
  app.post("/api/assessments/:id/responses", async (req, res) => {
    try {
      const { id } = req.params;
      const { responses } = req.body as { responses: Answer[] };

      // Save each response
      const savedResponses = await Promise.all(
        responses.map((answer, index) =>
          storage.createAssessmentResponse({
            assessmentId: id,
            questionId: `q${index + 1}`,
            answerId: answer.id,
            answerText: answer.text,
            trait: answer.trait,
            score: answer.score,
          })
        )
      );

      res.json({ success: true, responses: savedResponses });
    } catch (error) {
      console.error("Error saving responses:", error);
      res.status(400).json({ error: "Failed to save responses" });
    }
  });

  // Analyze assessment with AI
  app.post("/api/assessments/:id/analyze", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get assessment and responses
      const assessment = await storage.getAssessment(id);
      const responses = await storage.getAssessmentResponses(id);

      if (!assessment || responses.length === 0) {
        return res.status(404).json({ error: "Assessment not found" });
      }

      // Map non-DISC traits to DISC categories
      const traitMapping: Record<string, string> = {
        // Direct DISC traits
        "Dominance": "Dominance",
        "Influence": "Influence",
        "Steadiness": "Steadiness",
        "Conscientiousness": "Conscientiousness",
        // Myers-Briggs traits mapped to DISC
        "Extraversion": "Influence",
        "Introversion": "Steadiness",
        "Sensing": "Conscientiousness",
        "Intuition": "Dominance",
        "Thinking": "Conscientiousness",
        "Feeling": "Influence",
        "Judging": "Conscientiousness",
        "Perceiving": "Influence",
        // Personality traits mapped to DISC
        "Openness": "Influence",
        "Agreeableness": "Steadiness",
        "Neuroticism": "Steadiness"
      };

      // Calculate trait scores
      const traitTotals: Record<string, { total: number; count: number }> = {
        Dominance: { total: 0, count: 0 },
        Influence: { total: 0, count: 0 },
        Steadiness: { total: 0, count: 0 },
        Conscientiousness: { total: 0, count: 0 }
      };

      responses.forEach(response => {
        const discTrait = traitMapping[response.trait];
        if (discTrait) {
          traitTotals[discTrait].total += response.score;
          traitTotals[discTrait].count += 1;
        }
      });

      // Calculate percentages
      const traitScores = {
        Dominance: traitTotals.Dominance.count > 0 
          ? Math.round((traitTotals.Dominance.total / (traitTotals.Dominance.count * 3)) * 100)
          : 0,
        Influence: traitTotals.Influence.count > 0
          ? Math.round((traitTotals.Influence.total / (traitTotals.Influence.count * 3)) * 100)
          : 0,
        Steadiness: traitTotals.Steadiness.count > 0
          ? Math.round((traitTotals.Steadiness.total / (traitTotals.Steadiness.count * 3)) * 100)
          : 0,
        Conscientiousness: traitTotals.Conscientiousness.count > 0
          ? Math.round((traitTotals.Conscientiousness.total / (traitTotals.Conscientiousness.count * 3)) * 100)
          : 0
      };

      // Determine personality type
      const sortedTraits = Object.entries(traitScores)
        .sort(([, a], [, b]) => b - a)
        .map(([trait]) => trait[0]);

      const scores = Object.values(traitScores).sort((a, b) => b - a);
      const topScore = scores[0];
      const secondScore = scores[1];
      
      let personalityKey = "";
      if (topScore >= 60 && secondScore >= 55 && (topScore - secondScore) < 20) {
        personalityKey = sortedTraits.slice(0, 2).join("");
      } else if (topScore >= 60) {
        personalityKey = sortedTraits[0];
      } else {
        personalityKey = sortedTraits[0];
      }

      const personality = personalities[personalityKey] || personalities.D;

      // Get AI analysis
      let aiAnalysis = "";
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-5-mini",
          messages: [
            {
              role: "system",
              content: "You are a career counselor providing personalized insights based on personality assessments. Provide encouraging, specific, and actionable guidance."
            },
            {
              role: "user",
              content: `Based on this personality assessment:
- Personality Type: ${personality.title} (${personalityKey})
- Dominance: ${traitScores.Dominance}%
- Influence: ${traitScores.Influence}%
- Steadiness: ${traitScores.Steadiness}%
- Conscientiousness: ${traitScores.Conscientiousness}%
- Job Interest: ${assessment.jobInterest}
- Role Level: ${assessment.roleLevel}

Provide 2-3 paragraphs of personalized career guidance and insights for ${assessment.name}.`
            }
          ],
          max_completion_tokens: 500
        });

        aiAnalysis = completion.choices[0]?.message?.content || "";
      } catch (error) {
        console.error("AI analysis error:", error);
        aiAnalysis = "AI analysis temporarily unavailable.";
      }

      // Save results
      const result = await storage.createAssessmentResult({
        assessmentId: id,
        personalityKey: personalityKey,
        personalityTitle: personality.title,
        dominanceScore: traitScores.Dominance,
        influenceScore: traitScores.Influence,
        steadinessScore: traitScores.Steadiness,
        conscientiousnessScore: traitScores.Conscientiousness,
        aiAnalysis,
      });

      res.json({
        result,
        personality,
        traitScores
      });
    } catch (error) {
      console.error("Error analyzing assessment:", error);
      res.status(500).json({ error: "Failed to analyze assessment" });
    }
  });

  // Get assessment results
  app.get("/api/assessments/:id/results", async (req, res) => {
    try {
      const { id } = req.params;
      
      const assessment = await storage.getAssessment(id);
      const result = await storage.getAssessmentResult(id);

      if (!assessment || !result) {
        return res.status(404).json({ error: "Results not found" });
      }

      const personality = personalities[result.personalityKey] || personalities.D;

      res.json({
        assessment,
        result,
        personality,
        traitScores: {
          Dominance: result.dominanceScore,
          Influence: result.influenceScore,
          Steadiness: result.steadinessScore,
          Conscientiousness: result.conscientiousnessScore
        }
      });
    } catch (error) {
      console.error("Error fetching results:", error);
      res.status(500).json({ error: "Failed to fetch results" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
