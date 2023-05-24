import { useContext, useState } from "react";
import AppBar from "../components/layout/AppBar";
import BottomNavBar from "../components/layout/BottomNavBar";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import AuthContext from "../store/auth-context";
import classes from "./Profile.module.css";

function ProfilePage() {
  const authCtx = useContext(AuthContext);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  return (
    <div>
      <AppBar title="PERFIL" showBackButton={false} />
      <div className={classes.loading}>Mais funcionalidades em breve...</div>
      {authCtx.isAuthenticated ? (
        <>
          <div className={classes.bottom}>
            <button
              className={classes.logout}
              onClick={() => setIsLogoutDialogOpen(true)}
            >
              fazer logout
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
      <ConfirmDialog
        show={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={() => authCtx.logout()}
        title="FAZER LOGOUT"
        text="Tem certeza que deseja sair da sua conta?"
        isCritical={true}
        buttonText="fazer logout"
      />
      <BottomNavBar />
    </div>
  );
}
export default ProfilePage;
