import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building2, TrendingUp, Download } from "lucide-react";

export interface AssessmentResult {
  personalityType: string;
  personalityTitle: string;
  description: string;
  traits: string[];
  scores: {
    dominance: number;
    influence: number;
    steadiness: number;
    conscientiousness: number;
  };
  compatibleRoles: string[];
  compatibleCompanies: string[];
}

interface ResultsDisplayProps {
  result: AssessmentResult;
  userName: string;
  onDownloadReport?: () => void;
}

export default function ResultsDisplay({ result, userName, onDownloadReport }: ResultsDisplayProps) {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold">Congratulations, {userName}!</h1>
          <p className="text-xl text-muted-foreground">
            Your assessment is complete. Here are your personalized results.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="space-y-2">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {result.personalityType}
              </Badge>
              <CardTitle className="text-3xl sm:text-4xl font-bold text-primary">
                {result.personalityTitle}
              </CardTitle>
            </div>
            <CardDescription className="text-base max-w-2xl mx-auto">
              {result.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Your Key Traits
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.traits.map((trait, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Dominance</div>
                <div className="text-2xl font-bold text-primary">{result.scores.dominance}%</div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${result.scores.dominance}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Influence</div>
                <div className="text-2xl font-bold text-primary">{result.scores.influence}%</div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${result.scores.influence}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Steadiness</div>
                <div className="text-2xl font-bold text-primary">{result.scores.steadiness}%</div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${result.scores.steadiness}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Conscientiousness</div>
                <div className="text-2xl font-bold text-primary">{result.scores.conscientiousness}%</div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${result.scores.conscientiousness}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Compatible Job Roles
              </CardTitle>
              <CardDescription>
                Roles that align with your personality profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.compatibleRoles.map((role, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-base">{role}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Compatible Companies
              </CardTitle>
              <CardDescription>
                Organizations where you're likely to thrive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.compatibleCompanies.map((company, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-base">{company}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {onDownloadReport && (
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={onDownloadReport}
              className="gap-2"
              data-testid="button-download-report"
            >
              <Download className="w-5 h-5" />
              Download Detailed Report
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
