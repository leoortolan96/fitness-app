import { useNavigate } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import { FaArrowLeft, FaCrosshairs } from "react-icons/fa";

function MainNavigation() {
  const navigate = useNavigate();
  return (
    <header className={classes.header}>
      <button onClick={() => navigate(-1)}>
        <FaArrowLeft size={20} />
      </button>
      <h1>TITLE</h1>
      <button onClick={() => console.log("action")}>
        <FaCrosshairs size={20} />
      </button>
    </header>
  );
}

export default MainNavigation;
