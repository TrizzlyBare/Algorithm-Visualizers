import React, { useState, useEffect } from "react";
import "../../../styles/InsertionSort.css";

interface SortStep {
  array: number[];
  currentIndex: number;
  comparingIndex: number;
  sorted: number[];
}

const InsertionSort: React.FC = () => {
  const [array, setArray] = useState<number[]>([12, 11, 13, 5, 6, 7]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);

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
    generateInsertionSortSteps(arr, newSteps);
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

  const generateInsertionSortSteps = (arr: number[], steps: SortStep[]) => {
    const n = arr.length;
    const sortedIndices: number[] = [0];

    // Initial state
    steps.push({
      array: [...arr],
      currentIndex: -1,
      comparingIndex: -1,
      sorted: [...sortedIndices],
    });

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      // Show current element being inserted
      steps.push({
        array: [...arr],
        currentIndex: i,
        comparingIndex: -1,
        sorted: [...sortedIndices],
      });

      while (j >= 0 && arr[j] > key) {
        // Show comparison
        steps.push({
          array: [...arr],
          currentIndex: i,
          comparingIndex: j,
          sorted: [...sortedIndices],
        });

        // Shift element
        arr[j + 1] = arr[j];
        steps.push({
          array: [...arr],
          currentIndex: i,
          comparingIndex: j,
          sorted: [...sortedIndices],
        });

        j = j - 1;
      }

      // Place key in correct position
      arr[j + 1] = key;
      sortedIndices.push(i);

      steps.push({
        array: [...arr],
        currentIndex: -1,
        comparingIndex: -1,
        sorted: [...sortedIndices],
      });
    }
  };

  const getBarClassName = (index: number) => {
    if (!steps[currentStep]) return "array-bar";

    const { currentIndex, comparingIndex, sorted } = steps[currentStep];
    let className = "array-bar";

    if (sorted.includes(index)) {
      className += " sorted";
    } else if (index === currentIndex) {
      className += " current";
    } else if (index === comparingIndex) {
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

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  return (
    <div className="sort-container">
      <h1>Insertion Sort Visualization</h1>
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

export default InsertionSort;
