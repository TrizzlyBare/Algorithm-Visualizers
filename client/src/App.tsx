import "./App.css";
<<<<<<< HEAD
// import BubbleSort from "./components/algorithm/sortingAlgorithm/BubbleSort";
// import QuickSort from "./components/algorithm/sortingAlgorithm/QuickSort";
// import MergeSort from "./components/algorithm/sortingAlgorithm/MergeSort";
// import SelectionSort from "./components/algorithm/sortingAlgorithm/SelectionSort";
// import InsertionSort from "./components/algorithm/sortingAlgorithm/InsertionSort";
// import HeapSort from "./components/algorithm/sortingAlgorithm/HeapSort";
// import CycleSort from "./components/algorithm/sortingAlgorithm/CycleSort";
// import ThreeWayMergeSort from "./components/algorithm/sortingAlgorithm/ThreeWayMergeSort";
// import CountingSort from "./components/algorithm/sortingAlgorithm/CountingSort";
// import RadixSort from "./components/algorithm/sortingAlgorithm/RadixSort";
// import BucketSort from "./components/algorithm/sortingAlgorithm/BucketSort";
// import TimSort from "./components/algorithm/sortingAlgorithm/TimSort";
// import CombSort from "./components/algorithm/sortingAlgorithm/CombSort";
// import PigeonholeSort from "./components/algorithm/sortingAlgorithm/PigeonholeSort";
// import Introsort from "./components/algorithm/sortingAlgorithm/IntroSort";
// import HomePage from "./components/HomePage/HomePage";
import Navbar from "./components/NavBar/navbar";
=======
import BubbleSort from "./components/algorithm/sortingAlgorithm/bubbleSort";
import QuickSort from "./components/algorithm/sortingAlgorithm/quickSort";
import MergeSort from "./components/algorithm/sortingAlgorithm/MergeSort";
import SelectionSort from "./components/algorithm/sortingAlgorithm/SelectionSort";
import InsertionSort from "./components/algorithm/sortingAlgorithm/InsertionSort";
import HeapSort from "./components/algorithm/sortingAlgorithm/HeapSort";
import CycleSort from "./components/algorithm/sortingAlgorithm/CycleSort";
import ThreeWayMergeSort from "./components/algorithm/sortingAlgorithm/ThreeWayMergeSort";
import Heap from "./components/algorithm/Heap";
>>>>>>> origin/Finish-Heap-Visualizer

// function App() {
//   return (
//     <>
//       <HomePage />
//       <BubbleSort />
//       <QuickSort />
//       <MergeSort />
//       <SelectionSort />
//       <InsertionSort />
//       <HeapSort />
//       <CycleSort />
//       <ThreeWayMergeSort />

//       <CountingSort />
//       <RadixSort />
//       <BucketSort />
//       <TimSort />
//       <CombSort />
//       <PigeonholeSort />

//       <Introsort />
//     </>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Introsort from "./components/algorithm/sortingAlgorithm/IntroSort";
import Timsort from "./components/algorithm/sortingAlgorithm/TimSort";
import PigeonholeSort from "./components/algorithm/sortingAlgorithm/PigeonholeSort";
import CombSort from "./components/algorithm/sortingAlgorithm/CombSort";

const App: React.FC = () => {
  return (
<<<<<<< HEAD
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/algorithm/introsort" element={<Introsort />} />
        <Route path="/algorithm/timsort" element={<Timsort />} />
        <Route path="/algorithm/pigeonhole-sort" element={<PigeonholeSort />} />
        <Route path="/algorithm/comb-sort" element={<CombSort />} />
      </Routes>
    </Router>
=======
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
    </>
>>>>>>> origin/Finish-Heap-Visualizer
  );
};

export default App;
