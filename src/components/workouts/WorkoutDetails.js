import { useSnackbar } from "notistack";
import { useState } from "react";
import ExerciseItem from "./ExerciseItem";
import classes from "./WorkoutDetails.module.css";

export default function WorkoutDetails(props) {
  const [isLive, setIsLive] = useState(props.workout.is_live);
  const [isStartButtonLoading, setIsStartButtonLoading] = useState(false);
  const [isFinalizeButtonLoading, setIsFinalizeButtonLoading] = useState(false);
  const [isCancelButtonLoading, setIsCancelButtonLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  async function startCancelWorkout(isStarting) {
    try {
      // e.preventDefault();
      if (isStarting) setIsStartButtonLoading(true);
      else setIsCancelButtonLoading(true);
      // await new Promise(resolve => setTimeout(resolve, 2000));
      let result = await fetch("http://localhost:5000/start-cancel-workout", {
        method: "post",
        body: JSON.stringify({ id: props.workout._id, is_live: isStarting }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      if (result.status === 500) throw Error("Error finalizing workout!");
      props.workout.is_live = isStarting;
      setIsLive(isStarting);
      if (isStarting) {
        localStorage.setItem(
          "live_workout_initial",
          JSON.stringify(props.workout)
        );
        // localStorage.setItem("live_workout_start", JSON.stringify(new Date()));
        localStorage.setItem("live_workout_start", new Date());
        localStorage.removeItem("altered_loads");
      } else {
        localStorage.removeItem("live_workout_initial");
        localStorage.removeItem("live_workout_start");
        localStorage.removeItem("altered_loads");
      }
      // console.log(
      //   "initial time:\n" + localStorage.getItem("live_workout_start")
      // );
      // console.log("initial:\n" + localStorage.getItem("live_workout_initial"));
      // console.log("current:\n" + localStorage.getItem("altered_loads"));
    } catch (error) {
      console.log(error);
      enqueueSnackbar(
        <ul className={classes.snackbar}>
          <li>
            <h3>Error updating workout...</h3>
          </li>
          <li>
            <p>Check your connection and try again...</p>
          </li>
        </ul>,
        { variant: "error" }
      );
    } finally {
      if (isStarting) setIsStartButtonLoading(false);
      else setIsCancelButtonLoading(false);
    }
  }

  async function finalizeWorkout() {
    try {
      // e.preventDefault();
      setIsFinalizeButtonLoading(true);
      // await new Promise(resolve => setTimeout(resolve, 2000));
      let alteredLoads =
        JSON.parse(localStorage.getItem("altered_loads")) ?? [];
      let startTime = new Date(localStorage.getItem("live_workout_start"));
      let endTime = new Date();
      let durationMinutes = Math.ceil((endTime - startTime) / (1000 * 60));
      let result = await fetch("http://localhost:5000/finalize-workout", {
        method: "post",
        body: JSON.stringify({
          id: props.workout._id,
          start_time: startTime,
          duration: durationMinutes,
          altered_loads: alteredLoads,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      if (result.status === 500) throw Error("Error finalizing workout!");
      props.workout.is_live = false;
      setIsLive(false);
      localStorage.removeItem("live_workout_initial");
      localStorage.removeItem("live_workout_start");
      localStorage.removeItem("altered_loads");
      // console.log("initial:\n" + localStorage.getItem("live_workout_initial"));
      // console.log("current:\n" + localStorage.getItem("altered_loads"));
    } catch (error) {
      console.log(error);
      enqueueSnackbar(
        <ul className={classes.snackbar}>
          <li>
            <h3>Error finalizing workout...</h3>
          </li>
          <li>
            <p>Check your connection and try again...</p>
          </li>
        </ul>,
        { variant: "error" }
      );
    } finally {
      setIsFinalizeButtonLoading(false);
    }
  }

  return (
    <ul className={classes.list}>
      <li>EXERCICIO SETS REPS</li>
      {props.workout.exercises.map((exercise) => (
        <ExerciseItem key={exercise.id} exercise={exercise} />
      ))}
      {isLive ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            className={classes.finalize}
            onClick={() => finalizeWorkout()}
          >
            {isFinalizeButtonLoading ? "..." : "finalizar treino"}
          </button>
          <button
            className={classes.cancel}
            onClick={() => startCancelWorkout(false)}
          >
            {isCancelButtonLoading ? "..." : "cancelar treino"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            className={classes.start}
            onClick={() => startCancelWorkout(true)}
          >
            {isStartButtonLoading ? "..." : "iniciar treino"}
          </button>
        </div>
      )}
    </ul>
  );
}
