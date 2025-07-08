"use client";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";

const testimonials = [
  {
    car: "GLC 63",
    text: "Rented GLC 63 — immaculate service and the car was a showstopper! Highly recommended for special occasions.",
    name: "Ayesha Khan",
    role: "Bride, Dubai Wedding",
  },
  {
    car: "Lamborghini Huracán",
    text: "Rented Lamborghini Huracán — the thrill of driving a sports car through Dubai's streets was unforgettable. The rental process was seamless and staff were super helpful.",
    name: "Omar Al Farsi",
    role: "Adventure Seeker, Dubai",
  },
  {
    car: "Range Rover Vogue",
    text: "Rented Range Rover Vogue — needed a car for a commercial shoot—got a pristine vehicle delivered on time. The team understood our needs perfectly.",
    name: "Sara Malik",
    role: "Creative Director, Dubai",
  },
  {
    car: "Mercedes S-Class",
    text: "Rented Mercedes S-Class — exceptional customer service! They handled my last-minute booking for a business trip in Dubai with ease.",
    name: "Mohammed Al Habtoor",
    role: "Business Traveler, Dubai",
  },
  {
    car: "Porsche 911",
    text: "Rented Porsche 911 — the best rental experience I've had in Dubai. The car was spotless and the pickup/drop-off was super convenient.",
    name: "Fatima Noor",
    role: "Frequent Renter, Dubai",
  },
  {
    car: "BMW M4 Convertible",
    text: "Rented BMW M4 Convertible — booked a convertible for a weekend getaway—driving along the Dubai coastline was a dream come true!",
    name: "Rashid Saeed",
    role: "Tourist, Dubai",
  },
  {
    car: "Rolls Royce Ghost",
    text: "Rented Rolls Royce Ghost — the team's attention to detail made our anniversary celebration extra special. The luxury car was the perfect touch.",
    name: "Lina Farooq",
    role: "Event Planner, Dubai",
  },
  {
    car: "Audi RS7",
    text: "Rented Audi RS7 — I always recommend them to friends visiting Dubai. Reliable, friendly, and the best selection of cars!",
    name: "Yousef Al Mansoori",
    role: "Dubai Local",
  },
  {
    car: "Bentley Bentayga",
    text: "Rented Bentley Bentayga — from booking to return, the process was smooth. The staff even gave us great tips for exploring Dubai!",
    name: "Mariam Zayed",
    role: "Family Vacationer, Dubai",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsSection = () => {
  return (
    <motion.section
      className="bg-background my-20 relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 text-foreground">Hear from our customers</h2>
          <p className="text-center mt-5 opacity-75 text-foreground">See what our customers have to say about us.</p>
        </motion.div>
        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={30} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={36} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={44} />
        </div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection; 