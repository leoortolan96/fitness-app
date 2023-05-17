import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import LiveWorkoutContext from "../../store/live-workout-context";
import Card from "../ui/Card";
import classes from "./WorkoutItem.module.css";

export default function WorkoutItem(props) {
  const navigate = useNavigate();
  const liveWorkoutCtx = useContext(LiveWorkoutContext);
  const [isAnimationExpanded, setIsAnimationExpanded] = useState(false);

  if (
    liveWorkoutCtx.liveWorkout != null &&
    liveWorkoutCtx.liveWorkout._id === props.workout._id
  )
    setTimeout(
      () => setIsAnimationExpanded(!isAnimationExpanded),
      isAnimationExpanded ? 3000 : 1
    );

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
          <div
            style={{
              display: "flex",
              padding: "10px 0",
              marginLeft: "-4px",
              alignItems: "center",
            }}
          >
            {liveWorkoutCtx.liveWorkout != null &&
            liveWorkoutCtx.liveWorkout._id === props.workout._id ? (
              <>
                <div className={classes.status_box}>
                  <div
                    className={
                      isAnimationExpanded ? classes.live : classes.active
                    }
                  ></div>
                </div>
                <div className={classes.active_label}>EM ANDAMENTO</div>
              </>
            ) : props.workout.is_active ? (
              <>
                <div className={classes.status_box}>
                  <div className={classes.active}></div>
                </div>
                <div className={classes.active_label}>ATIVO</div>
              </>
            ) : (
              <>
                <div className={classes.status_box}>
                  <div className={classes.archived}></div>
                </div>
                <div className={classes.archived_label}>ARQUIVADO</div>
              </>
            )}
            <div className={classes.sessions_counter}>{workoutsCount}x</div>
          </div>

          <p>PRIMEIRO: {startDateString}</p>
          <p>ÚLTIMO: {endDateString}</p>
        </div>
      </Card>
    </li>
  );
}
