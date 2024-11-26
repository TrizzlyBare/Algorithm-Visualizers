import "./App.css";
import BubbleSort from "./components/algorithm/sortingAlgorithm/BubbleSort";
import QuickSort from "./components/algorithm/sortingAlgorithm/QuickSort";
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
