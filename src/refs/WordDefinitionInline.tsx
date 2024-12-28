import React from 'react';
import type { WordDefinition } from '../types';

interface WordDefinitionInlineProps {
  definition: WordDefinition;
}

export function WordDefinitionInline({ definition }: WordDefinitionInlineProps) {
  return (
    <div className="px-4 py-3 bg-gray-900/90 border-l-4 border-punk-cyan rounded-r-lg
                    shadow-[4px_4px_0px_0px_theme(colors.punk.red)]">
      <div className="space-y-2">
        <div>
          <p className="text-xs font-bold uppercase text-punk-cyan mb-1">Meanings:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-100">
            {definition.meanings.map((meaning, index) => (
              <li key={index} className="text-sm">{meaning}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-punk-cyan mb-1">Synonyms:</p>
          <div className="flex flex-wrap gap-2">
            {definition.synonyms.map((synonym, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-punk-purple/20 border border-punk-purple rounded-full 
                         text-xs font-medium text-punk-cyan"
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