import React, { useState } from 'react';
import { Skull, Trash2 } from 'lucide-react';
import { TextArea } from './components/TextArea';
import { Paragraph } from './components/Paragraph';
import { getMockDefinition } from './utils/mockDictionary';
import type { WordDefinition } from './types';

export default function App() {
  const [text, setText] = useState('');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handleWordClick = (word: string) => {
    const lowercaseWord = word.toLowerCase();
    setSelectedWord(prev => prev === lowercaseWord ? null : lowercaseWord);
  };

  const clearSelection = () => {
    setSelectedWord(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          {/* Header */}
          <header className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Skull className="text-punk-cyan" size={40} />
              <h1 className="text-4xl font-black text-punk-cyan uppercase tracking-wider text-shadow-punk">
                Punk English
              </h1>
              <Skull className="text-punk-cyan" size={40} />
            </div>
            <p className="text-gray-300 text-lg font-medium">
              Break down the barriers of language, one word at a time
            </p>
          </header>

          {/* Main Content */}
          <div className="space-y-6 bg-gray-900/50 p-8 rounded-xl border-punk backdrop-blur-sm">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-punk-cyan text-xl font-black uppercase tracking-wide">
                  Input Your Text
                </h2>
                {selectedWord && (
                  <button
                    onClick={clearSelection}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-punk-red 
                             hover:text-punk-yellow transition-colors duration-200 uppercase"
                  >
                    <Trash2 size={16} />
                    Clear Selection
                  </button>
                )}
              </div>
              <TextArea value={text} onChange={setText} />
            </div>

            {text && (
              <div>
                <h2 className="text-punk-cyan text-xl font-black mb-4 uppercase tracking-wide">
                  Click Words to See Definitions
                </h2>
                <Paragraph 
                  text={text} 
                  onWordClick={handleWordClick}
                  selectedWord={selectedWord}
                  definition={selectedWord ? getMockDefinition(selectedWord) : null}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}