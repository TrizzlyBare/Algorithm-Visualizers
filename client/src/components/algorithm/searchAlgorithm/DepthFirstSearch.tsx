import React, { useState, useCallback, useEffect } from 'react';

interface Cell {
  row: number;
  col: number;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  isStart: boolean;
  isEnd: boolean;
}

const DFSVisualizer = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [startNode, setStartNode] = useState<[number, number] | null>(null);
  const [endNode, setEndNode] = useState<[number, number] | null>(null);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [selectedTool, setSelectedTool] = useState<'wall' | 'start' | 'end'>('wall');
  const [status, setStatus] = useState<string>('');
  const [isMousePressed, setIsMousePressed] = useState(false);

  const GRID_ROWS = 10;
  const GRID_COLS = 15;
  const ANIMATION_SPEED_MS = 100;

  // Initialize grid
  const initializeGrid = useCallback(() => {
    const newGrid: Cell[][] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow: Cell[] = [];
      for (let col = 0; col < GRID_COLS; col++) {
        currentRow.push({
          row,
          col,
          isWall: false,
          isVisited: false,
          isPath: false,
          isStart: false,
          isEnd: false
        });
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
    setStartNode(null);
    setEndNode(null);
    setStatus('');
  }, []);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const handleCellClick = (row: number, col: number) => {
    if (isVisualizing) return;

    const newGrid = [...grid];
    
    if (selectedTool === 'start') {
      // Remove old start node if exists
      if (startNode) {
        newGrid[startNode[0]][startNode[1]].isStart = false;
      }
      newGrid[row][col] = {
        ...newGrid[row][col],
        isStart: true,
        isWall: false,
        isEnd: false
      };
      setStartNode([row, col]);
    } else if (selectedTool === 'end') {
      // Remove old end node if exists
      if (endNode) {
        newGrid[endNode[0]][endNode[1]].isEnd = false;
      }
      newGrid[row][col] = {
        ...newGrid[row][col],
        isEnd: true,
        isWall: false,
        isStart: false
      };
      setEndNode([row, col]);
    } else {
      // Toggle wall
      if (!newGrid[row][col].isStart && !newGrid[row][col].isEnd) {
        newGrid[row][col] = {
          ...newGrid[row][col],
          isWall: !newGrid[row][col].isWall
        };
      }
    }
    
    setGrid(newGrid);
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsMousePressed(true);
    handleCellClick(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isMousePressed && selectedTool === 'wall') {
      handleCellClick(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const dfs = async (
    row: number,
    col: number,
    visited: Set<string>,
    path: [number, number][],
    endRow: number,
    endCol: number
  ): Promise<boolean> => {
    if (
      row < 0 || row >= GRID_ROWS ||
      col < 0 || col >= GRID_COLS ||
      grid[row][col].isWall ||
      visited.has(`${row},${col}`)
    ) {
      return false;
    }

    visited.add(`${row},${col}`);
    path.push([row, col]);

    // Update visualization
    if (!grid[row][col].isStart && !grid[row][col].isEnd) {
      setGrid(prev => {
        const newGrid = [...prev];
        newGrid[row][col] = {
          ...newGrid[row][col],
          isVisited: true
        };
        return newGrid;
      });
      await sleep(ANIMATION_SPEED_MS);
    }

    if (row === endRow && col === endCol) {
      return true;
    }

    const directions = [
      [0, 1],  // right
      [1, 0],  // down
      [0, -1], // left
      [-1, 0]  // up
    ];

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      
      if (await dfs(newRow, newCol, visited, path, endRow, endCol)) {
        return true;
      }
    }

    path.pop();
    return false;
  };

  const visualizeDFS = async () => {
    if (!startNode || !endNode) {
      setStatus('Please set both start and end points');
      return;
    }

    setIsVisualizing(true);
    setStatus('Searching...');

    // Reset previous visualization
    const newGrid = grid.map(row =>
      row.map(cell => ({
        ...cell,
        isVisited: false,
        isPath: false
      }))
    );
    setGrid(newGrid);

    const visited = new Set<string>();
    const path: [number, number][] = [];

    const found = await dfs(
      startNode[0],
      startNode[1],
      visited,
      path,
      endNode[0],
      endNode[1]
    );

    if (found) {
      // Visualize the path
      for (const [row, col] of path) {
        if (!grid[row][col].isStart && !grid[row][col].isEnd) {
          setGrid(prev => {
            const newGrid = [...prev];
            newGrid[row][col] = {
              ...newGrid[row][col],
              isPath: true
            };
            return newGrid;
          });
          await sleep(ANIMATION_SPEED_MS / 2);
        }
      }
      setStatus('Path found!');
    } else {
      setStatus('No path found!');
    }

    setIsVisualizing(false);
  };

  return (
    <div className="container">
      <h1>DFS Path Finder</h1>
      
      <div className="select-group">
        <select 
          className="select"
          value={selectedTool}
          onChange={(e) => setSelectedTool(e.target.value as 'wall' | 'start' | 'end')}
          disabled={isVisualizing}
        >
          <option value="wall">Wall Tool</option>
          <option value="start">Start Point</option>
          <option value="end">End Point</option>
        </select>
      </div>

      <div className="button-group">
        <button
          className={`button start-button ${isVisualizing ? 'disabled' : ''}`}
          onClick={visualizeDFS}
          disabled={isVisualizing}
        >
          Visualize DFS
        </button>
        <button
          className="button generate-button"
          onClick={initializeGrid}
          disabled={isVisualizing}
        >
          Reset Grid
        </button>
      </div>

      <div className={`status-${status.includes('found') ? 'success' : status === 'Searching...' ? 'searching' : 'error'}`}>
        {status}
      </div>

      <div 
        className="grid-container"
        onMouseLeave={() => setIsMousePressed(false)}
        onMouseUp={handleMouseUp}
      >
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="grid-row">
            {row.map((cell, colIdx) => (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={`grid-cell ${
                  cell.isWall ? 'wall-cell' : ''
                } ${
                  cell.isVisited && !cell.isPath ? 'visited-cell' : ''
                } ${
                  cell.isPath ? 'path-cell' : ''
                } ${
                  cell.isStart ? 'start-cell' : ''
                } ${
                  cell.isEnd ? 'end-cell' : ''
                } ${
                  cell.isVisited ? 'cell-visiting' : ''
                }`}
                onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                onMouseUp={handleMouseUp}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color start-cell"></div>
          <span>Start Point</span>
        </div>
        <div className="legend-item">
          <div className="legend-color end-cell"></div>
          <span>End Point</span>
        </div>
        <div className="legend-item">
          <div className="legend-color wall-cell"></div>
          <span>Wall</span>
        </div>
        <div className="legend-item">
          <div className="legend-color visited-cell"></div>
          <span>Visited</span>
        </div>
        <div className="legend-item">
          <div className="legend-color path-cell"></div>
          <span>Path</span>
        </div>
      </div>
    </div>
  );
};

export default DFSVisualizer;