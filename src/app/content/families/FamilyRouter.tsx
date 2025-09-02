import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FamilyPage } from "./FamilyPage";
import { useFetchFamilies } from "#/firebase/families/families";
import { FamilySelector } from "./familySelector/FamilySelector";
import { TransactionPage } from "../transactions/TransactionPage";
import { useStoreSelectedFamilyFromPath } from "./useFamilyFromPath";
import { LocationWatcher } from "./LocationWatcher";

const router = createBrowserRouter([
  {
    path: "/families",
    element: <FamilySelector />,
  },
  {
    path: "/families/:familyId",
    element: <FamilyPage />,
  },
  {
    path: "/families/:familyId/transactions",
    element: <TransactionPage />,
  },
]);

export const FamilyRouter = () => {
  useFetchFamilies();
  useStoreSelectedFamilyFromPath();

  return (
    <RouterProvider router={router}>
      <LocationWatcher />
    </RouterProvider>
  );
};
