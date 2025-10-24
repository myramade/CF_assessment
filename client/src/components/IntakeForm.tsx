import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IntakeFormProps {
  onSubmit: (data: IntakeFormData) => void;
}

export interface IntakeFormData {
  name: string;
  email: string;
  age: string;
  jobInterest: string;
  roleLevel: string;
  consentAI: boolean;
  consentMarketing: boolean;
}

export default function IntakeForm({ onSubmit }: IntakeFormProps) {
  const [formData, setFormData] = useState<IntakeFormData>({
    name: "",
    email: "",
    age: "",
    jobInterest: "",
    roleLevel: "",
    consentAI: false,
    consentMarketing: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.consentAI && formData.consentMarketing) {
      onSubmit(formData);
    }
  };

  const isFormValid = 
    formData.name && 
    formData.email && 
    formData.age && 
    formData.jobInterest && 
    formData.roleLevel && 
    formData.consentAI && 
    formData.consentMarketing;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Let's Get Started</CardTitle>
          <CardDescription className="text-center text-base">
            Tell us a bit about yourself to personalize your assessment experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                data-testid="input-name"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                data-testid="input-email"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-base">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
                data-testid="input-age"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobInterest" className="text-base">Type of Job Interested In</Label>
              <Select
                value={formData.jobInterest}
                onValueChange={(value) => setFormData({ ...formData, jobInterest: value })}
                required
              >
                <SelectTrigger id="jobInterest" data-testid="select-job-interest" className="h-12">
                  <SelectValue placeholder="Select a job category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creative">Creative & Design</SelectItem>
                  <SelectItem value="technical">Technical & Engineering</SelectItem>
                  <SelectItem value="leadership">Leadership & Management</SelectItem>
                  <SelectItem value="support">Support & Service</SelectItem>
                  <SelectItem value="analytical">Analytical & Research</SelectItem>
                  <SelectItem value="entrepreneurial">Entrepreneurial & Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleLevel" className="text-base">Role Level Interested In</Label>
              <Select
                value={formData.roleLevel}
                onValueChange={(value) => setFormData({ ...formData, roleLevel: value })}
                required
              >
                <SelectTrigger id="roleLevel" data-testid="select-role-level" className="h-12">
                  <SelectValue placeholder="Select a role level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry-level">Entry-Level</SelectItem>
                  <SelectItem value="mid-level">Mid-Level</SelectItem>
                  <SelectItem value="senior-level">Senior-Level</SelectItem>
                  <SelectItem value="supervisor-manager">Supervisor/Manager</SelectItem>
                  <SelectItem value="director">Director</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consentAI"
                  checked={formData.consentAI}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, consentAI: checked as boolean })
                  }
                  data-testid="checkbox-consent-ai"
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="consentAI"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    I acknowledge that this platform uses <span className="font-semibold">AI technology</span> to analyze my assessment data
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consentMarketing"
                  checked={formData.consentMarketing}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, consentMarketing: checked as boolean })
                  }
                  data-testid="checkbox-consent-marketing"
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="consentMarketing"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    I agree to receive <span className="font-semibold">information and marketing communications</span> from CultureForward
                  </Label>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!isFormValid}
              className="w-full text-base"
              data-testid="button-start-assessment"
            >
              Start Assessment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
