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
          <h4>{props.workout.description ?? " "}</h4>
          <div style={{ display: "flex" }}>
            <p>{props.workout.is_active ? "ATIVO" : "ARQUIVADO"}</p>
            <p style={{marginLeft: "15px"}}>{workoutsCount}x</p>
          </div>
          
          <p>PRIMEIRO: {startDateString}</p>
          <p>ÚLTIMO: {endDateString}</p>
        </div>
      </Card>
    </li>
  );
}
