import React, { useState, useEffect } from "react";
import "../../../styles/BucketSort.css";

interface SortStep {
  array: number[];
  buckets: number[][];
  currentPhase: "distribution" | "sorting" | "collection" | "complete";
  activeIndex: number;
  activeBucket: number;
  message: string;
  sortedBuckets: number[];
}

const BucketSort: React.FC = () => {
  const [array, setArray] = useState<number[]>([
    0.42, 0.32, 0.73, 0.15, 0.91, 0.55, 0.28, 0.69,
  ]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);
  const [bucketCount, setBucketCount] = useState<number>(5);

  const generateRandomArray = () => {
    const newArray = Array.from(
      { length: 8 },
      () => Math.round(Math.random() * 100) / 100
    );
    setArray(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    const newSteps: SortStep[] = [];
    const arr = [...array];
    generateBucketSortSteps(arr, newSteps);
    setSteps(newSteps);
  }, [array, bucketCount]);

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

  const insertionSort = (
    arr: number[],
    steps: SortStep[],
    bucketIndex: number,
    buckets: number[][],
    sortedBuckets: number[]
  ) => {
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;

      while (j >= 0 && arr[j] > key) {
        steps.push({
          array: [...array],
          buckets: JSON.parse(JSON.stringify(buckets)),
          currentPhase: "sorting",
          activeIndex: j,
          activeBucket: bucketIndex,
          message: `Comparing ${arr[j]} with ${key} in bucket ${bucketIndex}`,
          sortedBuckets: [...sortedBuckets],
        });

        arr[j + 1] = arr[j];
        arr[j] = key;
        j--;

        steps.push({
          array: [...array],
          buckets: JSON.parse(JSON.stringify(buckets)),
          currentPhase: "sorting",
          activeIndex: j + 1,
          activeBucket: bucketIndex,
          message: `Swapped elements in bucket ${bucketIndex}`,
          sortedBuckets: [...sortedBuckets],
        });
      }
    }
  };

  const generateBucketSortSteps = (arr: number[], steps: SortStep[]) => {
    steps.push({
      array: [...arr],
      buckets: Array(bucketCount)
        .fill(null)
        .map(() => []),
      currentPhase: "distribution",
      activeIndex: -1,
      activeBucket: -1,
      message: "Starting Bucket Sort",
      sortedBuckets: [],
    });

    const buckets: number[][] = Array(bucketCount)
      .fill(null)
      .map(() => []);
    const sortedBuckets: number[] = [];

    for (let i = 0; i < arr.length; i++) {
      const bucketIndex = Math.floor(arr[i] * bucketCount);

      steps.push({
        array: [...arr],
        buckets: JSON.parse(JSON.stringify(buckets)),
        currentPhase: "distribution",
        activeIndex: i,
        activeBucket: bucketIndex,
        message: `Distributing ${arr[i]} to bucket ${bucketIndex}`,
        sortedBuckets: [...sortedBuckets],
      });

      buckets[bucketIndex].push(arr[i]);

      steps.push({
        array: [...arr],
        buckets: JSON.parse(JSON.stringify(buckets)),
        currentPhase: "distribution",
        activeIndex: -1,
        activeBucket: bucketIndex,
        message: `Placed ${arr[i]} in bucket ${bucketIndex}`,
        sortedBuckets: [...sortedBuckets],
      });
    }

    for (let i = 0; i < bucketCount; i++) {
      if (buckets[i].length > 0) {
        insertionSort(buckets[i], steps, i, buckets, sortedBuckets);
        sortedBuckets.push(i);

        steps.push({
          array: [...arr],
          buckets: JSON.parse(JSON.stringify(buckets)),
          currentPhase: "sorting",
          activeIndex: -1,
          activeBucket: i,
          message: `Finished sorting bucket ${i}`,
          sortedBuckets: [...sortedBuckets],
        });
      }
    }

    let index = 0;
    for (let i = 0; i < bucketCount; i++) {
      for (let j = 0; j < buckets[i].length; j++) {
        steps.push({
          array: [...arr],
          buckets: JSON.parse(JSON.stringify(buckets)),
          currentPhase: "collection",
          activeIndex: index,
          activeBucket: i,
          message: `Collecting ${buckets[i][j]} from bucket ${i}`,
          sortedBuckets: [...sortedBuckets],
        });

        arr[index] = buckets[i][j];
        index++;

        steps.push({
          array: [...arr],
          buckets: JSON.parse(JSON.stringify(buckets)),
          currentPhase: "collection",
          activeIndex: index - 1,
          activeBucket: -1,
          message: `Placed ${buckets[i][j]} back in array`,
          sortedBuckets: [...sortedBuckets],
        });
      }
    }

    steps.push({
      array: [...arr],
      buckets: Array(bucketCount)
        .fill(null)
        .map(() => []),
      currentPhase: "complete",
      activeIndex: -1,
      activeBucket: -1,
      message: "Bucket Sort Complete!",
      sortedBuckets: [],
    });
  };

  const getBarClassName = (index: number, isBucket: boolean = false) => {
    if (!steps[currentStep]) return isBucket ? "bucket-bar" : "array-bar";

    const { activeIndex, activeBucket, currentPhase, sortedBuckets } =
      steps[currentStep];
    let className = isBucket ? "bucket-bar" : "array-bar";

    if (index === activeIndex || (isBucket && index === activeBucket)) {
      className += " active";
    }

    if (isBucket && sortedBuckets.includes(index)) {
      className += " sorted";
    }

    if (currentPhase === "complete" && !isBucket) {
      className += " sorted";
    }

    return className;
  };

  return (
    <div className="sort-container">
      <h1>Bucket Sort Visualization</h1>
      <div className="message-box">{steps[currentStep]?.message}</div>

      <div className="controls-section">
        <div className="bucket-control">
          <label>Number of Buckets: </label>
          <select
            value={bucketCount}
            onChange={(e) => setBucketCount(Number(e.target.value))}
            disabled={isPlaying}
            className="bucket-select"
          >
            {[3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="main-array-section">
        <h3>Input/Output Array</h3>
        <div className="array-display">
          {steps[currentStep]?.array.map((value, index) => (
            <div
              key={index}
              className={getBarClassName(index)}
              style={{ height: `${value * 300}px` }}
            >
              {value.toFixed(2)}
            </div>
          ))}
        </div>
      </div>

      <div className="buckets-container">
        <h3>Buckets</h3>
        <div className="buckets-grid">
          {steps[currentStep]?.buckets.map((bucket, bucketIndex) => (
            <div
              key={bucketIndex}
              className={`bucket ${getBarClassName(bucketIndex, true)}`}
            >
              <div className="bucket-label">
                {`${(bucketIndex / bucketCount).toFixed(2)} - ${(
                  (bucketIndex + 1) /
                  bucketCount
                ).toFixed(2)}`}
              </div>
              <div className="bucket-items">
                {bucket.map((value, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bucket-bar"
                    style={{ height: `${value * 300}px` }}
                  >
                    {value.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="phase-indicator">
        Phase:{" "}
        {steps[currentStep]?.currentPhase.charAt(0).toUpperCase() +
          steps[currentStep]?.currentPhase.slice(1)}
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

export default BucketSort;
