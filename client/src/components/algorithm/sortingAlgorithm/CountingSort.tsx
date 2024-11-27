import React, { useState, useEffect } from "react";
import "../../../styles/CountingSort.css";

interface SortStep {
  inputArray: number[];
  countArray: number[];
  outputArray: number[];
  activeIndex: number;
  currentPhase: "counting" | "accumulating" | "placing" | "complete";
  message: string;
  highlightCount?: number;
  highlightIndices: number[];
}

const CountingSort: React.FC = () => {
  const [array, setArray] = useState<number[]>([4, 2, 2, 8, 3, 3, 1]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);

  const generateRandomArray = () => {
    const newArray = Array.from(
      { length: 8 },
      () => Math.floor(Math.random() * 9) + 1
    );
    setArray(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    const newSteps: SortStep[] = [];
    generateCountingSortSteps([...array], newSteps);
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

  const generateCountingSortSteps = (arr: number[], steps: SortStep[]) => {
    const max = Math.max(...arr);
    const countArray = new Array(max + 1).fill(0);
    const output = new Array(arr.length).fill(0);

    steps.push({
      inputArray: [...arr],
      countArray: [...countArray],
      outputArray: [...output],
      activeIndex: -1,
      currentPhase: "counting",
      message: "Starting Counting Sort",
      highlightIndices: [],
    });

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        inputArray: [...arr],
        countArray: [...countArray],
        outputArray: [...output],
        activeIndex: i,
        currentPhase: "counting",
        message: `Counting occurrence of element ${arr[i]}`,
        highlightCount: arr[i],
        highlightIndices: [i],
      });

      countArray[arr[i]]++;

      steps.push({
        inputArray: [...arr],
        countArray: [...countArray],
        outputArray: [...output],
        activeIndex: i,
        currentPhase: "counting",
        message: `Count of ${arr[i]} is now ${countArray[arr[i]]}`,
        highlightCount: arr[i],
        highlightIndices: [i],
      });
    }

    for (let i = 1; i <= max; i++) {
      steps.push({
        inputArray: [...arr],
        countArray: [...countArray],
        outputArray: [...output],
        activeIndex: i,
        currentPhase: "accumulating",
        message: `Accumulating count at index ${i}`,
        highlightIndices: [i - 1, i],
      });

      countArray[i] += countArray[i - 1];

      steps.push({
        inputArray: [...arr],
        countArray: [...countArray],
        outputArray: [...output],
        activeIndex: i,
        currentPhase: "accumulating",
        message: `Updated accumulated count at index ${i} to ${countArray[i]}`,
        highlightIndices: [i],
      });
    }

    for (let i = arr.length - 1; i >= 0; i--) {
      steps.push({
        inputArray: [...arr],
        countArray: [...countArray],
        outputArray: [...output],
        activeIndex: i,
        currentPhase: "placing",
        message: `Placing element ${arr[i]} in correct position`,
        highlightCount: arr[i],
        highlightIndices: [i],
      });

      output[countArray[arr[i]] - 1] = arr[i];
      countArray[arr[i]]--;

      steps.push({
        inputArray: [...arr],
        countArray: [...countArray],
        outputArray: [...output],
        activeIndex: countArray[arr[i]],
        currentPhase: "placing",
        message: `Placed ${arr[i]} at position ${countArray[arr[i]]}`,
        highlightIndices: [countArray[arr[i]]],
      });
    }

    steps.push({
      inputArray: [...arr],
      countArray: [...countArray],
      outputArray: [...output],
      activeIndex: -1,
      currentPhase: "complete",
      message: "Sorting complete!",
      highlightIndices: [],
    });
  };

  const getArrayBarClassName = (
    index: number,
    array: "input" | "count" | "output"
  ) => {
    if (!steps[currentStep]) return "array-bar";

    const { activeIndex, currentPhase, highlightIndices } = steps[currentStep];
    let className = "array-bar";

    if (array === "count") {
      className += " count-bar";
      if (index === steps[currentStep].highlightCount) {
        className += " highlight-count";
      }
    }

    if (highlightIndices.includes(index)) {
      className += " highlight";
    }

    if (index === activeIndex) {
      className += " active";
    }

    if (array === "output" && currentPhase === "complete") {
      className += " sorted";
    }

    return className;
  };

  return (
    <div className="sort-container">
      <h1>Counting Sort Visualization</h1>
      <div className="message-box">{steps[currentStep]?.message}</div>
      <div className="arrays-container">
        <div className="array-section">
          <h3>Input Array</h3>
          <div className="array-display">
            {steps[currentStep]?.inputArray.map((value, index) => (
              <div
                key={index}
                className={getArrayBarClassName(index, "input")}
                style={{ height: `${value * 30}px` }}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
        <div className="array-section">
          <h3>Count Array</h3>
          <div className="array-display">
            {steps[currentStep]?.countArray.map((value, index) => (
              <div
                key={index}
                className={getArrayBarClassName(index, "count")}
                style={{ height: `${value * 30}px` }}
              >
                {value}
              </div>
            ))}
          </div>
          <div className="index-labels">
            {steps[currentStep]?.countArray.map((_, index) => (
              <div key={index} className="index-label">
                {index}
              </div>
            ))}
          </div>
        </div>

        <div className="array-section">
          <h3>Output Array</h3>
          <div className="array-display">
            {steps[currentStep]?.outputArray.map((value, index) => (
              <div
                key={index}
                className={getArrayBarClassName(index, "output")}
                style={{ height: `${value * 30}px` }}
              >
                {value || ""}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="phase-indicator">
        Phase:{" "}
        {steps[currentStep]?.currentPhase.charAt(0).toUpperCase() +
          steps[currentStep]?.currentPhase.slice(1)}
      </div>

      <div className="speed-control">
        <label htmlFor="speed">Speed:</label>
        <input
          type="range"
          id="speed"
          name="speed"
          min="1"
          max="10"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
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
      <div className="step-info">
        Step: {currentStep + 1} / {steps.length}
      </div>
    </div>
  );
};

export default CountingSort;
