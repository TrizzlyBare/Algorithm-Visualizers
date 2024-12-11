import { GraphRepresentationProps } from './types';

export const GraphRepresentation = ({
  grid,
  representation,
  currentNode,
  visitedNodes,
  startNode,
  endNode,
  toggleWall
}: GraphRepresentationProps) => {
  const getAdjacencyMatrix = () => {
    const nodes = grid.length * grid[0].length;
    const matrix: number[][] = Array(nodes).fill(0).map(() => Array(nodes).fill(0));

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        const currentIndex = row * grid[0].length + col;
        
        if (!grid[row][col].isWall) {
          const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
          for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;

            if (
              newRow >= 0 && newRow < grid.length &&
              newCol >= 0 && newCol < grid[0].length &&
              !grid[newRow][newCol].isWall
            ) {
              const neighborIndex = newRow * grid[0].length + newCol;
              matrix[currentIndex][neighborIndex] = 1;
            }
          }
        }
      }
    }

    return matrix;
  };

  const getAdjacencyList = () => {
    const list = new Map<string, string[]>();

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (!grid[row][col].isWall) {
          const neighbors: string[] = [];
          const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
          
          for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;

            if (
              newRow >= 0 && newRow < grid.length &&
              newCol >= 0 && newCol < grid[0].length &&
              !grid[newRow][newCol].isWall
            ) {
              neighbors.push(`(${newRow},${newCol})`);
            }
          }

          list.set(`(${row},${col})`, neighbors);
        }
      }
    }

    return list;
  };

  const renderMatrix = () => {
    const matrix = getAdjacencyMatrix();
    return (
      <div className="matrix-container">
        <table className="matrix-table">
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className={cell ? 'matrix-cell-connected' : 'matrix-cell'}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderList = () => {
    const list = getAdjacencyList();
    return (
      <div className="list-container">
        {Array.from(list.entries()).map(([node, neighbors]) => (
          <div key={node} className="list-item">
            <span className="list-node">{node}:</span>
            <span className="list-neighbors">
              {neighbors.length > 0 ? neighbors.join(', ') : 'No neighbors'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderVisual = () => (
    <div className="grid-container">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="grid-row">
          {row.map((node, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              onClick={() => toggleWall(rowIdx, colIdx)}
              className={`grid-cell
                ${node.isWall ? 'wall-cell' : ''}
                ${currentNode?.row === rowIdx && currentNode?.col === colIdx ? 'current-cell' : ''}
                ${visitedNodes.some(n => n.row === rowIdx && n.col === colIdx) ? 'visited-cell' : ''}
                ${node.isPath ? 'path-cell' : ''}
                ${rowIdx === startNode.row && colIdx === startNode.col ? 'start-cell' : ''}
                ${rowIdx === endNode.row && colIdx === endNode.col ? 'end-cell' : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );

  switch (representation) {
    case 'matrix':
      return renderMatrix();
    case 'list':
      return renderList();
    default:
      return renderVisual();
  }
};