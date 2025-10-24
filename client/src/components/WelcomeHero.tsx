import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Black_young_professionals_workplace_d9888eca.png";

interface WelcomeHeroProps {
  onGetStarted: () => void;
}

export default function WelcomeHero({ onGetStarted }: WelcomeHeroProps) {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          CultureForward Assessment
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover your unique personality profile and get personalized career recommendations tailored to your strengths
        </p>
        <Button 
          size="lg"
          onClick={onGetStarted}
          className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
          data-testid="button-get-started"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
