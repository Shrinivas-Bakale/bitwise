import { Skeleton } from "@/components/ui/skeleton";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";
import { useLoadUserQuery } from "@/features/api/authApi";
import Course from "./Course";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Courses = () => {
  const { data, isLoading, isError, error } = useGetPublishedCourseQuery();
  useLoadUserQuery(); // Just check auth status without storing result

  if (isError) {
    const isUnauthorized = error?.status === 401;
    const isCorsError = error?.status === 'FETCH_ERROR' || error?.error?.includes('CORS');

    return (
      <div className="max-w-4xl mx-auto p-6 mt-10">
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-lg font-semibold mb-2">
            {isCorsError ? "CORS Error" :
              isUnauthorized ? "Authentication Required" :
                "Error Loading Courses"}
          </AlertTitle>
          <AlertDescription className="text-gray-700 dark:text-gray-300">
            {isCorsError ?
              "There's a CORS policy error. The server is expecting requests from port 5174 but you're connected from port 5173. Try running the client on port 5174 or update the server CORS configuration." :
              isUnauthorized ?
                "You need to be logged in to view courses. Please sign in to continue." :
                `Failed to load courses: ${error?.data?.message || error?.error || "Unknown error occurred"}`
            }
          </AlertDescription>
          {isUnauthorized && (
            <div className="mt-4">
              <Button asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          )}
          {isCorsError && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Technical details: CORS policy blocks requests from origin 'http://localhost:5173'. The server allows 'http://localhost:5174'.</p>
              <Button asChild variant="outline">
                <a href="http://localhost:5174" target="_blank" rel="noopener noreferrer">Try Port 5174</a>
              </Button>
            </div>
          )}
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-[#141414]">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : (
            data?.courses && data.courses.map((course, index) => <Course key={index} course={course} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;

const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};
