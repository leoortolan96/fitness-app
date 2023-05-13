import { useNavigate } from "react-router-dom";
import classes from "./AppBar.module.css";
import { IoIosArrowBack } from "react-icons/io";

function AppBar(props) {
  const navigate = useNavigate();
  return (
    <header className={classes.header}>
      <div className={classes.button_box}>
        {props.showBackButton ? (
          <button onClick={() => navigate(-1)}>
            <IoIosArrowBack size={26} />
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
