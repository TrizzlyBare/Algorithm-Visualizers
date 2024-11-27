import React, { useState, useEffect } from "react";
import "../../../styles/HeapSort.css";

interface SortStep {
  array: number[];
  heapRoot: number;
  comparing: number[];
  swapping: number[];
  sorted: number[];
  phase: "buildHeap" | "extractMax";
  message: string;
}

const HeapSort: React.FC = () => {
  const [array, setArray] = useState<number[]>([4, 10, 3, 5, 1, 8, 7, 9, 2, 6]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);

  const generateRandomArray = () => {
    const newArray = Array.from(
      { length: 10 },
      () => Math.floor(Math.random() * 20) + 1
    );
    setArray(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    const newSteps: SortStep[] = [];
    const arr = [...array];
    generateHeapSortSteps(arr, newSteps);
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

  const generateHeapSortSteps = (arr: number[], steps: SortStep[]) => {
    const n = arr.length;

    steps.push({
      array: [...arr],
      heapRoot: -1,
      comparing: [],
      swapping: [],
      sorted: [],
      phase: "buildHeap",
      message: "Starting heap construction",
    });

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i, steps, []);
    }

    const sorted: number[] = [];
    for (let i = n - 1; i > 0; i--) {
      steps.push({
        array: [...arr],
        heapRoot: 0,
        comparing: [],
        swapping: [0, i],
        sorted: [...sorted],
        phase: "extractMax",
        message: `Extracting maximum element ${arr[0]}`,
      });

      [arr[0], arr[i]] = [arr[i], arr[0]];
      sorted.unshift(i);

      steps.push({
        array: [...arr],
        heapRoot: 0,
        comparing: [],
        swapping: [],
        sorted: [...sorted],
        phase: "extractMax",
        message: "Heapifying remaining elements",
      });

      heapify(arr, i, 0, steps, sorted);
    }

    sorted.unshift(0);
    steps.push({
      array: [...arr],
      heapRoot: -1,
      comparing: [],
      swapping: [],
      sorted: sorted,
      phase: "extractMax",
      message: "Heap sort complete!",
    });
  };

  const heapify = (
    arr: number[],
    n: number,
    i: number,
    steps: SortStep[],
    sorted: number[]
  ) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    steps.push({
      array: [...arr],
      heapRoot: i,
      comparing: [left, right].filter((x) => x < n),
      swapping: [],
      sorted: [...sorted],
      phase: "buildHeap",
      message: `Comparing root ${arr[i]} with its children`,
    });

    if (left < n) {
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < n) {
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      steps.push({
        array: [...arr],
        heapRoot: i,
        comparing: [],
        swapping: [i, largest],
        sorted: [...sorted],
        phase: "buildHeap",
        message: `Swapping ${arr[i]} with ${arr[largest]}`,
      });

      [arr[i], arr[largest]] = [arr[largest], arr[i]];

      steps.push({
        array: [...arr],
        heapRoot: largest,
        comparing: [],
        swapping: [],
        sorted: [...sorted],
        phase: "buildHeap",
        message: "Continuing heapification",
      });

      heapify(arr, n, largest, steps, sorted);
    }
  };

  const getBarClassName = (index: number) => {
    if (!steps[currentStep]) return "array-bar";

    const { heapRoot, comparing, swapping, sorted } = steps[currentStep];
    let className = "array-bar";

    if (sorted.includes(index)) {
      className += " sorted";
    } else if (index === heapRoot) {
      className += " heap-root";
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

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  return (
    <div className="sort-container">
      <h1>Heap Sort Visualization</h1>
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
      <div className="phase-indicator">
        Phase:{" "}
        {steps[currentStep]?.phase === "buildHeap"
          ? "Building Max Heap"
          : "Extracting Maximum"}
      </div>
      <div className="speed-control">
        <label>Speed: </label>
        <select
          value={speed}
          onChange={(e) => handleSpeedChange(Number(e.target.value))}
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
      <div className="step-info">
        Step: {currentStep + 1} / {steps.length}
      </div>
    </div>
  );
};

export default HeapSort;
