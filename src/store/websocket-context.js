import { createContext, useContext, useEffect, useRef, useState } from "react";
import { w3cwebsocket as W3cwebsocket } from "websocket";
import AuthContext from "./auth-context";
import LiveWorkoutContext from "./live-workout-context";

const WebsocketContext = createContext({
  client: {},
  setNewClient: (client) => {},
});

export function WebsocketContextProvider(props) {
  const [client, _setClient] = useState();
  const clientRef = useRef(client);
  const setClient = (data) => {
    clientRef.current = data;
    _setClient(data);
  };
  const liveWorkoutCtx = useContext(LiveWorkoutContext);
  const authCtx = useContext(AuthContext);

  function setNewClientHandler() {
    if (!authCtx.user) return;
    // console.log(`[${new Date()}]  executando setNewClient()`);
    let newClient = new W3cwebsocket(process.env.REACT_APP_API_WEBSOCKET);

    newClient.onopen = () => {
      // console.log("Websocket Client Connected!");
      setClient(newClient);
      let userId = authCtx.user?.sub.split("|")[1];
      newClient.send(
        JSON.stringify({
          type: "connect",
          user_id: userId,
        })
      );
      newClient.send(
        JSON.stringify({
          type: "start",
          payload: "live_workout",
        })
      );
    };

    newClient.onmessage = (message) => {
      // console.log("message received:\n" + message.data);
      const data = JSON.parse(message.data);
      if (data.type === "data" && data.payload === "live_workout") {
        liveWorkoutCtx.setLiveWorkout(data.data?.is_live ? data.data : null);
      }
    };

    newClient.onclose = () => {
      // console.log(`[${new Date()}]  On Close do Websocket`);
      if (clientRef.current) {
        setClient(null);
      }
    };
    // setClient(newClient);
  }

  useEffect(() => {
    function visibilityChangeHandler() {
      if (document.visibilityState === "visible") {
        if (!clientRef.current) setNewClientHandler();
      }
    }
    document.addEventListener("visibilitychange", visibilityChangeHandler);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!clientRef.current) setNewClientHandler();
    // eslint-disable-next-line
  }, [client]);

  useEffect(() => {
    if (clientRef.current)
      clientRef.current.send(
        JSON.stringify({
          type: "disconnect",
        })
      );
    setNewClientHandler();
    // eslint-disable-next-line
  }, [authCtx.user]);

  const context = {
    client: clientRef.current,
    setNewClient: setNewClientHandler,
  };

  return (
    <WebsocketContext.Provider value={context}>
      {props.children}
    </WebsocketContext.Provider>
  );
}

export default WebsocketContext;
