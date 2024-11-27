import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const sortingAlgorithms = [
  {
    name: "Introsort",
    description:
      "A hybrid sorting algorithm that combines Quicksort, Heapsort, and Insertion Sort",
    path: "../algorithm/sortingAlgorithm/IntroSort",
    // image: "/images/introsort.jpg",
  },
  {
    name: "Timsort",
    description:
      "A hybrid stable sorting algorithm, derived from merge sort and insertion sort",
    path: "../algorithm/sortingAlgorithm/TimSort",
    // image: "/images/timsort.jpg",
  },
  {
    name: "Pigeonhole Sort",
    description:
      "A sorting algorithm suitable for sorting lists of elements where the number of elements and the range of possible key values are approximately the same",
    path: "../algorithm/sortingAlgorithm/PigeonholeSort",
    // image: "/images/pigeonhole-sort.jpg",
  },
  {
    name: "Comb Sort",
    description:
      "An improvement over Bubble Sort, using a gap sequence to compare and swap elements",
    path: "../algorithm/sortingAlgorithm/CombSort",
    // image: "/images/comb-sort.jpg",
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="main-title">Sorting Algorithm Visualizations</h1>
      <div className="cards-container">
        {sortingAlgorithms.map((algorithm) => (
          <Link to={algorithm.path} key={algorithm.name} className="card-link">
            <div className="card">
              <div className="wrapper">
                <img
                  //   src={algorithm.image}
                  alt={algorithm.name}
                  className="card-img"
                />
              </div>
              <div className="title">
                <h3>{algorithm.name}</h3>
                <p>{algorithm.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
