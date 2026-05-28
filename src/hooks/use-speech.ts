"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: { transcript: string };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  });
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) finalText += text + " ";
        else interimText += text;
      }
      if (finalText) setTranscript((prev) => (prev + " " + finalText).trim());
      setInterimTranscript(interimText);
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      // Routine, ignore: silence / user-stopped.
      if (e.error === "no-speech" || e.error === "aborted") return;
      // "network" on macOS Chrome/Edge means the Web Speech cloud endpoint is
      // unreachable. Mark the API as unsupported so the UI falls back to text.
      if (e.error === "network") {
        setIsSupported(false);
        setErrorCode("network");
        return;
      }
      setErrorCode(e.error || "unknown");
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch {
        // ignore
      }
    };
  }, []);

  const start = useCallback(async () => {
    const r = recognitionRef.current;
    if (!r) {
      setErrorCode("unsupported");
      return;
    }

    // Explicitly request mic permission first. This gives the browser a clean,
    // user-gesture-triggered prompt and lets us catch denial cleanly.
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Immediately release the stream — SpeechRecognition manages its own.
        stream.getTracks().forEach((t) => t.stop());
      } catch (e) {
        const name = (e as DOMException)?.name ?? "";
        if (name === "NotAllowedError" || name === "SecurityError") {
          setErrorCode("not-allowed");
        } else if (name === "NotFoundError") {
          setErrorCode("audio-capture");
        } else {
          setErrorCode("permission-failed");
        }
        return;
      }
    }

    try {
      setErrorCode(null);
      r.start();
      setIsListening(true);
    } catch (e) {
      console.error("[speech] start failed:", e);
      setErrorCode("start-failed");
    }
  }, []);

  const stop = useCallback(() => {
    const r = recognitionRef.current;
    if (!r) return;
    try {
      r.stop();
    } catch {
      // ignore
    }
    setIsListening(false);
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  return {
    isListening,
    isSupported,
    errorCode,
    transcript,
    interimTranscript,
    start,
    stop,
    reset,
    setTranscript,
  };
}

export function useSpeechSynthesis() {
  const [isSupported] = useState<boolean>(() =>
    typeof window !== "undefined" && "speechSynthesis" in window
  );
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(
    (text: string, options?: { rate?: number; pitch?: number }) => {
      if (!isSupported) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = options?.rate ?? 1;
        u.pitch = options?.pitch ?? 1;
        u.onstart = () => setIsSpeaking(true);
        u.onend = () => setIsSpeaking(false);
        u.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(u);
      } catch (e) {
        console.error("[tts] failed:", e);
      }
    },
    [isSupported]
  );

  const cancel = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return { speak, cancel, isSpeaking, isSupported };
}
