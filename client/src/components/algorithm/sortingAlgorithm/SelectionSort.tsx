import React, { useState, useEffect } from "react";
import "../../../styles/SelectionSort.css";

interface SortStep {
  array: number[];
  currentIndex: number;
  minIndex: number;
  comparing: number;
  sorted: number[];
}

const SelectionSort: React.FC = () => {
  const [array, setArray] = useState<number[]>([20, 14, 15, 2, 12, 11, 9]);
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
    generateSelectionSortSteps(arr, newSteps);
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

  const generateSelectionSortSteps = (arr: number[], steps: SortStep[]) => {
    const n = arr.length;
    const sortedIndices: number[] = [];

    for (let i = 0; i < n; i++) {
      let minIdx = i;

      // Add step to show current position
      steps.push({
        array: [...arr],
        currentIndex: i,
        minIndex: minIdx,
        comparing: -1,
        sorted: [...sortedIndices],
      });

      // Find the minimum element in the unsorted portion
      for (let j = i + 1; j < n; j++) {
        // Add step to show comparison
        steps.push({
          array: [...arr],
          currentIndex: i,
          minIndex: minIdx,
          comparing: j,
          sorted: [...sortedIndices],
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          // Add step to show new minimum
          steps.push({
            array: [...arr],
            currentIndex: i,
            minIndex: minIdx,
            comparing: -1,
            sorted: [...sortedIndices],
          });
        }
      }

      // Swap elements if needed
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        steps.push({
          array: [...arr],
          currentIndex: i,
          minIndex: minIdx,
          comparing: -1,
          sorted: [...sortedIndices],
        });
      }

      // Mark current index as sorted
      sortedIndices.push(i);
      steps.push({
        array: [...arr],
        currentIndex: -1,
        minIndex: -1,
        comparing: -1,
        sorted: [...sortedIndices],
      });
    }
  };

  const getBarClassName = (index: number) => {
    if (!steps[currentStep]) return "array-bar";

    const { currentIndex, minIndex, comparing, sorted } = steps[currentStep];
    let className = "array-bar";

    if (sorted.includes(index)) {
      className += " sorted";
    } else if (index === currentIndex) {
      className += " current";
    } else if (index === minIndex) {
      className += " minimum";
    } else if (index === comparing) {
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
      <h1>Selection Sort Visualization</h1>
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

export default SelectionSort;
