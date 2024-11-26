import React, { useState, useEffect } from "react";
import "../../../styles/MergeSort.css";

interface SortStep {
  array: number[];
  leftIndex: number;
  rightIndex: number;
  merging: number[];
}

const MergeSort: React.FC = () => {
  const [array, setArray] = useState<number[]>([8, 3, 5, 4, 7, 6, 1, 2]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const generateRandomArray = () => {
    const newArray = Array.from(
      { length: 8 },
      () => Math.floor(Math.random() * 20) + 1
    );
    setArray(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    const newSteps: SortStep[] = [];
    const arr = [...array];
    mergeSort(arr, 0, arr.length - 1, newSteps);
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
      }, 500);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, steps.length]);

  const merge = (
    arr: number[],
    left: number,
    middle: number,
    right: number,
    steps: SortStep[]
  ) => {
    const leftArray = arr.slice(left, middle + 1);
    const rightArray = arr.slice(middle + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArray.length && j < rightArray.length) {
      // Add step to show comparison
      steps.push({
        array: [...arr],
        leftIndex: left + i,
        rightIndex: middle + 1 + j,
        merging: Array.from(
          { length: right - left + 1 },
          (_, idx) => left + idx
        ),
      });

      if (leftArray[i] <= rightArray[j]) {
        arr[k] = leftArray[i];
        i++;
      } else {
        arr[k] = rightArray[j];
        j++;
      }

      // Add step to show the merge
      steps.push({
        array: [...arr],
        leftIndex: -1,
        rightIndex: -1,
        merging: Array.from({ length: k - left + 1 }, (_, idx) => left + idx),
      });

      k++;
    }

    while (i < leftArray.length) {
      arr[k] = leftArray[i];
      steps.push({
        array: [...arr],
        leftIndex: -1,
        rightIndex: -1,
        merging: Array.from({ length: k - left + 1 }, (_, idx) => left + idx),
      });
      i++;
      k++;
    }

    while (j < rightArray.length) {
      arr[k] = rightArray[j];
      steps.push({
        array: [...arr],
        leftIndex: -1,
        rightIndex: -1,
        merging: Array.from({ length: k - left + 1 }, (_, idx) => left + idx),
      });
      j++;
      k++;
    }
  };

  const mergeSort = (
    arr: number[],
    left: number,
    right: number,
    steps: SortStep[]
  ) => {
    if (left < right) {
      const middle = Math.floor((left + right) / 2);

      // Add step to show division
      steps.push({
        array: [...arr],
        leftIndex: left,
        rightIndex: right,
        merging: [],
      });

      mergeSort(arr, left, middle, steps);
      mergeSort(arr, middle + 1, right, steps);
      merge(arr, left, middle, right, steps);
    }
  };

  const getBarClassName = (index: number) => {
    if (!steps[currentStep]) return "array-bar";

    const { leftIndex, rightIndex, merging } = steps[currentStep];
    let className = "array-bar";

    if (merging.includes(index)) {
      className += " merging";
    } else if (index === leftIndex || index === rightIndex) {
      className += " comparing";
    }

    return className;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="sort-container">
      <h1>Merge Sort Visualization</h1>
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
      <div className="controls-container">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0 || isPlaying}
          className="control-button"
        >
          Previous
        </button>
        <button onClick={handlePlayPause} className="control-button">
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
        <button onClick={handleReset} className="control-button">
          Reset
        </button>
        <button onClick={generateRandomArray} className="control-button">
          New Array
        </button>
      </div>
    </div>
  );
};

export default MergeSort;
