import classes from "./Card.module.css";

export default function Card(props) {
  return (
    <button onClick={props.onClick} className={classes.card}>
      {props.children}
    </button>
  );
}
