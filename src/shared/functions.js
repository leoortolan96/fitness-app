import { useNavigate } from "react-router-dom";

export const useGoBackOrHome = () => {
  const navigate = useNavigate();
  const goBackOrHome = () => {
    const doesAnyHistoryEntryExist = window.location.key !== "default";
    if (doesAnyHistoryEntryExist) navigate(-1);
    else navigate("/", { replace: true });
  };
  return { goBackOrHome };
};
