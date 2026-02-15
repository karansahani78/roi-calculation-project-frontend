import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              EduROI
            </Link>
            <p className="text-sm text-muted-foreground">
              Make smarter education investment decisions with data-driven ROI analysis.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Tools</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/calculator" className="text-sm text-muted-foreground hover:text-foreground">ROI Calculator</Link>
              <Link to="/compare" className="text-sm text-muted-foreground hover:text-foreground">Compare Programs</Link>
            </nav>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Explore</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/countries" className="text-sm text-muted-foreground hover:text-foreground">Countries</Link>
              <Link to="/majors" className="text-sm text-muted-foreground hover:text-foreground">Majors</Link>
            </nav>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Legal</h4>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Privacy Policy</span>
              <span className="text-sm text-muted-foreground">Terms of Service</span>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} EduROI. All rights reserved. For informational purposes only.
        </div>
      </div>
    </footer>
  );
}
