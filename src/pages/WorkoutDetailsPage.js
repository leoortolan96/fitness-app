import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WorkoutDetails from "../components/workouts/WorkoutDetails";
import classes from "./WorkoutDetailsPage.module.css";

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
  const {id} = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch(
          "http://localhost:5000/workout/" + id
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

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section>
        <p>{errorMessage}</p>
      </section>
    );
  }

  return (
    <section>
      <WorkoutDetails workout={loadedWorkout} />
    </section>
  );
}
export default WorkoutDetailsPage;
