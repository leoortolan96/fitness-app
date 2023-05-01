import classes from "./BottomNavBar.module.css";
import { FaArrowDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function BottomNavBar() {
  // const navigationCtx = useContext(NavigationContext);
  const navigate = useNavigate();

  function navigateTo(index) {
    switch (index) {
      case 0:
        // console.log("0");
        // navigationCtx.selectIndex(0);
        navigate("/");
        break;
      case 1:
        // console.log("1");
        // navigationCtx.selectIndex(1);
        navigate("/live-workout");
        break;
      case 2:
        // console.log("2");
        // navigationCtx.selectIndex(2);
        navigate("/history");
        break;
      default:
        console.log("Invalid index");
    }
  }

  const path = window.location.pathname;
  return (
    <footer className={classes.footer}>
      <button onClick={() => navigateTo(0)}>
        <div
          className={
            // navigationCtx.currentIndex === 0
            path === "/" ? classes.selectedNavItem : classes.navItem
          }
        >
          <FaArrowLeft size={20} />
          <p>TREINOS</p>
        </div>
      </button>
      <button onClick={() => navigateTo(1)}>
        <div
          className={
            // navigationCtx.currentIndex === 1
            path === "/live-workout" ? classes.selectedNavItem : classes.navItem
          }
        >
          <FaArrowDown size={20} />
          <p>EM ANDAMENTO</p>
        </div>
      </button>
      <button onClick={() => navigateTo(2)}>
        <div
          className={
            // navigationCtx.currentIndex === 2
            path === "/history" ? classes.selectedNavItem : classes.navItem
          }
        >
          <FaArrowRight size={20} />
          <p>HISTÓRICO</p>
        </div>
      </button>
    </footer>
  );
}
