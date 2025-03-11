import { Link, useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import { useState, useEffect } from "react";

import animationData from "../../src/assets/Lottie/signup.json";
import { imageUpload } from "../Api/utiles";
import useAuth from "../Hooks/useAuth";
import Swal from "sweetalert2";
import axios from "axios";
import GoogleLogin from "./GoogleLogin";

const SignUp = () => {
    const { createUser, updateUserProfile } = useAuth();
    const [animationSize, setAnimationSize] = useState(350);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const updateSize = () => setAnimationSize(window.innerWidth < 768 ? 250 : 350);
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const image = form.image.files[0];
        const password = form.password.value;

        if (password.length < 6) {
            Swal.fire("Error!", "Password must be at least 6 characters!", "error");
            setLoading(false);
            return;
        }

        try {
            if (!image) {
                Swal.fire("Error!", "Please select a profile image!", "error");
                setLoading(false);
                return;
            }

            const photoUrl = await imageUpload(image);
            await createUser(email, password);
            await updateUserProfile(name, photoUrl);

            const userData = { name, email, photoUrl };
            await axios.post(`http://localhost:5000/users/${email}`, userData);

            Swal.fire("Success!", "You have successfully signed up!", "success");
            form.reset();
            navigate("/");

        } catch (error) {
            Swal.fire("Error!", "There was an error signing up. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-white px-4 md:px-8 lg:px-16 -mt-10">
            <div className="w-full max-w-6xl bg-white  p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                
                {/* Lottie Animation */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <Lottie options={defaultOptions} height={animationSize} width={animationSize} />
                </div>

                {/* Signup Form */}
                <div className="w-full md:w-1/2 max-w-lg">
                    <h2 className="text-3xl font-bold text-center text-[#2DAA9E] mb-6">𝑺𝒊𝒈𝒏 𝑼𝒑 𝑵𝒐𝒘</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" id="name" name="name" required
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-[#2DAA9E]"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="email" name="email" required
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-[#2DAA9E]"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Profile Image</label>
                            <input type="file" id="image" name="image" accept="image/*" required
                                className="w-full px-2 py-1 mt-1 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-[#2DAA9E]"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" id="password" name="password" required
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-[#2DAA9E]"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button type="submit"
                            className={`w-full py-2 px-4 font-semibold rounded-md focus:ring-2 transition duration-200 flex items-center justify-center gap-2 ${loading ? "bg-[#2DAA9E] cursor-not-allowed" : "bg-[#2DAA9E] hover:bg-[#248C81] text-white"}`}
                            disabled={loading}
                        >
                            {loading ? <span className="loading loading-infinity loading-md"></span> : "Sign Up"}
                        </button>

                        <div className="flex items-center my-4">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="px-2 text-gray-500 text-sm">OR</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        <div className="flex justify-center">
                            <GoogleLogin />
                        </div>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-2">
                        Already have an account?{" "}
                        <Link to="/login" className="text-[#2DAA9E] font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
