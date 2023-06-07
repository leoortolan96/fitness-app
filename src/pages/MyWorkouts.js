import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import AppBar from "../components/layout/AppBar";
import BottomNavBar from "../components/layout/BottomNavBar";
import WorkoutsList from "../components/workouts/WorkoutsList";
import classes from "./MyWorkouts.module.css";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import EditWorkoutContext from "../store/edit-workout-context";
import AuthContext from "../store/auth-context";

// const DUMMY_DATA = [
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
//   },
// ];

function MyWorkoutsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedWorkouts, setLoadedWorkouts] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const editWorkoutCtx = useContext(EditWorkoutContext);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!authCtx.user) {
          setLoadedWorkouts([]);
          setErrorMessage(null);
        } else {
          setIsLoading(true);
          let userId = authCtx.user.sub.split("|")[1];
          let tokenClaims = await authCtx.getIdTokenClaims();
          const response = await fetch(
            process.env.REACT_APP_API_ENDPOINT + "/workouts/" + userId,
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
          var workouts = [];
          for (const key in data["workouts"]) {
            const workout = {
              id: data["workouts"][key]["_id"],
              ...data["workouts"][key],
            };
            workouts.push(workout);
          }
          // setLoadedWorkouts(DUMMY_DATA);
          setLoadedWorkouts(workouts);
          setErrorMessage(null);
        }
      } catch (error) {
        setErrorMessage("Error fetching workouts!");
        console.log(error);
        enqueueSnackbar(
          <ul className={classes.snackbar}>
            <li>
              <h3>Error fetching workouts...</h3>
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
  }, [authCtx.user]);

  return (
    <div>
      <AppBar
        title="MEUS TREINOS"
        showBackButton={false}
        actionIcon={<FaPlus size={20} />}
        action={() => {
          editWorkoutCtx.setEditedWorkout({ exercises: [] });
          editWorkoutCtx.setWorkoutIsActive(true);
          navigate("/edit-workout/");
        }}
      />
      <div className={classes.page}>
        <div className={classes.list}>
          {!authCtx.isAuthenticated && !authCtx.isLoading ? (
            <div className={classes.loading}>Faça login para continuar...</div>
          ) : isLoading || authCtx.isLoading ? (
            <div className={classes.loading}>Loading...</div>
          ) : errorMessage ? (
            <div className={classes.loading}>{errorMessage}</div>
          ) : (
            <WorkoutsList workouts={loadedWorkouts} />
          )}
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
}
export default MyWorkoutsPage;
