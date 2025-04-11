// src/main.tsx (updated with permissions)

// src/pages/Dashboard.tsx
import { useAuth } from "../hooks/auth/authContext";

export const Dashboard = () => {
  const { userPermissions, userId, userName } = useAuth();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Dashboard Header */}
      <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <div className="mt-2">
          <p className="text-gray-600 dark:text-gray-400">
            Welcome, {userName} (ID: {userId})
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {userPermissions.map((permission) => (
            <span
              key={permission}
              className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm"
            >
              {permission.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      </div>

      {/* Permission-specific panels */}
      {userPermissions.includes("approve_trip") && (
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow mb-5 border-l-4 border-blue-500">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Trips to Approve
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            This section is only visible to users with the "approve_trip"
            permission
          </p>
        </div>
      )}

      {userPermissions.includes("book_trip") && (
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow mb-5 border-l-4 border-green-500">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Trips to Book
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            This section is only visible to users with the "book_trip"
            permission
          </p>
        </div>
      )}

      {/* Common section visible to all authenticated users */}
      <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow border-l-4 border-purple-500">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          My Profile
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          This section is visible to all authenticated users
        </p>
      </div>
    </div>
  );
};
