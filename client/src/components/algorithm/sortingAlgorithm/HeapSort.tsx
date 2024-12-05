import React, { useState, useEffect } from "react";

// Calculate node positions for a perfect binary tree
const calculateNodePosition = (
  level: number,
  position: number,
  totalLevels: number
) => {
  const verticalSpacing = 80;
  const width = Math.pow(2, totalLevels) * 60;
  const horizontalSpacing = width / Math.pow(2, level);
  const x = horizontalSpacing * (position + 0.5);
  const y = level * verticalSpacing + 50;
  return { x, y };
};

interface SortStep {
  array: number[];
  heapRoot: number;
  comparing: number[];
  swapping: number[];
  sorted: number[];
  phase: "buildHeap" | "extractMax";
  message: string;
}

const HeapSort: React.FC = () => {
  const [array, setArray] = useState<number[]>([4, 10, 3, 5, 1, 8, 7, 9, 2, 6]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);

  const generateRandomArray = () => {
    const newArray = Array.from(
      { length: 10 },
      () => Math.floor(Math.random() * 20) + 1
    );
    setArray(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Rest of the sorting logic remains the same...
  useEffect(() => {
    const newSteps: SortStep[] = [];
    const arr = [...array];
    generateHeapSortSteps(arr, newSteps);
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

  const generateHeapSortSteps = (arr: number[], steps: SortStep[]) => {
    const n = arr.length;

    steps.push({
      array: [...arr],
      heapRoot: -1,
      comparing: [],
      swapping: [],
      sorted: [],
      phase: "buildHeap",
      message: "Starting heap construction",
    });

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i, steps, []);
    }

    const sorted: number[] = [];
    for (let i = n - 1; i > 0; i--) {
      steps.push({
        array: [...arr],
        heapRoot: 0,
        comparing: [],
        swapping: [0, i],
        sorted: [...sorted],
        phase: "extractMax",
        message: `Extracting maximum element ${arr[0]}`,
      });

      [arr[0], arr[i]] = [arr[i], arr[0]];
      sorted.unshift(i);

      steps.push({
        array: [...arr],
        heapRoot: 0,
        comparing: [],
        swapping: [],
        sorted: [...sorted],
        phase: "extractMax",
        message: "Heapifying remaining elements",
      });

      heapify(arr, i, 0, steps, sorted);
    }

    sorted.unshift(0);
    steps.push({
      array: [...arr],
      heapRoot: -1,
      comparing: [],
      swapping: [],
      sorted: sorted,
      phase: "extractMax",
      message: "Heap sort complete!",
    });
  };

  const heapify = (
    arr: number[],
    n: number,
    i: number,
    steps: SortStep[],
    sorted: number[]
  ) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    steps.push({
      array: [...arr],
      heapRoot: i,
      comparing: [left, right].filter((x) => x < n),
      swapping: [],
      sorted: [...sorted],
      phase: "buildHeap",
      message: `Comparing root ${arr[i]} with its children`,
    });

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      steps.push({
        array: [...arr],
        heapRoot: i,
        comparing: [],
        swapping: [i, largest],
        sorted: [...sorted],
        phase: "buildHeap",
        message: `Swapping ${arr[i]} with ${arr[largest]}`,
      });

      [arr[i], arr[largest]] = [arr[largest], arr[i]];

      steps.push({
        array: [...arr],
        heapRoot: largest,
        comparing: [],
        swapping: [],
        sorted: [...sorted],
        phase: "buildHeap",
        message: "Continuing heapification",
      });

      heapify(arr, n, largest, steps, sorted);
    }
  };

  // Tree visualization component
  const TreeNode: React.FC<{
    value: number;
    index: number;
    level: number;
    position: number;
    totalLevels: number;
    className: string;
  }> = ({ value, index, level, position, totalLevels, className }) => {
    const { x, y } = calculateNodePosition(level, position, totalLevels);
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    const currentArray = steps[currentStep]?.array || [];

    return (
      <g>
        {/* Draw lines to children */}
        {left < currentArray.length && (
          <line
            x1={x}
            y1={y}
            x2={calculateNodePosition(level + 1, position * 2, totalLevels).x}
            y2={calculateNodePosition(level + 1, position * 2, totalLevels).y}
            stroke="#666"
            strokeWidth="2"
          />
        )}
        {right < currentArray.length && (
          <line
            x1={x}
            y1={y}
            x2={
              calculateNodePosition(level + 1, position * 2 + 1, totalLevels).x
            }
            y2={
              calculateNodePosition(level + 1, position * 2 + 1, totalLevels).y
            }
            stroke="#666"
            strokeWidth="2"
          />
        )}
        {/* Draw node */}
        <circle
          cx={x}
          cy={y}
          r="20"
          className={className}
          fill={
            className.includes("sorted")
              ? "#4CAF50"
              : className.includes("heap-root")
              ? "#FFC107"
              : className.includes("comparing")
              ? "#2196F3"
              : className.includes("swapping")
              ? "#FF5722"
              : "#ddd"
          }
          stroke="#333"
          strokeWidth="2"
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dy=".3em"
          fill="#000"
          fontSize="14px"
        >
          {value}
        </text>
      </g>
    );
  };

  const getNodeClassName = (index: number) => {
    if (!steps[currentStep]) return "";
    const { heapRoot, comparing, swapping, sorted } = steps[currentStep];
    if (sorted.includes(index)) return "sorted";
    if (index === heapRoot) return "heap-root";
    if (comparing.includes(index)) return "comparing";
    if (swapping.includes(index)) return "swapping";
    return "";
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Heap Sort Tree Visualization</h1>
      <div className="bg-gray-100 p-4 mb-4 rounded">
        {steps[currentStep]?.message}
      </div>

      <div className="relative w-full" style={{ height: "400px" }}>
        <svg width="100%" height="100%" viewBox="0 0 800 400">
          {steps[currentStep]?.array.map((value, index) => {
            const level = Math.floor(Math.log2(index + 1));
            const position = index - Math.pow(2, level) + 1;
            const totalLevels = Math.floor(Math.log2(array.length)) + 1;
            return (
              <TreeNode
                key={index}
                value={value}
                index={index}
                level={level}
                position={position}
                totalLevels={totalLevels}
                className={getNodeClassName(index)}
              />
            );
          })}
        </svg>
      </div>

      <div className="mb-4">
        Phase:{" "}
        {steps[currentStep]?.phase === "buildHeap"
          ? "Building Max Heap"
          : "Extracting Maximum"}
      </div>

      <div className="mb-4">
        <label className="mr-2">Speed:</label>
        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="border p-1 rounded"
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={200}>Fast</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0 || isPlaying}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={() =>
            setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))
          }
          disabled={currentStep === steps.length - 1 || isPlaying}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
        <button
          onClick={() => {
            setCurrentStep(0);
            setIsPlaying(false);
          }}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Reset
        </button>
        <button
          onClick={generateRandomArray}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          New Array
        </button>
      </div>

      <div className="mt-4">
        Step: {currentStep + 1} / {steps.length}
      </div>
    </div>
  );
};

export default HeapSort;
