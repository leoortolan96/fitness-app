import ExerciseItem from "./ExerciseItem";
import classes from "./WorkoutDetails.module.css";

export default function WorkoutDetails(props) {
  console.log("details:\n" + props.workout.name);
  return (
    <ul className={classes.list}>
      <li>EXERCICIO SETS REPS</li>
      {props.workout.exercises.map((exercise) => (
        <ExerciseItem key={exercise.id} exercise={exercise} />
      ))}
    </ul>
  );
}
