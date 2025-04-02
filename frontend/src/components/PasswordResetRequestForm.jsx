import React, { useState } from "react";
import useAuthStore from "../stores/authStore";

const PasswordResetRequestForm = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [success, setSuccess] = useState("");
  const { requestPasswordReset, error, isLoading } = useAuthStore();

  function validateEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!regex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess(""); // Reset success message

    // Validate email before proceeding
    if (!validateEmail()) {
      return; // Prevent form submission if validation fails
    }

    try {
      await requestPasswordReset(email);
      setSuccess("Password reset link has been sent to your email");
      setEmail(""); // Clear the email field
    } catch (error) {
      // Error handling is done by the store
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isLoading}
              />
              {emailError && (
                <p className="mt-2 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <div className="my-2">
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
              {success && (
                <p className="mt-2 text-sm text-green-600">{success}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequestForm;
