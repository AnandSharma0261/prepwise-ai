"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent gradient-animated" />
          <div className="absolute inset-0 grid-bg opacity-20" />

          <div className="relative z-10 text-primary-foreground">
            <Sparkles className="h-10 w-10 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
              Your next interview is
              <br />
              <span className="opacity-90">already practiced.</span>
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Join thousands using AI to crush their interviews. Free forever.
              No credit card. Just confidence.
            </p>
            <Button
              asChild
              size="xl"
              className="bg-background text-foreground hover:bg-background/90 shadow-2xl"
            >
              <Link href="/sign-up">
                Get started free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
