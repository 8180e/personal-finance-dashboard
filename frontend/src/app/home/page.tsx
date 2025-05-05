import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our Website!</h1>
      <p className="text-lg mb-8">
        Explore our services and offerings by navigating through the links
        below.
      </p>
      <div className="flex space-x-4">
        <Link to="/dashboard" className="text-blue-500 hover:underline">
          Go to Dashboard
        </Link>
        <Link to="/sign-in" className="text-blue-500 hover:underline">
          Sign In
        </Link>
        <Link to="/sign-up" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
