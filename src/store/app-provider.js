import { SnackbarProvider } from "notistack";
import { AuthContextProvider } from "./auth-context";
import { EditWorkoutContextProvider } from "./edit-workout-context";
import { LayoutContextProvider } from "./layout-context";
import { LiveWorkoutContextProvider } from "./live-workout-context";
import { NavigationContextProvider } from "./navigation-context";
import { WebsocketContextProvider } from "./websocket-context";
import { Auth0Provider } from "@auth0/auth0-react";

export default function AppProvider(props) {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      // redirectUri={window.location.origin}
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <SnackbarProvider maxSnack={5}>
        <NavigationContextProvider>
          <LayoutContextProvider>
            <EditWorkoutContextProvider>
              <AuthContextProvider>
                <LiveWorkoutContextProvider>
                  <WebsocketContextProvider>
                    {props.children}
                  </WebsocketContextProvider>
                </LiveWorkoutContextProvider>
              </AuthContextProvider>
            </EditWorkoutContextProvider>
          </LayoutContextProvider>
        </NavigationContextProvider>
      </SnackbarProvider>
    </Auth0Provider>
  );
}
