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
            className="text-center my-16 md:my-24"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
              Welcome to IPU Friendlist
            </h1>
            <TypeAnimation
              sequence={[
                'The exclusive network for GGSIPU students.', 2500,
                'Real Connections. Anonymously.', 2500,
                'Starting at GTBIT.', 3000,
              ]}
              wrapper="p"
              speed={50}
              className="text-lg md:text-xl font-medium text-gray-300"
              repeat={Infinity}
            />
          </motion.header>

          <main className="space-y-8">
            <motion.section {...sectionVariant} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
              <p className="text-lg italic text-center text-gray-300">"Connect with real people. Have meaningful conversations. Anonymously."</p>
              <p className="text-center"><strong className="text-white">IPU Friendlist is a secure platform built exclusively for the students of GGSIPU.</strong> Our unique system guarantees both <strong className="text-white">Authenticity and Anonymity</strong>, so you can chat with a verified fellow student without revealing who you are.</p>
              <div className="bg-blue-900/50 p-4 rounded-lg text-center mt-4">
                <h2 className="text-xl font-bold text-white">Initial Launch: GTBIT Campus</h2>
                <p className="mt-2 text-blue-200">We are kicking things off with an exclusive launch for the students of **GTBIT**. If the response is great, we'll expand to include all other colleges of our university!</p>
              </div>
            </motion.section>

            <motion.section {...sectionVariant} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Getting Started: A Quick Guide</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">One-Time Registration (100% Verified)</h3>
                  <p className="text-gray-400">To ensure our community is genuine, we have a simple, one-time verification process:</p>
                  <ul className="list-disc list-inside space-y-2 pl-4 mt-2 text-gray-400">
                      <li><strong className="text-gray-200">Offline (Recommended):</strong> Find one of our team members on campus for instant, in-person verification.</li>
                      <li><strong className="text-gray-200">Online:</strong> Email <span className="text-blue-400">airaworld28@gmail.com</span> with a photo of your College ID and your details (Enrollment No, Name, Phone, Email, Gender).</li>
                  </ul>
                </div>
                <hr className="border-gray-700"/>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Simple & Secure Login</h3>
                  <p className="text-gray-400">Once registered, log in anytime with your unique Enrollment Number. An OTP will be sent to your registered email for security.</p>
                </div>
                <hr className="border-gray-700"/>
                <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Create Your Alias</h3>
                    <p className="text-gray-400"><strong className="text-yellow-400">Important:</strong> This name is permanent and cannot be changed. It's how others will see you in random chats, so choose wisely!</p>
                </div>
              </div>
            </motion.section>

            <motion.section {...sectionVariant} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">How It All Works</h2>
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