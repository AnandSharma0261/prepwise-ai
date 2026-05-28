"use client";

import { motion } from "framer-motion";
import { ListChecks, MessagesSquare, FileText } from "lucide-react";

const steps = [
  {
    icon: ListChecks,
    step: "01",
    title: "Tell us your goal",
    description:
      "Pick your target role, tech stack, experience level, and interview type. Our AI tailors questions just for you.",
  },
  {
    icon: MessagesSquare,
    step: "02",
    title: "Take the interview",
    description:
      "Speak or type your answers in our distraction-free interview room. Practice as many times as you want.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Get instant feedback",
    description:
      "Receive a detailed AI evaluation with category scores, strengths, weaknesses, and an action plan.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-24 overflow-hidden border-y border-border/40"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="container mx-auto max-w-6xl px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            From zero to hired in <span className="text-gradient">3 steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No setup hassle. No paywall. Just open, practice, improve.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative glass rounded-2xl p-8 text-center"
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-xl shadow-primary/30 mb-4 mx-auto">
                <step.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-xs font-mono text-muted-foreground tracking-widest mb-2">
                STEP {step.step}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
