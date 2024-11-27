import React, { useState, useEffect } from "react";
import "../../../styles/IntroSort.css";

interface SortStep {
  array: number[];
  activeIndices: number[];
  message: string;
  phase: "quicksort" | "heapsort" | "insertion-sort" | "complete";
  subArray?: [number, number];
}

const Introsort: React.FC = () => {
  const [array, setArray] = useState<number[]>([
    64, 34, 25, 12, 22, 11, 90, 50, 45, 38, 15, 72, 28, 83, 65, 93,
  ]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);

  const generateRandomArray = () => {
    const newArray = Array.from(
      { length: 16 },
      () => Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    const newSteps: SortStep[] = [];
    const arr = [...array];
    introSort(
      arr,
      0,
      arr.length - 1,
      Math.floor(2 * Math.log2(arr.length)),
      newSteps
    );
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

  const introSort = (
    arr: number[],
    start: number,
    end: number,
    maxDepth: number,
    steps: SortStep[]
  ) => {
    const n = end - start + 1;

    if (n <= 1) {
      return;
    }

    if (n <= 16) {
      insertionSort(arr, start, end, steps);
    } else if (maxDepth === 0) {
      heapSort(arr, start, end, steps);
    } else {
      quickSort(arr, start, end, maxDepth, steps);
    }
  };

  const insertionSort = (
    arr: number[],
    start: number,
    end: number,
    steps: SortStep[]
  ) => {
    for (let i = start + 1; i <= end; i++) {
      const key = arr[i];
      let j = i - 1;

      while (j >= start && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;

        steps.push({
          array: [...arr],
          activeIndices: [j, j + 1],
          message: `Insertion Sort: Moving ${arr[j + 1]} to position ${j + 1}`,
          phase: "insertion-sort",
          subArray: [start, end],
        });
      }

      arr[j + 1] = key;
    }
  };

  const heapSort = (
    arr: number[],
    start: number,
    end: number,
    steps: SortStep[]
  ) => {
    const heapify = (n: number, i: number) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n && arr[start + left] > arr[start + largest]) {
        largest = left;
      }

      if (right < n && arr[start + right] > arr[start + largest]) {
        largest = right;
      }

      if (largest !== i) {
        [arr[start + i], arr[start + largest]] = [
          arr[start + largest],
          arr[start + i],
        ];

        steps.push({
          array: [...arr],
          activeIndices: [start + i, start + largest],
          message: `Heapify: Swapping ${arr[start + largest]} and ${
            arr[start + i]
          }`,
          phase: "heapsort",
          subArray: [start, end],
        });

        heapify(n, largest);
      }
    };

    const n = end - start + 1;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
      [arr[start], arr[start + i]] = [arr[start + i], arr[start]];

      steps.push({
        array: [...arr],
        activeIndices: [start, start + i],
        message: `Heap Sort: Swapping ${arr[start]} and ${arr[start + i]}`,
        phase: "heapsort",
        subArray: [start, end],
      });

      heapify(i, 0);
    }
  };

  const quickSort = (
    arr: number[],
    start: number,
    end: number,
    maxDepth: number,
    steps: SortStep[]
  ) => {
    if (start < end) {
      const pivotIndex = partition(arr, start, end, steps);

      steps.push({
        array: [...arr],
        activeIndices: [pivotIndex],
        message: `Quicksort: Pivot ${arr[pivotIndex]} is in its final position`,
        phase: "quicksort",
        subArray: [start, end],
      });

      introSort(arr, start, pivotIndex - 1, maxDepth - 1, steps);
      introSort(arr, pivotIndex + 1, end, maxDepth - 1, steps);
    }
  };

  const partition = (
    arr: number[],
    start: number,
    end: number,
    steps: SortStep[]
  ): number => {
    const pivot = arr[end];
    let i = start - 1;

    for (let j = start; j < end; j++) {
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];

        steps.push({
          array: [...arr],
          activeIndices: [i, j, end],
          message: `Partitioning: Swapping ${arr[j]} and ${arr[i]}`,
          phase: "quicksort",
          subArray: [start, end],
        });
      }
    }

    [arr[i + 1], arr[end]] = [arr[end], arr[i + 1]];

    steps.push({
      array: [...arr],
      activeIndices: [i + 1, end],
      message: `Partitioning: Swapping pivot ${arr[end]} with ${arr[i + 1]}`,
      phase: "quicksort",
      subArray: [start, end],
    });

    return i + 1;
  };

  const getBarClassName = (index: number) => {
    if (!steps[currentStep]) return "array-bar";

    const { activeIndices, phase, subArray } = steps[currentStep];
    let className = "array-bar";

    if (subArray && index >= subArray[0] && index <= subArray[1]) {
      className += " current-subarray";
    }

    if (activeIndices.includes(index)) {
      className += " active";
    }

    if (phase === "complete") {
      className += " sorted";
    }

    return className;
  };

  return (
    <div className="sort-container">
      <h1>Introsort Visualization</h1>
      <div className="message-box">{steps[currentStep]?.message}</div>

      <div className="array-section">
        <div className="array-display">
          {steps[currentStep]?.array.map((value, index) => (
            <div
              key={index}
              className={getBarClassName(index)}
              style={{ height: `${value * 3}px` }}
            >
              {value}
            </div>
          ))}
        </div>
      </div>

      <div className="phase-indicator">
        Phase:{" "}
        {steps[currentStep]?.phase
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </div>

      <div className="controls-section">
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
      </div>

      <div className="step-info">
        Step: {currentStep + 1} / {steps.length}
      </div>
    </div>
  );
};

export default Introsort;
