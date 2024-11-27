import React, { useState, useEffect } from "react";
import "../../../styles/RadixSort.css";

interface SortStep {
  array: number[];
  buckets: number[][];
  currentDigit: number;
  activeIndex: number;
  phase: "distribution" | "collection" | "complete";
  message: string;
  highlightIndices: number[];
}

const RadixSort: React.FC = () => {
  const [array, setArray] = useState<number[]>([
    170, 45, 75, 90, 802, 24, 2, 66,
  ]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [speed, setSpeed] = useState<number>(500);

  const generateRandomArray = () => {
    const newArray = Array.from(
      { length: 8 },
      () => Math.floor(Math.random() * 999) + 1
    );
    setArray(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    const newSteps: SortStep[] = [];
    const arr = [...array];
    generateRadixSortSteps(arr, newSteps);
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

  const getDigit = (num: number, place: number): number => {
    return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;
  };

  const getMaxDigits = (nums: number[]): number => {
    let maxDigits = 0;
    for (let num of nums) {
      maxDigits = Math.max(
        maxDigits,
        Math.floor(Math.log10(Math.abs(num))) + 1
      );
    }
    return maxDigits;
  };

  const generateRadixSortSteps = (arr: number[], steps: SortStep[]) => {
    const maxDigits = getMaxDigits(arr);

    // Initial state
    steps.push({
      array: [...arr],
      buckets: Array(10)
        .fill(null)
        .map(() => []),
      currentDigit: 0,
      activeIndex: -1,
      phase: "distribution",
      message: "Starting Radix Sort",
      highlightIndices: [],
    });

    for (let digitPlace = 0; digitPlace < maxDigits; digitPlace++) {
      const buckets: number[][] = Array(10)
        .fill(null)
        .map(() => []);

      // Distribution phase
      for (let i = 0; i < arr.length; i++) {
        const digit = getDigit(arr[i], digitPlace);

        steps.push({
          array: [...arr],
          buckets: JSON.parse(JSON.stringify(buckets)),
          currentDigit: digitPlace,
          activeIndex: i,
          phase: "distribution",
          message: `Distributing ${arr[i]} to bucket ${digit} (digit place: ${digitPlace})`,
          highlightIndices: [i],
        });

        buckets[digit].push(arr[i]);

        steps.push({
          array: [...arr],
          buckets: JSON.parse(JSON.stringify(buckets)),
          currentDigit: digitPlace,
          activeIndex: i,
          phase: "distribution",
          message: `Placed ${arr[i]} in bucket ${digit}`,
          highlightIndices: [],
        });
      }

      // Collection phase
      let arrIndex = 0;
      for (let b = 0; b < 10; b++) {
        for (let j = 0; j < buckets[b].length; j++) {
          steps.push({
            array: [...arr],
            buckets: JSON.parse(JSON.stringify(buckets)),
            currentDigit: digitPlace,
            activeIndex: arrIndex,
            phase: "collection",
            message: `Collecting ${buckets[b][j]} from bucket ${b}`,
            highlightIndices: [arrIndex],
          });

          arr[arrIndex] = buckets[b][j];
          arrIndex++;

          steps.push({
            array: [...arr],
            buckets: JSON.parse(JSON.stringify(buckets)),
            currentDigit: digitPlace,
            activeIndex: -1,
            phase: "collection",
            message: `Placed ${buckets[b][j]} back in array`,
            highlightIndices: [arrIndex - 1],
          });
        }
      }
    }

    // Final state
    steps.push({
      array: [...arr],
      buckets: Array(10)
        .fill(null)
        .map(() => []),
      currentDigit: -1,
      activeIndex: -1,
      phase: "complete",
      message: "Radix Sort Complete!",
      highlightIndices: [],
    });
  };

  const getArrayBarClassName = (index: number) => {
    if (!steps[currentStep]) return "array-bar";

    const { activeIndex, highlightIndices, phase } = steps[currentStep];
    let className = "array-bar";

    if (index === activeIndex) {
      className += " active";
    }
    if (highlightIndices.includes(index)) {
      className += " highlight";
    }
    if (phase === "complete") {
      className += " sorted";
    }

    return className;
  };

  const getBucketBarClassName = (bucketIndex: number, itemIndex: number) => {
    const { currentDigit } = steps[currentStep];
    let className = "bucket-bar";

    if (
      getDigit(
        steps[currentStep].buckets[bucketIndex][itemIndex],
        currentDigit
      ) === bucketIndex
    ) {
      className += " matching-digit";
    }

    return className;
  };

  return (
    <div className="sort-container">
      <h1>Radix Sort Visualization</h1>
      <div className="message-box">{steps[currentStep]?.message}</div>

      <div className="main-array-section">
        <h3>Current Array</h3>
        <div className="array-display">
          {steps[currentStep]?.array.map((value, index) => (
            <div
              key={index}
              className={getArrayBarClassName(index)}
              style={{ height: `${Math.min(value / 2, 200)}px` }}
            >
              {value}
            </div>
          ))}
        </div>
      </div>

      <div className="buckets-container">
        <h3>
          Buckets (Current Digit Place: {steps[currentStep]?.currentDigit})
        </h3>
        <div className="buckets-grid">
          {steps[currentStep]?.buckets.map((bucket, bucketIndex) => (
            <div key={bucketIndex} className="bucket">
              <div className="bucket-label">{bucketIndex}</div>
              <div className="bucket-items">
                {bucket.map((value, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={getBucketBarClassName(bucketIndex, itemIndex)}
                    style={{ height: `${Math.min(value / 2, 200)}px` }}
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="phase-indicator">
        Phase:{" "}
        {steps[currentStep]?.phase.charAt(0).toUpperCase() +
          steps[currentStep]?.phase.slice(1)}
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

export default RadixSort;
