import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import classes from "./WorkoutItem.module.css";

export default function WorkoutItem(props) {
  const navigate = useNavigate();
  var startDateString = "---";
  var endDateString = "---";
  var workoutsCount = props.workout.workout_sessions.length;
  if (workoutsCount > 0) {
    var workoutSessions = props.workout.workout_sessions.sort((s1, s2) =>
      s1.session_datetime > s2.session_datetime
        ? 1
        : s1.session_datetime < s2.session_datetime
        ? -1
        : 0
    );
    var startDate = workoutSessions[0].session_datetime;
    var endDate = workoutSessions[workoutSessions.length - 1].session_datetime;
    startDateString =
      new Date(startDate).getDate().toString().padStart(2, "0") +
      "/" +
      (new Date(startDate).getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      new Date(startDate).getFullYear();
    endDateString =
      new Date(endDate).getDate().toString().padStart(2, "0") +
      "/" +
      (new Date(endDate).getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      new Date(endDate).getFullYear();
  }

  function onWorkoutClick() {
    navigate("/workout/" + props.workout.id);
  }

  return (
    <li className={classes.item}>
      <Card onClick={onWorkoutClick}>
        <div className={classes.content}>
          <h3>{props.workout.name}</h3>
          <p>{props.workout.description ?? " "}</p>
          <div style={{ display: "flex", padding: "10px 0", alignItems:"center"}}>
            {props.workout.is_active ? (
              <>
                <div className={classes.active}></div>
                <div className={classes.active_label}>ATIVO</div>
              </>
            ) : (
              <>
                <div className={classes.archived}></div>
                <div className={classes.archived_label}>ARQUIVADO</div>
              </>
            )}
            <p style={{ marginLeft: "15px" }}>{workoutsCount}x</p>
          </div>

          <p>PRIMEIRO: {startDateString}</p>
          <p>ÚLTIMO: {endDateString}</p>
        </div>
      </Card>
    </li>
  );
}
