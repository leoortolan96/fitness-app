import { createContext, useState } from "react";

const NavigationContext = createContext({
  currentIndex: 0,
  selectIndex: (value) => {},
});

export function NavigationContextProvider(props) {
  const [index, setIndex] = useState([]);

  function selectIndexHandler(value) {
    setIndex((_) => value);
  }

  const context = {
    currentIndex: index,
    selectIndex: (value) => selectIndexHandler(value),
  };

  return (
    <NavigationContext.Provider value={context}>
      {props.children}
    </NavigationContext.Provider>
  );
}

export default NavigationContext;
