import React from 'react';

const registerForm = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/50">
      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <InputField id="first-name" label="First Name" type="text" />
          <InputField id="last-name" label="Last Name" type="text" />
        </div>
        <InputField id="reg-email" label="Email Address" type="email" />
        <InputField id="reg-password" label="Password" type="password" />
        <InputField id="confirm-password" label="Confirm Password" type="password" />

        <label className="flex items-start text-sm text-neutral-700 font-medium">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            required
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded mt-1"
          />
          <span className="ml-3">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 underline underline-offset-2">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 underline underline-offset-2">
              Privacy Policy
            </a>
          </span>
        </label>

        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
        >
          Create Account
        </button>
      </form>

      {/* Social sign up */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200/60" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/80 text-neutral-500 font-medium rounded-full">
              Or sign up with
            </span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <SocialButton type="Google" />
          <SocialButton type="Facebook" />
        </div>
      </div>
    </div>
  );
};

const InputField = ({ id, label, type }) => (
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
      className="w-full px-4 py-3.5 border border-neutral-200/50 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
    />
  </div>
);

const SocialButton = ({ type }) => {
  const icons = {
    Google: (
            <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="currentColor"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="currentColor"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="currentColor"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="currentColor"
                        />
                      </svg>
    ),
    Facebook: (
      <svg className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
    ),
  };

  return (
    <button className="w-full inline-flex justify-center items-center py-3 px-4 border border-neutral-200/50 rounded-xl bg-white/80 backdrop-blur-sm text-sm font-medium text-neutral-600 hover:bg-white hover:shadow-md transition-all duration-200 hover:scale-105">
      {icons[type]}
      <span className="ml-2">{type}</span>
    </button>
  );
};

export default registerForm;
