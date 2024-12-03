import { useState, useEffect, ChangeEvent } from 'react';
import '../../../styles/LinearSearchVisualizer.css';

const LinearSearchVisualizer = () => {
  const [array, setArray] = useState<number[]>([4, 2, 7, 1, 9, 5, 3, 8, 6]);
  const [target, setTarget] = useState<number>(5);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [found, setFound] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [searchComplete, setSearchComplete] = useState<boolean>(false);

  const resetSearch = () => {
    setCurrentIndex(-1);
    setFound(false);
    setSearching(false);
    setSearchComplete(false);
  };

  const generateNewArray = () => {
    const newArray = Array.from({ length: 9 }, () => Math.floor(Math.random() * 20) + 1);
    setArray(newArray);
    resetSearch();
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (searching && currentIndex < array.length) {
      timeoutId = setTimeout(() => {
        if (array[currentIndex] === target) {
          setFound(true);
          setSearching(false);
          setSearchComplete(true);
        } else if (currentIndex === array.length - 1) {
          setSearching(false);
          setSearchComplete(true);
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      }, 500);
    }

    return () => clearTimeout(timeoutId);
  }, [searching, currentIndex, array, target]);

  const startSearch = () => {
    resetSearch();
    setSearching(true);
    setCurrentIndex(0);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTarget(Number(e.target.value));
    resetSearch();
  };

  return (
    <div className="container">
      <div className="input-group">
        <label className="label">Target Number:</label>
        <input
          type="number"
          value={target}
          onChange={handleInputChange}
          className="input"
        />
      </div>

      <div className="array-container">
        {array.map((num, idx) => (
          <div
            key={idx}
            className={`array-item ${
              idx === currentIndex && !found ? 'current-item' : ''
            } ${found && idx === currentIndex ? 'found-item' : ''} ${
              idx < currentIndex && !found ? 'checked-item' : ''
            }`}
          >
            {num}
          </div>
        ))}
      </div>

      <div className="button-group">
        <button
          onClick={startSearch}
          disabled={searching || searchComplete}
          className={`button start-button ${
            searching || searchComplete ? 'disabled' : ''
          }`}
        >
          Start Search
        </button>
        <button
          onClick={generateNewArray}
          className="button generate-button"
        >
          Generate New Array
        </button>
      </div>

      <div>
        {searchComplete && (
          <p className={found ? 'status-success' : 'status-error'}>
            {found
              ? `Target ${target} found at index ${currentIndex}!`
              : `Target ${target} not found in the array.`}
          </p>
        )}
        {searching && (
          <p className="status-searching">
            Searching... Current index: {currentIndex}
          </p>
        )}
      </div>
    </div>
  );
};

export default LinearSearchVisualizer;