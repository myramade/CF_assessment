import { useState } from "react";
import WelcomeHero from "@/components/WelcomeHero";
import IntakeForm, { type IntakeFormData } from "@/components/IntakeForm";
import AssessmentQuestion from "@/components/AssessmentQuestion";
import ProgressBar from "@/components/ProgressBar";
import LoadingAnalysis from "@/components/LoadingAnalysis";
import ResultsDisplay from "@/components/ResultsDisplay";
import Header from "@/components/Header";
import { questions } from "@/data/questions";
import { personalities } from "@/data/personalities";
import type { Answer } from "@/data/questions";
import type { Personality } from "@/data/personalities";

type Stage = "welcome" | "intake" | "assessment" | "analyzing" | "results";

export default function Home() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [userData, setUserData] = useState<IntakeFormData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<{
    personality: Personality;
    traitScores: {
      Dominance: number;
      Influence: number;
      Steadiness: number;
      Conscientiousness: number;
    };
  } | null>(null);

  const handleGetStarted = () => {
    setStage("intake");
  };

  const handleIntakeSubmit = (data: IntakeFormData) => {
    setUserData(data);
    setStage("assessment");
  };

  const handleAnswer = (answer: Answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Assessment complete
      setStage("analyzing");
      // Simulate AI analysis
      setTimeout(() => {
        const calculatedResult = calculatePersonality(newAnswers);
        setResult(calculatedResult);
        setStage("results");
      }, 3000);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculatePersonality = (userAnswers: Answer[]): {
    personality: Personality;
    traitScores: {
      Dominance: number;
      Influence: number;
      Steadiness: number;
      Conscientiousness: number;
    };
  } => {
    // Calculate trait scores
    const traitTotals: Record<string, { total: number; count: number }> = {
      Dominance: { total: 0, count: 0 },
      Influence: { total: 0, count: 0 },
      Steadiness: { total: 0, count: 0 },
      Conscientiousness: { total: 0, count: 0 }
    };

    userAnswers.forEach(answer => {
      if (answer.trait === "Dominance" || answer.trait === "Influence" || 
          answer.trait === "Steadiness" || answer.trait === "Conscientiousness") {
        traitTotals[answer.trait].total += answer.score;
        traitTotals[answer.trait].count += 1;
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

    // Determine personality type based on scores
    const sortedTraits = Object.entries(traitScores)
      .sort(([, a], [, b]) => b - a)
      .map(([trait]) => trait[0]); // Get first letter

    let personalityKey = "";
    
    // Check if top two scores are significantly higher than others
    const scores = Object.values(traitScores).sort((a, b) => b - a);
    const topScore = scores[0];
    const secondScore = scores[1];
    
    if (topScore >= 60 && secondScore >= 55 && (topScore - secondScore) < 20) {
      // Two-trait combination
      personalityKey = sortedTraits.slice(0, 2).join("");
    } else if (topScore >= 60) {
      // Single dominant trait
      personalityKey = sortedTraits[0];
    } else {
      // Default to highest score
      personalityKey = sortedTraits[0];
    }

    // Ensure the personality key exists
    const personality = personalities[personalityKey] || personalities.D;

    return {
      personality,
      traitScores
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {stage !== "welcome" && <Header />}
      
      {stage === "welcome" && (
        <WelcomeHero onGetStarted={handleGetStarted} />
      )}

      {stage === "intake" && (
        <IntakeForm onSubmit={handleIntakeSubmit} />
      )}

      {stage === "assessment" && (
        <>
          <ProgressBar current={currentQuestion + 1} total={questions.length} />
          <AssessmentQuestion
            question={questions[currentQuestion]}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            onPrevious={currentQuestion > 0 ? handlePrevious : undefined}
            selectedAnswer={answers[currentQuestion]}
          />
        </>
      )}

      {stage === "analyzing" && (
        <LoadingAnalysis />
      )}

      {stage === "results" && result && userData && (
        <ResultsDisplay
          personality={result.personality}
          userName={userData.name}
          traitScores={result.traitScores}
          onDownloadReport={() => console.log("Download report")}
        />
      )}
    </div>
  );
}
