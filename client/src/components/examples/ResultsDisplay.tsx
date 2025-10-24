import ResultsDisplay from '../ResultsDisplay';

export default function ResultsDisplayExample() {
  const mockResult = {
    personalityType: "DI",
    personalityTitle: "The Dynamic Innovator",
    description: "You combine assertiveness with sociability to lead and inspire change. Your natural ability to take initiative while building strong relationships makes you an effective catalyst for innovation and team success.",
    traits: ["Assertive", "Sociable", "Creative", "Energetic", "Persuasive"],
    scores: {
      dominance: 85,
      influence: 78,
      steadiness: 45,
      conscientiousness: 52
    },
    compatibleRoles: [
      "Creative Director",
      "Product Manager",
      "Marketing Strategist",
      "Business Development Manager",
      "Innovation Consultant"
    ],
    compatibleCompanies: [
      "Tech startups and innovative companies",
      "Creative agencies",
      "Fast-growing technology companies",
      "Companies with strong R&D departments",
      "Organizations embracing digital transformation"
    ]
  };

  return (
    <ResultsDisplay
      result={mockResult}
      userName="Alex"
      onDownloadReport={() => console.log('Download report clicked')}
    />
  );
}
