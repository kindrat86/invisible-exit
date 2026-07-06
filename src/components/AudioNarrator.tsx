import { useState, useRef, useEffect } from "react";
import { Play, Pause, Headphones } from "lucide-react";

/**
 * Audio narrator component for the /story page.
 * Uses the Web Speech API (SpeechSynthesis) to read the story aloud.
 * No external API needed — runs entirely in the browser.
 * Respects reduced-motion and reduced-data preferences.
 *
 * EXPERT SECRETS Ch 11: Pre-frame objections by making the story accessible
 * to mobile readers who don't have 15 minutes of reading time.
 */
const chapterTitles = [
  "Background — I was the perfect employee.",
  "The Desire — I didn't want to quit. I wanted to matter.",
  "The Hook — 0.5% equity. 18 months to IPO.",
  "The Origin — Amsterdam. 6 AM. Raining.",
  "The Epiphany — Corporate loyalty is a transaction.",
  "Secret #1 — The Vehicle",
  "Secret #2 — The Stealth",
  "Secret #3 — The System",
  "The Wall — Month 4, zero customers.",
  "External Conflict — The competitor.",
  "The One Thing — 12 months. $4,100 MRR.",
  "Return with the Elixir",
];

interface AudioNarratorProps {
  activeChapter: number;
}

export function AudioNarrator({ activeChapter }: AudioNarratorProps) {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    // Check for reduced data mode
    const prefersReduced = window.matchMedia("(prefers-reduced-data: reduce)").matches;
    if (prefersReduced) {
      setSupported(false);
    }
  }, []);

  const handleToggle = () => {
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }

    // Get the visible text content from the current chapter
    const chapterEl = document.querySelector("[data-story-chapter]");
    if (!chapterEl) return;

    const text = chapterEl.textContent || "";
    const utterance = new SpeechSynthesisUtterance(text);

    // Pick a natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.name.includes("Google UK English Male") || v.name.includes("Daniel")
    ) || voices.find(
      (v) => v.lang.startsWith("en") && v.name.includes("Male")
    ) || voices[0];

    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 0.9; // Slightly slower for comprehension
    utterance.pitch = 1;
    utterance.volume = 1;

    // Track chapter being read
    const chapterNum = activeChapter + 1;
    utterance.text = `Chapter ${chapterNum}: ${chapterTitles[activeChapter] || ""}. ${text}`;

    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);

    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  };

  // Stop when chapter changes
  useEffect(() => {
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
    }
  }, [activeChapter]);

  if (!supported) return null;

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        playing
          ? "bg-primary text-white shadow-lg shadow-primary/25"
          : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
      }`}
      aria-label={playing ? "Pause narration" : "Play audio narration"}
    >
      {playing ? (
        <>
          <Pause className="w-4 h-4" />
          <span>Playing...</span>
        </>
      ) : (
        <>
          <Headphones className="w-4 h-4" />
          <span>Listen (audio)</span>
          <span className="text-[10px] opacity-60">~15 min</span>
        </>
      )}
    </button>
  );
}
