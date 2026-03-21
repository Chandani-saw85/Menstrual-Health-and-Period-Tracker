import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SanitaryPadAnimation from "@/components/SanitaryPadAnimation";
import { Heart, ArrowRight, Sparkles, Shield, Calendar, Brain } from "lucide-react";

const Landing = () => {
  const [mode, setMode] = useState<"landing" | "login" | "signup">("landing");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      login(email, password);
    } else {
      signup(name, email, password);
    }
    navigate("/dashboard");
  };

  const features = [
    { icon: Calendar, title: "Cycle Tracking", desc: "Log & predict your periods accurately", color: "bg-primary/10 text-primary" },
    { icon: Brain, title: "Smart Insights", desc: "Personalized diet, exercise & wellness tips", color: "bg-secondary/20 text-secondary-foreground" },
    { icon: Shield, title: "Private & Secure", desc: "Your data stays yours, always", color: "bg-accent/10 text-accent" },
    { icon: Heart, title: "Emotional Support", desc: "Mood tracking & motivational resources", color: "bg-coral/10 text-coral" },
  ];

  if (mode !== "landing") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: "linear-gradient(135deg, hsl(340,80%,95%), hsl(270,60%,95%), hsl(200,80%,95%), hsl(340,80%,95%))",
      }}>
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-primary/10 animate-blob-morph" />
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-secondary/10 blob-2 animate-blob-morph" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-coral/10 blob-3 animate-blob-morph" style={{ animationDelay: "4s" }} />

        <div className="fun-card max-w-md w-full relative z-10 border-primary/20">
          <div className="flex justify-center mb-4">
            <SanitaryPadAnimation size="md" />
          </div>
          <h2 className="font-display text-3xl font-extrabold text-center text-foreground mb-1">
            {mode === "login" ? "Welcome Back! 🌸" : "Join Us! 💖"}
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-6">
            {mode === "login" ? "Log in to track your health" : "Create your account"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-sm font-semibold text-foreground mb-1 block">Name</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full p-3 rounded-2xl bg-muted border-2 border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="w-full p-3 rounded-2xl bg-muted border-2 border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-2xl bg-muted border-2 border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <button type="submit" className="btn-fun w-full text-base py-3.5">
              {mode === "login" ? "Log In 🌟" : "Sign Up 🎀"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-primary font-bold hover:underline"
            >
              {mode === "login" ? "Sign Up" : "Log In"}
            </button>
          </p>
          <button
            onClick={() => setMode("landing")}
            className="block mx-auto mt-3 text-xs text-muted-foreground hover:text-primary"
          >
            ← Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden relative" style={{
      background: "linear-gradient(180deg, hsl(340,80%,96%) 0%, hsl(270,60%,96%) 40%, hsl(200,70%,96%) 70%, hsl(45,90%,96%) 100%)",
    }}>
      {/* Animated background blobs */}
      <div className="absolute top-20 left-8 w-64 h-64 bg-primary/8 animate-blob-morph" />
      <div className="absolute top-40 right-12 w-48 h-48 bg-secondary/10 blob-2 animate-blob-morph" style={{ animationDelay: "3s" }} />
      <div className="absolute bottom-20 left-1/3 w-56 h-56 bg-mint/8 blob-3 animate-blob-morph" style={{ animationDelay: "5s" }} />
      <div className="absolute bottom-40 right-1/4 w-36 h-36 bg-sunflower/10 blob animate-blob-morph" style={{ animationDelay: "7s" }} />

      {/* Floating emojis */}
      <div className="absolute top-[15%] left-[8%] text-2xl animate-pad-float" style={{ animationDelay: "0s" }}>🌸</div>
      <div className="absolute top-[25%] right-[12%] text-xl animate-pad-float" style={{ animationDelay: "1s" }}>💕</div>
      <div className="absolute bottom-[30%] left-[15%] text-lg animate-pad-float" style={{ animationDelay: "2s" }}>✨</div>
      <div className="absolute bottom-[20%] right-[8%] text-2xl animate-pad-float" style={{ animationDelay: "0.5s" }}>🌺</div>

      {/* Hero */}
      <div className="relative z-10 container max-w-6xl mx-auto px-4 pt-16 pb-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">Your Health, Your Way</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-tight mb-4">
              Menstrual Health<br />
              <span className="bg-gradient-to-r from-primary via-secondary to-coral bg-clip-text text-transparent">
                & Period Tracker
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg font-body">
              Track your cycles, get personalized health insights, diet & exercise tips, and emotional support — all in one beautiful app! 🌷
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button onClick={() => setMode("signup")} className="btn-fun text-base py-4 px-8 flex items-center gap-2 justify-center">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => setMode("login")} className="btn-coral text-base py-4 px-8 justify-center">
                Log In
              </button>
            </div>
          </div>

          {/* Right - Animated Pad */}
          <div className="flex-1 flex justify-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              {/* Glow behind pad */}
              <div className="absolute inset-0 w-64 h-64 bg-gradient-to-br from-primary/20 via-secondary/20 to-coral/20 rounded-full blur-3xl" />
              <SanitaryPadAnimation size="lg" />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-20">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="fun-card text-center animate-slide-up"
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mx-auto mb-3`}>
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pb-8">
          <p className="text-sm text-muted-foreground font-body">
            Made with 💕 by Chandani Pintu Saw • Roll No: 157 • TYBSC.IT-C
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
