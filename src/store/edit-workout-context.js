import { createContext, useState } from "react";

const EditWorkoutContext = createContext({
  //   originalWorkout: {},
  editedWorkout: {},
  setEditedWorkout: (workout) => {},
});

export function EditWorkoutContextProvider(props) {
  const [editedWorkout, setEditedWorkout] = useState();
  //   var originalWorkout;

  const context = {
    // originalWorkout: originalWorkout,
    editedWorkout: editedWorkout,
    setEditedWorkout: setEditedWorkout,
  };

  return (
    <EditWorkoutContext.Provider value={context}>
      {props.children}
    </EditWorkoutContext.Provider>
  );
}

export default EditWorkoutContext;
