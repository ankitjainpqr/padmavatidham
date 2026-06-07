import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/photos", label: "Photos" },
  { to: "/about-us", label: "About Us" },
  { to: "/contacts", label: "Contacts" },
  { to: "/sangh-parichay", label: "संघ परिचय" },
];

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClassName =
    "text-foreground hover:text-primary transition-colors w-full justify-start";

  return (
    <header className="w-full bg-card/80 backdrop-blur-sm shadow-warm sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold bg-gradient-temple bg-clip-text text-transparent">
                Sacred Temples
              </h1>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to}>
                <Button variant="ghost" className={linkClassName}>
                  {label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <span className="sr-only">Open menu</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-card">
                <SheetHeader>
                  <SheetTitle className="text-left bg-gradient-temple bg-clip-text text-transparent">
                    Sacred Temples
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-8">
                  {navLinks.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button variant="ghost" className={linkClassName}>
                        {label}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
