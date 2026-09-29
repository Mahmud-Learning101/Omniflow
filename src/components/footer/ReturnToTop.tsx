"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { playRelaySnap } from "@/lib/sound";

export function ReturnToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    playRelaySnap();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      data-testid="return-to-top-btn"
      onClick={scrollToTop}
      aria-label="Return to top of page"
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full border border-obsidian-border bg-obsidian-card/90 text-racing-lime shadow-2xl backdrop-blur-md hover:border-racing-lime hover:scale-110 active:scale-95 transition-all duration-300"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
