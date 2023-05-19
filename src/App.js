import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AddEditExercisePage from "./pages/AddEditExercise";
import AddEditWorkoutPage from "./pages/AddEditWorkout";
import AllMeetupsPage from "./pages/AllMeetups";
import FavoritesPage from "./pages/Favorites";
import HistoryPage from "./pages/History";
import LiveWorkoutPage from "./pages/LiveWorkout";
import MyWorkoutsPage from "./pages/MyWorkouts";
import NewMeetupPage from "./pages/NewMeetup";
import WorkoutDetailsPage from "./pages/WorkoutDetailsPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<MyWorkoutsPage />} />
        <Route path="/workout/:id" element={<WorkoutDetailsPage />} />
        <Route path="/live-workout" element={<LiveWorkoutPage />} />
        <Route path="/edit-workout" element={<AddEditWorkoutPage />} />
        <Route path="/edit-exercise" element={<AddEditExercisePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/meetups" element={<AllMeetupsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/new-meetup" element={<NewMeetupPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
