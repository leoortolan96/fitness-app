import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppBar from "../components/layout/AppBar";
import WorkoutDetails from "../components/workouts/WorkoutDetails";
import classes from "./WorkoutDetailsPage.module.css";
import { FaEdit } from "react-icons/fa";
import EditWorkoutContext from "../store/edit-workout-context";
import LiveWorkoutContext from "../store/live-workout-context";
import AuthContext from "../store/auth-context";

// const DUMMY_DATA =
//   {
//     id: "123",
//     name: "TREINO 1",
//     description: "Descricao",
//     is_active: true, //default true
//     is_live: false, //default false ("em andamento")
//     created_at: Date.parse("2022-12-17T03:24:00"),
//     updated_at: Date.parse("2022-12-17T03:24:00"),
//     workout_sessions: [
//       //contador de sessoes, primeira e ultima sessoes
//       {
//         session_datetime: Date.parse("2022-09-05T03:24:00"),
//         session_duration: 92, //minutes
//       },
//       {
//         session_datetime: Date.parse("2022-12-22T22:24:00"),
//         session_duration: 108, //minutes
//       },
//     ],
//     exercises: [
//       {
//         id: "1",
//         name: "Supino reto",
//         observation: null,
//         sets: "4",
//         reps: "12",
//         load: "60",
//         is_paused: false, //default false
//         created_at: Date.parse("2022-12-17T04:24:00"),
//         updated_at: Date.parse("2022-12-17T08:12:00"),
//         sessions: [
//           {
//             session_datetime: Date.parse("2022-09-18T03:24:00"),
//             session_load: "55",
//           },
//           {
//             session_datetime: Date.parse("2022-12-22T22:24:00"),
//             session_load: "60",
//           },
//         ],
//       },
//       {
//         id: "2",
//         name: "Triceps maquina",
//         observation: "3s isometria",
//         sets: "3",
//         reps: "15",
//         load: "8",
//         is_paused: false, //default false
//         created_at: Date.parse("2022-12-18T04:24:00"),
//         updated_at: Date.parse("2022-12-18T08:12:00"),
//         sessions: [
//           {
//             session_datetime: Date.parse("2022-09-18T03:24:00"),
//             session_load: "6",
//           },
//           {
//             session_datetime: Date.parse("2022-12-22T22:24:00"),
//             session_load: "7",
//           },
//         ],
//       },
//     ],
//   };

function WorkoutDetailsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedWorkout, setLoadedWorkout] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const navigate = useNavigate();
  const editWorkoutCtx = useContext(EditWorkoutContext);
  const liveWorkoutCtx = useContext(LiveWorkoutContext);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        let tokenClaims = await authCtx.getIdTokenClaims();
        const response = await fetch(
          process.env.REACT_APP_API_ENDPOINT + "/workout/" + id,
          {
            method: "get",
            headers: {
              Authorization: "Bearer " + tokenClaims.__raw,
            },
          }
        );
        if (!response.ok) {
          throw Error("Failed to fetch resource");
        }
        const data = await response.json();
        // setLoadedWorkout(DUMMY_DATA);
        setLoadedWorkout(data["workout"]);
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage("Error fetching workout!");
        console.log(error);
        enqueueSnackbar(
          <ul className={classes.snackbar}>
            <li>
              <h3>Error fetching workout...</h3>
            </li>
            <li>
              <p>Check your connection and try again...</p>
            </li>
          </ul>,
          { variant: "error" }
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <AppBar
        title={loadedWorkout?.name}
        showBackButton={true}
        actionIcon={
          liveWorkoutCtx.liveWorkout == null ||
          liveWorkoutCtx.liveWorkout._id !== loadedWorkout._id ? (
            <FaEdit size={20} />
          ) : null
        }
        action={
          liveWorkoutCtx.liveWorkout == null ||
          liveWorkoutCtx.liveWorkout._id !== loadedWorkout._id
            ? () => {
                editWorkoutCtx.setEditedWorkout(loadedWorkout);
                editWorkoutCtx.setWorkoutIsActive(loadedWorkout.is_active);
                navigate("/edit-workout/", {
                  state: { originalWorkout: loadedWorkout },
                });
              }
            : null
        }
      />
      {isLoading ? (
        <div className={classes.loading}>Loading...</div>
      ) : errorMessage ? (
        <div className={classes.loading}>{errorMessage}</div>
      ) : !loadedWorkout ? (
        <div className={classes.loading}>Nenhum treino para mostrar...</div>
      ) : (
        <WorkoutDetails workout={loadedWorkout} />
      )}
    </div>
  );
}
export default WorkoutDetailsPage;
