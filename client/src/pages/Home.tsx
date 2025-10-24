import { useState } from "react";
import WelcomeHero from "@/components/WelcomeHero";
import IntakeForm, { type IntakeFormData } from "@/components/IntakeForm";
import AssessmentQuestion from "@/components/AssessmentQuestion";
import ProgressBar from "@/components/ProgressBar";
import LoadingAnalysis from "@/components/LoadingAnalysis";
import ResultsDisplay from "@/components/ResultsDisplay";
import Header from "@/components/Header";
import { questions } from "@/data/questions";
import type { Answer } from "@/data/questions";
import type { Personality } from "@/data/personalities";
import { apiRequest } from "@/lib/queryClient";

type Stage = "welcome" | "intake" | "assessment" | "analyzing" | "results";

export default function Home() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [userData, setUserData] = useState<IntakeFormData | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
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

  const handleIntakeSubmit = async (data: IntakeFormData) => {
    try {
      // Create assessment in database - convert age to number
      const assessmentData = {
        ...data,
        age: parseInt(data.age, 10)
      };
      const res = await apiRequest("POST", "/api/assessments", assessmentData);
      const assessment = await res.json() as { id: string };

      setAssessmentId(assessment.id);
      setUserData(data);
      setStage("assessment");
    } catch (error) {
      console.error("Error creating assessment:", error);
      alert("Failed to start assessment. Please try again.");
    }
  };

  const handleAnswer = (answer: Answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Assessment complete - save and analyze
      submitAssessment(newAnswers);
    }
  };

  const submitAssessment = async (userAnswers: Answer[]) => {
    if (!assessmentId) return;

    setStage("analyzing");

    try {
      // Save responses
      await apiRequest("POST", `/api/assessments/${assessmentId}/responses`, { responses: userAnswers });

      // Trigger AI analysis
      const analysisRes = await apiRequest("POST", `/api/assessments/${assessmentId}/analyze`);
      const analysisResult = await analysisRes.json() as {
        result: any;
        personality: Personality;
        traitScores: {
          Dominance: number;
          Influence: number;
          Steadiness: number;
          Conscientiousness: number;
        };
      };

      setResult({
        personality: analysisResult.personality,
        traitScores: analysisResult.traitScores,
      });

      setStage("results");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("Failed to analyze assessment. Please try again.");
      setStage("assessment");
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
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
          assessmentId={assessmentId || undefined}
          traitScores={result.traitScores}
          onDownloadReport={() => console.log("Download report")}
        />
      )}
    </div>
  );
}
