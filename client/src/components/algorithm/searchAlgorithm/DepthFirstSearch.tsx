import { useState, useEffect, ChangeEvent } from 'react';
import { GraphRepresentation } from './GraphRepresentation.tsx';
import { Node, Grid, Position, RepresentationType } from './types.tsx';
import '../../../styles/DepthFirstSearchVisualizer.css';

const DepthFirstSearchVisualizer = () => {
  const [grid, setGrid] = useState<Grid>([]);
  const [visitedNodes, setVisitedNodes] = useState<Position[]>([]);
  const [currentNode, setCurrentNode] = useState<Position | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [pathFound, setPathFound] = useState<boolean>(false);
  const [startNode] = useState<Position>({ row: 0, col: 0 });
  const [endNode] = useState<Position>({ row: 9, col: 9 });
  const [representation, setRepresentation] = useState<RepresentationType>('visual');

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid: Grid = [];
    for (let row = 0; row < 10; row++) {
      const currentRow: Node[] = [];
      for (let col = 0; col < 10; col++) {
        currentRow.push({
          row,
          col,
          isWall: false,
          isVisited: false,
          isPath: false
        });
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
  };

  const resetSearch = () => {
    setVisitedNodes([]);
    setCurrentNode(null);
    setIsSearching(false);
    setIsComplete(false);
    setPathFound(false);
    const newGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isVisited: false,
        isPath: false
      }))
    );
    setGrid(newGrid);
  };

  const generateNewMaze = () => {
    resetSearch();
    const newGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isWall: Math.random() < 0.3
      }))
    );
    newGrid[startNode.row][startNode.col].isWall = false;
    newGrid[endNode.row][endNode.col].isWall = false;
    setGrid(newGrid);
  };

  const dfs = async (
    row: number,
    col: number,
    visited: Set<string> = new Set(),
    path: Position[] = []
  ): Promise<boolean> => {
    if (
      row < 0 ||
      row >= grid.length ||
      col < 0 ||
      col >= grid[0].length ||
      grid[row][col].isWall ||
      visited.has(`${row},${col}`)
    ) {
      return false;
    }

    setCurrentNode({ row, col });
    visited.add(`${row},${col}`);
    setVisitedNodes(prev => [...prev, { row, col }]);
    path.push({ row, col });

    // Update grid to show visited nodes
    const newGrid = [...grid];
    newGrid[row][col].isVisited = true;
    setGrid(newGrid);

    await new Promise(resolve => setTimeout(resolve, 100));

    if (row === endNode.row && col === endNode.col) {
      // Mark the path
      path.forEach(pos => {
        newGrid[pos.row][pos.col].isPath = true;
      });
      setGrid(newGrid);
      setPathFound(true);
      return true;
    }

    const directions: [number, number][] = [
      [1, 0],  // down
      [0, 1],  // right
      [-1, 0], // up
      [0, -1]  // left
    ];

    for (const [dx, dy] of directions) {
      if (await dfs(row + dx, col + dy, visited, [...path])) {
        return true;
      }
    }

    return false;
  };

  const startSearch = async () => {
    resetSearch();
    setIsSearching(true);
    const result = await dfs(startNode.row, startNode.col);
    setIsComplete(true);
    setIsSearching(false);
    setPathFound(result);
  };

  const toggleWall = (row: number, col: number) => {
    if (!isSearching && !(row === startNode.row && col === startNode.col) && 
        !(row === endNode.row && col === endNode.col)) {
      const newGrid = [...grid];
      newGrid[row][col].isWall = !newGrid[row][col].isWall;
      setGrid(newGrid);
    }
  };

  const handleRepresentationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRepresentation(e.target.value as RepresentationType);
  };

  return (
    <div className="container">
      <div className="controls">
        <div className="select-group">
          <label className="label">Representation:</label>
          <select
            value={representation}
            onChange={handleRepresentationChange}
            className="select"
          >
            <option value="visual">Visual Grid</option>
            <option value="matrix">Adjacency Matrix</option>
            <option value="list">Adjacency List</option>
          </select>
        </div>

        <div className="button-group">
          <button
            onClick={startSearch}
            disabled={isSearching || isComplete}
            className={`button start-button ${
              isSearching || isComplete ? 'disabled' : ''
            }`}
          >
            Start DFS
          </button>
          <button
            onClick={generateNewMaze}
            className="button generate-button"
          >
            Generate New Maze
          </button>
        </div>
      </div>

      <GraphRepresentation
        grid={grid}
        representation={representation}
        currentNode={currentNode}
        visitedNodes={visitedNodes}
        startNode={startNode}
        endNode={endNode}
        toggleWall={toggleWall}
      />

      <div className="status">
        {isComplete && (
          <p className={pathFound ? 'status-success' : 'status-error'}>
            {pathFound
              ? 'Path found to target!'
              : 'No path available to target.'}
          </p>
        )}
        {isSearching && (
          <p className="status-searching">
            Searching... Current position: ({currentNode?.row}, {currentNode?.col})
          </p>
        )}
      </div>
    </div>
  );
};

export default DepthFirstSearchVisualizer;