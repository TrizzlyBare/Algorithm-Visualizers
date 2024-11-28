import React, { useState, useEffect } from 'react';
import '../../styles/TreeVisualizer.css';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface TreeStep {
  tree: TreeNode;
  highlighting: number[];
  message: string;
}

const calculateNodePosition = (level: number, position: number, totalLevels: number): { x: number; y: number } => {
  const levelWidth = Math.pow(2, level);
  const spacing = 800 / (levelWidth + 1);
  const verticalSpacing = 400 / (totalLevels + 1);
  return {
    x: spacing * (position + 1),
    y: verticalSpacing * (level + 1)
  };
};

const TreeVisualizer: React.FC = () => {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [steps, setSteps] = useState<TreeStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);

  const generateSteps = (value: number) => {
    const newSteps: TreeStep[] = [];
    let newTree: TreeNode = tree ? { ...tree } : { value, left: null, right: null };

    if (!tree) {
      newSteps.push({
        tree: newTree,
        highlighting: [0],
        message: `Creating root node with value ${value}`
      });
    } else {
      let current = newTree;
      const path: number[] = [0];
      let level = 0;

      newSteps.push({
        tree: { ...newTree },
        highlighting: [...path],
        message: `Starting at root node ${current.value}`
      });

      while (true) {
        if (value < current.value) {
          if (!current.left) {
            current.left = { value, left: null, right: null };
            newSteps.push({
              tree: { ...newTree },
              highlighting: [...path, 2 * path[path.length - 1] + 1],
              message: `Inserting ${value} as left child of ${current.value}`
            });
            break;
          }
          current = current.left;
          path.push(2 * path[path.length - 1] + 1);
        } else {
          if (!current.right) {
            current.right = { value, left: null, right: null };
            newSteps.push({
              tree: { ...newTree },
              highlighting: [...path, 2 * path[path.length - 1] + 2],
              message: `Inserting ${value} as right child of ${current.value}`
            });
            break;
          }
          current = current.right;
          path.push(2 * path[path.length - 1] + 2);
        }
        level++;
        newSteps.push({
          tree: { ...newTree },
          highlighting: [...path],
          message: `Comparing with ${current.value}`
        });
      }
    }

    return { steps: newSteps, finalTree: newTree };
  };

  const insertValue = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const { steps: newSteps, finalTree } = generateSteps(value);
    setSteps(newSteps);
    setTree(finalTree);
    setCurrentStep(0);
    setIsPlaying(true);
    setInputValue("");
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

  const renderTree = (node: TreeNode | null, level: number, position: number, totalLevels: number, path: number[] = []): JSX.Element[] => {
    if (!node) return [];

    const { x, y } = calculateNodePosition(level, position, totalLevels);
    const elements: JSX.Element[] = [];
    const currentPath = [...path, position];
    const isHighlighted = steps[currentStep]?.highlighting.includes(position);

    if (node.left) {
      const childPos = calculateNodePosition(level + 1, position * 2, totalLevels);
      const angle = Math.atan2(childPos.y - y, childPos.x - x);
      const length = Math.sqrt(Math.pow(childPos.x - x, 2) + Math.pow(childPos.y - y, 2));
      
      elements.push(
        <div
          key={`edge-${level}-${position}-left`}
          className="tree-edge"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            width: `${length}px`,
            transform: `rotate(${angle}rad)`
          }}
        />
      );
    }

    if (node.right) {
      const childPos = calculateNodePosition(level + 1, position * 2 + 1, totalLevels);
      const angle = Math.atan2(childPos.y - y, childPos.x - x);
      const length = Math.sqrt(Math.pow(childPos.x - x, 2) + Math.pow(childPos.y - y, 2));
      
      elements.push(
        <div
          key={`edge-${level}-${position}-right`}
          className="tree-edge"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            width: `${length}px`,
            transform: `rotate(${angle}rad)`
          }}
        />
      );
    }

    elements.push(
      <div
        key={`node-${level}-${position}`}
        className={`tree-node ${isHighlighted ? 'highlighting' : ''}`}
        style={{
          left: `${x - 20}px`,
          top: `${y - 20}px`
        }}
      >
        {node.value}
      </div>
    );

    if (node.left) {
      elements.push(...renderTree(node.left, level + 1, position * 2, totalLevels, currentPath));
    }
    if (node.right) {
      elements.push(...renderTree(node.right, level + 1, position * 2 + 1, totalLevels, currentPath));
    }

    return elements;
  };

  const getTreeHeight = (node: TreeNode | null): number => {
    if (!node) return 0;
    return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
  };

  return (
    <div className="tree-visualizer">
      <h1>Binary Tree Visualizer</h1>
      <div className="message-box">{steps[currentStep]?.message}</div>

      <div className="visualization-container">
        <div className="tree-container">
          {steps[currentStep]?.tree && 
            renderTree(steps[currentStep].tree, 0, 0, getTreeHeight(steps[currentStep].tree))}
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

export default TreeVisualizer;