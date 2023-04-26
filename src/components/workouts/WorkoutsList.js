import WorkoutItem from "./WorkoutItem";
import classes from "./WorkoutsList.module.css";

export default function WorkoutsList(props) {
    console.log(props);
  var activeWorkouts = props.workouts
    .filter((workout) => workout.is_active)
    .sort((w1, w2) => (w1.name > w2.name ? 1 : w1.name < w2.name ? -1 : 0));
  var archivedWorkouts = props.workouts
    .filter((workout) => !workout.is_active)
    .sort((w1, w2) => (w1.name > w2.name ? 1 : w1.name < w2.name ? -1 : 0));

  return (
    <ul className={classes.list}>
      <li>TREINOS ATIVOS</li>
      {activeWorkouts.map((workout) => (
        <WorkoutItem key={workout.id} workout={workout} />
      ))}
      <li>TREINOS ARQUIVADOS</li>
      {archivedWorkouts.map((workout) => (
        <WorkoutItem key={workout.id} workout={workout} />
      ))}
    </ul>
  );
}
