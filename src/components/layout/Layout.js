import BottomNavBar from "./BottomNavBar";
import classes from "./Layout.module.css";
import MainNavigation from "./MainNavigation";

export default function Layout(props) {
  return (
    <div className={classes.navigation}>
      <MainNavigation />
      <main className={classes.main}>{props.children}</main>
      <BottomNavBar />
    </div>
  );
}
