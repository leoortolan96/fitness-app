import Card from "../ui/Card";
import classes from "./WorkoutItem.module.css";

export default function WorkoutItem(props) {
  var startDateString = "---";
  var endDateString = "---";
  var workoutsCount = props.workout.workout_sessions.length;
  console.log("count: " + workoutsCount);
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
    console.log("start:" + startDate);
    var dateTest = new Date(Date.parse("2022-12-17T03:24:00")).getDate();
    console.log(dateTest);
    // console.log(dateTest + ' /// ' + Date.parse('04-30-2014 05:30:00 PM').getDate());
    // const d2 = new Date(endDate).getDate();
    // console.log(d2);
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

  return (
    <li className={classes.item}>
      <Card>
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
