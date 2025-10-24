import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Question, Answer } from "@/data/questions";

interface AssessmentQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: Answer) => void;
  onPrevious?: () => void;
  selectedAnswer?: Answer;
}

export default function AssessmentQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onPrevious,
  selectedAnswer,
}: AssessmentQuestionProps) {
  const [answer, setAnswer] = useState<Answer | undefined>(selectedAnswer);

  const handleNext = () => {
    if (answer) {
      onAnswer(answer);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl">
        <CardContent className="pt-8 pb-6">
          <div className="mb-6">
            <span className="text-sm text-muted-foreground">
              Question {questionNumber}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold mb-8 leading-relaxed">
            {question.question}
          </h2>

          <RadioGroup
            value={answer?.id.toString()}
            onValueChange={(value) => {
              const selectedAnswer = question.answers.find(a => a.id.toString() === value);
              setAnswer(selectedAnswer);
            }}
            className="space-y-3"
          >
            {question.answers.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-3 p-4 rounded-lg border hover-elevate active-elevate-2 cursor-pointer"
                onClick={() => setAnswer(option)}
              >
                <RadioGroupItem
                  value={option.id.toString()}
                  id={`option-${option.id}`}
                  data-testid={`radio-option-${option.id}`}
                />
                <Label
                  htmlFor={`option-${option.id}`}
                  className="text-base font-medium cursor-pointer flex-1"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex items-center justify-between mt-8 gap-4">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!onPrevious}
              data-testid="button-previous"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={answer === undefined}
              data-testid="button-next"
              className="flex items-center gap-2"
            >
              {questionNumber === totalQuestions ? "Submit" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
