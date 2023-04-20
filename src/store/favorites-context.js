import { createContext, useState } from "react";

const FavoritesContext = createContext({
  favorites: [],
  totalFavorites: 0,
  addFavorite: (favoriteMeetup, saveToLocalStorage) => {},
  removeFavorite: (meetupId) => {},
  itemIsFavorite: (meetupId) => {},
  setFavorites: (favoriteMeetups) => {},
});

export function FavoritesContextProvider(props) {
  const [userFavorites, setUserFavorites] = useState([]);

  function addFavoriteHandler(favoriteMeetup, saveToLocalStorage) {
    setUserFavorites((prevUserFavorites) => {
      var result = prevUserFavorites;
      if (!result.some((meetup) => meetup.id === favoriteMeetup.id)) {
        result = result.concat(favoriteMeetup);
      }
      if (saveToLocalStorage) {
        localStorage.setItem(
          "favorite_meetup_ids",
          JSON.stringify(result.map((meetup) => meetup.id))
        );
      }
      // console.log(JSON.stringify(result.map((meetup) => meetup.id)));
      return result;
    });
  }

  function removeFavoriteHandler(meetupId) {
    setUserFavorites((prevUserFavorites) => {
      const result = prevUserFavorites.filter(
        (meetup) => meetupId !== meetup.id
      );
      localStorage.setItem(
        "favorite_meetup_ids",
        JSON.stringify(result.map((meetup) => meetup.id))
      );
      // console.log(JSON.stringify(result.map((meetup) => meetup.id)));
      return result;
    });
  }

  function itemIsFavoriteHandler(meetupId) {
    return userFavorites.some((meetup) => meetupId === meetup.id);
  }

  function setFavoritesHandler(favoriteMeetups) {
    setUserFavorites(favoriteMeetups);
  }

  const context = {
    favorites: userFavorites,
    totalFavorites: userFavorites.length,
    addFavorite: addFavoriteHandler,
    removeFavorite: removeFavoriteHandler,
    itemIsFavorite: itemIsFavoriteHandler,
    setFavorites: setFavoritesHandler,
  };

  return (
    <FavoritesContext.Provider value={context}>
      {props.children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesContext;