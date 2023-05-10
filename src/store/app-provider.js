import { SnackbarProvider } from "notistack";
import { EditWorkoutContextProvider } from "./edit-workout-context";
import { LayoutContextProvider } from "./layout-context";
import { NavigationContextProvider } from "./navigation-context";

export default function AppProvider(props) {
  return (
    <SnackbarProvider maxSnack={5}>
      <NavigationContextProvider>
        <LayoutContextProvider>
          <EditWorkoutContextProvider>
            {props.children}
          </EditWorkoutContextProvider>
        </LayoutContextProvider>
      </NavigationContextProvider>
    </SnackbarProvider>
  );
}
