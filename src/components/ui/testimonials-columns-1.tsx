"use client";
import React from "react";
import { motion } from "motion/react";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: {
    car: string;
    text: string;
    name: string;
    role: string;
  }[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, groupIndex) => (
            <React.Fragment key={`group-${groupIndex}`}>
              {props.testimonials.map(({ car, text, name, role }, testimonialIndex) => (
                <div 
                  className="p-10 rounded-3xl border border-border shadow-lg shadow-primary/10 max-w-xs w-full bg-background text-foreground" 
                  key={`testimonial-${groupIndex}-${testimonialIndex}`}
                >
                  <div className="text-base opacity-90">
                    <span className="text-secondary font-semibold">Rented {car}</span>
                    {text.replace(/^Rented [^—]+ — ?/, ' ')}
                  </div>
                  <div className="flex items-center gap-2 mt-5">
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5 text-primary">{name}</div>
                      <div className="leading-5 opacity-60 tracking-tight text-xs">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
}; 