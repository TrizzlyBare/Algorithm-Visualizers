import React, { useState, useEffect } from "react";
import "./HeapVisualizer.css";

interface HeapStep {
  heap: number[];
  comparing: number[];
  swapping: number[];
  message: string;
}

const HeapVisualizer: React.FC = () => {
  const [heap, setHeap] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [steps, setSteps] = useState<HeapStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);

  const getParentIndex = (index: number) => Math.floor((index - 1) / 2);
  const getLeftChildIndex = (index: number) => 2 * index + 1;
  const getRightChildIndex = (index: number) => 2 * index + 2;

  const generateSteps = (currentHeap: number[], operation: 'insert' | 'remove', value?: number) => {
    const newSteps: HeapStep[] = [];
    const tempHeap = [...currentHeap];
    
    if (operation === 'insert') {
      tempHeap.push(value!);
      newSteps.push({
        heap: [...tempHeap],
        comparing: [],
        swapping: [],
        message: `Inserting ${value}`
      });

      let currentIndex = tempHeap.length - 1;
      while (currentIndex > 0) {
        const parentIndex = getParentIndex(currentIndex);
        
        newSteps.push({
          heap: [...tempHeap],
          comparing: [currentIndex, parentIndex],
          swapping: [],
          message: `Comparing ${tempHeap[currentIndex]} with parent ${tempHeap[parentIndex]}`
        });

        if (tempHeap[parentIndex] >= tempHeap[currentIndex]) break;

        newSteps.push({
          heap: [...tempHeap],
          comparing: [],
          swapping: [currentIndex, parentIndex],
          message: `Swapping ${tempHeap[currentIndex]} with ${tempHeap[parentIndex]}`
        });

        [tempHeap[currentIndex], tempHeap[parentIndex]] = 
        [tempHeap[parentIndex], tempHeap[currentIndex]];
        
        currentIndex = parentIndex;
      }
    } else if (operation === 'remove' && tempHeap.length > 0) {
      const removedValue = tempHeap[0];
      newSteps.push({
        heap: [...tempHeap],
        comparing: [],
        swapping: [0],
        message: `Removing maximum element: ${removedValue}`
      });

      tempHeap[0] = tempHeap[tempHeap.length - 1];
      tempHeap.pop();

      if (tempHeap.length > 0) {
        let currentIndex = 0;
        while (true) {
          let largestIndex = currentIndex;
          const leftChild = getLeftChildIndex(currentIndex);
          const rightChild = getRightChildIndex(currentIndex);

          newSteps.push({
            heap: [...tempHeap],
            comparing: [leftChild, rightChild].filter(i => i < tempHeap.length),
            swapping: [],
            message: "Comparing with children"
          });

          if (leftChild < tempHeap.length && tempHeap[leftChild] > tempHeap[largestIndex]) {
            largestIndex = leftChild;
          }

          if (rightChild < tempHeap.length && tempHeap[rightChild] > tempHeap[largestIndex]) {
            largestIndex = rightChild;
          }

          if (largestIndex === currentIndex) break;

          newSteps.push({
            heap: [...tempHeap],
            comparing: [],
            swapping: [currentIndex, largestIndex],
            message: `Swapping ${tempHeap[currentIndex]} with ${tempHeap[largestIndex]}`
          });

          [tempHeap[currentIndex], tempHeap[largestIndex]] = 
          [tempHeap[largestIndex], tempHeap[currentIndex]];
          
          currentIndex = largestIndex;
        }
      }
    }

    newSteps.push({
      heap: [...tempHeap],
      comparing: [],
      swapping: [],
      message: "Operation complete"
    });

    return { steps: newSteps, finalHeap: tempHeap };
  };

  const insertValue = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const { steps: newSteps, finalHeap } = generateSteps(heap, 'insert', value);
    setSteps(newSteps);
    setHeap(finalHeap);
    setCurrentStep(0);
    setIsPlaying(true);
    setInputValue("");
  };

  const removeMax = () => {
    if (heap.length === 0) return;

    const { steps: newSteps, finalHeap } = generateSteps(heap, 'remove');
    setSteps(newSteps);
    setHeap(finalHeap);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying && currentStep < steps.length - 1) {
      intervalId = setInterval(() => {
        setCurrentStep(prev => {
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
  }, [isPlaying, steps.length, speed, currentStep]);

  const getBarClassName = (index: number) => {
    if (!steps[currentStep]) return "array-bar";

    const { comparing, swapping } = steps[currentStep];
    let className = "array-bar";

    if (comparing.includes(index)) {
      className += " comparing";
    } else if (swapping.includes(index)) {
      className += " swapping";
    }

    return className;
  };

  return (
    <div className="sort-container">
      <h1>Heap Visualizer</h1>
      <div className="message-box">{steps[currentStep]?.message}</div>
      
      <div className="array-container">
        {steps[currentStep]?.heap.map((value, index) => (
          <div
            key={index}
            className={getBarClassName(index)}
            style={{ height: `${value * 10}px` }}
          >
            {value}
          </div>
        ))}
      </div>

      <div className="controls-container">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter number"
          className="number-input"
        />
        <button onClick={insertValue} className="control-button">
          Insert
        </button>
        <button onClick={removeMax} className="control-button">
          Remove Max
        </button>
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
          onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
          disabled={currentStep === steps.length - 1 || isPlaying}
          className="control-button"
        >
          Next
        </button>
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
    </div>
  );
};

export default HeapVisualizer;