// import { useNavigate } from "react-router-dom";
import classes from "./BottomNavBar.module.css";
import { FaArrowDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import NavigationContext from "../../store/navigation-context";
import { useContext } from "react";

export default function BottomNavBar() {
  const navigationCtx = useContext(NavigationContext);
  //   const navigate = useNavigate();
  return (
    <footer className={classes.footer}>
      <button
        onClick={() => {
          console.log("0");
          navigationCtx.selectIndex(0);
        }}
      >
        <div
          className={
            navigationCtx.currentIndex === 0
              ? classes.selectedNavItem
              : classes.navItem
          }
        >
          <FaArrowLeft size={20} />
          <p>TREINOS</p>
        </div>
      </button>
      <button
        onClick={() => {
          console.log("1");
          navigationCtx.selectIndex(1);
        }}
      >
        <div
          className={
            navigationCtx.currentIndex === 1
              ? classes.selectedNavItem
              : classes.navItem
          }
        >
          <FaArrowDown size={20} />
          <p>EM ANDAMENTO</p>
        </div>
      </button>
      <button
        onClick={() => {
          console.log("2");
          navigationCtx.selectIndex(2);
        }}
      >
        <div
          className={
            navigationCtx.currentIndex === 2
              ? classes.selectedNavItem
              : classes.navItem
          }
        >
          <FaArrowRight size={20} />
          <p>HISTÓRICO</p>
        </div>
      </button>
    </footer>
  );
}
