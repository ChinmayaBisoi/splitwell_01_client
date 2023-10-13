const { useEffect } = require("react");

export function useOnOutsideClick(ref, functionToRun = () => {}) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref?.current && !ref?.current?.contains(event.target)) {
        functionToRun();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, functionToRun]);
}
