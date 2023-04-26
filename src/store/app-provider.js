import { SnackbarProvider } from "notistack";
import { FavoritesContextProvider } from "./favorites-context";
import { LayoutContextProvider } from "./layout-context";
import { NavigationContextProvider } from "./navigation-context";

export default function AppProvider(props) {
  return (
    <SnackbarProvider maxSnack={5}>
      <NavigationContextProvider>
        <LayoutContextProvider>
          <FavoritesContextProvider>{props.children}</FavoritesContextProvider>
        </LayoutContextProvider>
      </NavigationContextProvider>
    </SnackbarProvider>
  );
}
