import { createContext, useState } from "react";

const LayoutContext = createContext({
  isGridLayout: true,
  toggleIsGrid: (value) => {},
});

export function LayoutContextProvider(props) {
  const [isGrid, setIsGrid] = useState([]);

  function toggleIsGridHandler() {
    setIsGrid((previous) => !previous);
  }

  const context = {
    isGridLayout: isGrid,
    toggleIsGrid: (value) => toggleIsGridHandler(value),
  };

  return (
    <LayoutContext.Provider value={context}>
      {props.children}
    </LayoutContext.Provider>
  );
}

export default LayoutContext;
