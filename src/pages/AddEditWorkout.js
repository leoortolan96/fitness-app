import { useSnackbar } from "notistack";
import { useContext, useState } from "react";
import classes from "./AddEditWorkout.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from "../components/layout/AppBar";
import { ExerciseItemEditMode } from "../components/workouts/ExerciseItem";
import { useRef } from "react";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EditWorkoutContext from "../store/edit-workout-context";
import Switch from "react-switch";

function AddEditWorkoutPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isSaveButtonLoading, setIsSaveButtonLoading] = useState(false);
  const [isDeleteButtonLoading, setIsDeleteButtonLoading] = useState(false);
  const editWorkoutCtx = useContext(EditWorkoutContext);
  const location = useLocation();
  const nameInputRef = useRef();
  const descriptionInputRef = useRef();

  let originalWorkout = location?.state?.originalWorkout;

  async function saveWorkout(event) {
    try {
      event.preventDefault();
      setIsSaveButtonLoading(true);
      // await new Promise(resolve => setTimeout(resolve, 2000));
      let enteredName = nameInputRef.current.value.trim();
      let enteredDescription = descriptionInputRef.current.value.trim();
      if (enteredDescription === "") enteredDescription = null;
      let enteredWorkoutIsActive = editWorkoutCtx.workoutIsActive;
      let exercises = editWorkoutCtx.editedWorkout.exercises.map((exercise) => {
        return {
          _id: exercise._id,
          name: exercise.name,
          observation: exercise.observation,
          sets: exercise.sets,
          reps: exercise.reps,
          load: exercise.load,
          is_paused: exercise.is_paused,
        };
      });

      let result = await fetch(
        process.env.REACT_APP_API_ENDPOINT +
          (originalWorkout ? "/edit-workout" : "/add-workout"),
        {
          method: "post",
          body: JSON.stringify({
            id: originalWorkout?._id,
            name: enteredName.trim(),
            description: enteredDescription,
            is_active: enteredWorkoutIsActive,
            exercises: JSON.stringify(exercises),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      result = await result.json();
      if (result.status === 500) throw Error("Error editing workout!");
      navigate(-1);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(
        <ul className={classes.snackbar}>
          <li>
            <h3>Error editing workout...</h3>
          </li>
          <li>
            <p>Check your connection and try again...</p>
          </li>
        </ul>,
        { variant: "error" }
      );
    } finally {
      setIsSaveButtonLoading(false);
    }
  }

  async function deleteWorkout(event) {
    try {
      event.preventDefault();
      setIsDeleteButtonLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      let result = await fetch(
        process.env.REACT_APP_API_ENDPOINT + "/delete-workout",
        {
          method: "post",
          body: JSON.stringify({
            id: originalWorkout?._id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      result = await result.json();
      if (result.status === 500) throw Error("Error deleting workout!");
      setIsDeleteDialogOpen(false);
      navigate(-1);
      setTimeout(() => {
        if (window.location.pathname.startsWith("/workout/" + result.id))
          navigate(-1);
      }, 20);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(
        <ul className={classes.snackbar}>
          <li>
            <h3>Error deleting workout...</h3>
          </li>
          <li>
            <p>Check your connection and try again...</p>
          </li>
        </ul>,
        { variant: "error" }
      );
    } finally {
      setIsDeleteButtonLoading(false);
    }
  }

  return (
    <div>
      <AppBar
        title={originalWorkout ? "EDITAR TREINO" : "NOVO TREINO"}
        showBackButton={true}
      />
      {editWorkoutCtx.editedWorkout != null ? (
        <div>
          <ul className={classes.list}>
            <div className={classes.header}>
              <div style={{ flex: "1 1 auto" }}>EXERCÍCIO</div>
              <div
                style={{ width: "50px", textAlign: "right", padding: "0 5px" }}
              >
                SETS
              </div>
              <div style={{ width: "70px", textAlign: "right" }}>REPS</div>
            </div>
            {editWorkoutCtx.editedWorkout.exercises.map((exercise, index) => (
              <ExerciseItemEditMode
                key={index}
                exercise={exercise}
                onClick={() => {
                  editWorkoutCtx.setExerciseIsPaused(exercise.is_paused);
                  navigate("/edit-exercise/", {
                    state: { originalExercise: exercise, exerciseIndex: index },
                  });
                }}
              />
            ))}
          </ul>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <button
              className={classes.add_exercise}
              onClick={() => {
                editWorkoutCtx.setExerciseIsPaused(false);
                navigate("/edit-exercise/");
              }}
            >
              adicionar exercício
            </button>
          </div>
          <form
            id="workout-form"
            className={classes.form}
            onSubmit={saveWorkout}
          >
            <div className={classes.control}>
              <label htmlFor="name">NOME DO TREINO</label>
              <input
                type="text"
                name="name"
                required
                id="name"
                ref={nameInputRef}
                placeholder="Ex: Treino A"
                defaultValue={originalWorkout?.name}
              />
            </div>
            <div className={classes.control}>
              <label htmlFor="description">DESCRIÇÃO</label>
              <input
                type="text"
                name="description"
                id="description"
                ref={descriptionInputRef}
                placeholder="Ex: Peito, ombro e tríceps"
                defaultValue={originalWorkout?.description}
              />
            </div>
          </form>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              className={classes.switch_button}
              onClick={() =>
                editWorkoutCtx.setWorkoutIsActive(
                  !editWorkoutCtx.workoutIsActive
                )
              }
              style={{ display: "flex", alignItems: "center" }}
            >
              <Switch
                onChange={(_) => {
                  // editWorkoutCtx.setWorkoutIsActive(checked)
                }}
                checked={editWorkoutCtx.workoutIsActive}
                uncheckedIcon={false}
                checkedIcon={false}
                id="workout-switch"
              />
              <div style={{ margin: "0 10px" }}>
                {editWorkoutCtx.workoutIsActive
                  ? "TREINO ATIVO"
                  : "TREINO ARQUIVADO"}
              </div>
            </div>
            <button className={classes.save} form="workout-form" type="submit">
              {isSaveButtonLoading ? "..." : "salvar treino"}
            </button>
            {originalWorkout ? (
              <button
                className={classes.delete}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                {isDeleteButtonLoading ? "..." : "excluir treino"}
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <section>
          <p>Loading...</p>
        </section>
      )}
      <ConfirmDialog
        show={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={deleteWorkout}
        title="EXCLUIR TREINO"
        text="Deseja excluir o treino?"
        secondaryText={originalWorkout?.name}
        isCritical={true}
        buttonText={isDeleteButtonLoading ? "..." : "excluir"}
      />
    </div>
  );
}
export default AddEditWorkoutPage;
