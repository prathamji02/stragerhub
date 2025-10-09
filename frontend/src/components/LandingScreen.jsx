import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

// Animation variant for sections to fade in as they're scrolled into view
const sectionVariant = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: "easeOut" }
};

// SVG for the Calendar Icon (we'll keep it for now but it's not used in the new button)
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-3 text-yellow-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M-4.5 12h22.5" />
    </svg>
);

// Your Google Form Link
const GOOGLE_FORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLScTK6BaVEgy-RrYf7hxpOxYuEHmYpjZ5ASdkQ_U3PY19JLRVA/viewform?usp=dialog";


function LandingScreen({ setView }) {
  return (
    <div className="relative min-h-screen w-full bg-gray-900 text-white font-sans overflow-hidden">
      {/* Animated Aurora Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-[10%] left-[40%] w-[500px] h-[500px] bg-blue-500/30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-teal-500/30 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content - sits above the background */}
      <div className="relative z-10">
        <div className="container mx-auto p-6 pb-28">
          
          <motion.header 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="text-center my-12 md:my-20"
          >
            {/* Logo Image */}
            <img 
              src="/logo.png" 
              alt="IPU Friendlist Logo" 
              className="mx-auto mb-6 h-32 w-32 rounded-2xl shadow-lg border-2 border-blue-400" 
            />
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
              Welcome to IPU Friendlist
            </h1>
            <TypeAnimation
              sequence={[
                'The exclusive network for GGSIPU students.', 2500,
                'Talk to Strangers, Make them Friends.', 2500, 
                'Starting at GTBIT.', 3000,
              ]}
              wrapper="p"
              speed={50}
              className="text-lg md:text-xl font-medium text-gray-300"
              repeat={Infinity}
            />
          </motion.header>

          <main className="space-y-12">

            {/* --- UPDATED: REGISTER BUTTON SECTION --- */}
            <motion.section 
                {...sectionVariant} 
                className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-2xl shadow-lg text-center border border-green-400"
            >
                <h2 className="text-xl font-bold text-white mb-4">Ready to Connect?</h2>
                <p className="text-base text-green-100 mb-6">Join the IPU Friendlist community today!</p>
                <a 
                    href={GOOGLE_FORM_LINK} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block bg-white text-green-700 px-4 py-4 rounded-full font-bold text-xl hover:bg-green-100 transition-all transform hover:scale-105 shadow-xl"
                >
                    Register Now
                </a>
                <p className="text-sm text-green-200 mt-4">* All registrations are verified by our admin team.</p>
            </motion.section>

            <motion.section {...sectionVariant} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
              <p className="text-lg italic text-center text-gray-300">"Connect with real people. Have meaningful conversations. Anonymously."</p>
              <p className="text-center"><strong className="text-white">IPU Friendlist is a secure platform built exclusively for the students of GGSIPU.</strong> Our unique system guarantees both <strong className="text-white">Authenticity and Anonymity</strong>, so you can chat with a verified fellow student without revealing who you are.</p>
              <div className="bg-blue-900/50 p-4 rounded-lg text-center mt-4">
                <h2 className="text-xl font-bold text-white">Initial Launch: GTBIT Campus</h2>
                <p className="mt-2 text-blue-200">We are kicking things off with an exclusive launch for the students of **GTBIT**. If the response is great, we'll expand to include all other colleges of our university!</p>
              </div>
            </motion.section>

             {/* Video Section */}
            <motion.section {...sectionVariant} className="text-center">
                <h2 className="text-3xl font-bold text-white mb-6">See IPU Friendlist in Action!</h2>
                <div className="aspect-w-9 aspect-h-16 max-w-sm mx-auto bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-500/50">
                    <video 
                        src="/promo-video.mp4" 
                        className="w-full h-full"
                        autoPlay  
                        loop      
                        muted     
                        playsInline 
                        controls   
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </motion.section>

            {/* Getting Started section is now implicitly "How It Works" with new steps */}
            <motion.section {...sectionVariant} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Your Journey to Connect:</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">1. Register with Your Google Form:</h3>
                  <p className="text-gray-400">Fill out our quick and secure Google Form with your details. This is the first step to becoming a verified member of IPU Friendlist.</p>
                  <a 
                      href={GOOGLE_FORM_LINK} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block text-blue-400 hover:underline mt-2"
                  >
                      Go to Registration Form &rarr;
                  </a>
                </div>
                <hr className="border-gray-700"/>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">2. Verification by Our Admin Team:</h3>
                  <p className="text-gray-400">Our dedicated admin team will review your registration to verify your student status. This ensures a genuine and safe community for everyone.</p>
                </div>
                <hr className="border-gray-700"/>
                <div>
                    <h3 className="text-xl font-semibold text-white mb-2">3. Receive Your Welcome Email:</h3>
                    <p className="text-gray-400">Once verified, you'll receive a welcome email with your login credentials and clear instructions to get started. Your Enrollment Number will serve as both your Login ID and temporary password.</p>
                </div>
                <hr className="border-gray-700"/>
                <div>
                    <h3 className="text-xl font-semibold text-white mb-2">4. Log In and Create Your Alias:</h3>
                    <p className="text-gray-400">Use your Enrollment Number to log in. On your first successful login, you will create your unique anonymous alias (your "fake name"). This is how you'll be known in random chats, ensuring your privacy while connecting.</p>
                </div>
              </div>
            </motion.section>

            {/* Original How It All Works (now part of "Your Journey to Connect") */}
            <motion.section {...sectionVariant} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Connecting on IPU Friendlist</h2>
                <ul className="space-y-4">
                    <li><strong className="text-white">Find a Chat:</strong> Instantly and randomly connect with another online student from our campus.</li>
                    <li><strong className="text-white">Community-Powered Safety:</strong> Before you even say "hi," you'll see every user's public average rating, helping you decide if you want to start a conversation.</li>
                    <li><strong className="text-white">Rate, Review, Block, & Report:</strong> Your feedback after every chat helps us build a safe and respectful community.</li>
                    <li><strong className="text-white">Connect Request:</strong> Had a great conversation? Send a request! If they accept, your chat is saved. Since everyone is from our university, you can turn an anonymous friend into a real-life connection.</li>
                    <li><strong className="text-white">Saved Chats:</strong> Access all your saved conversations in the "Saved Chats" tab to continue the conversation anytime.</li>
                </ul>
            </motion.section>

            <motion.section {...sectionVariant} className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">A Final Word</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">This is the first test launch of IPU Friendlist at GTBIT. Your support and feedback are crucial to help us expand to the entire university. We hope you enjoy it!</p>
            </motion.section>

          </main>
        </div>

        {/* Floating Login Button */}
        <motion.div 
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/50 backdrop-blur-lg border-t border-white/10"
        >
            <button 
                onClick={() => setView('login')} 
                className="w-full max-w-md mx-auto p-4 flex justify-center items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-xl font-bold hover:opacity-90 transition-opacity transform hover:scale-105 shadow-lg shadow-blue-500/20"
            >
                Login / Get Started
            </button>
        </motion.div>
      </div>
    </div>
  );
}

export default LandingScreen;