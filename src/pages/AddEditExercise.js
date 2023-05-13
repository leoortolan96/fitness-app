import { useSnackbar } from "notistack";
import { useContext, useState } from "react";
import classes from "./AddEditExercise.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from "../components/layout/AppBar";
import { useRef } from "react";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EditWorkoutContext from "../store/edit-workout-context";
import Switch from "react-switch";

function AddEditExercisePage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const editWorkoutCtx = useContext(EditWorkoutContext);

  const nameInputRef = useRef();
  const observationInputRef = useRef();
  const setsInputRef = useRef();
  const repsInputRef = useRef();
  const loadInputRef = useRef();
  const location = useLocation();
  const originalExercise = location?.state?.originalExercise;
  const exerciseIndex = location?.state?.exerciseIndex;

  async function saveExercise(event) {
    try {
      event.preventDefault();
      let editedExercise = {
        _id: originalExercise?._id,
        name: nameInputRef.current.value.trim(),
        observation: observationInputRef.current.value.trim(),
        sets: setsInputRef.current.value.trim(),
        reps: repsInputRef.current.value.trim(),
        load: loadInputRef.current.value.trim(),
        is_paused: editWorkoutCtx.exerciseIsPaused,
      };
      if (editedExercise.observation === "") editedExercise.observation = null;
      if (editedExercise.load === "") editedExercise.load = null;

      let editedWorkout = editWorkoutCtx.editedWorkout;
      if (originalExercise)
        editedWorkout.exercises[exerciseIndex] = editedExercise;
      else editedWorkout.exercises.push(editedExercise);
      editWorkoutCtx.setEditedWorkout(editedWorkout);
      navigate(-1);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(
        <ul className={classes.snackbar}>
          <li>
            <h3>Error editing exercise...</h3>
          </li>
          <li>
            <p>Check your connection and try again...</p>
          </li>
        </ul>,
        { variant: "error" }
      );
    }
  }

  async function deleteExercise(event) {
    try {
      event.preventDefault();
      let editedWorkout = editWorkoutCtx.editedWorkout;
      editedWorkout.exercises.splice(exerciseIndex, 1);
      editWorkoutCtx.setEditedWorkout(editedWorkout);
      setIsDeleteDialogOpen(false);
      navigate(-1);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(
        <ul className={classes.snackbar}>
          <li>
            <h3>Error deleting exercise...</h3>
          </li>
          <li>
            <p>Check your connection and try again...</p>
          </li>
        </ul>,
        { variant: "error" }
      );
    }
  }

  return (
    <div>
      <AppBar
        title={originalExercise ? "EDITAR EXERCÍCIO" : "NOVO EXERCÍCIO"}
        showBackButton={true}
      />
      <div>
        <form
          id="exercise-form"
          className={classes.form}
          onSubmit={saveExercise}
        >
          <div className={classes.control}>
            <label htmlFor="name">NOME DO EXERCÍCIO</label>
            <input
              required
              type="text"
              name="name"
              id="name"
              ref={nameInputRef}
              placeholder="Ex: Supino reto"
              defaultValue={originalExercise?.name}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="observation">OBSERVAÇÃO</label>
            <input
              type="text"
              name="observation"
              id="observation"
              ref={observationInputRef}
              placeholder="Ex: Com alteres"
              defaultValue={originalExercise?.observation}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="sets">SÉRIES</label>
            <input
              required
              type="text"
              name="sets"
              id="sets"
              ref={setsInputRef}
              placeholder="Ex: 3"
              defaultValue={originalExercise?.sets}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="reps">REPETIÇÕES</label>
            <input
              required
              type="text"
              name="reps"
              id="reps"
              ref={repsInputRef}
              placeholder="Ex: 10, 12-15"
              defaultValue={originalExercise?.reps}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="load">CARGA</label>
            <input
              type="text"
              name="load"
              id="load"
              ref={loadInputRef}
              placeholder="Ex: 10, 5/6/7"
              defaultValue={originalExercise?.load}
            />
          </div>
        </form>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            className={classes.switch_button}
            onClick={() =>
              editWorkoutCtx.setExerciseIsPaused(
                !editWorkoutCtx.exerciseIsPaused
              )
            }
            style={{ display: "flex", alignItems: "center" }}
          >
            <Switch
              onChange={(_) => {
                // editWorkoutCtx.setExerciseIsPaused(!checked);
              }}
              checked={!editWorkoutCtx.exerciseIsPaused}
              uncheckedIcon={false}
              checkedIcon={false}
              id="exercise-switch"
            />
            <div style={{ margin: "0 10px" }}>
              {editWorkoutCtx.exerciseIsPaused
                ? "EXERCÍCIO PAUSADO"
                : "EXERCÍCIO ATIVO"}
            </div>
          </div>
          <button className={classes.save} form="exercise-form" type="submit">
            salvar exercício
          </button>
          {originalExercise ? (
            <button
              className={classes.delete}
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              excluir exercício
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <ConfirmDialog
        show={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={deleteExercise}
        title="EXCLUIR EXERCÍCIO"
        text="Deseja excluir o exercício?"
        secondaryText={
          originalExercise?.name +
          ", " +
          originalExercise?.sets +
          "x" +
          originalExercise?.reps
        }
        isCritical={true}
        buttonText="excluir"
      />
    </div>
  );
}
export default AddEditExercisePage;
