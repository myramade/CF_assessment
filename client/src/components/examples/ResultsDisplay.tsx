import ResultsDisplay from '../ResultsDisplay';
import { personalities } from '@/data/personalities';

export default function ResultsDisplayExample() {
  const mockTraitScores = {
    Dominance: 85,
    Influence: 78,
    Steadiness: 45,
    Conscientiousness: 52
  };

  return (
    <ResultsDisplay
      personality={personalities.DI}
      userName="Alex"
      traitScores={mockTraitScores}
      onDownloadReport={() => console.log('Download report clicked')}
    />
  );
}
