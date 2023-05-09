import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppBar from "../components/layout/AppBar";
import WorkoutDetails from "../components/workouts/WorkoutDetails";
import classes from "./WorkoutDetailsPage.module.css";
import { FaEdit } from "react-icons/fa";

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

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch(
          process.env.REACT_APP_API_ENDPOINT + "/workout/" + id
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
          loadedWorkout && !loadedWorkout.is_live ? <FaEdit size={20} /> : null
        }
        action={
          loadedWorkout && !loadedWorkout.is_live
            ? () => {
                if (!loadedWorkout.is_live)
                  navigate("/edit-workout/", {
                    state: { originalWorkout: loadedWorkout },
                  });
              }
            : null
        }
      />
      {isLoading ? (
        <section>
          <p>Loading...</p>
        </section>
      ) : errorMessage ? (
        <section>
          <p>{errorMessage}</p>
        </section>
      ) : !loadedWorkout ? (
        <section>
          <p>"Nenhum treino para mostrar..."</p>
        </section>
      ) : (
        <section>
          <WorkoutDetails workout={loadedWorkout} />
        </section>
      )}
    </div>
  );
}
export default WorkoutDetailsPage;
