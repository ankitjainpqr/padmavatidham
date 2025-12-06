import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <header className="w-full bg-card/80 backdrop-blur-sm shadow-warm sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-temple bg-clip-text text-transparent">
              Sacred Temples
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/">
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                Home
              </Button>
            </Link>
            <Link to="/photos">
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                Photos
              </Button>
            </Link>
            <Link to="/about-us">
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                About Us
              </Button>
            </Link>
            <Link to="/contacts">
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                Contacts
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;