import React, { useState, useEffect } from "react";
import "./BubbleSort.css";

const BubbleSort: React.FC = () => {
  const [array, setArray] = useState<number[]>([5, 3, 8, 4, 2]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [comparingIndex, setComparingIndex] = useState<number>(-1);
  const [sorted, setSorted] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const resetArray = () => {
    const newArray = Array.from(
      { length: 8 },
      () => Math.floor(Math.random() * 15) + 1
    );
    setArray(newArray);
    setCurrentIndex(-1);
    setComparingIndex(-1);
    setSorted(false);
    setIsRunning(false);
  };

  const bubbleSortStep = () => {
    if (currentIndex >= array.length - 1) {
      setCurrentIndex(0);
      return;
    }

    let newArray = [...array];
    if (newArray[currentIndex] > newArray[currentIndex + 1]) {
      // Swap elements
      [newArray[currentIndex], newArray[currentIndex + 1]] = [
        newArray[currentIndex + 1],
        newArray[currentIndex],
      ];
    }

    setArray(newArray);
    setCurrentIndex((prev) => prev + 1);
    setComparingIndex(currentIndex + 1);

    // Check if array is sorted
    const isSorted = newArray.every(
      (num, index) => index === 0 || newArray[index - 1] <= num
    );

    if (isSorted) {
      setSorted(true);
      setIsRunning(false);
      setCurrentIndex(-1);
      setComparingIndex(-1);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && !sorted) {
      intervalId = setInterval(bubbleSortStep, 500);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, currentIndex, array, sorted]);

  const getBarClassName = (index: number) => {
    let className = "array-bar";
    if (sorted) {
      className += " sorted";
    } else if (index === currentIndex || index === comparingIndex) {
      className += " comparing";
    }
    return className;
  };

  return (
    <div className="bubble-sort-container">
      <h1>Bubble Sort Visualization</h1>
      <div className="array-container">
        {array.map((num, index) => (
          <div
            key={index}
            className={getBarClassName(index)}
            style={{ height: `${num * 20}px` }}
          >
            {num}
          </div>
        ))}
      </div>
      <div className="controls-container">
        <button
          onClick={() => setIsRunning(true)}
          disabled={isRunning || sorted}
          className="control-button"
        >
          Start Sort
        </button>
        <button
          onClick={() => setIsRunning(false)}
          disabled={!isRunning}
          className="control-button"
        >
          Pause
        </button>
        <button onClick={resetArray} className="control-button">
          Reset
        </button>
      </div>
    </div>
  );
};

export default BubbleSort;
