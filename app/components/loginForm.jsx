import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Login successful!");
        console.log("User:", data.user);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("❌ Something went wrong, please try again.");
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Google login successful!");
        console.log("User:", data.user);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Google login failed.");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/50">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-neutral-800 mb-3">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3.5 border border-neutral-200/50 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-neutral-800 mb-3">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            required
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3.5 border border-neutral-200/50 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Remember me & forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-neutral-700 font-medium">
            <input
              type="checkbox"
              name="remember-me"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded"
            />
            <span className="ml-3">Remember me</span>
          </label>
          <a
            href="#"
            className="text-sm text-blue-900 hover:text-blue-500 font-medium"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
        >
          Sign In
        </button>
      </form>

      {/* API response message */}
      {message && (
        <p className="mt-4 text-center text-sm font-medium text-red-600">
          {message}
        </p>
      )}

      {/* Social Login */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200/60" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/80 text-neutral-500 font-medium rounded-full">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => setMessage("⚠️ Google login failed")}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
