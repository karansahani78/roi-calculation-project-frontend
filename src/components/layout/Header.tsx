import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { label: 'Calculator', href: '/calculator' },
  { label: 'Compare', href: '/compare' },
  { label: 'Countries', href: '/countries' },
  { label: 'Majors', href: '/majors' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/60 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-heading text-lg font-bold text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-purple">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-gradient-hero">EduROI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                location.pathname === item.href
                  ? 'bg-white/[0.08] text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/calculator">
            <Button size="sm" className="ml-3 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#FF6EC7] text-white border-0 font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20">
              Get Started
            </Button>
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/[0.06] bg-background/90 backdrop-blur-xl p-4 md:hidden"
        >
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'bg-white/[0.08] text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/calculator" onClick={() => setMobileOpen(false)}>
              <Button className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#FF6EC7] text-white border-0 font-semibold hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
