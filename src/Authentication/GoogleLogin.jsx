import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation

import axios from "axios";
import Swal from 'sweetalert2'; // Import SweetAlert2
import useAuth from "../Hooks/useAuth";

const GoogleLogin = () => {
  const { signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate(); // Initialize navigate function
  const location = useLocation(); // Initialize useLocation

  // Get the "from" path from the state (for redirection)
  const from = location.state?.from?.pathname || "/"; // Default to '/' if not available

  const handleGoogle = async () => {
    try {
      // Sign in with Google
      const result = await signInWithGoogle();

      // Destructure user info from the result
      const { displayName, email, photoURL } = result.user;

      const userData = {
        name: displayName,
        email,
        photoUrl: photoURL,
      };

      // Send the user data to the backend
      await axios.post(`http://localhost:5000/users/${email}`, userData);

      // Show success alert
      Swal.fire({
        title: 'Success!',
        text: 'You have logged in successfully.',
        icon: 'success',
        confirmButtonText: 'Okay',
      });

      // Navigate to the previous location or home page
      navigate(from, { replace: true });

    } catch (error) {
      console.error("Google login error:", error);

      // Show error alert
      Swal.fire({
        title: 'Oops!',
        text: 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  return (
    <div>
      <button
        onClick={handleGoogle}
        className="flex items-center px-17 py-3 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg hover:border-gray-400 transition duration-300 ease-in-out focus:outline-none"
      >
        <FcGoogle className="text-2xl mr-3" /> {/* Google Icon */}
        <span className="text-gray-700 font-medium">
          {loading ? "Loading..." : "Sign in with Google"}
        </span>
      </button>
    </div>
  );
};

export default GoogleLogin;
