import { createContext, useState } from "react";

const LiveWorkoutContext = createContext({
  liveWorkout: {},
  setLiveWorkout: (workout) => {},
});

export function LiveWorkoutContextProvider(props) {
  const [liveWorkout, setLiveWorkout] = useState();

  const context = {
    liveWorkout: liveWorkout,
    setLiveWorkout: setLiveWorkout,
  };

  return (
    <LiveWorkoutContext.Provider value={context}>
      {props.children}
    </LiveWorkoutContext.Provider>
  );
}

export default LiveWorkoutContext;
