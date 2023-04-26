import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AllMeetupsPage from "./pages/AllMeetups";
import FavoritesPage from "./pages/Favorites";
import LiveWorkoutPage from "./pages/LiveWorkout";
import MyWorkoutsPage from "./pages/MyWorkouts";
import NewMeetupPage from "./pages/NewMeetup";
import WorkoutDetailsPage from "./pages/WorkoutDetailsPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<MyWorkoutsPage />} />
        <Route path="/workout-details" element={<WorkoutDetailsPage />} />
        <Route path="/live-workout" element={<LiveWorkoutPage />} />
        <Route path="/meetups" element={<AllMeetupsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/new-meetup" element={<NewMeetupPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
