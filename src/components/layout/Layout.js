import classes from "./Layout.module.css";

export default function Layout(props) {
  return <main className={classes.main}>{props.children}</main>;
  // return (
  //   <div className={classes.navigation}>
  //     <AppBar />
  //     <main className={classes.main}>{props.children}</main>
  //     <BottomNavBar />
  //   </div>
  // );
}
