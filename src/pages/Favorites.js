import { useContext } from "react";
import MeetupsList from "../components/meetups/MeetupList";
import FavoritesContext from "../store/favorites-context";

function FavoritesPage() {
  const favoritesCtx = useContext(FavoritesContext);

  return (
    <section>
      <h1>Favorites</h1>
      {favoritesCtx.totalFavorites > 0 ? (
        <MeetupsList meetups={favoritesCtx.favorites} />
      ) : (
        <p>You got no favorites yet. Start adding some?</p>
      )}
    </section>
  );
}
export default FavoritesPage;
