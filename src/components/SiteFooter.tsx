import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle, MapPin } from "lucide-react";
import logo from "@/assets/logo.png"; // adjust filename if needed

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">

            {/* Logo Image */}
            <img
              src={logo}
              alt="Farmaking Logo"
              className="w-10 h-10 object-contain"
            />

            <span className="font-display font-bold">
              FARMAKING AUTOMATION
            </span>
          </div>

          <p className="text-sm text-muted-foreground max-w-md">
            Leading world towards automation. GPS auto-steering systems and AI-powered
            farming technology for the next generation of agriculture.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-cyber-glow mb-4">
            Navigate
          </h4>

          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </li>

            <li>
              <Link to="/upload" className="text-muted-foreground hover:text-foreground">
                Upload Review
              </Link>
            </li>

            <li>
              <Link to="/gallery" className="text-muted-foreground hover:text-foreground">
                Gallery
              </Link>
            </li>

            <li>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </li>

            <li>
              <Link to="/admin" className="text-muted-foreground hover:text-foreground">
                Admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-cyber-glow mb-4">
            Connect
          </h4>

          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="https://wa.me/917984491337"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="w-4 h-4 text-flame" />
                WhatsApp
              </a>
            </li>

            <li>
              <a
                href="https://instagram.com/farmaking.automation"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Instagram className="w-4 h-4 text-flame" />
                Instagram
              </a>
            </li>

            <li>
              <a
                href="mailto:farmatechautomation@gmail.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Mail className="w-4 h-4 text-flame" />
                Mail
              </a>
            </li>

            <li>
              <span className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-flame" />
                Gujrat, India
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Farmaking Automation. Engineering tomorrow's farms.
      </div>
    </footer>
  );
}
