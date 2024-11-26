import React, { useState, useEffect } from "react";
import "../../../styles/ThreeWayMergeSort.css";

interface SortStep {
  array: number[];
  left: number;
  mid1: number;
  mid2: number;
  right: number;
  activeIndices: number[];
  merging: number[];
  sortedRanges: Array<[number, number]>;
  message: string;
}

const ThreeWayMergeSort: React.FC = () => {
  const [array, setArray] = useState<number[]>([
    14, 20, 15, 12, 2, 11, 5, 8, 3,
  ]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);

  const generateRandomArray = () => {
    const newArray = Array.from(
      { length: 9 },
      () => Math.floor(Math.random() * 20) + 1
    );
    setArray(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    const newSteps: SortStep[] = [];
    const arr = [...array];
    generateThreeWayMergeSortSteps(arr, 0, arr.length - 1, newSteps);
    setSteps(newSteps);
  }, [array]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying && currentStep < steps.length - 1) {
      intervalId = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, steps.length, speed]);

  const merge = (
    arr: number[],
    left: number,
    mid1: number,
    mid2: number,
    right: number,
    steps: SortStep[]
  ) => {
    const tempArray: number[] = Array(right - left + 1);
    let i = left,
      j = mid1 + 1,
      k = mid2 + 1,
      l = 0;

    // Initial merge state
    steps.push({
      array: [...arr],
      left,
      mid1,
      mid2,
      right,
      activeIndices: [i, j, k],
      merging: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
      sortedRanges: [],
      message: "Starting merge of three parts",
    });

    // Compare and merge the three parts
    while (i <= mid1 && j <= mid2 && k <= right) {
      steps.push({
        array: [...arr],
        left,
        mid1,
        mid2,
        right,
        activeIndices: [i, j, k],
        merging: Array.from(
          { length: right - left + 1 },
          (_, idx) => left + idx
        ),
        sortedRanges: [],
        message: `Comparing elements: ${arr[i]}, ${arr[j]}, ${arr[k]}`,
      });

      if (arr[i] <= arr[j] && arr[i] <= arr[k]) {
        tempArray[l++] = arr[i++];
      } else if (arr[j] <= arr[i] && arr[j] <= arr[k]) {
        tempArray[l++] = arr[j++];
      } else {
        tempArray[l++] = arr[k++];
      }
    }

    // Merge remaining elements of first and second parts
    while (i <= mid1 && j <= mid2) {
      steps.push({
        array: [...arr],
        left,
        mid1,
        mid2,
        right,
        activeIndices: [i, j],
        merging: Array.from(
          { length: right - left + 1 },
          (_, idx) => left + idx
        ),
        sortedRanges: [],
        message: `Comparing remaining elements: ${arr[i]}, ${arr[j]}`,
      });

      if (arr[i] <= arr[j]) {
        tempArray[l++] = arr[i++];
      } else {
        tempArray[l++] = arr[j++];
      }
    }

    // Merge remaining elements of first and third parts
    while (i <= mid1 && k <= right) {
      steps.push({
        array: [...arr],
        left,
        mid1,
        mid2,
        right,
        activeIndices: [i, k],
        merging: Array.from(
          { length: right - left + 1 },
          (_, idx) => left + idx
        ),
        sortedRanges: [],
        message: `Comparing remaining elements: ${arr[i]}, ${arr[k]}`,
      });

      if (arr[i] <= arr[k]) {
        tempArray[l++] = arr[i++];
      } else {
        tempArray[l++] = arr[k++];
      }
    }

    // Merge remaining elements of second and third parts
    while (j <= mid2 && k <= right) {
      steps.push({
        array: [...arr],
        left,
        mid1,
        mid2,
        right,
        activeIndices: [j, k],
        merging: Array.from(
          { length: right - left + 1 },
          (_, idx) => left + idx
        ),
        sortedRanges: [],
        message: `Comparing remaining elements: ${arr[j]}, ${arr[k]}`,
      });

      if (arr[j] <= arr[k]) {
        tempArray[l++] = arr[j++];
      } else {
        tempArray[l++] = arr[k++];
      }
    }

    // Copy remaining elements
    while (i <= mid1) tempArray[l++] = arr[i++];
    while (j <= mid2) tempArray[l++] = arr[j++];
    while (k <= right) tempArray[l++] = arr[k++];

    // Copy back to original array
    for (i = 0; i < tempArray.length; i++) {
      arr[left + i] = tempArray[i];
      steps.push({
        array: [...arr],
        left,
        mid1,
        mid2,
        right,
        activeIndices: [left + i],
        merging: [],
        sortedRanges: [[left, right]],
        message: `Copying merged element back to position ${left + i}`,
      });
    }
  };

  const generateThreeWayMergeSortSteps = (
    arr: number[],
    left: number,
    right: number,
    steps: SortStep[]
  ) => {
    if (left < right) {
      const len = right - left + 1;
      const mid1 = left + Math.floor(len / 3) - 1;
      const mid2 = left + 2 * Math.floor(len / 3) - 1;

      steps.push({
        array: [...arr],
        left,
        mid1,
        mid2,
        right,
        activeIndices: [],
        merging: [],
        sortedRanges: [],
        message: `Dividing array into three parts: [${left}-${mid1}], [${
          mid1 + 1
        }-${mid2}], [${mid2 + 1}-${right}]`,
      });

      generateThreeWayMergeSortSteps(arr, left, mid1, steps);
      generateThreeWayMergeSortSteps(arr, mid1 + 1, mid2, steps);
      generateThreeWayMergeSortSteps(arr, mid2 + 1, right, steps);

      merge(arr, left, mid1, mid2, right, steps);
    }
  };

  const getBarClassName = (index: number) => {
    if (!steps[currentStep]) return "array-bar";

    const { activeIndices, merging, sortedRanges } = steps[currentStep];
    let className = "array-bar";

    if (activeIndices.includes(index)) {
      className += " comparing";
    } else if (merging.includes(index)) {
      className += " merging";
    }

    for (const [start, end] of sortedRanges) {
      if (index >= start && index <= end) {
        className += " sorted";
        break;
      }
    }

    return className;
  };

  return (
    <div className="sort-container">
      <h1>3-Way Merge Sort Visualization</h1>
      <div className="message-box">{steps[currentStep]?.message}</div>
      <div className="array-container">
        {steps[currentStep]?.array.map((value, index) => (
          <div
            key={index}
            className={getBarClassName(index)}
            style={{ height: `${value * 20}px` }}
          >
            {value}
          </div>
        ))}
      </div>
      <div className="speed-control">
        <label>Speed: </label>
        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="speed-select"
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={200}>Fast</option>
        </select>
      </div>
      <div className="controls-container">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0 || isPlaying}
          className="control-button"
        >
          Previous
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="control-button"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={() =>
            setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))
          }
          disabled={currentStep === steps.length - 1 || isPlaying}
          className="control-button"
        >
          Next
        </button>
        <button
          onClick={() => {
            setCurrentStep(0);
            setIsPlaying(false);
          }}
          className="control-button"
        >
          Reset
        </button>
        <button onClick={generateRandomArray} className="control-button">
          New Array
        </button>
      </div>
      <div className="step-info">
        Step: {currentStep + 1} / {steps.length}
      </div>
    </div>
  );
};

export default ThreeWayMergeSort;
