import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building2, Award, Download } from "lucide-react";
import type { Personality } from "@/data/personalities";

interface ResultsDisplayProps {
  personality: Personality;
  userName: string;
  traitScores: {
    Dominance: number;
    Influence: number;
    Steadiness: number;
    Conscientiousness: number;
  };
  onDownloadReport?: () => void;
}

export default function ResultsDisplay({ personality, userName, traitScores, onDownloadReport }: ResultsDisplayProps) {

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
                {personality.key}
              </Badge>
              <CardTitle className="text-3xl sm:text-4xl font-bold text-primary">
                {personality.title}
              </CardTitle>
            </div>
            <CardDescription className="text-base max-w-2xl mx-auto">
              {personality.detail}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Your Key Strengths
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {personality.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Your DISC Profile Scores</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Dominance</div>
                  <div className="text-2xl font-bold text-primary">{traitScores.Dominance}%</div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${traitScores.Dominance}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Influence</div>
                  <div className="text-2xl font-bold text-primary">{traitScores.Influence}%</div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${traitScores.Influence}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Steadiness</div>
                  <div className="text-2xl font-bold text-primary">{traitScores.Steadiness}%</div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${traitScores.Steadiness}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Conscientiousness</div>
                  <div className="text-2xl font-bold text-primary">{traitScores.Conscientiousness}%</div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${traitScores.Conscientiousness}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Core Values</h3>
              <div className="flex flex-wrap gap-2">
                {personality.values.map((value, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Recommended Job Roles
              </CardTitle>
              <CardDescription>
                Roles that align with your personality profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {personality.recommendedJobs.map((job, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-base">{job}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Ideal Company Culture
              </CardTitle>
              <CardDescription>
                Work environments where you'll thrive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed">{personality.companyCulture}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Professional Characteristics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed">{personality.professionalCharacteristics}</p>
          </CardContent>
        </Card>

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
