"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/chat", label: "Chat" },
    { href: "/how-it-works", label: "How It Works" },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("neoquery-theme") as Theme | null;
    const initial: Theme = stored ?? "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        document.documentElement.setAttribute("data-theme", next);
        window.localStorage.setItem("neoquery-theme", next);
      }
      return next;
    });
  };

  const closeMenu = () => setIsMenuOpen(false);

  const ThemeIcon = () =>
    theme === "dark" ? (
      // Sun icon
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ) : (
      // Moon icon
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 0111.21 3 7 7 0 1019 14.79 9.05 9.05 0 0121 12.79z" />
      </svg>
    );

  return (
    <>
      {/* Floating glass navbar */}
      <nav className="pointer-events-none fixed top-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-4">
        <div className="pointer-events-auto glass rounded-full border border-[var(--border)]/70 shadow-[0_0_40px_rgba(0,0,0,0.7)] px-4 sm:px-6 py-2 flex items-center gap-4 max-w-6xl w-full">
          <Link
            href="/"
            className="neon-glow text-lg sm:text-xl font-bold gradient-text cursor-pointer transition-all duration-200 focus:outline-none focus:ring-0"
          >
            NeoQuery
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-4 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 text-sm font-medium rounded-full ${
                  pathname === item.href
                    ? "bg-[var(--neon-blue)]/15 text-[var(--neon-blue)]"
                    : "text-[var(--foreground)]/80 hover:text-[var(--neon-blue)] hover:bg-[var(--surface-elevated)]/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop theme toggle on far right */}
          <div className="hidden md:flex items-center justify-end">
            <button
              type="button"
              onClick={toggleTheme}
              className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-elevated)]/80 border border-[var(--border)]/80 text-[var(--foreground)] hover:text-[var(--neon-blue)] hover:border-[var(--neon-blue)]/60"
              aria-label="Toggle theme"
            >
              <ThemeIcon />
            </button>
          </div>

          {/* Mobile right controls: theme + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-elevated)]/80 border border-[var(--border)]/80 text-[var(--foreground)] hover:text-[var(--neon-blue)] hover:border-[var(--neon-blue)]/60"
              aria-label="Toggle theme"
            >
              <ThemeIcon />
            </button>
            <button
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-elevated)]/80 border border-[var(--border)]/80 text-[var(--foreground)] hover:text-[var(--neon-blue)] hover:border-[var(--neon-blue)]/60"
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay + dropdown menu */}
      {isMenuOpen && (
        <>
          {/* Blur background, content stays in place */}
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-2xl md:hidden"
            onClick={closeMenu}
          />

          <div className="fixed top-20 right-4 z-50 md:hidden">
            <div className="glass rounded-3xl border border-[var(--border)]/70 shadow-[0_0_40px_rgba(0,0,0,0.9)] min-w-[190px] max-w-[220px] py-3">
              <div className="flex flex-col gap-1 px-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-2xl ${
                      pathname === item.href
                        ? "bg-[var(--neon-blue)] text-white shadow-[0_0_25px_rgba(124,58,237,0.6)]"
                        : "text-[var(--foreground)]/85 hover:bg-[var(--surface-elevated)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

