import { createContext, useContext, useEffect, useRef, useState } from "react";
import { w3cwebsocket as W3cwebsocket } from "websocket";
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
  console.log("rodou o websocket context provider");

  function setNewClientHandler() {
    console.log(`[${new Date()}]  executando setNewClient()`);
    let newClient = new W3cwebsocket(process.env.REACT_APP_API_WEBSOCKET);

    newClient.onopen = () => {
      console.log("Websocket Client Connected!");
      setClient(newClient);
      newClient.send(
        JSON.stringify({
          type: "connect",
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
        console.log("condicao foi atendida");
        liveWorkoutCtx.setLiveWorkout(data.data?.is_live ? data.data : null);
      }
    };

    newClient.onclose = () => {
      console.log(`[${new Date()}]  On Close do Websocket`);
      console.log(
        "onClose client: " + (!clientRef.current ? "nenhum" : clientRef.current)
      );
      if (clientRef.current) {
        console.log("setando client para null");
        setClient(null);
      }
    };
    // setClient(newClient);
  }

  useEffect(() => {
    console.log("rodou o useEffect");
    function visibilityChangeHandler() {
      console.log(
        `[${new Date()}]  mudou visibilidade para: ${document.visibilityState}`
      );
      if (document.visibilityState === "visible") {
        console.log(
          "listener client: " +
            (!clientRef.current ? "nenhum" : clientRef.current)
        );
        if (!clientRef.current) setNewClientHandler();
      }
    }
    document.addEventListener("visibilitychange", visibilityChangeHandler);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log(
      "antes client: " + (!clientRef.current ? "nenhum" : clientRef.current)
    );
    if (!clientRef.current) setNewClientHandler();
    console.log(
      "depois client: " + (!clientRef.current ? "nenhum" : clientRef.current)
    );
    // eslint-disable-next-line
  }, [client]);

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
