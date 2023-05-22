import classes from "./AppBar.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { useGoBackOrHome } from "../../shared/functions";

function AppBar(props) {
  const navigator = useGoBackOrHome();
  return (
    <header className={classes.header}>
      <div className={classes.button_box}>
        {props.showBackButton ? (
          <button onClick={() => navigator.goBackOrHome()}>
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
