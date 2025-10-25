export interface AssessmentAnswer {
  id: number;
  text: string;
  trait: string;
  score: number;
}

export interface TraitScores {
  Dominance: number;
  Influence: number;
  Steadiness: number;
  Conscientiousness: number;
  Introversion: number;
  Extraversion: number;
  Sensing: number;
  Intuition: number;
  Thinking: number;
  Feeling: number;
  Judging: number;
  Perceiving: number;
  Openness: number;
}

export interface AssessmentResponse {
  questionId: string;
  question: string;
  answer: AssessmentAnswer;
  scores: TraitScores;
}

export interface Assessment {
  _id: string;
  personalityId: string;
  isBuildingPersonalityProfile: boolean;
  errorWhileCalculating: boolean;
  userId: string;
  createdTime: string;
  updatedTime: string;
  response: AssessmentResponse[];
}

// Sample assessments for reference/testing
export const sampleAssessments: Assessment[] = [
  {
    _id: "66f33bd2a912a9b0eece1353",
    personalityId: "66b1677d7346defbe9fe3852",
    isBuildingPersonalityProfile: false,
    errorWhileCalculating: false,
    userId: "7547d87141654aa892f92725",
    createdTime: "2024-09-24T22:23:14.106Z",
    updatedTime: "2024-09-24T22:23:29.166Z",
    response: [
      {
        questionId: "66b16a067346defbe9fe386c",
        question: "How do you manage your responsibilities?",
        answer: {
          id: 1,
          text: "I am very organized and reliable.",
          trait: "Conscientiousness",
          score: 3
        },
        scores: {
          Dominance: 6,
          Influence: 5,
          Steadiness: 0,
          Conscientiousness: 14,
          Introversion: 0,
          Extraversion: 0,
          Sensing: 0,
          Intuition: 0,
          Thinking: 0,
          Feeling: 0,
          Judging: 0,
          Perceiving: 0,
          Openness: 0
        }
      },
      {
        questionId: "66b16a067346defbe9fe3864",
        question: "How do you feel about helping others?",
        answer: {
          id: 2,
          text: "I enjoy helping but also need time for myself.",
          trait: "Conscientiousness",
          score: 2
        },
        scores: {
          Dominance: 6,
          Influence: 5,
          Steadiness: 0,
          Conscientiousness: 14,
          Introversion: 0,
          Extraversion: 0,
          Sensing: 0,
          Intuition: 0,
          Thinking: 0,
          Feeling: 0,
          Judging: 0,
          Perceiving: 0,
          Openness: 0
        }
      },
      {
        questionId: "66b16a067346defbe9fe3862",
        question: "How do you approach tasks and responsibilities?",
        answer: {
          id: 1,
          text: "I am detail-oriented and strive for perfection.",
          trait: "Conscientiousness",
          score: 3
        },
        scores: {
          Dominance: 6,
          Influence: 5,
          Steadiness: 0,
          Conscientiousness: 14,
          Introversion: 0,
          Extraversion: 0,
          Sensing: 0,
          Intuition: 0,
          Thinking: 0,
          Feeling: 0,
          Judging: 0,
          Perceiving: 0,
          Openness: 0
        }
      },
      {
        questionId: "66b16a067346defbe9fe3860",
        question: "How do you interact with others in a social setting?",
        answer: {
          id: 1,
          text: "I am outgoing and enjoy being the center of attention.",
          trait: "Influence",
          score: 3
        },
        scores: {
          Dominance: 6,
          Influence: 5,
          Steadiness: 0,
          Conscientiousness: 14,
          Introversion: 0,
          Extraversion: 0,
          Sensing: 0,
          Intuition: 0,
          Thinking: 0,
          Feeling: 0,
          Judging: 0,
          Perceiving: 0,
          Openness: 0
        }
      },
      {
        questionId: "66b16a067346defbe9fe385f",
        question: "How do you typically approach challenges and problems?",
        answer: {
          id: 2,
          text: "I prefer to collaborate and seek input from others.",
          trait: "Influence",
          score: 2
        },
        scores: {
          Dominance: 6,
          Influence: 5,
          Steadiness: 0,
          Conscientiousness: 14,
          Introversion: 0,
          Extraversion: 0,
          Sensing: 0,
          Intuition: 0,
          Thinking: 0,
          Feeling: 0,
          Judging: 0,
          Perceiving: 0,
          Openness: 0
        }
      }
    ]
  },
  {
    _id: "66f340df9e1c6afaaf6dad2f",
    personalityId: "66b1677d7346defbe9fe385b",
    isBuildingPersonalityProfile: false,
    errorWhileCalculating: false,
    userId: "aa77a4e0738c486c8882040a",
    createdTime: "2024-09-24T22:44:47.641Z",
    updatedTime: "2024-09-24T22:44:53.201Z",
    response: [
      {
        questionId: "66b16a067346defbe9fe386c",
        question: "How do you manage your responsibilities?",
        answer: {
          id: 1,
          text: "I am very organized and reliable.",
          trait: "Conscientiousness",
          score: 3
        },
        scores: {
          Dominance: 6,
          Influence: 5,
          Steadiness: 7,
          Conscientiousness: 6,
          Introversion: 0,
          Extraversion: 0,
          Sensing: 0,
          Intuition: 0,
          Thinking: 0,
          Feeling: 0,
          Judging: 0,
          Perceiving: 0,
          Openness: 0
        }
      },
      {
        questionId: "66b16a067346defbe9fe3864",
        question: "How do you feel about helping others?",
        answer: {
          id: 1,
          text: "I love helping others and often put their needs before my own.",
          trait: "Steadiness",
          score: 3
        },
        scores: {
          Dominance: 6,
          Influence: 5,
          Steadiness: 7,
          Conscientiousness: 6,
          Introversion: 0,
          Extraversion: 0,
          Sensing: 0,
          Intuition: 0,
          Thinking: 0,
          Feeling: 0,
          Judging: 0,
          Perceiving: 0,
          Openness: 0
        }
      }
    ]
  }
];
