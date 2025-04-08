import { Link } from "react-router-dom";

export const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 dark:text-red-400">
            Unauthorized Access
          </h1>
          <div className="mt-4 text-gray-600 dark:text-gray-400">
            <p>You don't have permission to access this page.</p>
            <p className="mt-2">
              Please contact your administrator if you think this is an error.
            </p>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/dashboard"
            className="block w-full py-2 text-center text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/example"
            className="block w-full py-2 mt-3 text-center text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Go to Example Page
          </Link>
        </div>
      </div>
    </div>
  );
};
