export interface Node {
    row: number;
    col: number;
    isWall: boolean;
    isVisited: boolean;
    isPath: boolean;
  }
  
  export type Grid = Node[][];
  
  export interface Position {
    row: number;
    col: number;
  }
  
  export type RepresentationType = 'matrix' | 'list' | 'visual';
  
  export interface GraphRepresentationProps {
    grid: Grid;
    representation: RepresentationType;
    currentNode: Position | null;
    visitedNodes: Position[];
    startNode: Position;
    endNode: Position;
    toggleWall: (row: number, col: number) => void;
  }