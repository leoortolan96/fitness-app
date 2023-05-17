import { useSnackbar } from "notistack";
import { useContext, useRef, useState } from "react";
import { ExerciseItem, ExerciseItemAlteredLoads } from "./ExerciseItem";
import classes from "./WorkoutDetails.module.css";
import { CgClose } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../ui/ConfirmDialog";
import LiveWorkoutContext from "../../store/live-workout-context";

export default function WorkoutDetails(props) {
  const [isStartButtonLoading, setIsStartButtonLoading] = useState(false);
  const [isFinalizeButtonLoading, setIsFinalizeButtonLoading] = useState(false);
  const [isCancelButtonLoading, setIsCancelButtonLoading] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [isCancelWorkoutDialogOpen, setIsCancelWorkoutDialogOpen] =
    useState(false);
  const [isFinalizeWorkoutDialogOpen, setIsFinalizeWorkoutDialogOpen] =
    useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [alteredLoads, setAlteredLoads] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const liveWorkoutCtx = useContext(LiveWorkoutContext);

  setTimeout(() => {
    if (alteredLoads == null)
      setAlteredLoads(
        JSON.parse(localStorage.getItem("altered_loads") ?? "[]")
      );
  }, 20);

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
      if (result.status === 500) throw result.message;
      props.workout.is_live = isStarting;
      if (isStarting) {
        localStorage.setItem(
          "live_workout_initial",
          JSON.stringify(props.workout)
        );
        localStorage.setItem("live_workout_start", new Date());
      } else {
        localStorage.removeItem("live_workout_initial");
        localStorage.removeItem("live_workout_start");
        setIsCancelWorkoutDialogOpen(false);
      }
      localStorage.removeItem("altered_loads");
      setAlteredLoads([]);
    } catch (error) {
      if (error.includes("User already has live workout"))
        enqueueSnackbar(
          <ul className={classes.snackbar}>
            <li>
              <h3>Erro ao iniciar treino...</h3>
            </li>
            <li>
              <p>Você já possui um treino em andamento...</p>
            </li>
          </ul>,
          { variant: "warning" }
        );
      else
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
      // await new Promise((resolve) => setTimeout(resolve, 2000));
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
      localStorage.removeItem("live_workout_initial");
      localStorage.removeItem("live_workout_start");
      localStorage.removeItem("altered_loads");
      setAlteredLoads([]);
      // console.log("initial:\n" + localStorage.getItem("live_workout_initial"));
      // console.log("current:\n" + localStorage.getItem("altered_loads"));
      const path = window.location.pathname;
      if (path === "/live-workout") navigate("/");
      else if (path.startsWith("/workout/")) navigate(-1);
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
      let alteredLoadsArray = JSON.parse(
        localStorage.getItem("altered_loads") ?? "[]"
      );
      alteredLoadsArray = alteredLoadsArray.filter(
        (alteredLoad) => alteredLoad.exercise_id !== selectedExercise._id
      );
      alteredLoadsArray.push({
        exercise_id: selectedExercise._id,
        new_load: enteredLoad,
      });
      localStorage.setItem("altered_loads", JSON.stringify(alteredLoadsArray));
      setAlteredLoads(alteredLoadsArray);
      // console.log(JSON.parse(localStorage.getItem("altered_loads") ?? []));
      onClose();
    }

    return (
      <div className={classes.overlay} onClick={onClose}>
        <form className={classes.form} onSubmit={submitHandler}>
          <div
            className={classes.dialog}
            onClick={(e) => e.stopPropagation()}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              className={classes.dialog_header}
              style={{ display: "flex", alignItems: "center" }}
            >
              <h2 style={{ flexGrow: "1" }}>ALTERAR CARGA</h2>
              <button onClick={onClose}>
                <CgClose size={25} />
              </button>
            </div>

            <div className={classes.dialog_content} style={{ flexGrow: "1" }}>
              <p>
                {selectedExercise.name}, {selectedExercise.sets}x
                {selectedExercise.reps}
              </p>
              <br />
              <h4 style={{ margin: "4px 0" }}>
                ATUAL: {selectedExercise.load}
              </h4>

              <div style={{ display: "flex" }}>
                <h4 style={{ margin: "4px 0" }}>NOVA: </h4>
                <input
                  type="text"
                  autoFocus
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
          </div>
        </form>
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

  function FinalizeWorkoutDialog() {
    if (!isFinalizeWorkoutDialogOpen) return <></>;

    let startTime = new Date(localStorage.getItem("live_workout_start"));
    let endTime = new Date();
    let durationMinutes = Math.ceil((endTime - startTime) / (1000 * 60));
    let alteredLoads = JSON.parse(localStorage.getItem("altered_loads")) ?? [];
    let alteredExercises = [];
    alteredLoads.forEach((alteredLoad) => {
      let exercise = props.workout.exercises.find(
        (exercise) => exercise._id === alteredLoad.exercise_id
      );
      if (exercise.load !== alteredLoad.new_load)
        alteredExercises.push({
          name: exercise.name,
          oldLoad: exercise.load,
          currentLoad: alteredLoad.new_load,
        });
    });

    return (
      <div
        className={classes.overlay}
        onClick={() => setIsFinalizeWorkoutDialogOpen(false)}
      >
        <div
          className={classes.dialog}
          onClick={(e) => e.stopPropagation()}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            className={classes.dialog_header}
            style={{ display: "flex", alignItems: "center" }}
          >
            <h2 style={{ flexGrow: "1" }}>RESUMO DO TREINO</h2>
            <button onClick={() => setIsFinalizeWorkoutDialogOpen(false)}>
              <CgClose size={25} />
            </button>
          </div>
          <div className={classes.dialog_content} style={{ flexGrow: "1" }}>
            <h3>{"Duração:  " + durationMinutes + " min"}</h3>
            <br />
            <ul className={classes.list}>
              {alteredExercises.length > 0 ? (
                <>
                  <li>ALTERAÇÕES DE CARGA</li>
                  {alteredExercises.map((exercise, index) => (
                    <ExerciseItemAlteredLoads key={index} exercise={exercise} />
                  ))}
                  <p>As demais cargas foram mantidas</p>
                </>
              ) : (
                <p>Todas as cargas foram mantidas</p>
              )}
            </ul>
          </div>
          <div style={{ display: "flex" }}>
            <button
              className={classes.finalize_dialog}
              style={{ flexGrow: "1" }}
              onClick={finalizeWorkout}
            >
              {isFinalizeButtonLoading ? "..." : "finalizar treino"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function CancelWorkoutDialog() {
    return (
      <ConfirmDialog
        show={isCancelWorkoutDialogOpen}
        onClose={() => setIsCancelWorkoutDialogOpen(false)}
        onConfirm={() => startCancelWorkout(false)}
        title="CANCELAR TREINO"
        text="As alterações de carga serão descartadas e o treino não será adicionado ao seu histórico."
        secondaryText="Deseja continuar?"
        isCritical={true}
        buttonText={isCancelButtonLoading ? "..." : "cancelar treino"}
      />
    );
  }

  return (
    <div>
      <ul className={classes.list}>
        <div className={classes.header}>
          <div style={{ flex: "1 1 auto" }}>EXERCÍCIO</div>
          <div style={{ width: "50px", textAlign: "right", padding: "0 5px" }}>
            SETS
          </div>
          <div style={{ width: "70px", textAlign: "right" }}>REPS</div>
        </div>
        {props.workout.exercises
          .filter((exercise) => !exercise.is_paused)
          .map((exercise) => (
            <ExerciseItem
              key={exercise._id}
              exercise={exercise}
              onClick={() => {
                if (
                  liveWorkoutCtx.liveWorkout == null ||
                  liveWorkoutCtx.liveWorkout._id !== props.workout._id
                )
                  return;
                setSelectedExercise(exercise);
                setIsLoadDialogOpen(true);
              }}
              alteredLoads={alteredLoads ?? []}
            />
          ))}
      </ul>
      {liveWorkoutCtx.liveWorkout != null &&
      liveWorkoutCtx.liveWorkout._id === props.workout._id ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            className={classes.finalize}
            onClick={() => setIsFinalizeWorkoutDialogOpen(true)}
          >
            finalizar treino
          </button>
          <button
            className={classes.cancel}
            onClick={() => setIsCancelWorkoutDialogOpen(true)}
          >
            cancelar treino
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
      <ChangeLoadDialog />
      <FinalizeWorkoutDialog />
      <CancelWorkoutDialog />
    </div>
  );
}
