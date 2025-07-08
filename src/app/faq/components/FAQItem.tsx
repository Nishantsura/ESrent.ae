'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-zinc-800 transition-colors"
      >
        <span className="text-base font-medium text-white text-left">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-zinc-400 flex-shrink-0 ml-4" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-400 flex-shrink-0 ml-4" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="p-4 bg-zinc-950 border-t border-zinc-800">
          <p className="text-sm leading-relaxed text-zinc-300">{answer}</p>
        </div>
      </div>
    </div>
  );
}
