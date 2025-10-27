import React from "react";

const Login = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4min-h-screen  relative ">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl shadow-lg overflow-hidden h-100 border-black-600">

        {/* Left Side (Form) */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-[-7px]">
          <form className="text-center space-y-4">
            <p className="text-gray-600">Please login to your account</p>
<br />
            <div className="gap-5">
              <input
                type="email"
                id="username"
                placeholder="Phone number or email address"
                className="w-80 px-4 gap-5 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
              />
              </div>
              <br />
              <div><input
                type="password"
                id="password"
                placeholder="Password"
                className="w-80 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 outline-none placeholder-normal"
              />
              </div>
            <br />
            <div className="gap-5">
              <button
                type="button"
                className="w-30 bg-blue-500 text-white py-2 rounded-md hover:bg-green-500 transition"
              >
                Log in
              </button>
              <a href="#" className=" flex-col gap-5 block text-sm text-gray-500 hover:text-green-500">
                Forgot password?
              </a>
            </div>
            <br />

            <div className="flex justify-center items-center space-x-2">
              <p className="text-gray-600">Don't have an account?</p>
              <button
                type="button"
                className="border border-green-500 text-green-500 px-4 py-1 rounded-md hover:bg-green-500 hover:text-white transition"
              >
                Create new
              </button>
            </div>
          </form>
        </div>

        {/* Right Side (Info) */}
        <div className="md:w-1/2 bg-gradient-to-r from-red-500 to-green-900 text-white flex items-center justify-center p-10">
          <div>
            <h4 className="text-2xl font-semibold mb-4">
              We are more than just a company
            </h4>
            <p className="text-sm leading-relaxed">
              Empowering members to save, access loans, and grow their 
              financial well-being through a secure and efficient SACCO platform.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Login;

