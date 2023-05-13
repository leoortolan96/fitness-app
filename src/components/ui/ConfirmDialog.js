import classes from "./ConfirmDialog.module.css";
import { CgClose } from "react-icons/cg";

function ConfirmDialog(props) {
  //   console.log(JSON.stringify(props));
  if (!props.show) return <></>;
  return (
    <div className={classes.overlay} onClick={props.onClose}>
      <div className={classes.dialog} onClick={(e) => e.stopPropagation()}>
        <div
          className={classes.header}
          style={{ display: "flex", alignItems: "center" }}
        >
          <h2 style={{ flexGrow: "1" }}>{props.title ?? " "}</h2>
          <button onClick={props.onClose}>
            <CgClose size={25} />
          </button>
        </div>
        <div className={classes.content}>
          <p>{props.text}</p>
          <p>{props.secondaryText}</p>
        </div>
        <div style={{ display: "flex" }}>
          <button
            className={props.isCritical ? classes.critical : classes.confirm}
            style={{ flexGrow: "1" }}
            onClick={props.onConfirm}
          >
            {props.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
