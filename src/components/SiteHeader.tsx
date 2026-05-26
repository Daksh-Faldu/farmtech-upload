import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/upload", label: "Upload Review" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 blur-md bg-cyber/60 rounded-lg group-hover:bg-flame/60 transition-colors" />
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyber to-flame flex items-center justify-center">
              <Zap className="w-5 h-5 text-background" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-sm text-foreground">FARMAKING</span>
            <span className="text-[10px] tracking-[0.25em] text-cyber-glow">AUTOMATION</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
              activeProps={{ className: "text-cyber-glow bg-white/5" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
          <Link to="/upload" className="btn-flame ml-3 !py-2 !px-4">Upload Now</Link>
        </nav>

        <button className="md:hidden text-foreground p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border px-4 py-4 space-y-1">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5"
              activeProps={{ className: "text-cyber-glow bg-white/5" }}
            >
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
