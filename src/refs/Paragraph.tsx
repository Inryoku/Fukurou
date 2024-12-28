import React from 'react';
import type { WordDefinition } from '../types';
import { splitIntoSentences } from '../utils/textProcessing';
import { Sentence } from './Sentence';

interface ParagraphProps {
  text: string;
  onWordClick: (word: string) => void;
  selectedWord: string | null;
  definition: WordDefinition | null;
}

export function Paragraph({ text, onWordClick, selectedWord, definition }: ParagraphProps) {
  const sentences = splitIntoSentences(text);

  return (
    <div className="space-y-6">
      {sentences.map((sentence, index) => (
        <Sentence
          key={index}
          sentence={sentence}
          onWordClick={onWordClick}
          selectedWord={selectedWord}
          definition={definition}
        />
      ))}
    </div>
  );
}