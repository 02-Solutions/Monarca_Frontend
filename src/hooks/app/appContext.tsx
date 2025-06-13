import React, { createContext, useContext, ReactNode } from "react";

export interface ContextType {
    pageTitle: string;
    setPageTitle: (title: string) => void;
    handleVisitPage: () => void;
    tutorial: boolean;
    setTutorial: (tutorial: boolean) => void;
}


// Create the app
//  context with proper typing
export const AppContext = createContext<ContextType | undefined>(undefined);

// Custom hook to use the app context
export const useApp = (): ContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

// App provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
    const [pageTitle, setPageTitle] = React.useState<string>("Sin título");
    const [tutorial, setTutorial] = React.useState<boolean>(false);

    const handleVisitPage = () => {
        const visitedPages = JSON.parse(localStorage.getItem('visitedPages') || '[]');
        // Split the current page if it has a uuid
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
        const segments = location.pathname.split('/').filter(seg => seg !== '');
        if (segments.length === 0) return;
        if (uuidRegex.test(segments[segments.length - 1] ?? "")) {
          segments.pop();
          segments.push('id');
        }
        const cleaned = '/' + segments.join('/');
        
        // Check if the current page is already in the list
        if (!visitedPages.includes(cleaned)) {
          // Add the current page to the list
          visitedPages.push(cleaned);
          localStorage.setItem('visitedPages', JSON.stringify(visitedPages));
        }
  }

  return (
    <AppContext.Provider value={{ 
        pageTitle,
        setPageTitle,
        handleVisitPage,
        tutorial,
        setTutorial
    }}>
      {children}
    </AppContext.Provider>
  );
};
