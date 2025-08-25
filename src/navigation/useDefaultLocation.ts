import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

const locationStorageName = "lastVisitedRoute";

export const useDefaultLocation = () => {
  const browserLocation = useLocation();

  const initialLocalStorageLocation = useMemo(
    () => localStorage.getItem(locationStorageName),
    []
  );

  useEffect(() => {
    if (!browserLocation.pathname) {
      history.pushState(undefined, "", "/home");
      return;
    }

    localStorage.SetItem(locationStorageName, browserLocation.pathname);
  }, [browserLocation, initialLocalStorageLocation]);
};
