import ExerciseItem from "./ExerciseItem";
import classes from "./WorkoutDetails.module.css";

export default function WorkoutDetails(props) {
  return (
    <ul className={classes.list}>
      <li>EXERCICIO SETS REPS</li>
      {props.workout.exercises.map((exercise) => (
        <ExerciseItem key={exercise.id} exercise={exercise} />
      ))}
    </ul>
  );
}
