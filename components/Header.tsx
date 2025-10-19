
import React from 'react';
import { GeminiIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <GeminiIcon className="h-8 w-auto text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Bulk SMS Platform
            </h1>
          </div>
          <p className="text-sm text-slate-500 hidden md:block">
            Powered by Gemini
          </p>
        </div>
      </div>
    </header>
  );
};
