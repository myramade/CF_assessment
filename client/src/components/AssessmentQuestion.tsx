import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Question {
  id: number;
  text: string;
  category: string;
}

interface AssessmentQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: number) => void;
  onPrevious?: () => void;
  selectedAnswer?: number;
}

const answerOptions = [
  { value: 5, label: "Definitely me" },
  { value: 4, label: "Somewhat me" },
  { value: 3, label: "Neutral" },
  { value: 2, label: "Somewhat not me" },
  { value: 1, label: "Definitely not" },
];

export default function AssessmentQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onPrevious,
  selectedAnswer,
}: AssessmentQuestionProps) {
  const [answer, setAnswer] = useState<number | undefined>(selectedAnswer);

  const handleNext = () => {
    if (answer !== undefined) {
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
            {question.text}
          </h2>

          <RadioGroup
            value={answer?.toString()}
            onValueChange={(value) => setAnswer(parseInt(value))}
            className="space-y-3"
          >
            {answerOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 p-4 rounded-lg border hover-elevate active-elevate-2 cursor-pointer"
                onClick={() => setAnswer(option.value)}
              >
                <RadioGroupItem
                  value={option.value.toString()}
                  id={`option-${option.value}`}
                  data-testid={`radio-option-${option.value}`}
                />
                <Label
                  htmlFor={`option-${option.value}`}
                  className="text-base font-medium cursor-pointer flex-1"
                >
                  {option.label}
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
