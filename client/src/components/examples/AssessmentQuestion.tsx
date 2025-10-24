import AssessmentQuestion from '../AssessmentQuestion';

export default function AssessmentQuestionExample() {
  const mockQuestion = {
    _id: "1",
    question: "How do you typically approach challenges and problems?",
    answers: [
      {
        id: 1,
        text: "I take charge and make decisions quickly.",
        trait: "Dominance",
        score: 3
      },
      {
        id: 2,
        text: "I prefer to collaborate and seek input from others.",
        trait: "Influence",
        score: 2
      },
      {
        id: 3,
        text: "I analyze the situation thoroughly before acting.",
        trait: "Conscientiousness",
        score: 2
      },
      {
        id: 4,
        text: "I try to avoid conflict and maintain harmony.",
        trait: "Steadiness",
        score: 1
      }
    ],
    order: 1
  };

  return (
    <AssessmentQuestion
      question={mockQuestion}
      questionNumber={1}
      totalQuestions={15}
      onAnswer={(answer) => console.log('Answer selected:', answer)}
      onPrevious={() => console.log('Previous clicked')}
    />
  );
}
