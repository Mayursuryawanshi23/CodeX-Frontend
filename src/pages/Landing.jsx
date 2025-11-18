import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            <span className="inline-flex items-center">
              <span className="text-yellow-400">〽️</span>
              <span className="ml-0.5 font-mono tracking-tight">s Code</span>
            </span>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-2 text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signUp"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-block mb-6 px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded-full text-sm text-blue-300">
            ✨ The Future of Cloud Coding is Here
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Code Anywhere,
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Anytime, Instantly
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            A powerful, browser-based IDE with real-time code execution, 
            multi-language support, and secure project management. No installations needed.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap mb-20">
            <Link
              to="/signUp"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-bold text-lg transition-all hover:shadow-lg hover:shadow-blue-500/50"
            >
              Get Start 
            </Link>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border border-slate-600 hover:border-slate-400 rounded-lg font-semibold text-lg transition-colors hover:text-white text-slate-300"
            >
              Learn More
            </button>
          </div>

          {/* Hero Image: blended full image with vignette, edge-fade and 3D perspective */}
          <div className="relative w-full overflow-hidden" style={{ perspective: '1600px' }}>
            <div className="relative w-full h-80 md:h-[420px] flex items-center justify-center rounded-2xl"
              style={{
                boxShadow: '0 24px 60px rgba(2,6,23,0.7), 0 6px 20px rgba(2,6,23,0.45), 0 0 80px rgba(2,6,23,0.35), 0 12px 40px rgba(14,165,233,0.04)',
                WebkitBoxShadow: '0 24px 60px rgba(2,6,23,0.7), 0 6px 20px rgba(2,6,23,0.45), 0 0 80px rgba(2,6,23,0.35), 0 12px 40px rgba(14,165,233,0.04)'
              }}
            >
              {/* full image using <img> and allow overflow so the entire image can be seen */}
              <img
                src="/code.jpg"
                alt="Hero"
                className="absolute pointer-events-none"
                style={{
                  left: '-8%',
                  top: '-6%',
                  height: '120%',
                  width: 'auto',
                  transform: 'translateZ(0) rotateY(14deg) rotateX(-6deg) translateX(6%)',
                  transformOrigin: 'center right',
                  willChange: 'transform',
                  filter: 'contrast(1.03) saturate(1.05) brightness(0.98)',
                  borderRadius: '16px'
                }}
              />

              {/* Linear vignette overlay for subtle darkness and blending */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.12) 30%, rgba(0,0,0,0.6) 100%)', mixBlendMode: 'overlay' }} />

              {/* Radial vignette to darken corners and tuck image into background */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 10% 20%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.9) 100%)', mixBlendMode: 'multiply' }} />

              {/* Edge soft fade for left/right to hide hard corners */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 6%, rgba(0,0,0,0) 94%, rgba(0,0,0,0.95) 100%)', mixBlendMode: 'multiply' }} />

              {/* Subtle bottom shadow for depth */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-11/12 h-20 blur-3xl bg-black opacity-40 rounded-full pointer-events-none" />

              {/* Centered text overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">Modern Web-Based IDE Interface</h3>
                  <p className="text-slate-300 mt-2">Build, run and preview code — instantly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why Choose <span className="inline-flex items-center"><span className="text-yellow-400">〽️</span><span className="ml-0.5 font-mono tracking-tight">s Code</span></span>?
              </h2>
            <p className="text-slate-400 text-lg">Everything you need to code efficiently</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 hover:bg-slate-800/80 transition-all hover:shadow-lg hover:shadow-slate-900/50">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold mb-2">Browser-Based</h3>
              <p className="text-slate-400">
                No installation needed. Start coding immediately in any modern web browser.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 hover:bg-slate-800/80 transition-all hover:shadow-lg hover:shadow-slate-900/50">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Real-Time Execution</h3>
              <p className="text-slate-400">
                Run your code instantly and see results immediately without delays.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 hover:bg-slate-800/80 transition-all hover:shadow-lg hover:shadow-slate-900/50">
              <div className="text-4xl mb-4">🔤</div>
              <h3 className="text-xl font-bold mb-2">Multi-Language</h3>
              <p className="text-slate-400">
                Code in Python, JavaScript, and more with full syntax highlighting support.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 hover:bg-slate-800/80 transition-all hover:shadow-lg hover:shadow-slate-900/50">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Secure & Safe</h3>
              <p className="text-slate-400">
                Your code and data are protected with modern encryption and JWT authentication.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 hover:bg-slate-800/80 transition-all hover:shadow-lg hover:shadow-slate-900/50">
              <div className="text-4xl mb-4">☁️</div>
              <h3 className="text-xl font-bold mb-2">Cloud Storage</h3>
              <p className="text-slate-400">
                Save all your projects in the cloud and access them from any device.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 hover:bg-slate-800/80 transition-all hover:shadow-lg hover:shadow-slate-900/50">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-2">Cross-Device</h3>
              <p className="text-slate-400">
                Seamlessly work on PC, tablet, or mobile with our responsive interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why CodeX Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why Choose CodeX?
              </h2>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start">
                  <span className="text-cyan-400 font-bold mr-3">✓</span>
                  <span>Write and execute code without any setup or installation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 font-bold mr-3">✓</span>
                  <span>Support for Python, JavaScript, and more languages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 font-bold mr-3">✓</span>
                  <span>Professional code editor with syntax highlighting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 font-bold mr-3">✓</span>
                  <span>Manage multiple projects efficiently</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 font-bold mr-3">✓</span>
                  <span>Enterprise-grade security for your code</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 font-bold mr-3">✓</span>
                  <span>Access your work from anywhere, anytime</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-b from-blue-500/10 to-transparent border border-slate-700 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-500/5"></div>
              <div className="relative h-96 flex items-center justify-center">
                {/* full image from public/code2.jpg, blended into container */}
                <img
                  src="/code2.png"
                  alt="Why choose - visual"
                  className="w-full h-full object-cover rounded-lg shadow-2xl"
                  
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
               Why Choose 〽️s Code?
            </h2>
            <p className="text-slate-400 text-lg">Students, professionals, and enthusiasts</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Use Case 1 */}
            <div className="text-center">
              <div className="text-6xl mb-4">👨‍🎓</div>
              <h3 className="text-2xl font-bold mb-3">Students</h3>
              <p className="text-slate-400">
                Learn to code with instant feedback and no local setup required. Perfect for coursework and projects.
              </p>
            </div>

            {/* Use Case 2 */}
            <div className="text-center">
              <div className="text-6xl mb-4">💼</div>
              <h3 className="text-2xl font-bold mb-3">Professionals</h3>
              <p className="text-slate-400">
                Collaborate on projects, test code snippets, and manage your work from anywhere in the world.
              </p>
            </div>

            {/* Use Case 3 */}
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3">Enthusiasts</h3>
              <p className="text-slate-400">
                Experiment with different languages and frameworks without cluttering your computer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Coding?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of developers already using <span className="inline-flex items-center"><span className="text-yellow-400">〽️</span><span className="ml-0.5 font-mono tracking-tight">s Code</span></span> to write better code, faster.
          </p>
          <Link
            to="/signUp"
            className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-bold text-lg transition-all hover:shadow-lg hover:shadow-blue-500/50"
          >
            Get Start
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4 md:mb-0">
              <span className="inline-flex items-center">
                <span className="text-yellow-400">〽️</span>
                <span className="ml-0.5 font-mono tracking-tight">s Code</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2025 <span className="inline-flex items-center"><span className="text-yellow-400">〽️</span><span className="ml-0.5 font-mono tracking-tight">s Code</span></span>. Your cloud-based IDE for the modern developer.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
