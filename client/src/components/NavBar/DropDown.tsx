import { QADropdown } from "./NavItems";
import { Link } from "react-router-dom";
import "./NavBar.css"; // Import the CSS file

const DropDown = () => {
  return (
    <ul className="dropdown">
      {QADropdown.map((item) => {
        return (
          <li key={item.id}>
            <Link to={item.path}>{item.title}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default DropDown;
