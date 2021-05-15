import { useState, useEffect } from "react";

function useWidth() {
  const [width, setWidth] = useState({
    low: false,
    middle: false,
    hight: true,
  });

  const [state, setState] = useState([true, true, false]);

  useEffect(() => {
    const setWindowWidth = () => {
      if (window.innerWidth < 786 && state[0]) {
        setState([false, true, true]);
        setWidth({
          low: true,
          middle: false,
          hight: false,
        });
      } else if (
        window.innerWidth >= 786 &&
        window.innerWidth <= 1000 &&
        state[1]
      ) {
        setState([true, false, true]);
        setWidth({
          low: false,
          middle: true,
          hight: false,
        });
      } else {
        if (state[2]) {
          setState([true, true, false]);
          setWidth({
            low: false,
            middle: false,
            hight: true,
          });
        }
      }
    };

    window.addEventListener("resize", setWindowWidth);

    return () => window.removeEventListener("resize", setWindowWidth);
  }, []);
  return width;
}

export default useWidth;
