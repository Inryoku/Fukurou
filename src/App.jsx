import {} from "react";
import "./App.css";

export default function App() {
  return (
    <>
      <DataManager />
    </>
  );
}

function DataManager() {
  return (
    <>
      <InputProcessor />
      <WordMeaningFetcher />
      <InputArea />
      <DisplayArea />
      <MeaningArea />
    </>
  );
}

function InputProcessor() {
  return <></>;
}

function InputArea() {
  return <div>InputAre</div>;
}

function WordMeaningFetcher() {
  return <></>;
}

function DisplayArea() {
  return <div>DisplayArea</div>;
}
function MeaningArea() {
  return <div>MeaningArea</div>;
}
