import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoadingAnalysis() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="flex justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary" data-testid="loading-spinner" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Analyzing Your Responses</h3>
            <p className="text-muted-foreground">
              Our AI is processing your assessment to create your personalized profile...
            </p>
            <p className="text-sm text-muted-foreground">
              This typically takes 10-15 seconds
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
