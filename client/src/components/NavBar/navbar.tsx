import { useState } from "react";
import { Link } from "react-router-dom";
import { navItems } from "./NavItems";
import DropDown from "./DropDown";
import "./NavBar.css"; // Import the CSS file

const Navbar = () => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="text-4xl">
          Company Name
        </Link>
        <ul className="nav-items">
          {navItems.map((item) => {
            if (item.title === "QA") {
              return (
                <li
                  key={item.id}
                  onMouseEnter={() => setDropdown(true)}
                  onMouseLeave={() => setDropdown(false)}
                >
                  <Link to={item.path}>{item.title}</Link>
                  {dropdown && <DropDown />}
                </li>
              );
            }

            return (
              <li key={item.id}>
                <Link to={item.path}>{item.title}</Link>
              </li>
            );
          })}
        </ul>
        <button>Logout</button>
      </nav>
    </>
  );
};

export default Navbar;
