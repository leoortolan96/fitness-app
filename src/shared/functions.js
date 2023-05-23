import { useLocation, useNavigate } from "react-router-dom";

export const useGoBackOrHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const goBackOrHome = () => {
    const doesAnyHistoryEntryExist = location.key !== "default";
    if (doesAnyHistoryEntryExist) navigate(-1);
    else navigate("/", { replace: true });
  };
  return { goBackOrHome };
};
