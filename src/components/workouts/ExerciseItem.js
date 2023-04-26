import classes from "./ExerciseItem.module.css";

export default function ExerciseItem(props) {
  console.log("item:\n" + props.exercise.name);
  return (
    <li className={classes.item}>
      <div className={classes.content}>
        <div style={{ display: "flex" }}>
          <p style={{ flexGrow: "1" }}>{props.exercise.name}</p>
          <p style={{ width: "50px", textAlign: "right" }}>
            {props.exercise.sets}
          </p>
          <p style={{ width: "50px", textAlign: "right" }}>
            {props.exercise.reps}
          </p>
        </div>
        <h4>{props.exercise.load ?? " "}</h4>
        <h4>{props.exercise.observation ?? " "}</h4>
      </div>
    </li>
  );
}
