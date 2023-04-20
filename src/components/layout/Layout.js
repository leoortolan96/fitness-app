import { useContext } from "react";
import LayoutContext from "../../store/layout-context";
import classes from "./Layout.module.css";
import MainNavigation from "./MainNavigation";

export default function Layout(props) {
  const layoutCtx = useContext(LayoutContext);

  return (
    <div>
      <MainNavigation />
      <main
        className={layoutCtx.isGridLayout ? classes.mainGrid : classes.mainList}
      >
        {props.children}
      </main>
    </div>
  );
}
