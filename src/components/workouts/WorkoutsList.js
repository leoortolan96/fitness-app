import WorkoutItem from "./WorkoutItem";
import classes from "./WorkoutsList.module.css";

export default function WorkoutsList(props) {
  var activeWorkouts = props.workouts
    .filter((workout) => workout.is_active)
    .sort((w1, w2) => (w1.name > w2.name ? 1 : w1.name < w2.name ? -1 : 0));
  var archivedWorkouts = props.workouts
    .filter((workout) => !workout.is_active)
    .sort((w1, w2) => (w1.name > w2.name ? 1 : w1.name < w2.name ? -1 : 0));

  return (
    <ul className={classes.list}>
      <li className={classes.section_title}>TREINOS ATIVOS</li>
      {activeWorkouts.length > 0 ? (
        activeWorkouts.map((workout) => (
          <WorkoutItem key={workout.id} workout={workout} />
        ))
      ) : (
        <p className={classes.empty}>Nenhum treino ativo...</p>
      )}
      <li className={classes.section_title}>TREINOS ARQUIVADOS</li>
      {archivedWorkouts.length > 0 ? (
        archivedWorkouts.map((workout) => (
          <WorkoutItem key={workout.id} workout={workout} />
        ))
      ) : (
        <p className={classes.empty}>Nenhum treino arquivado...</p>
      )}
    </ul>
  );
}
