'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  backUrl?: string;
}

export function PageHeader({ title, backUrl = '/' }: PageHeaderProps) {
  return (
    <div className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center md:h-20 h-16">
          <div className="absolute left-4 sm:left-6 lg:left-24 flex items-center">
            <Link
              href={backUrl}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            {/* <p className="ml-0 text-sm font-semibold text-gray-900">Back</p> */}
          </div>
          <h1 className="heading-4 font-semibold text-gray-900 flex-1 text-center">{title}</h1>
        </div>
      </div>
    </div>
  );
}
