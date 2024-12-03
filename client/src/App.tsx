import "./App.css";
import BubbleSort from "./components/algorithm/sortingAlgorithm/bubbleSort";
import QuickSort from "./components/algorithm/sortingAlgorithm/quickSort";
import MergeSort from "./components/algorithm/sortingAlgorithm/MergeSort";
import SelectionSort from "./components/algorithm/sortingAlgorithm/SelectionSort";
import InsertionSort from "./components/algorithm/sortingAlgorithm/InsertionSort";
import HeapSort from "./components/algorithm/sortingAlgorithm/HeapSort";
import CycleSort from "./components/algorithm/sortingAlgorithm/CycleSort";
import ThreeWayMergeSort from "./components/algorithm/sortingAlgorithm/ThreeWayMergeSort";
import Heap from "./components/algorithm/Heap";
import BinaryTree from "./components/algorithm/BinaryTree";
import LinearSearch from "./components/algorithm/searchAlgorithm/LinearSearch"; 
import BinarySearch from "./components/algorithm/searchAlgorithm/BinarySearch";

function App() {
  return (
    <>
      <BubbleSort />
      <QuickSort />
      <MergeSort />
      <SelectionSort />
      <InsertionSort />
      <HeapSort />
      <CycleSort />
      <ThreeWayMergeSort />
      <Heap />
      <BinaryTree />
      <LinearSearch />
      <BinarySearch />
    </>
  );
}

export default App;
