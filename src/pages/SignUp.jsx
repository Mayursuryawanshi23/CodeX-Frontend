import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';

const SignUp = () => {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(api_base_url + "/signUp",{
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName: fullName,
        email: email,
        pwd: pwd
      })
    }).then(res => res.json()).then(data => {
      setLoading(false);
      if(data.success){
        toast.success("Account created successfully!");
        navigate("/login");
      }
      else{
        toast.error(data.msg || "Something went wrong!");
      }
    }).catch(err => {
      setLoading(false);
      toast.error("Network error. Please try again!");
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              <span className="inline-flex items-center">
                <span className="text-yellow-400">〽️</span>
                <span className="ml-0.5 font-mono tracking-tight">s Code</span>
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-slate-400">Join thousands of developers coding in the cloud with <span className="inline-flex items-center"><span className="text-yellow-400">〽️</span><span className="ml-0.5 font-mono tracking-tight">s Code</span></span></p>
          </div>

          {/* Form */}
          <form onSubmit={submitForm} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Full Name</label>
              <input
                onChange={(e) => { setFullName(e.target.value) }}
                value={fullName}
                type="text"
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
              <input
                onChange={(e) => { setEmail(e.target.value) }}
                value={email}
                type="email"
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
              <input
                onChange={(e) => { setPwd(e.target.value) }}
                value={pwd}
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900/50 text-slate-400">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="w-full py-3 border border-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800/50 transition-all text-center block"
          >
            Login Instead
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-center text-slate-500 text-sm mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SignUp;