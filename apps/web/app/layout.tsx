import type { Metadata } from "next";
import Link from "next/link";
import { Leaf } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriIntel Africa",
  description: "AI-powered farming intelligence for African smallholder farmers."
};

const navItems = [
  ["Crop", "/crop-health"],
  ["Extension", "/extension"],
  ["Market", "/market"],
  ["Climate", "/climate"],
  ["Credit", "/credit"]
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="shell">
          <header className="topbar">
            <Link className="brand" href="/">
              <span className="brand-mark">
                <Leaf size={20} />
              </span>
              <span>AgriIntel Africa</span>
            </Link>
            <nav className="nav" aria-label="Primary navigation">
              {navItems.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </nav>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
