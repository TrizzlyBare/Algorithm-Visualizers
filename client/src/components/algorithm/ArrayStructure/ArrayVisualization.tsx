import React, { useState } from "react";
import "../../../styles/ArrayStyles.css";

const createArray = (length: number) => {
  return Array.from({ length }, () => Math.floor(Math.random() * 100) + 1);
};

const removeArray = (array: number[], index: number) => {
  return array.filter((_, i) => i !== index);
};

const insertArray = (array: number[], index: number, value: number) => {
  if (index < 0 || index > array.length) return array;
  return [...array.slice(0, index), value, ...array.slice(index)];
};

const updateArray = (array: number[], index: number, value: number) => {
  if (index < 0 || index >= array.length) return array;
  return array.map((v, i) => (i === index ? value : v));
};

const swapArray = (array: number[], index1: number, index2: number) => {
  if (
    index1 < 0 ||
    index1 >= array.length ||
    index2 < 0 ||
    index2 >= array.length
  ) {
    return array;
  }
  const newArray = [...array];
  [newArray[index1], newArray[index2]] = [newArray[index2], newArray[index1]];
  return newArray;
};

const sortArray = (array: number[]) => {
  return [...array].sort((a, b) => a - b);
};

const ArrayVisualization: React.FC = () => {
  const [array, setArray] = useState<number[]>(createArray(10));
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [insertIndex, setInsertIndex] = useState<number>(0);
  const [insertValue, setInsertValue] = useState<number>(0);
  const [updateIndex, setUpdateIndex] = useState<number>(0);
  const [updateValue, setUpdateValue] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<number>(0);

  const handleRemove = (index: number) => {
    setArray(removeArray(array, index));
    setSelectedIndices([]);
  };

  const handleInsert = () => {
    setArray(insertArray(array, insertIndex, insertValue));
    setSelectedIndices([insertIndex]);
  };

  const handleSelect = (index: number) => {
    setSelectedIndices([index]);
  };

  const handleUpdate = () => {
    setArray(updateArray(array, updateIndex, updateValue));
    setSelectedIndices([updateIndex]);
  };

  const handleSearch = () => {
    const matches = array.reduce((acc, val, idx) => {
      if (val === searchValue) acc.push(idx);
      return acc;
    }, [] as number[]);
    setSelectedIndices(matches);
  };

  const handleSwap = (index1: number, index2: number) => {
    setArray(swapArray(array, index1, index2));
    setSelectedIndices([index1, index2]);
  };

  const handleSort = () => {
    const sortedArray = sortArray(array);
    setArray(sortedArray);
    setSelectedIndices([]);
  };

  return (
    <div>
      <div className="array-container">
        <div className="array-labels">
          <span>Values →</span>
        </div>
        <div className="array-row">
          {array.map((value, index) => (
            <div
              key={index}
              className={`array-item ${
                selectedIndices.includes(index) ? "selected" : ""
              }`}
              onClick={() => handleSelect(index)}
            >
              {value}
            </div>
          ))}
        </div>
        <div className="array-indices">
          {array.map((_, index) => (
            <div key={index} className="index-item">
              {index}
            </div>
          ))}
        </div>
        <div className="array-labels">
          <span>Indices →</span>
        </div>
      </div>
      <div className="controls-container">
        <button onClick={() => setArray(createArray(10))}>Reset Array</button>
        <button onClick={() => handleRemove(0)}>Remove First</button>
        <div>
          <input
            type="number"
            value={insertIndex}
            onChange={(e) => setInsertIndex(Number(e.target.value))}
            placeholder="Insert Index"
          />
          <input
            type="number"
            value={insertValue}
            onChange={(e) => setInsertValue(Number(e.target.value))}
            placeholder="Insert Value"
          />
          <button onClick={handleInsert}>Insert</button>
        </div>
        <div>
          <input
            type="number"
            value={updateIndex}
            onChange={(e) => setUpdateIndex(Number(e.target.value))}
            placeholder="Update Index"
          />
          <input
            type="number"
            value={updateValue}
            onChange={(e) => setUpdateValue(Number(e.target.value))}
            placeholder="Update Value"
          />
          <button onClick={handleUpdate}>Update</button>
        </div>
        <div>
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(Number(e.target.value))}
            placeholder="Search Value"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <button onClick={() => handleSort()}>Sort Array</button>
      </div>
    </div>
  );
};

export default ArrayVisualization;
