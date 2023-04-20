import { SnackbarProvider } from "notistack";
import { FavoritesContextProvider } from "./favorites-context";
import { LayoutContextProvider } from "./layout-context";

export default function AppProvider(props) {
  return (
    <SnackbarProvider maxSnack={5}>
      <LayoutContextProvider>
        <FavoritesContextProvider>{props.children}</FavoritesContextProvider>
      </LayoutContextProvider>
    </SnackbarProvider>
  );
}
