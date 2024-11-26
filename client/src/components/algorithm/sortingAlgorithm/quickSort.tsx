import React, { useState, useEffect } from "react";
import "./QuickSort.css";

interface SortStep {
  array: number[];
  pivotIndex: number;
  comparing: number[];
  swapping: number[];
}

const QuickSort: React.FC = () => {
  const [array, setArray] = useState<number[]>([10, 7, 8, 9, 1, 5]);
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
    quickSort(arr, 0, arr.length - 1, newSteps);
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

  const quickSort = (
    arr: number[],
    low: number,
    high: number,
    steps: SortStep[]
  ) => {
    if (low < high) {
      const pi = partition(arr, low, high, steps);
      quickSort(arr, low, pi - 1, steps);
      quickSort(arr, pi + 1, high, steps);
    }
  };

  const partition = (
    arr: number[],
    low: number,
    high: number,
    steps: SortStep[]
  ): number => {
    const pivot = arr[high];
    let i = low - 1;

    // Add initial state with pivot highlighted
    steps.push({
      array: [...arr],
      pivotIndex: high,
      comparing: [],
      swapping: [],
    });

    for (let j = low; j < high; j++) {
      // Add comparing state
      steps.push({
        array: [...arr],
        pivotIndex: high,
        comparing: [j],
        swapping: [],
      });

      if (arr[j] < pivot) {
        i++;
        // Add swapping state
        steps.push({
          array: [...arr],
          pivotIndex: high,
          comparing: [],
          swapping: [i, j],
        });
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({
          array: [...arr],
          pivotIndex: high,
          comparing: [],
          swapping: [],
        });
      }
    }

    // Swap pivot into position
    steps.push({
      array: [...arr],
      pivotIndex: high,
      comparing: [],
      swapping: [i + 1, high],
    });
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({
      array: [...arr],
      pivotIndex: i + 1,
      comparing: [],
      swapping: [],
    });

    return i + 1;
  };

  const getBarClassName = (index: number) => {
    if (!steps[currentStep]) return "array-bar";

    const { pivotIndex, comparing, swapping } = steps[currentStep];
    let className = "array-bar";

    if (index === pivotIndex) {
      className += " pivot";
    } else if (comparing.includes(index)) {
      className += " comparing";
    } else if (swapping.includes(index)) {
      className += " swapping";
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
      <h1>Quick Sort Visualization</h1>
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

export default QuickSort;
