import { useContext } from "react";
import LayoutContext from "../../store/layout-context";
import MeetupItem from "./MeetupItem";
import classes from "./MeetupList.module.css";

export default function MeetupsList(props) {
const layoutCtx = useContext(LayoutContext);

  return (
    <ul className={layoutCtx.isGridLayout ? classes.grid : classes.list}>
      {props.meetups.map((meetup) => (
        <MeetupItem
          key={meetup.id}
          id={meetup.id}
          image={meetup.image}
          title={meetup.title}
          address={meetup.address}
          description={meetup.description}
        />
      ))}
    </ul>
  );
}
