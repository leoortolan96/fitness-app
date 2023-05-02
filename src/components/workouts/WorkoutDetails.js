import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import ExerciseItem from "./ExerciseItem";
import classes from "./WorkoutDetails.module.css";
import { FaRegWindowClose } from "react-icons/fa";

export default function WorkoutDetails(props) {
  const [isLive, setIsLive] = useState(props.workout.is_live);
  const [isStartButtonLoading, setIsStartButtonLoading] = useState(false);
  const [isFinalizeButtonLoading, setIsFinalizeButtonLoading] = useState(false);
  const [isCancelButtonLoading, setIsCancelButtonLoading] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  async function startCancelWorkout(isStarting) {
    try {
      // e.preventDefault();
      if (isStarting) setIsStartButtonLoading(true);
      else setIsCancelButtonLoading(true);
      // await new Promise(resolve => setTimeout(resolve, 2000));
      let result = await fetch(
        process.env.REACT_APP_API_ENDPOINT + "/start-cancel-workout",
        {
          method: "post",
          body: JSON.stringify({ id: props.workout._id, is_live: isStarting }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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
      let result = await fetch(
        process.env.REACT_APP_API_ENDPOINT + "/finalize-workout",
        {
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
        }
      );
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

  function ChangeLoadDialog() {
    const loadInputRef = useRef();
    if (!isLoadDialogOpen || !selectedExercise) return <></>;

    function onClose() {
      setIsLoadDialogOpen(false);
    }

    function submitHandler(event) {
      event.preventDefault();
      const enteredLoad = loadInputRef.current.value;
      console.log("new load: " + enteredLoad);
      console.log("1");
      let alteredLoads = JSON.parse(
        localStorage.getItem("altered_loads") ?? "[]"
      );
      console.log("2");
      alteredLoads = alteredLoads.filter(
        (alteredLoad) => alteredLoad.exercise_id !== selectedExercise._id
      );
      console.log("3");
      alteredLoads.push({
        exercise_id: selectedExercise._id,
        new_load: enteredLoad,
      });
      console.log("4");
      localStorage.setItem("altered_loads", JSON.stringify(alteredLoads));
      console.log(JSON.parse(localStorage.getItem("altered_loads") ?? []));
    }

    return (
      <div className={classes.overlay} onClick={onClose}>
        <div className={classes.dialog} onClick={(e) => e.stopPropagation()}>
          <div
            className={classes.header}
            style={{ display: "flex", alignItems: "center" }}
          >
            <h2 style={{ flexGrow: "1" }}>ALTERAR CARGA</h2>
            <button onClick={onClose}>
              <FaRegWindowClose size={25} />
            </button>
          </div>
          <form className={classes.form} onSubmit={submitHandler}>
            <div className={classes.dialog_content}>
              <p>
                {selectedExercise.name}, {selectedExercise.sets}x
                {selectedExercise.reps}
              </p>
              <br />
              <h4>ATUAL: {selectedExercise.load}</h4>

              <div style={{ display: "flex" }}>
                <h4>NOVA: </h4>
                <input
                  type="text"
                  required
                  id="load"
                  ref={loadInputRef}
                  style={{ flexGrow: "1" }}
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <button className={classes.save_load} style={{ flexGrow: "1" }}>
                salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
    // return (
    //   <Dialog
    //     show={isLoadDialogOpen}
    //     title="ALTERAR CARGA"
    //     onClose={() => {
    //       setIsLoadDialogOpen(false);
    //     }}
    //   >
    //     {selectedExercise.name}, {selectedExercise.sets}x{selectedExercise.reps}
    //   </Dialog>
    // );
  }

  return (
    <div>
      <ul className={classes.list}>
        <li>EXERCICIO SETS REPS</li>
        {props.workout.exercises.map((exercise) => (
          <ExerciseItem
            key={exercise.id}
            exercise={exercise}
            onClick={() => {
              setSelectedExercise(exercise);
              setIsLoadDialogOpen(true);
              console.log(selectedExercise.name);
            }}
          />
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
      <ChangeLoadDialog />
    </div>
  );
}
