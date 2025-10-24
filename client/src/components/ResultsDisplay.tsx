import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building2, Award, Download, ExternalLink } from "lucide-react";
import type { Personality } from "@/data/personalities";
import { useQuery } from "@tanstack/react-query";

interface GetroJob {
  id: string;
  title: string;
  company_name?: string;
  location?: string;
  employment_type?: string;
  url?: string;
}

interface ResultsDisplayProps {
  personality: Personality;
  userName: string;
  assessmentId?: string;
  traitScores: {
    Dominance: number;
    Influence: number;
    Steadiness: number;
    Conscientiousness: number;
  };
  onDownloadReport?: () => void;
}

export default function ResultsDisplay({ personality, userName, assessmentId, traitScores, onDownloadReport }: ResultsDisplayProps) {
  const { data: jobsData } = useQuery<{ jobs: GetroJob[]; message?: string }>({
    queryKey: ["/api/assessments", assessmentId, "jobs"],
    enabled: !!assessmentId,
  });

  const jobs = jobsData?.jobs || [];

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

        {jobs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Matching Job Opportunities
              </CardTitle>
              <CardDescription>
                Curated job openings that align with your personality profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-lg border hover-elevate active-elevate-2 transition-colors"
                    data-testid={`job-card-${job.id}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <h4 className="font-semibold text-lg">{job.title}</h4>
                        {job.company_name && (
                          <p className="text-muted-foreground flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {job.company_name}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {job.location && (
                            <Badge variant="secondary">{job.location}</Badge>
                          )}
                          {job.employment_type && (
                            <Badge variant="secondary">{job.employment_type}</Badge>
                          )}
                        </div>
                      </div>
                      {job.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          data-testid={`button-apply-job-${job.id}`}
                        >
                          <a href={job.url} target="_blank" rel="noopener noreferrer" className="gap-2">
                            View Job
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
