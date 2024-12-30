import { useState } from "react";
import { Coffee } from "lucide-react";

export default function App() {
  return (
    <body className="bg-gray-800 text-white p-8 w-full h-screen">
      <DataManager />
    </body>
  );
}

function DataManager() {
  const [splitText, setSplitText] = useState([]); // 初期値を空配列に変更
  const [selectedWord, setSelectedWord] = useState(""); // 選択された単語を管理

  const handleTextInterpret = (text) => {
    console.log("Interpreting text: ", text);
    setSplitText(text.match(/(\w+|[^\s\w])/g) || []); // 正規表現で分割
  };

  const handleWordLemmatize = (word) => {

  };


  const handleWordClick = (word) => {
    console.log("Clicked word: ", word);
    setSelectedWord(word); 
  };

  return (
    <>
      <InputArea onSendText={handleTextInterpret} />
      <DisplayArea splitText={splitText} onWordClick={handleWordClick} />
      <MeaningArea selectedWord={selectedWord} />
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
      <button type="submit" className="bg-green-500 text-black rounded-md m-4">
        Search
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

function MeaningArea({ selectedWord }) {
  return (
    <div className="bg-black text-white p-4 m-2">
      {selectedWord ? (
        <p>Meaning of "{selectedWord}" will appear here.</p>
      ) : (
        <p>No word selected.</p>
      )}
    </div>
  );
}
