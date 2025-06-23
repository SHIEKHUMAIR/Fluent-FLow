// 'use client'
// import React, { useState } from 'react'

// const Auth = () => {
//   const [activeTab, setActiveTab] = useState('login')

//   return (
//     <section
//       className="page-section  min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-[720px] mx-auto"
//       id="auth"
//     >
//       <div className="space-y-6 mx-auto">
//         <div className="text-center">
//           <div className="mb-6">
//             <div className="w-24 h-24 bg-[#1e3a8a] rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
//               <img
//                 alt=""
//                 className="w-16 h-16"
//                 src="./assets/group11.png"
//               />
//             </div>
//           </div>
//           <h2 className="text-xl sm:text-xl lg:text-4xl font-extrabold bg-blue-900 bg-clip-text text-transparent mb-4">
//             Welcome to Fluent Flow
//           </h2>
//           <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
//             Start your Mandarin learning journey
//           </p>
//         </div>
//         {/* Tab Buttons */}
//         <div>
//           <div className="bg-neutral-100/80 p-1.5 rounded-xl flex backdrop-blur-sm mb-6">
//             <button
//               className={`flex-1 py-3 px-4 text-sm font-semibold rounded_cstm transition-all duration-300 m-4 ml-0 [box-shadow:inset_0_4px_6px_-1px_rgb(0,0,0,0.1),inset_0_2px_4px_-2px_rgb(0,0,0,0.1)] ${
//                 activeTab === 'login' ? 'bg-white text-blue-900 shadow-lg' : 'text-neutral-600'
//               }`}
//               onClick={() => setActiveTab('login')}
//               type="button"
//             >
//               Sign In
//             </button>
//             <button
//               className={`flex-1 py-3 px-4 text-sm font-semibold rounded_cstm transition-all duration-300  [box-shadow:inset_0_4px_6px_-1px_rgb(0,0,0,0.1),inset_0_2px_4px_-2px_rgb(0,0,0,0.1)] m-4 mr-0 ${
//                 activeTab === 'register' ? 'bg-white text-blue-900 shadow-lg' : 'text-neutral-600'
//               }`}
//               onClick={() => setActiveTab('register')}
//               type="button"
//             >
//               Sign Up
//             </button>
//           </div>
//           {/* Login Tab */}
//           {activeTab === 'login' && (
//             <div>
//               <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/50">
//                 <form className="space-y-6">
//                   <div>
//                     <label
//                       className="block text-sm font-semibold text-neutral-800 mb-3"
//                       htmlFor="email"
//                     >
//                       Email Address
//                     </label>
//                     <input
//                       className="w-full px-4 py-3.5 border border-neutral-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
//                       id="email"
//                       name="email"
//                       placeholder="Enter your email"
//                       required
//                       type="email"
//                     />
//                   </div>
//                   <div>
//                     <label
//                       className="block text-sm font-semibold text-neutral-800 mb-3"
//                       htmlFor="password"
//                     >
//                       Password
//                     </label>
//                     <input
//                       className="w-full px-4 py-3.5 border border-neutral-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
//                       id="password"
//                       name="password"
//                       placeholder="Enter your password"
//                       required
//                       type="password"
//                     />
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <input
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded"
//                         id="remember-me"
//                         name="remember-me"
//                         type="checkbox"
//                       />
//                       <label
//                         className="ml-3 block text-sm text-neutral-700 font-medium"
//                         htmlFor="remember-me"
//                       >
//                         Remember me
//                       </label>
//                     </div>
//                     <a
//                       className="text-sm text-blue-900 hover:text-blue-500 font-medium transition-colors"
//                       href="#"
//                     >
//                       Forgot password?
//                     </a>
//                   </div>
//                   <button
//                     className="w-full bg-blue-900 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02]"
//                     type="submit"
//                   >
//                     Sign In
//                   </button>
//                 </form>
//                 <div className="mt-8">
//                   <div className="relative">
//                     <div className="absolute inset-0 flex items-center">
//                       <div className="w-full border-t border-neutral-200/60" />
//                     </div>
//                     <div className="relative flex justify-center text-sm">
//                       <span className="px-4 bg-white/80 text-neutral-500 font-medium rounded-full">
//                         Or continue with
//                       </span>
//                     </div>
//                   </div>
//                   <div className="mt-6 grid grid-cols-2 gap-4">
//                     <button className="w-full inline-flex justify-center items-center py-3 px-4 border border-neutral-200/50 rounded-xl bg-white/80 backdrop-blur-sm text-sm font-medium text-neutral-600 hover:bg-white hover:shadow-md transition-all duration-200 hover:scale-105" type="button">
//                       {/* Google SVG */}
//                       <svg
//                         className="h-5 w-5"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                           fill="currentColor"
//                         />
//                         <path
//                           d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                           fill="currentColor"
//                         />
//                         <path
//                           d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                           fill="currentColor"
//                         />
//                         <path
//                           d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                           fill="currentColor"
//                         />
//                       </svg>
//                       <span className="ml-2">
//                         Google
//                       </span>
//                     </button>
//                     <button className="w-full inline-flex justify-center items-center py-3 px-4 border border-neutral-200/50 rounded-xl bg-white/80 backdrop-blur-sm text-sm font-medium text-neutral-600 hover:bg-white hover:shadow-md transition-all duration-200 hover:scale-105" type="button">
//                       {/* Facebook SVG */}
//                       <svg
//                         className="h-5 w-5"
//                         fill="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//                       </svg>
//                       <span className="ml-2">
//                         Facebook
//                       </span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//           {/* Register Tab */}
//           {activeTab === 'register' && (
//             <div>
//               <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/50">
//                 <form className="space-y-6">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label
//                         className="block text-sm font-semibold text-neutral-800 mb-3"
//                         htmlFor="first-name"
//                       >
//                         First Name
//                       </label>
//                       <input
//                         className="w-full px-4 py-3.5 border border-neutral-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
//                         id="first-name"
//                         name="first-name"
//                         placeholder="First name"
//                         required
//                         type="text"
//                       />
//                     </div>
//                     <div>
//                       <label
//                         className="block text-sm font-semibold text-neutral-800 mb-3"
//                         htmlFor="last-name"
//                       >
//                         Last Name
//                       </label>
//                       <input
//                         className="w-full px-4 py-3.5 border border-neutral-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
//                         id="last-name"
//                         name="last-name"
//                         placeholder="Last name"
//                         required
//                         type="text"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label
//                       className="block text-sm font-semibold text-neutral-800 mb-3"
//                       htmlFor="reg-email"
//                     >
//                       Email Address
//                     </label>
//                     <input
//                       className="w-full px-4 py-3.5 border border-neutral-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
//                       id="reg-email"
//                       name="email"
//                       placeholder="Enter your email"
//                       required
//                       type="email"
//                     />
//                   </div>
//                   <div>
//                     <label
//                       className="block text-sm font-semibold text-neutral-800 mb-3"
//                       htmlFor="reg-password"
//                     >
//                       Password
//                     </label>
//                     <input
//                       className="w-full px-4 py-3.5 border border-neutral-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
//                       id="reg-password"
//                       name="password"
//                       placeholder="Create a password"
//                       required
//                       type="password"
//                     />
//                   </div>
//                   <div>
//                     <label
//                       className="block text-sm font-semibold text-neutral-800 mb-3"
//                       htmlFor="confirm-password"
//                     >
//                       Confirm Password
//                     </label>
//                     <input
//                       className="w-full px-4 py-3.5 border border-neutral-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
//                       id="confirm-password"
//                       name="confirm-password"
//                       placeholder="Confirm your password"
//                       required
//                       type="password"
//                     />
//                   </div>
//                   <div className="flex items-start">
//                     <input
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded mt-1"
//                       id="terms"
//                       name="terms"
//                       required
//                       type="checkbox"
//                     />
//                     <label
//                       className="ml-3 block text-sm text-neutral-700 font-medium"
//                       htmlFor="terms"
//                     >
//                       I agree to the{' '}
//                       <a
//                         className="text-blue-600 hover:text-blue-500 underline underline-offset-2"
//                         href="#"
//                       >
//                         Terms of Service
//                       </a>
//                       {' '}and{' '}
//                       <a
//                         className="text-blue-600 hover:text-blue-500 underline underline-offset-2"
//                         href="#"
//                       >
//                         Privacy Policy
//                       </a>
//                     </label>
//                   </div>
//                   <button
//                     className="w-full bg-blue-900 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02]"
//                     type="submit"
//                   >
//                     Create Account
//                   </button>
//                 </form>
//                 <div className="mt-8">
//                   <div className="relative">
//                     <div className="absolute inset-0 flex items-center">
//                       <div className="w-full border-t border-neutral-200/60" />
//                     </div>
//                     <div className="relative flex justify-center text-sm">
//                       <span className="px-4 bg-white/80 text-neutral-500 font-medium rounded-full">
//                         Or sign up with
//                       </span>
//                     </div>
//                   </div>
//                   <div className="mt-6 grid grid-cols-2 gap-4">
//                     <button className="w-full inline-flex justify-center items-center py-3 px-4 border border-neutral-200/50 rounded-xl bg-white/80 backdrop-blur-sm text-sm font-medium text-neutral-600 hover:bg-white hover:shadow-md transition-all duration-200 hover:scale-105" type="button">
//                       {/* Google SVG */}
//                       <svg
//                         className="h-5 w-5"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                           fill="currentColor"
//                         />
//                         <path
//                           d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                           fill="currentColor"
//                         />
//                         <path
//                           d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                           fill="currentColor"
//                         />
//                         <path
//                           d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                           fill="currentColor"
//                         />
//                       </svg>
//                       <span className="ml-2">
//                         Google
//                       </span>
//                     </button>
//                     <button className="w-full inline-flex justify-center items-center py-3 px-4 border border-neutral-200/50 rounded-xl bg-white/80 backdrop-blur-sm text-sm font-medium text-neutral-600 hover:bg-white hover:shadow-md transition-all duration-200 hover:scale-105" type="button">
//                       {/* Facebook SVG */}
//                       <svg
//                         className="h-5 w-5"
//                         fill="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//                       </svg>
//                       <span className="ml-2">
//                         Facebook
//                       </span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//         {/* ...existing code... */}
//         <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
//           <p className="text-sm text-neutral-700 font-medium mb-6">
//             Join thousands learning Mandarin with AI-powered tools
//           </p>
//           <div className="flex justify-center space-x-8 text-sm text-neutral-600">
//             <div className="flex items-center">
//               <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
//                 <svg
//                   className="h-4 w-4 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     d="M5 13l4 4L19 7"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                   />
//                 </svg>
//               </div>
//               <span className="font-medium">
//                 AI Chatbot
//               </span>
//             </div>
//             <div className="flex items-center">
//               <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
//                 <svg
//                   className="h-4 w-4 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     d="M5 13l4 4L19 7"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                   />
//                 </svg>
//               </div>
//               <span className="font-medium">
//                 AR Learning
//               </span>
//             </div>
//             <div className="flex items-center">
//               <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
//                 <svg
//                   className="h-4 w-4 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     d="M5 13l4 4L19 7"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                   />
//                 </svg>
//               </div>
//               <span className="font-medium">
//                 Gamification
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Auth
'use client'
import React, { useState } from 'react';
import LoginForm from './loginForm';
import RegisterForm from './registerForm';
const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <section
      className="page-section min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-[720px] mx-auto"
      id="auth"
    >
      <div className="space-y-6 mx-auto">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-[#1e3a8a] rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
              <img alt="Logo" className="w-16 h-16" src="./assets/group11.png" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-xl lg:text-4xl font-extrabold bg-blue-900 bg-clip-text text-transparent mb-4">
            Welcome to Fluent Flow
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Start your Mandarin learning journey
          </p>
        </div>

        {/* Toggle Tabs */}
       <div>
  <div className="bg-neutral-100/80 rounded-2xl flex backdrop-blur-md mb-6 shadow-inner ring-1 ring-white/40">
    <button
      className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 mr-2 text-sm font-semibold rounded-xl transition-all duration-300 ease-in-out ${
        activeTab === 'login'
          ? 'bg-white text-blue-900 shadow-lg ring-2 ring-blue-900'
          : 'text-gray-500 hover:text-blue-800 hover:bg-white/50'
      }`}
      onClick={() => setActiveTab('login')}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
      </svg>
      Sign In
    </button>

    <button
      className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ease-in-out ${
        activeTab === 'register'
          ? 'bg-white text-blue-900 shadow-lg ring-2 ring-blue-900'
          : 'text-gray-500 hover:text-blue-800 hover:bg-white/50'
      }`}
      onClick={() => setActiveTab('register')}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Sign Up
    </button>
  </div>

  {/* Conditional Rendering */}
  {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
</div>


        {/* Features Section */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <p className="text-sm text-neutral-700 font-medium mb-6">
            Join thousands learning Mandarin with AI-powered tools
          </p>
          <div className="flex justify-center space-x-8 text-sm text-neutral-600">
            {['AI Chatbot', 'AR Learning', 'Gamification'].map((item, i) => (
              <div className="flex items-center" key={i}>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;
