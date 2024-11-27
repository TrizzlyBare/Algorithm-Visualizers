import React, { useState, useEffect } from "react";
import "../../../styles/PigeonholeSort.css";

interface SortStep {
  array: number[];
  pigeonholes: number[][];
  activeIndices: number[];
  message: string;
  phase: "initializing" | "distributing" | "collecting" | "complete";
}

const PigeonholeSort: React.FC = () => {
  const [array, setArray] = useState<number[]>([
    8, 3, 2, 7, 4, 6, 8, 1, 5, 9, 3, 0, 9, 5, 7, 2,
  ]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 10)
    );
    setArray(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    const newSteps: SortStep[] = [];
    const arr = [...array];
    generatePigeonholeSortSteps(arr, newSteps);
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

  const generatePigeonholeSortSteps = (arr: number[], steps: SortStep[]) => {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min + 1;
    const pigeonholes: number[][] = Array.from({ length: range }, () => []);

    steps.push({
      array: [...arr],
      pigeonholes: [...pigeonholes],
      activeIndices: [],
      message: `Initializing pigeonholes with range ${min} to ${max}`,
      phase: "initializing",
    });

    // Distributing elements into pigeonholes
    for (let i = 0; i < arr.length; i++) {
      const hole = arr[i] - min;
      pigeonholes[hole].push(arr[i]);

      steps.push({
        array: [...arr],
        pigeonholes: pigeonholes.map((hole) => [...hole]),
        activeIndices: [i],
        message: `Placing ${arr[i]} into pigeonhole ${hole}`,
        phase: "distributing",
      });
    }

    // Collecting elements from pigeonholes
    let index = 0;
    for (let i = 0; i < range; i++) {
      while (pigeonholes[i].length > 0) {
        arr[index] = pigeonholes[i].shift()!;

        steps.push({
          array: [...arr],
          pigeonholes: pigeonholes.map((hole) => [...hole]),
          activeIndices: [index],
          message: `Collecting ${arr[index]} from pigeonhole ${i}`,
          phase: "collecting",
        });

        index++;
      }
    }

    steps.push({
      array: [...arr],
      pigeonholes: [...pigeonholes],
      activeIndices: [],
      message: "Pigeonhole Sort complete!",
      phase: "complete",
    });
  };

  const getBarClassName = (index: number) => {
    if (!steps[currentStep]) return "array-bar";

    const { activeIndices, phase } = steps[currentStep];
    let className = "array-bar";

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
      <h1>Pigeonhole Sort Visualization</h1>
      <div className="message-box">{steps[currentStep]?.message}</div>

      <div className="visualization-section">
        <div className="array-display">
          {steps[currentStep]?.array.map((value, index) => (
            <div
              key={index}
              className={getBarClassName(index)}
              style={{ height: `${value * 20 + 20}px` }}
            >
              {value}
            </div>
          ))}
        </div>

        <div className="pigeonholes-display">
          {steps[currentStep]?.pigeonholes.map((hole, index) => (
            <div key={index} className="pigeonhole">
              <div className="pigeonhole-label">{index}</div>
              {hole.map((value, valueIndex) => (
                <div key={valueIndex} className="pigeonhole-item">
                  {value}
                </div>
              ))}
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

export default PigeonholeSort;
