import { useState } from "react";
import { Search } from "lucide-react";
import nlp from "compromise";

export default function App() {
  return (
    <body className="bg-gray-800 text-white p-8 w-full h-screen">
      <DataManager />
    </body>
  );
}

function DataManager() {
  const [splitText, setSplitText] = useState([]); // 初期値を空配列に変更
  const handleTextInterpret = (text) => {
    console.log("Interpreting text: ", text);
    setSplitText(text.match(/(\w+|[^\s\w])/g) || []); // 正規表現で分割
  };

  const [fetchedWordData, setFetchedWordData] = useState({});

  const lemmatizeWord = (word) => {
    // 原型化処理
    const lemmatizedWord =
      nlp(word).verbs().toInfinitive().out() ||
      nlp(word).nouns().toSingular().out() ||
      word; // 該当がなければそのまま
    return lemmatizedWord; // 結果を返す
  };

  const fetchMeaning = async (word) => {
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
  const fetchSynonyms = async (word) => {
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

  const handleWordClick = async (word) => {
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
  return (
    <>
      <InputArea onSendText={handleTextInterpret} />
      <DisplayArea
        splitText={splitText}
        wordData={fetchedWordData}
        onWordClick={handleWordClick}
      />
      <MeaningArea wordData={fetchedWordData} />
    </>
  );
}

function InputArea({ onSendText }) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e) => {
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
        type="text"
        rows="8"
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
  // 前置詞
  "in",
  "on",
  "at",
  "by",
  "for",
  "with",
  "of",
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
  "me",
  "him",
  "her",
  "us",
  "them",
];

function DisplayArea({ splitText, onWordClick, wordData }) {
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState(null); // 選択された文のインデックス
  const [selectedWordData, setSelectedWordData] = useState(null); // 選択された単語データ

  const isClickableWord = (word) => {
    const isAlphabet = /^[a-zA-Z]+$/.test(word); // 単語がアルファベットのみか
    const isExcluded = EXCLUDED_WORDS.includes(word.toLowerCase()); // 除外単語リストに含まれるか
    return isAlphabet && !isExcluded;
  };

  /**
   * 文を分割し、ピリオドを保持した形で配列として返す
   */
  const sentences = splitText?.length
    ? splitText
        .join(" ") // 配列を1つの文字列に結合
        .replace(/([^.!?])$/, "$1.") // 最後の文にピリオドを追加
        .match(/[^.!?]+[.!?]|\S+/g) // 文末のピリオド・クエスチョンマーク・感嘆符を保持
        .map((sentence) => sentence.trim()) // 各文の前後の余白を削除
    : [];

  const handleWordClick = async (word, sentenceIndex) => {
    const wordData = await onWordClick(word); // 単語データを取得
    setSelectedSentenceIndex(sentenceIndex); // 対象の文を選択
    setSelectedWordData(wordData); // 単語データをセット
  };

  return (
    <div className="flex flex-wrap bg-slate-50 text-sm text-black">
      {/* 各文をレンダリング */}
      {sentences.map((sentence, sentenceIndex) => (
        <p key={sentenceIndex} className="flex flex-wrap">
          {/* 文を単語ごとに分割してレンダリング */}
          {sentence.split(" ").map((word, wordIndex) => {
            const isClickable = isClickableWord(word);
            return (
              <span
                key={wordIndex}
                className={`m-1 ${
                  isClickable ? "bg-gray-200 cursor-pointer" : ""
                }`}
                onClick={() =>
                  isClickable && handleWordClick(word, sentenceIndex)
                }
              >
                {word}
              </span>
            );
          })}
          {/* 選択された文の場合、意味エリアを表示 */}
          {selectedSentenceIndex !== null &&
          selectedSentenceIndex === sentenceIndex ? (
            <MeaningArea wordData={wordData} />
          ) : null}
        </p>
      ))}
    </div>
  );
}

function MeaningArea({ wordData }) {
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
                  .map((synonym) => synonym.word)
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
