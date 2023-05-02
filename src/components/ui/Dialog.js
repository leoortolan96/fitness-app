import classes from "./Dialog.module.css";
import { FaRegWindowClose } from "react-icons/fa";

// let dialogStyles = {
//   width: "500px",
//   maxWidth: "100%",
//   margin: "0 auto",
//   position: "fixed",
//   left: "50%",
//   top: "50%",
//   transform: "translate(-50%,-50%)",
//   zIndex: "999",
//   backgroundColor: "#eee",
//   padding: "10px 20px 40px",
//   borderRadius: "20px",
//   display: "flex",
//   flexDirection: "column",
// };

// let dialogStyles = {
//     width: "500px",
//     maxWidth: "90%",
//     margin: "0 auto",
//     position: "fixed",
//     left: "50%",
//     top: "50%",
//     transform: "translate(-50%,-50%)",
//     zIndex: "999",
//     backgroundColor: "#eee",
//     padding: "10px 20px 40px",
//     borderRadius: "20px",
//     display: "flex",
//     flexDirection: "column",
//   };

// let dialogCloseButtonStyles = {
//   marginBottom: "15px",
//   padding: "3px 8px",
//   cursor: "pointer",
//   borderRadius: "50%",
//   border: "none",
//   width: "30px",
//   height: "30px",
//   fontWeight: "bold",
//   alignSelf: "flex-end",
// };

function Dialog(props) {
  console.log(JSON.stringify(props));
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
            <FaRegWindowClose size={25} />
          </button>
        </div>
        {props.children}
      </div>
    </div>
  );
}

export default Dialog;
