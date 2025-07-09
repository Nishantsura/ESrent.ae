'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from "framer-motion";

const carTypes = [
  "Luxury Sedan",
  "Sports Car",
  "SUV",
  "Supercar",
  "Convertible",
  "Electric",
  "Hybrid"
];

const durations = [
  { label: "Daily", value: "daily" },
  { label: "+3 Days", value: "3days" },
  { label: "Weekly", value: "weekly" }
];

export function HeroSection() {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedDuration, setSelectedDuration] = useState<string>("daily");
  const [selectedType, setSelectedType] = useState<string>("");

  const handleSearch = () => {
    const message = `Hi, I'm interested in renting a car with the following preferences:
Location: Dubai
Date: ${format(new Date(selectedDate), 'dd/MM/yyyy')}
Duration: ${selectedDuration}
${selectedType ? `Car Type: ${selectedType}` : ''}`;

    const whatsappUrl = `https://wa.me/971553553626?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.section
      className="relative h-screen w-full overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
        >
          <source src="/videos/Luxury Cars Free Stock Videos No Copyright.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" /> {/* Overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-4">
          Parked in Dubai, Just for you.
        </h1>
        <p className="text-lg md:text-xl text-white/90 text-center max-w-3xl mb-12">
          Discover Dubai's finest collection of premium vehicles. From sleek sports cars to elegant SUVs, we've got your perfect ride.
        </p>

        {/* Search Form */}
        <div className="w-full max-w-4xl bg-black/30 backdrop-blur-sm p-8 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Pickup car at</label>
              <input
                type="text"
                value="Dubai"
                disabled
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">From</label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white appearance-none"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={20} />
              </div>
            </div>

            {/* Car Type */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Car type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white appearance-none"
              >
                <option value="">Select car type</option>
                {carTypes.map((type, index) => (
                  <option key={`cartype-${index}-${type}`} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Duration Options */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Duration</label>
              <div className="flex gap-2">
                {durations.map((duration, index) => (
                  <button
                    key={`duration-${index}-${duration.value}`}
                    onClick={() => setSelectedDuration(duration.value)}
                    className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
                      selectedDuration === duration.value
                        ? 'bg-primary text-black'
                        : 'bg-black/50 text-white border border-white/10 hover:bg-black/70'
                    }`}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="mt-8 w-full md:w-auto md:min-w-[200px] bg-primary hover:bg-primary/90 text-black font-semibold px-8 py-3 rounded-full flex items-center justify-center gap-2 mx-auto"
          >
            <span>Search Cars</span>
          </button>
        </div>
      </div>
    </motion.section>
  );
} 