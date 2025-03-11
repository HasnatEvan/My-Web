import { Link, useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import animationData from "../../src/assets/Lottie/Login.json";
import useAuth from "../Hooks/useAuth";
import Swal from "sweetalert2";
import { useState } from "react";
import GoogleLogin from "./GoogleLogin";

const LogIn = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // লোডিং স্টেট

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // লোডিং শুরু

        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        try {
            const user = await signIn(email, password);
            if (user) {
                Swal.fire({
                    icon: "success",
                    title: "Login Successful!",
                    text: "Welcome back to your account.",
                    showConfirmButton: false,
                    timer: 2000,
                });
                navigate("/");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Login Failed!",
                text: error.message,
            });
        } finally {
            setLoading(false); // লোডিং শেষ
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-white px-4 text-gray-900">
            <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white p-6 md:p-8">
                {/* Lottie Animation */}
                <div className="flex justify-center items-center w-full md:w-1/2 mb-6 md:mb-0">
                    <Lottie options={defaultOptions} height={300} width={300} />
                </div>

                {/* Login Form */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-center text-[#2DAA9E] mb-6">𝑳𝒐𝒈𝒊𝒏 𝑵𝒐𝒘</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#2DAA9E]"
                                placeholder="Enter your email"
                                required
                                disabled={loading} // লোডিং থাকলে ইনপুট ডিসেবল
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full px-4 py-2 mt-1 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#2DAA9E]"
                                placeholder="Enter your password"
                                required
                                disabled={loading} // লোডিং থাকলে ইনপুট ডিসেবল
                            />
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <a href="/forgot-password" className="text-sm text-[#2DAA9E] hover:underline">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-[#2DAA9E] text-white font-semibold rounded-md hover:bg-[#248C81] focus:outline-none focus:ring-2 focus:ring-[#2DAA9E] transition duration-200 flex justify-center items-center"
                            disabled={loading} // লোডিং থাকলে বাটন ডিসেবল
                        >
                            {loading ? <span className="loading loading-infinity loading-xl"></span> : "Login"}
                        </button>

                        {/* OR Divider */}
                        <div className="flex items-center my-4">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="px-2 text-gray-500 text-sm">OR</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        <div className="flex justify-center">
                            <GoogleLogin></GoogleLogin>
                        </div>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Don't have an account? <Link to="/signup" className="text-[#2DAA9E] font-semibold hover:underline">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LogIn;
