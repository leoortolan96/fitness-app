import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import AppBar from "../components/layout/AppBar";
import BottomNavBar from "../components/layout/BottomNavBar";
import WorkoutsList from "../components/workouts/WorkoutsList";
import classes from "./MyWorkouts.module.css";

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

  useEffect(() => {
    // setIsLoading(true);
    // fetch(
    //   "https://react-course-43389-default-rtdb.firebaseio.comm/meetupss.json"
    // )
    //   .then((response) => {
    //     console.log(response.ok);
    //     if (!response.ok) {
    //       throw Error("Failed to fetch resource - tretaa");
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     const meetups = [];
    //     for (const key in data) {
    //       const meetup = {
    //         id: key,
    //         ...data[key],
    //       };
    //       meetups.push(meetup);
    //     }
    //     setFavoriteMeetupsFromStorage(meetups);
    //     setLoadedMeetups(meetups);
    //     setIsLoading(false);
    //   })
    //   .catch((err) => console.log(err, "aaaaaaaa"));

    // usando async await
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch(
          process.env.REACT_APP_API_ENDPOINT + "/workouts"
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
  }, []);

  return (
    <div>
      <AppBar title="MEUS TREINOS" showBackButton={false} />
      {isLoading ? (
        <section>
          <p>Loading...</p>
        </section>
      ) : errorMessage ? (
        <section>
          <p>{errorMessage}</p>
        </section>
      ) : (
        <section>
          <WorkoutsList workouts={loadedWorkouts} />
        </section>
      )}
      <BottomNavBar />
    </div>
  );
}
export default MyWorkoutsPage;
