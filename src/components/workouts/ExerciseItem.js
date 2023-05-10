import classes from "./ExerciseItem.module.css";

export function ExerciseItem(props) {
  let oldLoad = props.exercise.load;
  let currentLoad =
    props.alteredLoads.find(
      (alteredLoad) => alteredLoad.exercise_id === props.exercise._id
    )?.new_load ?? oldLoad;

  return (
    <li className={classes.item} onClick={props.onClick}>
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
        <div style={{ display: "flex" }}>
          {oldLoad !== currentLoad ? (
            <h4 className={classes.old_load}>{oldLoad ?? ""}</h4>
          ) : (
            <></>
          )}
          <h4 style={{ flexGrow: "1" }}>{currentLoad ?? ""}</h4>
        </div>
        <h4>{props.exercise.observation ?? " "}</h4>
      </div>
    </li>
  );
}

export function ExerciseItemEditMode(props) {
  return (
    <li className={classes.item} onClick={props.onClick}>
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
        <h4>{props.exercise.load ?? ""}</h4>
        <h4>{props.exercise.observation ?? " "}</h4>
        {props.exercise.is_paused ? <h4>PAUSADO</h4> : <></>}
      </div>
    </li>
  );
}
