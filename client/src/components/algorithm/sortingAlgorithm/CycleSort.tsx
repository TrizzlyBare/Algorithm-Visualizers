import React, { useState, useEffect } from "react";
import "../../../styles/CycleSort.css";

interface SortStep {
  array: number[];
  currentItem: number;
  currentIndex: number;
  cycleStart: number;
  comparing: number;
  writes: number;
  message: string;
  sorted: number[];
}

const CycleSort: React.FC = () => {
  const [array, setArray] = useState<number[]>([5, 4, 3, 2, 1]);
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
    generateCycleSortSteps(arr, newSteps);
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

  const generateCycleSortSteps = (arr: number[], steps: SortStep[]) => {
    const n = arr.length;
    let writes = 0;
    const sorted: number[] = [];

    steps.push({
      array: [...arr],
      currentItem: -1,
      currentIndex: -1,
      cycleStart: -1,
      comparing: -1,
      writes,
      message: "Starting Cycle Sort",
      sorted: [],
    });

    for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
      let item = arr[cycleStart];
      let pos = cycleStart;

      steps.push({
        array: [...arr],
        currentItem: item,
        currentIndex: cycleStart,
        cycleStart,
        comparing: -1,
        writes,
        message: `Starting new cycle with item ${item}`,
        sorted: [...sorted],
      });

      for (let i = cycleStart + 1; i < n; i++) {
        steps.push({
          array: [...arr],
          currentItem: item,
          currentIndex: cycleStart,
          cycleStart,
          comparing: i,
          writes,
          message: `Comparing ${item} with ${arr[i]}`,
          sorted: [...sorted],
        });

        if (arr[i] < item) {
          pos++;
        }
      }

      if (pos === cycleStart) {
        sorted.push(cycleStart);
        steps.push({
          array: [...arr],
          currentItem: item,
          currentIndex: cycleStart,
          cycleStart,
          comparing: -1,
          writes,
          message: `${item} is already in correct position`,
          sorted: [...sorted],
        });
        continue;
      }

      while (item === arr[pos]) {
        pos += 1;
      }

      steps.push({
        array: [...arr],
        currentItem: item,
        currentIndex: cycleStart,
        cycleStart,
        comparing: pos,
        writes,
        message: `Swapping ${item} with ${arr[pos]}`,
        sorted: [...sorted],
      });

      if (pos !== cycleStart) {
        const temp = item;
        item = arr[pos];
        arr[pos] = temp;
        writes++;

        steps.push({
          array: [...arr],
          currentItem: item,
          currentIndex: pos,
          cycleStart,
          comparing: -1,
          writes,
          message: `Placed ${arr[pos]} in its correct position`,
          sorted: [...sorted.concat(pos)],
        });

        while (pos !== cycleStart) {
          pos = cycleStart;

          for (let i = cycleStart + 1; i < n; i++) {
            steps.push({
              array: [...arr],
              currentItem: item,
              currentIndex: pos,
              cycleStart,
              comparing: i,
              writes,
              message: `Finding position for ${item}`,
              sorted: [...sorted],
            });

            if (arr[i] < item) {
              pos += 1;
            }
          }

          while (item === arr[pos]) {
            pos += 1;
          }

          steps.push({
            array: [...arr],
            currentItem: item,
            currentIndex: cycleStart,
            cycleStart,
            comparing: pos,
            writes,
            message: `Swapping ${item} with ${arr[pos]}`,
            sorted: [...sorted],
          });

          if (item !== arr[pos]) {
            const temp = item;
            item = arr[pos];
            arr[pos] = temp;
            writes++;

            steps.push({
              array: [...arr],
              currentItem: item,
              currentIndex: pos,
              cycleStart,
              comparing: -1,
              writes,
              message: `Placed ${arr[pos]} in its correct position`,
              sorted: [...sorted.concat(pos)],
            });
          }
        }
      }
    }

    sorted.push(n - 1);
    steps.push({
      array: [...arr],
      currentItem: -1,
      currentIndex: -1,
      cycleStart: -1,
      comparing: -1,
      writes,
      message: `Sort complete with ${writes} memory writes`,
      sorted: [...sorted],
    });
  };

  const getBarClassName = (index: number) => {
    if (!steps[currentStep]) return "array-bar";

    const { currentIndex, comparing, cycleStart, sorted } = steps[currentStep];
    let className = "array-bar";

    if (sorted.includes(index)) {
      className += " sorted";
    } else if (index === currentIndex) {
      className += " current";
    } else if (index === comparing) {
      className += " comparing";
    } else if (index === cycleStart) {
      className += " cycle-start";
    }

    return className;
  };

  return (
    <div className="sort-container">
      <h1>Cycle Sort Visualization</h1>
      <div className="info-container">
        <div className="writes-counter">
          Memory Writes: {steps[currentStep]?.writes || 0}
        </div>
        <div className="message-box">{steps[currentStep]?.message}</div>
      </div>
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
      <div className="step-info">
        Step: {currentStep + 1} / {steps.length}
      </div>
    </div>
  );
};

export default CycleSort;
