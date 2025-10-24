import logoImage from "@assets/CF-LOGO_1761340988658.png";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start h-16">
          <img 
            src={logoImage} 
            alt="CultureForward Logo" 
            style={{ height: '50px' }}
            className="w-auto"
            data-testid="img-logo"
          />
        </div>
      </div>
    </header>
  );
}
