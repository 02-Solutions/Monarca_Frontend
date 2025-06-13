import { useEffect } from "react";
import TravelRequestForm from "../components/travel-requests/TravelRequestForm";
import { Tutorial } from "../components/Tutorial";
import { useApp } from "../hooks/app/appContext";

function CreateTravelRequest() {
  const { handleVisitPage, tutorial, setTutorial } = useApp();


  useEffect(() => {
      // Get the visited pages from localStorage
      const visitedPages = JSON.parse(localStorage.getItem("visitedPages") || "[]");
      // Check if the current page is already in the visited pages
      const isPageVisited = visitedPages.includes(location.pathname);
  
      // If the page is not visited, set the tutorial to true
      if (!isPageVisited) {
        setTutorial(true);
      }
      // Add the current page to the visited pages
      handleVisitPage();
    }, []);

  return (
    <div>
      <Tutorial page="createRequest" run={tutorial}>

      <TravelRequestForm />
      </Tutorial>
    </div>
  );
}
export default CreateTravelRequest;
