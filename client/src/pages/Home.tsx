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
import jsPDF from "jspdf";

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

  const handleDownloadReport = () => {
    if (!result || !userData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = 20;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * fontSize * 0.4 + 5;
    };

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Career Assessment Report", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    // User info
    addText(`Name: ${userData.name}`, 12, true);
    addText(`Email: ${userData.email}`, 11);
    addText(`Job Interest: ${userData.jobInterest}`, 11);
    addText(`Role Level: ${userData.roleLevel}`, 11);
    yPosition += 5;

    // Personality Type
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, maxWidth, 15, "F");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Personality Type: ${result.personality.title}`, margin + 5, yPosition + 10);
    yPosition += 20;

    // DISC Scores
    addText("DISC Personality Scores:", 12, true);
    addText(`Dominance: ${result.traitScores.Dominance}`, 11);
    addText(`Influence: ${result.traitScores.Influence}`, 11);
    addText(`Steadiness: ${result.traitScores.Steadiness}`, 11);
    addText(`Conscientiousness: ${result.traitScores.Conscientiousness}`, 11);
    yPosition += 5;

    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Overview
    addText("Overview:", 12, true);
    addText(result.personality.detail, 11);
    yPosition += 5;

    // Key Strengths
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    addText("Key Strengths:", 12, true);
    result.personality.strengths.forEach((strength: string) => {
      addText(`• ${strength}`, 11);
    });
    yPosition += 5;

    // Values
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    addText("Core Values:", 12, true);
    result.personality.values.forEach((value: string) => {
      addText(`• ${value}`, 11);
    });
    yPosition += 5;

    // Recommended Career Paths
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    addText("Recommended Career Paths:", 12, true);
    result.personality.recommendedJobs.forEach((job: string) => {
      addText(`• ${job}`, 11);
    });
    yPosition += 5;

    // Company Culture
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    addText("Ideal Company Culture:", 12, true);
    addText(result.personality.companyCulture, 11);
    yPosition += 5;

    // Professional Characteristics
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    addText("Professional Characteristics:", 12, true);
    addText(result.personality.professionalCharacteristics, 11);

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(128);
      doc.text(
        `CultureForward Career Assessment - Page ${i} of ${totalPages}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }

    // Save the PDF
    doc.save(`CultureForward_Assessment_${userData.name.replace(/\s+/g, '_')}.pdf`);
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
          onDownloadReport={handleDownloadReport}
        />
      )}
    </div>
  );
}
