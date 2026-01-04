'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { API_ENDPOINTS } from "../../lib/config";

const LoginForm = () => {
  const router = useRouter();
  // 🧠 Step 1: State for user input
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false, // added rememberMe field
  });

  const [message, setMessage] = useState("");

  // 🔁 Step 2: Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // handle checkbox correctly
    });
  };

  // 🚀 Step 3: Submit the login form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Login successful!");

        // 🛡️ Step 4: Store token based on rememberMe
        const token = data.token; // assuming backend sends token

        if (formData.rememberMe) {
          // Persistent login - stays after closing browser
          localStorage.setItem("token", token);
          // Set cookie for middleware (expires in 7 days)
          document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
        } else {
          // Temporary login - removed when tab/browser closes
          sessionStorage.setItem("token", token);
          // Set cookie for middleware (session cookie, no max-age)
          document.cookie = `authToken=${token}; path=/; SameSite=Strict`;
        }

        console.log("User logged in:", data.user);
        try {
          // Store user ID
          if (data?.user?.id) localStorage.setItem("userId", data.user.id.toString());

          // Store user name (combine firstName and lastName if available)
          const fullName = data?.user?.firstName && data?.user?.lastName
            ? `${data.user.firstName} ${data.user.lastName}`.trim()
            : data?.user?.firstName || data?.user?.name || '';
          if (fullName) localStorage.setItem("userName", fullName);

          // Store email
          if (data?.user?.email) localStorage.setItem("userEmail", data.user.email);

          // Store profile image if available
          if (data?.user?.profileImage) localStorage.setItem("profileImage", data.user.profileImage);
        } catch { }

        // Notify other components about the login so state updates immediately
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
        window.dispatchEvent(new CustomEvent('profileUpdated'));

        router.replace('/dashboard');
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("❌ Something went wrong, please try again.");
    }
  };

  // 🌐 Step 5: Handle Google login (optional)
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential, isSignup: false }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Google login successful!");

        // Store token (Google login uses 7-day expiry, so use localStorage)
        const token = data.token;
        if (token) {
          localStorage.setItem("token", token);
          // Set cookie for middleware (Google login usually durable, so 7 days)
          // Use 'Lax' for SameSite to ensure cookie sends on navigation from external (Google)
          document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }

        // Store user info
        try {
          // Store user ID
          if (data?.user?.id) localStorage.setItem("userId", data.user.id.toString());

          // Ensure email is stored
          if (data.user && data.user.email) {
            localStorage.setItem("userEmail", data.user.email);
            console.log("Email stored:", data.user.email);
          } else {
            console.error("No email in response:", data);
          }

          // Store user name
          const fullName = data.user?.firstName && data.user?.lastName
            ? `${data.user.firstName} ${data.user.lastName}`.trim()
            : data.user?.firstName || data.user?.lastName || data.user?.email || 'User';

          if (fullName) {
            localStorage.setItem("userName", fullName);
          }

          // Store profile image if available
          if (data?.user?.profileImage) localStorage.setItem("profileImage", data.user.profileImage);
        } catch (err) {
          console.error("Error storing user data:", err);
        }

        console.log("User data:", data.user);

        // Dispatch event to update sidebar immediately
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
        window.dispatchEvent(new CustomEvent('profileUpdated'));

        // Use hard navigation to ensure cookies are sent to server/middleware
        window.location.href = '/dashboard';
      } else {
        setMessage(`❌ ${data.message}`);

        // Clear any stale data to prevent sidebar from showing logged-in state
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('profileImage');
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Google login failed.");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/50">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email */}
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
            className="w-full px-4 py-3.5 border border-neutral-200/50 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Password */}
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
            className="w-full px-4 py-3.5 border border-neutral-200/50 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Remember me & forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-neutral-700 font-medium">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded"
            />
            <span className="ml-3">Remember me</span>
          </label>

          <a href="#" className="text-sm text-blue-900 hover:text-blue-500 font-medium">
            Forgot password?
          </a>
        </div>

        {/* Submit button */}
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

      {/* Divider */}
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

        {/* Google login */}
        <div className="mt-6 flex justify-center">
          <div
            className="
      
      rounded-3xl 
      shadow-md 
      w-full
      hover:shadow-lg 
      hover:scale-[1.02] 
      transition-all 
      duration-200
      active:scale-95
    "
          >
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setMessage("⚠️ Google login failed")}
              theme="outline"       // cleaner look
              size="large"          // bigger button
              shape="pill"          // rounded
              width="100%"           // consistent width
              text="signin_with"    // "Sign in with Google"
              logo_alignment="left" // logo on left
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginForm;
