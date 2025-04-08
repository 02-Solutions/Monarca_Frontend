import { useAuth } from "../hooks/auth/authContext";

export const Dashboard = () => {
  const { userRole, userId } = useAuth();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Dashboard Header */}
      <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm">
            Role: {userRole}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm">
            User ID: {userId}
          </span>
        </div>
      </div>

      {/* Role-specific panels */}
      {(userRole === "n2" || userRole === "n1" || userRole === "SOI") && (
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow mb-5 border-l-4 border-blue-500">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Trips to Approve
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            This section is only visible to n2, n1, and SOI roles
          </p>
        </div>
      )}

      {userRole === "agency" && (
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow mb-5 border-l-4 border-green-500">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Trips to Book
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            This section is only visible to agency role
          </p>
        </div>
      )}

      {/* Common section visible to all roles */}
      <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow border-l-4 border-purple-500">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          My Profile
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          This section is visible to all roles
        </p>
      </div>
    </div>
  );
};
