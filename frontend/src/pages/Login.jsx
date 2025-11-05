import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 🔐 Function to handle login
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/api/users/login/",
        { email, password }
      );

      // ✅ Save token to localStorage
      localStorage.setItem("token", response.data.token);

      // ✅ Redirect to main page
      navigate("/main");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl shadow-lg overflow-hidden h-100 border-black-600">
        {/* Left Side */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-[-7px]">
          {/* ✅ The form listens for Enter key */}
          <form
            className="text-center space-y-4"
            onSubmit={(e) => {
              e.preventDefault(); // Prevent page reload
              handleLogin(); // Trigger login on Enter
            }}
          >
            <p className="text-gray-600">Please login to your account</p>
            <br />

            {/* Email Field */}
            <div className="gap-5">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-80 px-4 gap-5 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>

            <br />

            {/* Password Field */}
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-80 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>

            <br />

            {/* ✅ Login button (Enter key also triggers this) */}
            <button
              type="submit" // important — makes Enter work
              className="w-30 bg-blue-500 text-white py-2 rounded-md hover:bg-green-500 transition cursor-pointer"
            >
              Log in
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 bg-linear-to-r from-red-500 to-green-900 text-white flex items-center justify-center p-10">
          <div>
            <h4 className="text-2xl font-semibold mb-4">
              We are more than just a company
            </h4>
            <p className="text-sm leading-relaxed">
              Empowering members to save, access loans, and grow their financial
              well-being through a secure and efficient SACCO platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
