import React, { useState, useEffect } from "react";
import "../../../styles/CombSort.css";

interface SortStep {
  array: number[];
  comparing: [number, number];
  swapped: boolean;
  gap: number;
  message: string;
}

const CombSort: React.FC = () => {
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
    generateCombSortSteps(arr, newSteps);
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

  const getNextGap = (gap: number): number => {
    gap = Math.floor((gap * 10) / 13);
    return Math.max(1, gap);
  };

  const generateCombSortSteps = (arr: number[], steps: SortStep[]) => {
    const n = arr.length;
    let gap = n;
    let swapped = true;

    steps.push({
      array: [...arr],
      comparing: [-1, -1],
      swapped: false,
      gap: n,
      message: "Starting Comb Sort",
    });

    while (gap !== 1 || swapped) {
      gap = getNextGap(gap);
      swapped = false;

      for (let i = 0; i < n - gap; i++) {
        steps.push({
          array: [...arr],
          comparing: [i, i + gap],
          swapped: false,
          gap,
          message: `Comparing elements at index ${i} and ${i + gap}`,
        });

        if (arr[i] > arr[i + gap]) {
          [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
          swapped = true;
          steps.push({
            array: [...arr],
            comparing: [i, i + gap],
            swapped: true,
            gap,
            message: `Swapped elements ${arr[i + gap]} and ${arr[i]}`,
          });
        }
      }
    }

    steps.push({
      array: [...arr],
      comparing: [-1, -1],
      swapped: false,
      gap: 1,
      message: "Comb Sort complete!",
    });
  };

  const getBarClassName = (index: number) => {
    if (!steps[currentStep]) return "array-bar";

    const { comparing, swapped } = steps[currentStep];
    let className = "array-bar";

    if (comparing.includes(index)) {
      className += swapped ? " swapped" : " comparing";
    }

    if (currentStep === steps.length - 1) {
      className += " sorted";
    }

    return className;
  };

  return (
    <div className="sort-container">
      <h1>Comb Sort Visualization</h1>
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

      <div className="gap-indicator">Gap: {steps[currentStep]?.gap}</div>

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

export default CombSort;
