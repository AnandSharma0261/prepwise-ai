"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Mic, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const HeroScene = dynamic(
  () => import("@/components/three/hero-scene").then((m) => m.HeroScene),
  { ssr: false, loading: () => null }
);

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* 3D Background */}
      <HeroScene />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 -z-[5] bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_85%)]" />

      {/* Grid background */}
      <div className="absolute inset-0 -z-[6] grid-bg opacity-30" />

      <div className="container mx-auto max-w-6xl px-4 py-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex"
        >
          <Badge variant="default" className="px-4 py-2 mb-6 text-sm">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Powered by Google Gemini AI
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
        >
          Master Your Next
          <br />
          <span className="text-gradient-violet gradient-animated">
            Interview
          </span>{" "}
          with AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Practice real interviews with our AI coach. Get personalized
          questions, voice-based mock interviews, and instant feedback to land
          your dream role.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
        >
          <Button asChild size="xl" variant="gradient" className="group">
            <Link href="/sign-up">
              Start practicing free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="glass">
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { label: "AI Models", value: "Gemini 2.0" },
            { label: "Question Types", value: "100+" },
            { label: "Interview Modes", value: "Voice + Text" },
            { label: "Free Forever", value: "Yes" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-xl p-4 text-left"
            >
              <div className="text-2xl font-bold text-gradient">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Floating decorative icons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute top-1/4 left-8 hidden lg:flex h-14 w-14 items-center justify-center rounded-2xl glass animate-float-y"
        style={{ animationDelay: "0s" }}
      >
        <Mic className="h-6 w-6 text-accent" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute top-1/3 right-12 hidden lg:flex h-14 w-14 items-center justify-center rounded-2xl glass animate-float-y"
        style={{ animationDelay: "2s" }}
      >
        <Brain className="h-6 w-6 text-primary" />
      </motion.div>
    </section>
  );
}
