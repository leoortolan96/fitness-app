import classes from "./BottomNavBar.module.css";
import { useNavigate } from "react-router-dom";
import { TbWeight, TbPlayerPlay, TbUser } from "react-icons/tb";

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
        navigate("/profile");
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
          <TbWeight size={24} />
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
          <TbPlayerPlay size={24} />
          <p>EM ANDAMENTO</p>
        </div>
      </button>
      <button onClick={() => navigateTo(2)}>
        <div
          className={
            // navigationCtx.currentIndex === 2
            path === "/profile" ? classes.selectedNavItem : classes.navItem
          }
        >
          <TbUser size={24} />
          <p>PERFIL</p>
        </div>
      </button>
    </footer>
  );
}
