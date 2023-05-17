import { useContext } from "react";
import AppBar from "../components/layout/AppBar";
import BottomNavBar from "../components/layout/BottomNavBar";
import WorkoutDetails from "../components/workouts/WorkoutDetails";
import LiveWorkoutContext from "../store/live-workout-context";
import classes from "./LiveWorkout.module.css";

function LiveWorkoutPage() {
  const liveWorkoutCtx = useContext(LiveWorkoutContext);

  return (
    <div style={{ paddingBottom: "60px" }}>
      <AppBar
        title={
          liveWorkoutCtx.liveWorkout
            ? liveWorkoutCtx.liveWorkout.name
            : "EM ANDAMENTO"
        }
        showBackButton={false}
      />
      {
        // isLoading ? (
        //   <div className={classes.loading}>Loading...</div>
        // ) : errorMessage ? (
        //   <div className={classes.loading}>{errorMessage}</div>
        // ) :
        !liveWorkoutCtx.liveWorkout ? (
          <div className={classes.loading}>
            <p>Nenhum treino em andamento </p>
            <p>Inicie um treino para que ele seja mostrado aqui </p>
          </div>
        ) : (
          <WorkoutDetails workout={liveWorkoutCtx.liveWorkout} />
        )
      }
      <BottomNavBar />
    </div>
  );
}
export default LiveWorkoutPage;
