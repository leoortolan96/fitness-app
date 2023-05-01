import { useNavigate } from "react-router-dom";
import classes from "./AppBar.module.css";
import { FaArrowLeft, FaCrosshairs } from "react-icons/fa";

function AppBar(props) {
  const navigate = useNavigate();
  return (
    <header className={classes.header}>
      {props.showBackButton ? (
        <button onClick={() => navigate(-1)}>
          <FaArrowLeft size={20} />
        </button>
      ) : (
        <div />
      )}
      <h3>{props.title ?? ' '}</h3>
      <button onClick={() => console.log("action")}>
        <FaCrosshairs size={20} />
      </button>
    </header>
  );
}

export default AppBar;
