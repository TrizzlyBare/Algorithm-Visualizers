import "./App.css";
import BubbleSort from "./components/algorithm/sortingAlgorithm/bubbleSort";
import QuickSort from "./components/algorithm/sortingAlgorithm/quickSort";
import MergeSort from "./components/algorithm/sortingAlgorithm/MergeSort";

function App() {
  return (
    <>
      <BubbleSort />
      <QuickSort />
      <MergeSort />
    </>
  );
}

export default App;
