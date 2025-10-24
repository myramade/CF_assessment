import { useState } from "react";
import WelcomeHero from "@/components/WelcomeHero";
import IntakeForm, { type IntakeFormData } from "@/components/IntakeForm";
import AssessmentQuestion, { type Question } from "@/components/AssessmentQuestion";
import ProgressBar from "@/components/ProgressBar";
import LoadingAnalysis from "@/components/LoadingAnalysis";
import ResultsDisplay, { type AssessmentResult } from "@/components/ResultsDisplay";
import Header from "@/components/Header";

// Mock questions based on the assessment structure
const questions: Question[] = [
  { id: 1, text: "I find myself being the initiator in social situations.", category: "Influence" },
  { id: 2, text: "Organizing and structuring tasks is a natural skill for me.", category: "Conscientiousness" },
  { id: 3, text: "I tend to feel stressed when faced with unexpected changes.", category: "Steadiness" },
  { id: 4, text: "Understanding and empathizing with others comes easily to me.", category: "Influence" },
  { id: 5, text: "I am constantly looking for new and innovative ways to do things.", category: "Dominance" },
  { id: 6, text: "Self-improvement and personal growth are very important to me.", category: "Dominance" },
  { id: 7, text: "I prefer to follow established rules and procedures.", category: "Steadiness" },
  { id: 8, text: "Exploring philosophical and abstract concepts is intellectually stimulating for me.", category: "Conscientiousness" },
  { id: 9, text: "Achieving set goals and targets is a primary motivator for me.", category: "Dominance" },
  { id: 10, text: "Maintaining harmony in my relationships is a key priority.", category: "Steadiness" },
  { id: 11, text: "I have a wide range of interests and hobbies.", category: "Influence" },
  { id: 12, text: "In problem-solving, I rely more on practical solutions than creative ones.", category: "Conscientiousness" },
  { id: 13, text: "Receiving feedback or criticism affects me deeply.", category: "Steadiness" },
  { id: 14, text: "I base most of my decisions on logical analysis rather than intuition.", category: "Conscientiousness" },
  { id: 15, text: "Building deep, meaningful relationships is essential in my life.", category: "Steadiness" },
  { id: 16, text: "I enjoy taking risks when I believe in the potential outcome.", category: "Dominance" },
  { id: 17, text: "I thrive in collaborative environments where I can share ideas.", category: "Influence" },
  { id: 18, text: "I pay close attention to details and strive for accuracy.", category: "Conscientiousness" },
  { id: 19, text: "I prefer stability and predictability in my work environment.", category: "Steadiness" },
  { id: 20, text: "I am comfortable making quick decisions under pressure.", category: "Dominance" },
];

type Stage = "welcome" | "intake" | "assessment" | "analyzing" | "results";

