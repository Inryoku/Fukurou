import { useState } from "react";
import { Coffee } from "lucide-react";

export default function App() {
  return (
    <body className="bg-blue-500 text-white p-8 rounded-lg">
      <DataManager />
    </body>
  );
}

function DataManager() {
  const {} = InputLogic();
  const {} = WordMeaningLogic();

  return (
    <>
      <InputArea />
      <DisplayArea />
      <MeaningArea />
    </>
  );
}

function InputLogic() {
  return {};
}

function InputArea() {
  return (
    <div>
      InputAre
      <Coffee size={18} />
    </div>
  );
}

function WordMeaningLogic() {
  return <></>;
}

function DisplayArea() {
  return <div>DisplayArea</div>;
}
function MeaningArea() {
  return <div>MeaningArea</div>;
}
