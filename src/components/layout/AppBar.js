import { useNavigate } from "react-router-dom";
import classes from "./AppBar.module.css";
import { FaArrowLeft } from "react-icons/fa";

function AppBar(props) {
  const navigate = useNavigate();
  return (
    <header className={classes.header}>
      <div className={classes.button_box}>
        {props.showBackButton ? (
          <button onClick={() => navigate(-1)}>
            <FaArrowLeft size={20} />
          </button>
        ) : (
          <div />
        )}{" "}
      </div>
      <h1>{props.title ?? " "}</h1>
      <div className={classes.button_box}>
        {props.actionIcon ? (
          <button onClick={() => props.action()}>{props.actionIcon}</button>
        ) : (
          <div />
        )}
      </div>
    </header>
  );
}

export default AppBar;
