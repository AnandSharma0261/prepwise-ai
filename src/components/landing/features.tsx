"use client";

import { motion } from "framer-motion";
import {
  Mic,
  Brain,
  BarChart3,
  Zap,
  Shield,
  Sparkles,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Personalized AI Questions",
    description:
      "Gemini AI generates questions tailored to your role, tech stack, and experience level — no generic question banks.",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Mic,
    title: "Voice-Based Mock Interviews",
    description:
      "Practice speaking your answers out loud. Real interview muscle memory, not just typing.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: BarChart3,
    title: "Detailed Feedback Scores",
    description:
      "Get scored across 5 dimensions — communication, technical depth, problem solving, role fit, confidence.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Target,
    title: "Strengths & Gaps",
    description:
      "AI identifies exactly what to work on. No more guessing where you stand.",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Complete an interview, get feedback in seconds. Iterate faster than a coffee break.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data stays yours. JWT auth, encrypted passwords, and no third-party sharing.",
    color: "from-indigo-500 to-blue-700",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Everything you need to{" "}
            <span className="text-gradient">ace your interview</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We obsessed over every detail so you do not have to. Just press
            start, and we will handle the rest.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative glass rounded-2xl p-6 hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg mb-4`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
