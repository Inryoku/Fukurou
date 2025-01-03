import { useState } from "react";
import { Search } from "lucide-react";
import nlp from "compromise";
import React from "react";
import clsx from "clsx";

export default function App() {
  return (
    <body className="bg-gray-800 text-white p-8 w-full h-screen">
      <DataManager />
    </body>
  );
}

function DataFetchLogic() {
  const [fetchedWordData, setFetchedWordData] = useState({
    baseWord: "",
    lemma: "",
    meaning: null,
    synonyms: null,
  });

  const lemmatizeWord = (word: string) => {
    // 原型化処理
    const lemmatizedWord =
      nlp(word).verbs().toInfinitive().out() ||
      nlp(word).nouns().toSingular().out() ||
      word; // 該当がなければそのまま
    return lemmatizedWord; // 結果を返す
  };

  const fetchMeaning = async (word: any) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const data = await response.json();
      console.log("Meaning of word: ", data);
      return data;
    } catch (error) {
      console.error("Error fetching meaning: ", error);
      return null;
    }
  };
  const fetchSynonyms = async (word: any) => {
    try {
      const response = await fetch(`https://api.datamuse.com/words?ml=${word}`);
      const data = await response.json();
      console.log("Synonyms of word: ", data);
      return data;
    } catch (error) {
      console.error("Error fetching synonyms: ", error);
      return null;
    }
  };

  const getWordMeaningAndSynonym = async (word: any) => {
    try {
      console.log("Clicked word: ", word);
      const lemmatizedWord = lemmatizeWord(word);

      // 並行して複数のAPIリクエストを実行
      const [meaningResponse, synonymsResponse] = await Promise.all([
        fetchMeaning(lemmatizedWord),
        fetchSynonyms(lemmatizedWord),
      ]);

      setFetchedWordData({
        baseWord: word,
        lemma: lemmatizedWord,
        meaning: meaningResponse,
        synonyms: synonymsResponse,
      });
    } catch (error) {
      console.error("Error processing word:", error);
    }
  };
  return {
    getWordMeaningAndSynonym,
    fetchedWordData,
  };
}

function InputProcessLogic() {
  const [parsedSentences, setParsedSentences] = useState<string[]>([]); // 初期値を空配列に変更
  const textInterpret = (text: string | null) => {
    const sentences =
      text // テキストを受け取り
        ?.replace(/([^.!?])$/, "$1.") // 最後の文にピリオドを追加
        .match(/[^.!?]+[.!?]|\S+/g) // 文末のピリオド・クエスチョンマーク・感嘆符を保持
        ?.map((sentence) => sentence.trim()) || []; // 各文の前後の余白を削除

    setParsedSentences(sentences); // 正規表現で分割された文をセット
  };

  return {
    textInterpret,
    parsedSentences,
  };
}

function DataManager() {
  const { textInterpret, parsedSentences } = InputProcessLogic();

  const { getWordMeaningAndSynonym, fetchedWordData } = DataFetchLogic();


  return (
    <>
      <InputArea onSendText={textInterpret} />
      <DisplayArea
        displaySentences={parsedSentences}
        wordData={fetchedWordData}
        onWordClick={getWordMeaningAndSynonym}
      />
    </>
  );
}

interface InputAreaProps {
  onSendText: (text: string) => void;
}

function InputArea({ onSendText }: InputAreaProps) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (inputText.trim() !== "") {
      onSendText(inputText);
      setInputText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <textarea
        className="text-black p-2 m-1"
        rows={8}
        placeholder="Type or Paste here"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button
        type="submit"
        className="bg-green-500 text-black rounded-md m-4 
      flex items-center justify-center"
      >
        <Search size={24} />
      </button>
    </form>
  );
}

