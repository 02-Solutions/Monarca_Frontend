import React, { createContext, useContext, ReactNode } from "react";

export interface ContextType {
    pageTitle: string;
    setPageTitle: (title: string) => void;
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
 


  return (
    <AppContext.Provider value={{ 
        pageTitle,
        setPageTitle
    }}>
      {children}
    </AppContext.Provider>
  );
};
