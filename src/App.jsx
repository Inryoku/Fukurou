import {} from "react";
import "./App.css";

export default function App() {
  return (
    <>
      <InputProcessor />
      <WordMeaningFetcher />
    </>
  );
}

function InputProcessor() {
  return (
    <>
      <InputArea />
      <DisplayArea />
    </>
  );
}

function InputArea() {
  return <div>InputArea</div>;
}

function WordMeaningFetcher() {
  return (
    <>
      <DisplayArea />
      <MeaningArea />
    </>
  );
}

function DisplayArea() {
  return <div>DisplayArea</div>;
}
function MeaningArea() {
  return <div>MeaningArea</div>;
}