// 除外する単語リスト
const EXCLUDED_WORDS = [
  // 冠詞
  "the",
  "a",
  "an",
  "s",

  // 前置詞
  "in",
  "on",
  "at",
  "by",
  "for",
  "with",
  "of",
  "to",
  "from",
  "about",
  "as",
  "into",
  "like",
  "through",
  "after",
  "over",
  "between",
  "under",
  "against",
  "during",
  "before",
  "around",
  "without",
  "within",
  "behind",
  "beyond",

  // 接続詞
  "and",
  "or",
  "but",
  // 動詞 (be動詞, have, do)
  "be",
  "am",
  "are",
  "is",
  "was",
  "were",
  "been",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  // 代名詞
  "he",
  "she",
  "it",
  "they",
  "we",
  "I",
  "you",
  "this",
  "that",
  "these",
  "there",
  "those",
  "me",
  "him",
  "her",
  "us",
  "them",
];

interface DisplayAreaProps {
  displaySentences: string[];
  onWordClick: (word: string) => Promise<void>;
  wordData: {
    baseWord: string;
    lemma: string;
    meaning: any;
    synonyms: any;
  };
  excludeWords?: string[];
}

function DisplayArea({
  displaySentences,
  onWordClick,
  wordData,
  excludeWords = EXCLUDED_WORDS,
}: DisplayAreaProps) {
  const [selectedWordInfo, setSelectedWordInfo] = useState<{
    sentenceIndex: number | null;
    wordData: any | null;
  }>({
    sentenceIndex: null,
    wordData: null,
  }); // 選択された単語情報

  const isClickableWord = (word: string) => {
    const isAlphabet = /^[a-zA-Z]+$/.test(word); // 単語がアルファベットのみか
    const isExcluded = excludeWords.includes(word.toLowerCase()); // 除外単語リストに含まれるか
    return isAlphabet && !isExcluded;
  };

  const handleWordClick = async (word: string, sentenceIndex: number) => {
    const wordData = await onWordClick(word); // 単語データを取得
    setSelectedWordInfo({ sentenceIndex, wordData }); // 選択された単語情報をセット
  };

  const splitIntoWords = (sentence: string): string[] => {
    return sentence.match(/\w+|[^\s\w]+/g) || [];
  };

  return (
    <div className="flex flex-wrap bg-slate-50 text-sm text-black">
      {displaySentences.map((sentence: string, sentenceIndex: number) => (
        <p key={sentenceIndex} className="flex flex-wrap">
          {splitIntoWords(sentence).map((word: string, wordIndex: number) => {
            const isClickable = isClickableWord(word);
            return (
              <span
                key={wordIndex}
                className={clsx("m-1", {
                  "bg-gray-200 cursor-pointer": isClickable,
                })}
                onClick={() =>
                  isClickable && handleWordClick(word, sentenceIndex)
                }
              >
                {word}
              </span>
            );
          })}
          {selectedWordInfo.sentenceIndex !== null &&
          selectedWordInfo.sentenceIndex === sentenceIndex ? (
            <MeaningArea wordData={wordData} />
          ) : null}
        </p>
      ))}
    </div>
  );
}

interface WordData {
  baseWord: string;
  lemma: string;
  meaning: any;
  synonyms: any;
}

function MeaningArea({ wordData }: { wordData: WordData }) {
  return (
    <div className="bg-black text-white p-4 m-2">
      {wordData ? (
        <>
          <p>
            <strong>Word:</strong> {wordData.baseWord}
          </p>
          <p>
            <strong>Lemma:</strong> {wordData.lemma}
          </p>
          <p>
            <strong>Meaning:</strong>{" "}
            {wordData.meaning
              ? wordData.meaning[0]?.meanings[0]?.definitions[0]?.definition
              : "No definition found"}
          </p>
          <p>
            <strong>Synonyms:</strong> {""}
            {wordData.synonyms
              ? wordData.synonyms
                  .slice(0, 5)
                  .map((synonym: { word: any }) => synonym.word)
                  .join(", ")
              : "No synonyms found"}
          </p>
        </>
      ) : (
        <p>No word selected.</p>
      )}
    </div>
  );
}
