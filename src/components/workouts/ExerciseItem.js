import classes from "./ExerciseItem.module.css";

export function ExerciseItem(props) {
  let oldLoad = props.exercise.load;
  let currentLoad =
    props.alteredLoads.find(
      (alteredLoad) => alteredLoad.exercise_id === props.exercise._id
    )?.new_load ?? oldLoad;

  return (
    <li className={classes.item} onClick={props.onClick}>
      <div style={{ display: "flex" }}>
        <h1 style={{ flex: "1 1 auto" }}>{props.exercise.name}</h1>
        <h3
          style={{
            width: "50px",
            textAlign: "right",
            flex: "0 0 auto",
            padding: "0 5px",
          }}
        >
          {props.exercise.sets}
        </h3>
        <h3 style={{ width: "70px", textAlign: "right", flex: "0 0 auto" }}>
          {props.exercise.reps}
        </h3>
      </div>
      <div style={{ display: "flex" }}>
        {oldLoad !== currentLoad ? (
          <div className={classes.old_load}>{oldLoad ?? ""}</div>
        ) : (
          <></>
        )}
        <h4 style={{ flex: "1 1 auto" }}>{currentLoad ?? ""}</h4>
      </div>
      <h4>{props.exercise.observation ?? " "}</h4>
    </li>
  );
}

export function ExerciseItemEditMode(props) {
  return (
    <li style={{ position: "relative" }} onClick={props.onClick}>
      <div className={classes.item}>
        <div style={{ display: "flex" }}>
          <h1 style={{ flex: "1 1 auto" }}>{props.exercise.name}</h1>
          <h3
            style={{
              width: "50px",
              textAlign: "right",
              flex: "0 0 auto",
              padding: "0 5px",
            }}
          >
            {props.exercise.sets}
          </h3>
          <h3 style={{ width: "70px", textAlign: "right", flex: "0 0 auto" }}>
            {props.exercise.reps}
          </h3>
        </div>
        <h4>{props.exercise.load ?? ""}</h4>
        <h4>{props.exercise.observation ?? " "}</h4>
      </div>
      {props.exercise.is_paused ? (
        <div className={classes.paused}>
          <h4>PAUSADO</h4>
        </div>
      ) : (
        <></>
      )}
    </li>
  );
}

export function ExerciseItemAlteredLoads(props) {
  return (
    <li className={classes.item} style={{ margin: "0px" }}>
      <h1>{props.exercise.name}</h1>
      <div style={{ display: "flex" }}>
        <div className={classes.old_load}>{props.exercise.oldLoad ?? "--"}</div>
        <h4 style={{ flex: "1 1 auto" }}>{props.exercise.currentLoad ?? ""}</h4>
      </div>
    </li>
  );
}
