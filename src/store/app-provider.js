import { SnackbarProvider } from "notistack";
import { EditWorkoutContextProvider } from "./edit-workout-context";
import { LayoutContextProvider } from "./layout-context";
import { LiveWorkoutContextProvider } from "./live-workout-context";
import { NavigationContextProvider } from "./navigation-context";
import { WebsocketContextProvider } from "./websocket-context";

export default function AppProvider(props) {
  return (
    <SnackbarProvider maxSnack={5}>
      <NavigationContextProvider>
        <LayoutContextProvider>
          <EditWorkoutContextProvider>
            <LiveWorkoutContextProvider>
              <WebsocketContextProvider>
                {props.children}
              </WebsocketContextProvider>
            </LiveWorkoutContextProvider>
          </EditWorkoutContextProvider>
        </LayoutContextProvider>
      </NavigationContextProvider>
    </SnackbarProvider>
  );
}
