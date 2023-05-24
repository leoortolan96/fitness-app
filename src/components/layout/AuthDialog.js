import ConfirmDialog from "../ui/ConfirmDialog";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";

export default function AuthDialog(props) {
  const authCtx = useContext(AuthContext);

  return (
    <>
      {props.children}
      <ConfirmDialog
        show={!authCtx.isAuthenticated && !authCtx.isLoading}
        onClose={() => {}}
        onConfirm={() => authCtx.loginWithRedirect()}
        title="FAZER LOGIN"
        text="Você deve fazer login para poder visualizar e editar seus treinos!"
        isCritical={false}
        buttonText="fazer login"
      />
    </>
  );
}
