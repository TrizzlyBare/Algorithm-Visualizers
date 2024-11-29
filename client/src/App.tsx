import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import BubbleSort from "./components/algorithm/sortingAlgorithm/BubbleSort";
import QuickSort from "./components/algorithm/sortingAlgorithm/QuickSort";
import MergeSort from "./components/algorithm/sortingAlgorithm/MergeSort";
import SelectionSort from "./components/algorithm/sortingAlgorithm/SelectionSort";
import InsertionSort from "./components/algorithm/sortingAlgorithm/InsertionSort";
import HeapSort from "./components/algorithm/sortingAlgorithm/HeapSort";
import CycleSort from "./components/algorithm/sortingAlgorithm/CycleSort";
import ThreeWayMergeSort from "./components/algorithm/sortingAlgorithm/ThreeWayMergeSort";
import CountingSort from "./components/algorithm/sortingAlgorithm/CountingSort";
import RadixSort from "./components/algorithm/sortingAlgorithm/RadixSort";
import BucketSort from "./components/algorithm/sortingAlgorithm/BucketSort";
import TimSort from "./components/algorithm/sortingAlgorithm/TimSort";
import CombSort from "./components/algorithm/sortingAlgorithm/CombSort";
import PigeonholeSort from "./components/algorithm/sortingAlgorithm/PigeonholeSort";
import Introsort from "./components/algorithm/sortingAlgorithm/Introsort";
import HomePage from "./components/HomePage/HomePage";
import Navbar from "./components/NavBar/Navbar";
import Heap from "./components/algorithm/Heap";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bubble-sort" element={<BubbleSort />} />
        <Route path="/quick-sort" element={<QuickSort />} />
        <Route path="/merge-sort" element={<MergeSort />} />
        <Route path="/selection-sort" element={<SelectionSort />} />
        <Route path="/insertion-sort" element={<InsertionSort />} />
        <Route path="/heap-sort" element={<HeapSort />} />
        <Route path="/cycle-sort" element={<CycleSort />} />
        <Route path="/three-way-merge-sort" element={<ThreeWayMergeSort />} />
        <Route path="/counting-sort" element={<CountingSort />} />
        <Route path="/radix-sort" element={<RadixSort />} />
        <Route path="/bucket-sort" element={<BucketSort />} />
        <Route path="/tim-sort" element={<TimSort />} />
        <Route path="/comb-sort" element={<CombSort />} />
        <Route path="/pigeonhole-sort" element={<PigeonholeSort />} />
        <Route path="/introsort" element={<Introsort />} />
        <Route path="/heap" element={<Heap />} />
      </Routes>
    </Router>
  );
}

export default App;