export default function Home() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [userData, setUserData] = useState<IntakeFormData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const handleGetStarted = () => {
    setStage("intake");
  };

  const handleIntakeSubmit = (data: IntakeFormData) => {
    setUserData(data);
    setStage("assessment");
  };

  const handleAnswer = (answer: number) => {
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
        const mockResult = generateMockResult(newAnswers);
        setResult(mockResult);
        setStage("results");
      }, 3000);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Mock function to generate results based on answers
  const generateMockResult = (userAnswers: number[]): AssessmentResult => {
    // Calculate scores based on answer patterns
    const dominanceQuestions = [5, 6, 9, 16, 20];
    const influenceQuestions = [1, 4, 11, 17];
    const steadinessQuestions = [3, 7, 10, 13, 15, 19];
    const conscientiousnessQuestions = [2, 8, 12, 14, 18];

    const calcScore = (questionIndices: number[]) => {
      const sum = questionIndices.reduce((acc, idx) => acc + (userAnswers[idx - 1] || 0), 0);
      return Math.round((sum / (questionIndices.length * 5)) * 100);
    };

    const scores = {
      dominance: calcScore(dominanceQuestions),
      influence: calcScore(influenceQuestions),
      steadiness: calcScore(steadinessQuestions),
      conscientiousness: calcScore(conscientiousnessQuestions),
    };

    // Determine personality type based on highest scores
    const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const topTwo = sortedScores.slice(0, 2);
    
    let personalityType = "";
    let personalityTitle = "";
    let description = "";
    let traits: string[] = [];
    let compatibleRoles: string[] = [];
    let compatibleCompanies: string[] = [];

    if (topTwo[0][0] === "dominance" && topTwo[1][0] === "influence") {
      personalityType = "DI";
      personalityTitle = "The Dynamic Innovator";
      description = "You combine assertiveness with sociability to lead and inspire change. Your natural ability to take initiative while building strong relationships makes you an effective catalyst for innovation and team success.";
      traits = ["Assertive", "Sociable", "Creative", "Energetic", "Persuasive"];
      compatibleRoles = ["Creative Director", "Product Manager", "Marketing Strategist", "Business Development Manager", "Innovation Consultant"];
      compatibleCompanies = ["Tech startups", "Creative agencies", "Fast-growing technology companies", "Companies with strong R&D departments", "Organizations embracing digital transformation"];
    } else if (topTwo[0][0] === "influence" && topTwo[1][0] === "steadiness") {
      personalityType = "IS";
      personalityTitle = "The Engaging Motivator";
      description = "You use charm and empathy to encourage and uplift team morale. Your ability to build strong relationships while maintaining stability makes you an invaluable team player and mentor.";
      traits = ["Empathetic", "Supportive", "Communicative", "Patient", "Team-oriented"];
      compatibleRoles = ["HR Manager", "Customer Success Manager", "Team Lead", "Counselor", "Social Worker"];
      compatibleCompanies = ["Non-profits", "Educational institutions", "Healthcare organizations", "Salesforce", "Companies with strong people-first cultures"];
    } else if (topTwo[0][0] === "conscientiousness" && topTwo[1][0] === "steadiness") {
      personalityType = "CS";
      personalityTitle = "The Dependable Facilitator";
      description = "You balance teamwork with a keen eye for detail to support and refine processes. Your methodical approach combined with reliability makes you essential for maintaining quality and consistency.";
      traits = ["Detail-oriented", "Reliable", "Methodical", "Organized", "Consistent"];
      compatibleRoles = ["Quality Assurance Analyst", "Operations Manager", "Project Coordinator", "Administrative Officer", "Compliance Specialist"];
      compatibleCompanies = ["Law firms", "Government agencies", "Large corporations", "Manufacturing firms", "Financial institutions"];
    } else if (topTwo[0][0] === "dominance" && topTwo[1][0] === "conscientiousness") {
      personalityType = "DC";
      personalityTitle = "The Tactical Executive";
      description = "You merge leadership with meticulous planning to achieve high standards. Your combination of strategic thinking and attention to detail drives excellence in execution.";
      traits = ["Strategic", "Analytical", "Results-driven", "Precise", "Decisive"];
      compatibleRoles = ["CEO", "Operations Director", "Strategic Planner", "Management Consultant", "Financial Analyst"];
      compatibleCompanies = ["Consulting firms", "Financial institutions", "Tech companies", "IBM", "Accenture"];
    } else {
      // Default to highest single trait
      const highest = sortedScores[0][0];
      if (highest === "dominance") {
        personalityType = "D";
        personalityTitle = "The Trailblazing Leader";
        description = "You are assertive, results-oriented, and enjoy challenges. Your natural leadership abilities and drive make you excel in fast-paced, competitive environments.";
        traits = ["Assertive", "Confident", "Results-oriented", "Competitive", "Direct"];
        compatibleRoles = ["CEO", "Entrepreneur", "Sales Director", "Business Development Manager", "Operations Manager"];
        compatibleCompanies = ["Startups", "Corporations with leadership programs", "Competitive industries", "Fast-paced environments"];
      } else if (highest === "influence") {
        personalityType = "I";
        personalityTitle = "The Charismatic Communicator";
        description = "You are naturally persuasive, sociable, and thrive in collaborative settings. Your ability to connect with others and communicate effectively makes you a natural influencer.";
        traits = ["Persuasive", "Sociable", "Enthusiastic", "Optimistic", "Creative"];
        compatibleRoles = ["Marketing Manager", "Public Relations Specialist", "Sales Professional", "Brand Manager", "Communications Director"];
        compatibleCompanies = ["Creative agencies", "Marketing firms", "Media companies", "Google", "Adobe"];
      } else if (highest === "steadiness") {
        personalityType = "S";
        personalityTitle = "The Reliable Supporter";
        description = "You appreciate stability, consistency, and are a great team player. Your patience and supportive nature make you the backbone of successful teams.";
        traits = ["Patient", "Reliable", "Supportive", "Loyal", "Cooperative"];
        compatibleRoles = ["Customer Service Manager", "HR Specialist", "Team Coordinator", "Support Specialist", "Account Manager"];
        compatibleCompanies = ["Established corporations", "Service-oriented organizations", "Healthcare", "Education", "Non-profits"];
      } else {
        personalityType = "C";
        personalityTitle = "The Analytical Strategist";
        description = "You are detail-oriented, analytical, and value accuracy and efficiency. Your systematic approach and precision make you excel in technical and analytical roles.";
        traits = ["Analytical", "Precise", "Systematic", "Quality-focused", "Logical"];
        compatibleRoles = ["Data Analyst", "Software Engineer", "Quality Assurance", "Research Scientist", "Financial Planner"];
        compatibleCompanies = ["Tech companies", "Research institutions", "Financial firms", "Intel", "Engineering companies"];
      }
    }

    return {
      personalityType,
      personalityTitle,
      description,
      traits,
      scores,
      compatibleRoles,
      compatibleCompanies,
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
          result={result}
          userName={userData.name}
          onDownloadReport={() => console.log("Download report")}
        />
      )}
    </div>
  );
}
