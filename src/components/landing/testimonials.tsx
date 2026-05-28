"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Priya M.",
    role: "Frontend Engineer @ FAANG",
    quote:
      "Got 3 offers after using PrepWise for 2 weeks. The voice mode catches filler words I didn't even know I had.",
  },
  {
    name: "Arjun K.",
    role: "Data Scientist",
    quote:
      "The feedback is brutally honest in the best way. It told me exactly what to study before my final round.",
  },
  {
    name: "Sara L.",
    role: "Backend Developer",
    quote:
      "Better than paying $200/hr for a human coach. The AI questions feel scary realistic.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Loved by people who <span className="text-gradient">got hired</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-warning text-warning"
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6 text-foreground/90">
                &ldquo;{review.quote}&rdquo;
              </p>
              <div className="mt-auto pt-4 border-t border-border/40">
                <div className="font-semibold text-sm">{review.name}</div>
                <div className="text-xs text-muted-foreground">
                  {review.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
