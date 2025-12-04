import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    try {
      const response = await fetch("https://fluent-flow-k3rx.onrender.com/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ " + data.message);
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Something went wrong. Try again.");
    }

  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("https://fluent-flow-k3rx.onrender.com/api/auth/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Google signup success:", data.user);
        setMessage("✅ Google signup successful!");
        
        // Store token (Google login uses 7-day expiry, so use localStorage)
        const token = data.token;
        if (token) {
          localStorage.setItem("token", token);
        }
        
        // Store user info
        try {
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
          
          // Note: profileImage would need to be extracted from Google payload if needed
        } catch (err) {
          console.error("Error storing user data:", err);
        }
        
        // Dispatch event to update sidebar immediately
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
        
        // Redirect or refresh to update UI
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        console.error("Google signup failed:", data.message);
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Error sending token to backend:", err);
      setMessage("❌ Google signup failed");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/50">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <InputField id="firstName" label="First Name" value={formData.firstName} onChange={handleChange} />
          <InputField id="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} />
        </div>
        <InputField id="email" label="Email Address" value={formData.email} onChange={handleChange} />
        <InputField id="password" label="Password" type="password" value={formData.password} onChange={handleChange} />
        <InputField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
        >
          Create Account
        </button>
      </form>

      {message && <p className="mt-4 text-center font-medium">{message}</p>}
<div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200/60" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/80 text-neutral-500 font-medium rounded-full">
              Or continue with
            </span>
          </div>
        </div>
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
              onSuccess={handleGoogleSuccess} onError={() => setMessage("❌ Google signup failed")}
              theme="outline"       // cleaner look
              size="3-xl"          // bigger button
              shape="pill"          // rounded
              width="100%"           // consistent width
              text="signin_with"    // "Sign in with Google"
              logo_alignment="left" // logo on left
            />
          </div>
        </div>
      {/* <div className="mt-8">
        
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setMessage("❌ Google signup failed")} />
      </div> */}
    </div>
  );
};

const InputField = ({ id, label, type = "text", value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-neutral-800 mb-3">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      required
      placeholder={label}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3.5 border border-neutral-200/50 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
    />
  </div>
);

export default RegisterForm;
