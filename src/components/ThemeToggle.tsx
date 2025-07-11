"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const isDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400); // match animation duration
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.theme = newDark ? "dark" : "light";
  };

  return (
    <button
  onClick={toggleTheme}
  className="absolute top-4 right-4 px-6 py-5 rounded-xl bg-muted text-foreground shadow-lg dark:shadow-[0_4px_32px_0_rgba(0,0,0,0.7)] text-2xl transition-colors duration-300"
  aria-label="Toggle dark mode"
  type="button"
>
  <div
  className={`transition-all duration-300 ease-in-out ${
    animating ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
  }`}
  key={dark ? "moon" : "sun"}
>
  {dark ? <Moon size={25} /> : <Sun size={25} />}
</div>
</button>
  );
}