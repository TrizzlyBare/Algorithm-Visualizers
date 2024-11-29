// HeapVisualizer.tsx
import React, { useState, useEffect } from "react";
import "../../styles/HeapVisualizer.css";

interface HeapStep {
  heap: number[];
  comparing: number[];
  swapping: number[];
  message: string;
}

const calculateLevelWidth = (level: number): number => Math.pow(2, level);

const calculateNodePosition = (level: number, position: number, totalLevels: number): { x: number, y: number } => {
  const levelWidth = calculateLevelWidth(level);
  const spacing = 800 / (levelWidth + 1);
  const verticalSpacing = 400 / (totalLevels + 1);
  return {
    x: spacing * (position + 1),
    y: verticalSpacing * (level + 1)
  };
};

const HeapVisualizer: React.FC = () => {
  const [heap, setHeap] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [steps, setSteps] = useState<HeapStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);
  const [isMaxHeap, setIsMaxHeap] = useState(true);

  const getParentIndex = (index: number) => Math.floor((index - 1) / 2);
  const getLeftChildIndex = (index: number) => 2 * index + 1;
  const getRightChildIndex = (index: number) => 2 * index + 2;

  const compareNodes = (a: number, b: number) => {
    return isMaxHeap ? a >= b : a <= b;
  };

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

        if (compareNodes(tempHeap[parentIndex], tempHeap[currentIndex])) break;

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
        message: `Removing ${isMaxHeap ? 'maximum' : 'minimum'} element: ${removedValue}`
      });

      tempHeap[0] = tempHeap[tempHeap.length - 1];
      tempHeap.pop();

      if (tempHeap.length > 0) {
        let currentIndex = 0;
        while (true) {
          let targetIndex = currentIndex;
          const leftChild = getLeftChildIndex(currentIndex);
          const rightChild = getRightChildIndex(currentIndex);

          newSteps.push({
            heap: [...tempHeap],
            comparing: [leftChild, rightChild].filter(i => i < tempHeap.length),
            swapping: [],
            message: "Comparing with children"
          });

          if (leftChild < tempHeap.length && !compareNodes(tempHeap[targetIndex], tempHeap[leftChild])) {
            targetIndex = leftChild;
          }

          if (rightChild < tempHeap.length && !compareNodes(tempHeap[targetIndex], tempHeap[rightChild])) {
            targetIndex = rightChild;
          }

          if (targetIndex === currentIndex) break;

          newSteps.push({
            heap: [...tempHeap],
            comparing: [],
            swapping: [currentIndex, targetIndex],
            message: `Swapping ${tempHeap[currentIndex]} with ${tempHeap[targetIndex]}`
          });

          [tempHeap[currentIndex], tempHeap[targetIndex]] = 
          [tempHeap[targetIndex], tempHeap[currentIndex]];
          
          currentIndex = targetIndex;
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

  const getNodeClassName = (index: number) => {
    if (!steps[currentStep]) return "heap-node";

    const { comparing, swapping } = steps[currentStep];
    let className = "heap-node";

    if (comparing.includes(index)) {
      className += " comparing";
    } else if (swapping.includes(index)) {
      className += " swapping";
    }

    return className;
  };

  const renderHeapTree = () => {
    if (!steps[currentStep]?.heap.length) return null;

    const heap = steps[currentStep].heap;
    const edges: JSX.Element[] = [];
    const nodes: JSX.Element[][] = [];
    const totalLevels = Math.floor(Math.log2(heap.length)) + 1;

    for (let level = 0; level < totalLevels; level++) {
      const levelNodes: JSX.Element[] = [];
      const startIndex = Math.pow(2, level) - 1;
      const endIndex = Math.min(Math.pow(2, level + 1) - 1, heap.length);

      for (let i = startIndex; i < endIndex; i++) {
        const position = i - startIndex;
        const { x, y } = calculateNodePosition(level, position, totalLevels);
        
        const leftChild = 2 * i + 1;
        const rightChild = 2 * i + 2;

        if (leftChild < heap.length) {
          const childPos = calculateNodePosition(level + 1, leftChild - (Math.pow(2, level + 1) - 1), totalLevels);
          const angle = Math.atan2(childPos.y - y, childPos.x - x);
          const length = Math.sqrt(Math.pow(childPos.x - x, 2) + Math.pow(childPos.y - y, 2));
          
          edges.push(
            <div
              key={`edge-${i}-${leftChild}`}
              className="heap-edge"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${length}px`,
                transform: `rotate(${angle}rad)`
              }}
            />
          );
        }

        if (rightChild < heap.length) {
          const childPos = calculateNodePosition(level + 1, rightChild - (Math.pow(2, level + 1) - 1), totalLevels);
          const angle = Math.atan2(childPos.y - y, childPos.x - x);
          const length = Math.sqrt(Math.pow(childPos.x - x, 2) + Math.pow(childPos.y - y, 2));
          
          edges.push(
            <div
              key={`edge-${i}-${rightChild}`}
              className="heap-edge"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${length}px`,
                transform: `rotate(${angle}rad)`
              }}
            />
          );
        }

        levelNodes.push(
          <div
            key={i}
            className={getNodeClassName(i)}
            style={{
              left: `${x - 20}px`,
              top: `${y - 20}px`,
              position: 'absolute'
            }}
          >
            {heap[i]}
          </div>
        );
      }
      nodes.push(levelNodes);
    }

    return (
      <div className="heap-container">
        {edges}
        {nodes.flat()}
      </div>
    );
  };

  return (
    <div className="sort-container">
      <h1>{isMaxHeap ? 'Max' : 'Min'} Heap Visualizer</h1>
      <div className="message-box">{steps[currentStep]?.message}</div>
      
      <div className="heap-type-control">
        <label>Heap Type: </label>
        <select
          value={isMaxHeap ? 'max' : 'min'}
          onChange={(e) => {
            setIsMaxHeap(e.target.value === 'max');
            setHeap([]);
            setSteps([]);
            setCurrentStep(0);
          }}
          className="heap-type-select"
        >
          <option value="max">Max Heap</option>
          <option value="min">Min Heap</option>
        </select>
      </div>

      <div className="visualizations-container">
        <div>
          <div className="visualization-title">Tree View</div>
          {renderHeapTree()}
        </div>
        <div>
          <div className="visualization-title">Array View</div>
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
        </div>
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
          Remove {isMaxHeap ? 'Max' : 'Min'}
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