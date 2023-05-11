import { createContext, useState } from "react";

const EditWorkoutContext = createContext({
  //   originalWorkout: {},
  editedWorkout: {},
  setEditedWorkout: (workout) => {},
  workoutIsActive: {},
  setWorkoutIsActive: (isActive) => {},
  exerciseIsPaused: {},
  setExerciseIsPaused: (isActive) => {},
});

export function EditWorkoutContextProvider(props) {
  const [editedWorkout, setEditedWorkout] = useState();
  const [workoutIsActive, setWorkoutIsActive] = useState();
  const [exerciseIsPaused, setExerciseIsPaused] = useState();
  //   var originalWorkout;

  const context = {
    // originalWorkout: originalWorkout,
    editedWorkout: editedWorkout,
    setEditedWorkout: setEditedWorkout,
    workoutIsActive: workoutIsActive,
    setWorkoutIsActive: setWorkoutIsActive,
    exerciseIsPaused: exerciseIsPaused,
    setExerciseIsPaused: setExerciseIsPaused,
  };

  return (
    <EditWorkoutContext.Provider value={context}>
      {props.children}
    </EditWorkoutContext.Provider>
  );
}

export default EditWorkoutContext;
