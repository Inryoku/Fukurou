import React from 'react';
import type { TextAreaProps } from '../types';

export function TextArea({ value, onChange }: TextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-40 p-4 bg-gray-900 text-gray-100 border-punk
                 focus:outline-none focus:border-punk-cyan focus:ring-2 focus:ring-punk-cyan/50
                 placeholder-gray-500 font-mono text-lg resize-none"
      placeholder="Type or paste your text here..."
    />
  );
}