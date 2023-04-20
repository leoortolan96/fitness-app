import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import MeetupsList from "../components/meetups/MeetupList";
import FavoritesContext from "../store/favorites-context";
import LayoutContext from "../store/layout-context";
import classes from "./AllMeetups.module.css";

// const DUMMY_DATA = [
//   {
//     id: "m1",
//     title: "This is a first meetup",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/2560px-Stadtbild_M%C3%BCnchen.jpg",
//     address: "Meetupstreet 5, 12345 Meetup City",
//     description:
//       "This is a first, amazing meetup which you definitely should not miss. It will be a lot of fun!",
//   },
//   {
//     id: "m2",
//     title: "This is a second meetup",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/2560px-Stadtbild_M%C3%BCnchen.jpg",
//     address: "Meetupstreet 5, 12345 Meetup City",
//     description:
//       "This is a first, amazing meetup which you definitely should not miss. It will be a lot of fun!",
//   },
// ];

function AllMeetupsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedMeetups, setLoadedMeetups] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const favoritesCtx = useContext(FavoritesContext);
  const layoutCtx = useContext(LayoutContext);
  const { enqueueSnackbar } = useSnackbar();

  function setFavoriteMeetupsFromStorage(meetups) {
    const favoritesFromStorage = localStorage.getItem("favorite_meetup_ids");
    const favoriteMeetupIds =
      favoritesFromStorage !== null ? JSON.parse(favoritesFromStorage) : [];
    let favorites = [];
    meetups.forEach((meetup) => {
      if (favoriteMeetupIds.some((meetupId) => meetupId === meetup.id)) {
        favorites = favorites.concat(meetup);
      }
    });
    favoritesCtx.setFavorites(favorites, false);
  }

  useEffect(() => {
    // setIsLoading(true);
    // fetch(
    //   "https://react-course-43389-default-rtdb.firebaseio.comm/meetupss.json"
    // )
    //   .then((response) => {
    //     console.log(response.ok);
    //     if (!response.ok) {
    //       throw Error("Failed to fetch resource - tretaa");
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     const meetups = [];
    //     for (const key in data) {
    //       const meetup = {
    //         id: key,
    //         ...data[key],
    //       };
    //       meetups.push(meetup);
    //     }
    //     setFavoriteMeetupsFromStorage(meetups);
    //     setLoadedMeetups(meetups);
    //     setIsLoading(false);
    //   })
    //   .catch((err) => console.log(err, "aaaaaaaa"));

    // usando async await
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://react-course-43389-default-rtdb.firebaseio.com/meetups.json"
        );
        if (!response.ok) {
          throw Error("Failed to fetch resource");
        }
        const data = await response.json();
        const meetups = [];
        for (const key in data) {
          const meetup = {
            id: key,
            ...data[key],
          };
          meetups.push(meetup);
        }
        setFavoriteMeetupsFromStorage(meetups);
        setLoadedMeetups(meetups);
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage("Error fetching meetups!");
        console.log(error);
        enqueueSnackbar(
          <ul className={classes.snackbar}>
            <li>
              <h3>Error fetching meetups...</h3>
            </li>
            <li>
              <p>Check your connection and try again...</p>
            </li>
          </ul>,
          { variant: "error" }
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section>
        <p>{errorMessage}</p>
      </section>
    );
  }

  return (
    <section>
      <ul className={classes.top}>
        <li>
          <h1>All meetups page</h1>
        </li>
        <li>
          <button onClick={() => layoutCtx.toggleIsGrid()}>
            {layoutCtx.isGridLayout ? "grid" : "lista"}
          </button>
        </li>
      </ul>

      <MeetupsList meetups={loadedMeetups} />
    </section>
  );
}
export default AllMeetupsPage;
