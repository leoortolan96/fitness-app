import { useSnackbar } from "notistack";
import { useState } from "react";
import classes from "./AddEditWorkout.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from "../components/layout/AppBar";
import { ExerciseItemEditMode } from "../components/workouts/ExerciseItem";
import { useRef } from "react";
import ConfirmDialog from "../components/ui/ConfirmDialog";

function AddEditWorkoutPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isSaveButtonLoading, setIsSaveButtonLoading] = useState(false);
  const [isDeleteButtonLoading, setIsDeleteButtonLoading] = useState(false);

  const nameInputRef = useRef();
  const descriptionInputRef = useRef();
  const location = useLocation();
  const originalWorkout = location?.state?.originalWorkout;
  // console.log(JSON.stringify(originalWorkout));
  const [editedWorkout, setEditedWorkout] = useState(
    originalWorkout ?? { exercises: [] }
  );

  async function saveWorkout(event) {
    try {
      event.preventDefault();
      setIsSaveButtonLoading(true);
      // await new Promise(resolve => setTimeout(resolve, 2000));
      let enteredName = nameInputRef.current.value;
      let enteredDescription = descriptionInputRef.current.value.trim();
      if (enteredDescription === "") enteredDescription = null;

      let result = await fetch(
        process.env.REACT_APP_API_ENDPOINT +
          (originalWorkout ? "/edit-workout" : "/add-workout"),
        {
          method: "post",
          body: JSON.stringify({
            id: originalWorkout?._id,
            name: enteredName.trim(),
            description: enteredDescription,
            is_active: true, //TODO implementar o switch
            exercises: JSON.stringify(editedWorkout.exercises),
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
      <div>
        <ul className={classes.list}>
          <li>EXERCICIO SETS REPS</li>
          {editedWorkout.exercises.map((exercise) => (
            <ExerciseItemEditMode
              key={exercise._id}
              exercise={exercise}
              onClick={() => {
                console.log("editar exercicio: " + exercise.name);
              }}
            />
          ))}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <button
              className={classes.add_exercise}
              onClick={() => console.log("adicionar exercicio")}
            >
              adicionar exercício
            </button>
          </div>
        </ul>
        <form id="workout-form" className={classes.form} onSubmit={saveWorkout}>
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
