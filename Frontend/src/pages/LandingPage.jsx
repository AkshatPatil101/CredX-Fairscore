import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Sparkles, Shield, TrendingUp, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

const lightTheme = "corporate";
const darkTheme = "forest";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || darkTheme
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleToggle = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  return (
    <label className="swap swap-rotate">
      <input
        type="checkbox"
        onChange={handleToggle}
        checked={theme === darkTheme}
      />
      <svg
        className="swap-on h-6 w-6 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29l.71-.71A1,1,0,0,0,6.36,5.64l-.71.71A1,1,0,0,0,5.64,7.05ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM20,12a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V13A1,1,0,0,0,20,12ZM18.36,5.64a1,1,0,0,0-.71-.29,1,1,0,0,0-.7.29l-.71.71a1,1,0,1,0,1.41,1.41l.71-.71A1,1,0,0,0,18.36,5.64ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
      </svg>
      <svg
        className="swap-off h-6 w-6 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22a10.14,10.14,0,0,0,9.57,9.57A8.13,8.13,0,0,1,12.14,19.69Z" />
      </svg>
    </label>
  );
};

const TypingAnimation = ({ phrases }) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[currentPhraseIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < phrase.length) {
          setCurrentText(phrase.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentPhraseIndex, phrases]);

  return (
    <span className="inline-block">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-base-100/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar container mx-auto">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CredX 
            </span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal p-0 gap-2">
            <li><a className="hover:text-primary transition-colors">How It Works</a></li>
            <li><a className="hover:text-primary transition-colors">Our Platform</a></li>
            <li><a className="hover:text-primary transition-colors">About Us</a></li>
            <li><a className="hover:text-primary transition-colors">Fairness</a></li>
          </ul>
        </div>

        <div className="navbar-end gap-3">
          <ThemeToggle />
          <Link to="/dashboard" className="btn btn-primary group">
            Apply Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/dashboard" className="btn btn-ghost hidden sm:inline-flex">
            View Demo
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

const HeroSection = () => {
  return (
    <div className="relative min-h-[90vh] bg-gradient-to-br from-base-300 via-base-200 to-base-100 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="hero min-h-[90vh] relative z-10">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6 border border-primary/20">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">AI-Powered Credit Scoring</span>
              </div>
            </motion.div>

            <motion.h1
              className="mb-6 text-5xl lg:text-7xl font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Better Credit, Built on <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Fairness & Innovation
              </span>
            </motion.h1>

            <motion.div
              className="mb-8 min-h-[80px]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-xl lg:text-2xl mb-4 font-medium">
                <TypingAnimation phrases={[
                  "Fair credit score in seconds",
                  "AI-powered financial analysis",
                  "Transparent credit decisions",
                  "Your path to better credit"
                ]} />
              </p>
              <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                Our AI-powered platform helps lenders find creditworthy applicants
                and provides a transparent, fair path to credit for everyone.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/dashboard" className="btn btn-primary btn-lg gap-2 group shadow-lg shadow-primary/50">
                <Sparkles className="w-5 h-5" />
                Check Your  Fair Score
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#platform" className="btn btn-outline btn-lg gap-2">
                See Our Platform
                <Shield className="w-5 h-5" />
              </a>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="stat place-items-center bg-base-100/50 backdrop-blur rounded-lg p-4">
                <div className="stat-value text-primary">98%</div>
                <div className="stat-desc text-base-content/70">Accuracy Rate</div>
              </div>
              <div className="stat place-items-center bg-base-100/50 backdrop-blur rounded-lg p-4">
                <div className="stat-value text-secondary">2 sec</div>
                <div className="stat-desc text-base-content/70">Avg. Processing</div>
              </div>
              <div className="stat place-items-center bg-base-100/50 backdrop-blur rounded-lg p-4">
                <div className="stat-value text-accent">100%</div>
                <div className="stat-desc text-base-content/70">Transparent</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};


const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Link Your Data",
      description: "Securely connect your bank account or upload utility bills. We look at your real financial life.",
      color: "primary"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Get Your Fair Score",
      description: "Our AI analyzes your data in minutes to build a transparent score you can understand.",
      color: "secondary"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Access Credit",
      description: "Use your new score to apply for fair-rate loans from our partners.",
      color: "accent"
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-base-200 to-base-100">
      <div className="container mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6 border border-primary/20">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Simple Process</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-16">
            A Smarter, Fairer Path to Credit
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="card bg-base-200/50 backdrop-blur border border-base-300 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="card-body items-center text-center">
                  <div className={`p-4 bg-${step.color}/10 rounded-full mb-4 border border-${step.color}/20`}>
                    <div className={`text-${step.color}`}>
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{index + 1}. {step.title}</h3>
                  <p className="text-base-content/70">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-primary/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PlatformSection = () => {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Full Explainability (XAI)",
      description: "Get simple, human-readable explanations for every decision, ensuring 100% compliance.",
      gradient: "from-primary to-secondary"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Real-Time Bias Monitoring",
      description: "Our regulator-ready dashboard tracks fairness metrics across all protected groups, live.",
      gradient: "from-secondary to-accent"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Inclusive Data Models",
      description: "Go beyond traditional scores by safely incorporating alternative data like bank transactions.",
      gradient: "from-accent to-primary"
    }
  ];

  return (
    <div id="platform" className="py-24 bg-base-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
      
      <div className="container mx-auto text-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Enterprise Platform</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            A Complete Platform for <br />Responsible Lending
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto mb-16">
            Built with cutting-edge AI technology and designed with fairness at its core
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <div className="card bg-base-200 shadow-xl border border-base-300 h-full hover:shadow-2xl transition-all duration-300">
                <div className="card-body items-center text-center">
                  <div className={`p-4 bg-gradient-to-br ${feature.gradient} rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h2 className="card-title mb-4 text-xl font-semibold">{feature.title}</h2>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CallToActionSection = () => {
  return (
    <div className="relative min-h-[60vh] bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/30 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="hero min-h-[60vh] relative z-10">
        <div className="hero-content text-center">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Start Your Journey</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Join Us in Building a <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Fairer Financial Future
              </span>
            </h1>
            
            <p className="text-lg mb-8 text-base-content/70">
              See how our platform can help you grow responsibly or get the
              fair credit you deserve. Get started in seconds.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dashboard" className="btn btn-primary btn-lg gap-2 group shadow-lg shadow-primary/50">
                <Sparkles className="w-5 h-5" />
                Get Your Fair Score Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#platform" className="btn btn-outline btn-lg gap-2">
                Learn More
                <Shield className="w-5 h-5" />
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-base-content/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>100% secure & encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>2-minute setup</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="py-16 bg-base-200 border-t border-base-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FairScore AI
              </span>
            </div>
            <p className="text-sm text-base-content/70 mb-4">
              Empowering fair credit decisions through AI-powered analytics and transparent scoring.
            </p>
            <div className="flex gap-3">
              <a className="btn btn-circle btn-ghost btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="fill-current">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a className="btn btn-circle btn-ghost btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="fill-current">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <nav className="flex flex-col space-y-3">
            <h6 className="mb-2 font-bold text-base">Product</h6>
            <a className="link link-hover text-sm">How It Works</a>
            <a className="link link-hover text-sm">Apply for a Score</a>
            <a className="link link-hover text-sm">Platform Features</a>
            <a className="link link-hover text-sm">Fairness & XAI</a>
          </nav>
          
          <nav className="flex flex-col space-y-3">
            <h6 className="mb-2 font-bold text-base">Company</h6>
            <a className="link link-hover text-sm">About us</a>
            <a className="link link-hover text-sm">Careers</a>
            <a className="link link-hover text-sm">Press</a>
            <a className="link link-hover text-sm">Contact</a>
          </nav>
          
          <nav className="flex flex-col space-y-3">
            <h6 className="mb-2 font-bold text-base">Legal</h6>
            <a className="link link-hover text-sm">Terms of use</a>
            <a className="link link-hover text-sm">Privacy policy</a>
            <a className="link link-hover text-sm">Cookie policy</a>
            <a className="link link-hover text-sm">Compliance</a>
          </nav>
        </div>

        <div className="pt-8 border-t border-base-300 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-base-content/60">
            Copyright © 2025 CredX - All rights reserved
          </p>
          <div className="flex gap-4 text-sm text-base-content/60">
            <a className="link link-hover">Privacy</a>
            <a className="link link-hover">Terms</a>
            <a classNameclassName="link link-hover">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <PlatformSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;