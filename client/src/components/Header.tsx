import logoImage from "@assets/icon and logo 1-3_1761333387427.png";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img 
              src={logoImage} 
              alt="CultureForward Logo" 
              className="h-8 w-auto"
              data-testid="img-logo"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
