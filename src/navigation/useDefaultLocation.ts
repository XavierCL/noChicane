import { navigateToHomePage } from "#/app/content/families/familyNavigation";
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
    if (!browserLocation.pathname || browserLocation.pathname == "/") {
      navigateToHomePage();
      return;
    }

    localStorage.setItem(locationStorageName, browserLocation.pathname);
  }, [browserLocation, initialLocalStorageLocation]);
};
