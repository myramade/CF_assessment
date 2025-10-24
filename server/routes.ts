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
        .sort(([, a], [, b]) => b - a);

      const scores = Object.values(traitScores).sort((a, b) => b - a);
      const topScore = scores[0];
      const secondScore = scores[1];
      
      let personalityKey = "";
      
      // Determine if it's a two-trait combination or single trait
      if (topScore >= 60 && secondScore >= 55 && (topScore - secondScore) < 20) {
        // Two-trait combination
        const trait1 = sortedTraits[0][0][0]; // First letter of first trait
        const trait2 = sortedTraits[1][0][0]; // First letter of second trait
        
        // Try both combinations (e.g., "DI" and "ID") and use whichever exists
        const combo1 = trait1 + trait2;
        const combo2 = trait2 + trait1;
        
        if (personalities[combo1]) {
          personalityKey = combo1;
        } else if (personalities[combo2]) {
          personalityKey = combo2;
        } else {
          // Fall back to single dominant trait
          personalityKey = trait1;
        }
      } else {
        // Single dominant trait
        personalityKey = sortedTraits[0][0][0];
      }

      const personality = personalities[personalityKey] || personalities.D;

      // Get AI analysis
      let aiAnalysis = "";
      try {
        // Build context about the user's responses
        const responseSummary = responses.map(r => 
          `Question: ${r.questionId.replace(/-/g, ' ')} | Answer: ${r.answerText} (${r.score} points to ${r.trait})`
        ).join('\n');

        const completion = await openai.chat.completions.create({
          model: "gpt-5-mini",
          messages: [
            {
              role: "system",
              content: `You are an expert career counselor using the Culture Forward Assessment framework. This framework categorizes individuals into personality profiles based on DISC traits (Dominance, Influence, Steadiness, Conscientiousness).

PERSONALITY PROFILES & COMPATIBLE ROLES:

Pure Types:
1. D (Dominant): "The Trailblazing Leader" - Assertive, results-oriented, enjoys challenges
   - Compatible Companies: Tech startups, consulting firms, innovative companies
   - Job Roles: Operations Manager, Business Development Manager, Entrepreneur, Project Manager
   
2. I (Influential): "The Charismatic Communicator" - Persuasive, sociable, thrives in collaboration
   - Compatible Companies: Creative agencies, marketing firms, tech startups
   - Job Roles: Marketing Specialist, HR Manager, Creative Director, Public Relations Manager, Customer Success Manager
   
3. S (Steady): "The Reliable Supporter" - Stable, consistent, great team player
   - Compatible Companies: Non-profits, educational institutions, healthcare organizations
   - Job Roles: Customer Service Manager, HR Specialist, Teacher, Social Worker, Healthcare Professional
   
4. C (Conscientious): "The Analytical Strategist" - Detail-oriented, analytical, values accuracy
   - Compatible Companies: Financial institutions, tech companies, consulting firms
   - Job Roles: Data Analyst, Financial Analyst, Software Engineer, Quality Assurance Specialist, Research Scientist

Two-Type Combinations:
- DI/ID: "The Dynamic Innovator" - Leads and inspires change (Roles: CEO, Product Manager, Business Development)
- DS/SD: "The Grounded Pioneer" - Methodical progress driver (Roles: Operations Director, Program Manager)
- DC/CD: "The Tactical Executive" - Strategic planner (Roles: Senior Manager, Strategy Consultant)
- IS/SI: "The Engaging Motivator" - Uplifts team morale (Roles: HR Director, Team Lead, Community Manager)
- IC/CI: "The Creative Persuader" - Crafts compelling narratives (Roles: Marketing Director, Content Strategist)
- SC/CS: "The Dependable Facilitator" - Supports and refines processes (Roles: Project Coordinator, Quality Manager)

IMPORTANT: When recommending careers, YOU MUST consider the individual's age, education level, and current role level interest. For example:
- A 22-year-old with a bachelor's degree interested in entry-level tech roles should NOT be recommended CEO or executive positions, regardless of their D trait score
- Instead, recommend appropriate entry-level roles like Program Coordinator, Junior Analyst, Associate positions
- For mid-level professionals, recommend Manager, Senior positions
- Only recommend Director/Executive roles to those explicitly interested in those levels

Provide encouraging, specific, and actionable guidance that is REALISTIC and APPROPRIATE for their demographic profile.`
            },
            {
              role: "user",
              content: `Analyze this individual's career assessment:

USER PROFILE:
- Name: ${assessment.name}
- Age: ${assessment.age}
- Education Level: ${assessment.educationLevel}
- Job Interest: ${assessment.jobInterest}
- Role Level Interest: ${assessment.roleLevel}

PERSONALITY ASSESSMENT RESULTS:
- Personality Type: ${personality.title} (${personalityKey})
- DISC Scores:
  * Dominance: ${traitScores.Dominance}%
  * Influence: ${traitScores.Influence}%
  * Steadiness: ${traitScores.Steadiness}%
  * Conscientiousness: ${traitScores.Conscientiousness}%

ASSESSMENT RESPONSES:
${responseSummary}

Based on their personality type, DISC scores, and most importantly their age (${assessment.age}), education (${assessment.educationLevel}), and role level interest (${assessment.roleLevel}), provide 2-3 paragraphs of personalized career guidance. 

Recommend SPECIFIC job roles that are:
1. Aligned with their personality type
2. APPROPRIATE for their age and experience level (${assessment.roleLevel})
3. Match their job interest area (${assessment.jobInterest})

Be realistic - don't recommend C-suite roles to someone seeking entry-level positions, even if they have high D scores.`
            }
          ],
          max_completion_tokens: 600
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
