import React from 'react';
import { X } from 'lucide-react';
import type { WordDefinition } from '../types';

interface WordAnalysisProps {
  word: WordDefinition | null;
  onClose: () => void;
}

export function WordAnalysis({ word, onClose }: WordAnalysisProps) {
  if (!word) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-black border-2 border-pink-500 rounded-lg p-4 
                    shadow-lg shadow-pink-500/20 text-pink-500">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold uppercase tracking-wider">{word.word}</h3>
        <button
          onClick={onClose}
          className="text-pink-500 hover:text-pink-400 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm uppercase font-bold mb-2 text-pink-400">Meanings</h4>
          <ul className="list-disc list-inside space-y-1">
            {word.meanings.map((meaning, index) => (
              <li key={index} className="text-sm">{meaning}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm uppercase font-bold mb-2 text-pink-400">Synonyms</h4>
          <div className="flex flex-wrap gap-2">
            {word.synonyms.map((synonym, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-pink-500/10 rounded-full text-xs"
              >
                {synonym}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}