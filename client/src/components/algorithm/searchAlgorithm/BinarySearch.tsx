import{ useState, useEffect, ChangeEvent } from 'react';
import '../../../styles/BinarySearchVisualizer.css';

const BinarySearchVisualizer = () => {
  const [array, setArray] = useState<number[]>([1, 3, 5, 7, 9, 11, 13, 15, 17]);
  const [target, setTarget] = useState<number>(9);
  const [left, setLeft] = useState<number>(-1);
  const [right, setRight] = useState<number>(-1);
  const [mid, setMid] = useState<number>(-1);
  const [found, setFound] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [searchComplete, setSearchComplete] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const resetSearch = () => {
    setLeft(-1);
    setRight(-1);
    setMid(-1);
    setFound(false);
    setSearching(false);
    setSearchComplete(false);
    setMessage('');
  };

  const generateNewArray = () => {
    // Generate random numbers between 1 and 100
    const newArray = Array.from({ length: 9 }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    // Sort array for binary search to work
    const sortedArray = [...newArray].sort((a, b) => a - b);
    setArray(sortedArray);
    resetSearch();
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (searching) {
      timeoutId = setTimeout(() => {
        if (left > right) {
          setSearching(false);
          setSearchComplete(true);
          setMessage(`Target ${target} not found in the array.`);
          return;
        }

        const middleIndex = Math.floor((left + right) / 2);
        setMid(middleIndex);

        if (array[middleIndex] === target) {
          setFound(true);
          setSearching(false);
          setSearchComplete(true);
          setMessage(`Target ${target} found at index ${middleIndex}!`);
        } else if (array[middleIndex] < target) {
          setMessage(`${array[middleIndex]} is too small, searching right half`);
          setLeft(middleIndex + 1);
        } else {
          setMessage(`${array[middleIndex]} is too large, searching left half`);
          setRight(middleIndex - 1);
        }
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [searching, left, right, array, target]);

  const startSearch = () => {
    resetSearch();
    setLeft(0);
    setRight(array.length - 1);
    setSearching(true);
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
              idx === mid ? 'current-item' : ''
            } ${found && idx === mid ? 'found-item' : ''} ${
              (idx < left || idx > right) && left !== -1 ? 'discarded-item' : ''
            }`}
          >
            {num}
          </div>
        ))}
      </div>

      <div className="message">
        {message && <p>{message}</p>}
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
    </div>
  );
};

export default BinarySearchVisualizer;