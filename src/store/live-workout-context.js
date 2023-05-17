import { createContext, useState } from "react";
import { w3cwebsocket as W3cwebsocket } from "websocket";

const client = new W3cwebsocket(process.env.REACT_APP_API_WEBSOCKET);

client.onopen = () => {
  console.log("Websocket Client Connected!");
  // client.send(
  //   JSON.stringify({
  //     type: "connect",
  //   })
  // );
  client.send(
    JSON.stringify({
      type: "start",
      payload: "live_workout",
    })
  );
};

const LiveWorkoutContext = createContext({
  webSocket: {},
  liveWorkout: {},
  setLiveWorkout: (workout) => {},
});

export function LiveWorkoutContextProvider(props) {
  let webSocket;
  const [liveWorkout, setLiveWorkout] = useState();

  client.onmessage = (message) => {
    // console.log(message.data);
    const data = JSON.parse(message.data);
    if (data.type === "data" && data.payload === "live_workout" && data.data) {
      setLiveWorkout(data.data.is_live ? data.data : null);
    }
  };

  const context = {
    webSocket: webSocket,
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
