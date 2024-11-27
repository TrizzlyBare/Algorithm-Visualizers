import React, { useState, useEffect } from "react";
import "../../../styles/TimSort.css";

interface Run {
  start: number;
  length: number;
  isMerging?: boolean;
}

interface SortStep {
  array: number[];
  activeIndices: number[];
  runs: Run[];
  message: string;
  phase: "finding-runs" | "insertion-sort" | "merging" | "complete";
  currentRun?: number;
}

const MIN_MERGE = 32;

const TimSort: React.FC = () => {
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
    generateTimSortSteps(arr, newSteps);
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

  const minRunLength = (n: number): number => {
    let r = 0;
    while (n >= MIN_MERGE) {
      r |= n & 1;
      n >>= 1;
    }
    return n + r;
  };

  const insertionSort = (
    arr: number[],
    left: number,
    right: number,
    steps: SortStep[],
    runs: Run[]
  ) => {
    for (let i = left + 1; i <= right; i++) {
      const temp = arr[i];
      let j = i - 1;

      steps.push({
        array: [...arr],
        activeIndices: [i, j],
        runs: [...runs],
        message: `Insertion Sort: Comparing ${arr[i]} with previous elements`,
        phase: "insertion-sort",
      });

      while (j >= left && arr[j] > temp) {
        arr[j + 1] = arr[j];

        steps.push({
          array: [...arr],
          activeIndices: [j, j + 1],
          runs: [...runs],
          message: `Shifting ${arr[j]} to the right`,
          phase: "insertion-sort",
        });

        j--;
      }

      arr[j + 1] = temp;
    }
  };

  const merge = (
    arr: number[],
    l: number,
    m: number,
    r: number,
    steps: SortStep[],
    runs: Run[]
  ) => {
    const len1 = m - l + 1;
    const len2 = r - m;
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);

    let i = 0,
      j = 0,
      k = l;

    while (i < len1 && j < len2) {
      steps.push({
        array: [...arr],
        activeIndices: [l + i, m + 1 + j],
        runs: runs.map((run) => ({ ...run, isMerging: true })),
        message: `Merging: Comparing ${left[i]} and ${right[j]}`,
        phase: "merging",
      });

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      k++;
    }

    while (i < len1) {
      steps.push({
        array: [...arr],
        activeIndices: [k],
        runs: runs.map((run) => ({ ...run, isMerging: true })),
        message: `Copying remaining elements from left array`,
        phase: "merging",
      });

      arr[k] = left[i];
      i++;
      k++;
    }

    while (j < len2) {
      steps.push({
        array: [...arr],
        activeIndices: [k],
        runs: runs.map((run) => ({ ...run, isMerging: true })),
        message: `Copying remaining elements from right array`,
        phase: "merging",
      });

      arr[k] = right[j];
      j++;
      k++;
    }
  };

  const generateTimSortSteps = (arr: number[], steps: SortStep[]) => {
    const n = arr.length;
    const minRun = minRunLength(n);
    const runs: Run[] = [];

    // Initial state
    steps.push({
      array: [...arr],
      activeIndices: [],
      runs: [],
      message: `Starting TimSort with minRun = ${minRun}`,
      phase: "finding-runs",
    });

    // Find runs and apply insertion sort
    for (let i = 0; i < n; i += minRun) {
      const end = Math.min(i + minRun - 1, n - 1);

      runs.push({ start: i, length: end - i + 1 });

      steps.push({
        array: [...arr],
        activeIndices: [i, end],
        runs: [...runs],
        message: `Found run from index ${i} to ${end}`,
        phase: "finding-runs",
        currentRun: runs.length - 1,
      });

      insertionSort(arr, i, end, steps, runs);
    }

    // Merge runs
    for (let size = minRun; size < n; size = 2 * size) {
      for (let left = 0; left < n; left += 2 * size) {
        const mid = left + size - 1;
        const right = Math.min(left + 2 * size - 1, n - 1);

        if (mid < right) {
          steps.push({
            array: [...arr],
            activeIndices: [left, mid, right],
            runs: [...runs],
            message: `Merging runs from ${left} to ${mid} and ${
              mid + 1
            } to ${right}`,
            phase: "merging",
          });

          merge(arr, left, mid, right, steps, runs);
        }
      }
    }

    // Final state
    steps.push({
      array: [...arr],
      activeIndices: [],
      runs: [],
      message: "TimSort complete!",
      phase: "complete",
    });
  };

  const getBarClassName = (index: number) => {
    if (!steps[currentStep]) return "array-bar";

    const { activeIndices, phase, runs } = steps[currentStep];
    let className = "array-bar";

    // Check if index is in a run
    const runIndex = runs.findIndex(
      (run) => index >= run.start && index < run.start + run.length
    );

    if (runIndex !== -1) {
      const run = runs[runIndex];
      if (run.isMerging) {
        className += " merging";
      } else {
        className += ` run-${runIndex % 5}`; // Use modulo to cycle through colors
      }
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
      <h1>TimSort Visualization</h1>
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

export default TimSort;
