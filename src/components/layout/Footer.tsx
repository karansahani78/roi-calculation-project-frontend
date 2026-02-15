import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-background">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2.5 font-heading text-lg font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-purple">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="text-gradient-hero">EduROI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Make smarter education investment decisions with data-driven ROI analysis.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Tools</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">ROI Calculator</Link>
              <Link to="/compare" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Compare Programs</Link>
            </nav>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Explore</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/countries" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Countries</Link>
              <Link to="/majors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Majors</Link>
            </nav>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Legal</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t border-white/[0.06] pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} EduROI. All rights reserved. For informational purposes only.
        </div>
      </div>
    </footer>
  );
}
