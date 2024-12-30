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

  const [lemma, setLemma] = useState(null);
  const [meaning, setMeaning] = useState(null);
  const [synonyms, setSynonyms] = useState(null);
  const [fetchedWordData, setFetchedWordData] = useState({});

  const lemmatizeWord = (word) => {
    // 原型化処理
    const lemmatizedWord =
      nlp(word).verbs().toInfinitive().out() ||
      nlp(word).nouns().toSingular().out() ||
      word; // 該当がなければそのまま
    setLemma(lemmatizedWord);
    return lemmatizedWord; // 結果を返す
  };
  const fetchMeaning = async (word) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const data = await response.json();
      console.log("Meaning of word: ", data);
      setMeaning(data);
    } catch (error) {
      console.error("Error fetching meaning: ", error);
      setMeaning(null);
    }
  };

  const fetchSynonyms = async (word) => {
    try {
      const response = await fetch(`https://api.datamuse.com/words?ml=${word}`);
      const data = await response.json();
      console.log("Synonyms of word: ", data);
      setSynonyms(data);
    } catch (error) {
      console.error("Error fetching synonyms: ", error);
      setSynonyms(null);
    }
  };

  const handleWordClick = async (word) => {
    console.log("Clicked word: ", word);
    const lemmatizedWord = lemmatizeWord(word); // 原型化
    await fetchMeaning(lemmatizedWord); // 意味を取得
    await fetchSynonyms(lemmatizedWord); // 類義語を取得

    // データを統合してセット
    setFetchedWordData({
      word,
      lemma: lemmatizedWord,
      meaning,
      synonyms,
    });
  };

  return (
    <>
      <InputArea onSendText={handleTextInterpret} />
      <DisplayArea splitText={splitText} onWordClick={handleWordClick} />
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

function DisplayArea({ splitText, onWordClick }) {
  const isAlphabet = (word) => {
    return /^[a-zA-Z]+$/.test(word);
  };

  return (
    <div
      className="flex flex-wrap bg-slate-50 
      text-sm text-black"
    >
      {splitText.map((word, index) => {
        const clickable = isAlphabet(word);
        return (
          <span
            key={index}
            onClick={() => clickable && onWordClick(word)}
            className={`m-1 p-1
               ${clickable ? "bg-gray-500" : null}
                `}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}

function MeaningArea({ wordData }) {
  return (
    <div className="bg-black text-white p-4 m-2">
      {wordData.word ? (
        <>
          <p>
            <strong>Word:</strong> {wordData.word}
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
            <strong>Synonyms:</strong>{" "}
            {wordData.synonyms
              ? wordData.synonyms.map((synonym) => synonym.word).join(", ")
              : "No synonyms found"}
          </p>
        </>
      ) : (
        <p>No word selected.</p>
      )}
    </div>
  );
}
