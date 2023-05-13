import AppBar from "../components/layout/AppBar";
import BottomNavBar from "../components/layout/BottomNavBar";
import classes from "./History.module.css";

function HistoryPage() {
  return (
    <div>
      <AppBar title="HISTÓRICO" showBackButton={false} />
      <div className={classes.loading}>Em breve...</div>
      <BottomNavBar />
    </div>
  );
}
export default HistoryPage;
