import { useState, useEffect } from "react";

function useWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const setWindowWidth = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", setWindowWidth);

    return () => window.removeEventListener("resize", setWindowWidth);
  }, []);
  return width;
}

export default useWidth;
