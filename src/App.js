import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AddEditExercisePage from "./pages/AddEditExercise";
import AddEditWorkoutPage from "./pages/AddEditWorkout";
import AllMeetupsPage from "./pages/AllMeetups";
import FavoritesPage from "./pages/Favorites";
import ProfilePage from "./pages/Profile";
import LiveWorkoutPage from "./pages/LiveWorkout";
import MyWorkoutsPage from "./pages/MyWorkouts";
import NewMeetupPage from "./pages/NewMeetup";
import WorkoutDetailsPage from "./pages/WorkoutDetailsPage";

function App() {
  return (
    // <AuthDialog>
    <Layout>
      <Routes>
        <Route path="/" element={<MyWorkoutsPage />} />
        <Route path="/workout/:id" element={<WorkoutDetailsPage />} />
        <Route path="/live-workout" element={<LiveWorkoutPage />} />
        <Route path="/edit-workout" element={<AddEditWorkoutPage />} />
        <Route path="/edit-exercise" element={<AddEditExercisePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/meetups" element={<AllMeetupsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/new-meetup" element={<NewMeetupPage />} />
        <Route path="/*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
    // </AuthDialog>
  );
}

export default App;
