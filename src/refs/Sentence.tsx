import React from 'react';
import type { SentenceProps } from '../types';
import { WordDefinitionInline } from './WordDefinitionInline';

export function Sentence({ sentence, onWordClick, selectedWord, definition }: SentenceProps) {
  const hasSelectedWord = sentence.words.some(
    ({ clean }) => clean.toLowerCase() === selectedWord
  );

  return (
    <div className="mb-4">
      <p className="leading-relaxed text-gray-100 font-medium">
        {sentence.words.map((word, index) => {
          const isSelected = selectedWord === word.clean.toLowerCase();
          
          return (
            <React.Fragment key={index}>
              <span
                onClick={() => onWordClick(word.clean)}
                className={`cursor-pointer px-1 py-0.5 rounded transition-all duration-200 
                          ${isSelected 
                            ? 'bg-punk-cyan text-black font-bold animate-punk-glow' 
                            : 'hover:bg-punk-red/20 hover:text-punk-cyan'
                          }`}
              >
                {word.clean}
              </span>
              {word.punctuation}
              {index < sentence.words.length - 1 ? ' ' : ''}
            </React.Fragment>
          );
        })}
      </p>
      {hasSelectedWord && definition && (
        <div className="mt-2 ml-4">
          <WordDefinitionInline definition={definition} />
        </div>
      )}
    </div>
  );
}