import React from 'react';
import type { WordDefinition } from '../types';

interface DisplayTextProps {
  text: string;
  onWordClick: (word: string) => void;
}

export function DisplayText({ text, onWordClick }: DisplayTextProps) {
  const words = text.split(/\s+/);

  return (
    <div className="p-6 bg-black/90 border-2 border-pink-500 rounded-lg min-h-[200px]">
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <span
            onClick={() => onWordClick(word.replace(/[.,!?]$/, ''))}
            className="inline-block text-pink-500 hover:text-pink-400 cursor-pointer 
                     transition-colors duration-200 hover:scale-105 transform"
          >
            {word}
          </span>
          {index < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </div>
  );
}