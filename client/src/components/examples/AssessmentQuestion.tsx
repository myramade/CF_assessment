import AssessmentQuestion from '../AssessmentQuestion';

export default function AssessmentQuestionExample() {
  const mockQuestion = {
    id: 1,
    text: "I find myself being the initiator in social situations.",
    category: "Influence"
  };

  return (
    <AssessmentQuestion
      question={mockQuestion}
      questionNumber={1}
      totalQuestions={20}
      onAnswer={(answer) => console.log('Answer selected:', answer)}
      onPrevious={() => console.log('Previous clicked')}
    />
  );
}
