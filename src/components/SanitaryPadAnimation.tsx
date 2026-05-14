const SanitaryPadAnimation = ({ size = "lg" }: { size?: "sm" | "md" | "lg" }) => {
  const dims = size === "lg" ? "w-40 h-52" : size === "md" ? "w-24 h-32" : "w-14 h-18";
  const wingW = size === "lg" ? "w-10" : size === "md" ? "w-6" : "w-4";
  const wingH = size === "lg" ? "h-6" : size === "md" ? "h-4" : "h-3";

  return (
    <div className={`relative ${dims} animate-pad-float`}>
      {/* Main pad body */}
      <div className="absolute inset-0 rounded-[45%] bg-gradient-to-b from-white via-rose-50 to-rose-100 shadow-xl border-2 border-rose-200/60">
        {/* Quilted pattern lines */}
        <div className="absolute inset-4 flex flex-col justify-center gap-2 opacity-20">
          <div className="h-px bg-rose-300 rounded-full mx-3" />
          <div className="h-px bg-rose-300 rounded-full mx-5" />
          <div className="h-px bg-rose-300 rounded-full mx-3" />
          <div className="h-px bg-rose-300 rounded-full mx-5" />
          <div className="h-px bg-rose-300 rounded-full mx-3" />
        </div>

        {/* Center flow animation */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-2/5 h-2/5 overflow-hidden rounded-full">
          <div
            className="absolute inset-0 rounded-full animate-flow-wave"
            style={{
              background: "radial-gradient(ellipse, hsla(340, 80%, 60%, 0.35), hsla(340, 70%, 70%, 0.15), transparent)",
            }}
          />
          <div
            className="absolute inset-1 rounded-full animate-gentle-pulse"
            style={{
              background: "radial-gradient(circle, hsla(350, 80%, 55%, 0.25), transparent 70%)",
            }}
          />
        </div>

        {/* Subtle flower pattern */}
        <div className="absolute bottom-4 right-4 text-rose-200/40 text-lg">❀</div>
        <div className="absolute top-4 left-4 text-rose-200/40 text-sm">✿</div>
      </div>

      {/* Left wing */}
      <div className={`absolute top-1/2 -left-3 ${wingW} ${wingH} -translate-y-1/2 rotate-[-12deg]`}>
        <div className="w-full h-full rounded-full bg-gradient-to-r from-rose-100 to-rose-50 border border-rose-200/50 shadow-sm" />
      </div>

      {/* Right wing */}
      <div className={`absolute top-1/2 -right-3 ${wingW} ${wingH} -translate-y-1/2 rotate-[12deg]`}>
        <div className="w-full h-full rounded-full bg-gradient-to-l from-rose-100 to-rose-50 border border-rose-200/50 shadow-sm" />
      </div>

      {/* Sparkles around pad */}
      <div className="absolute -top-3 -right-2 text-xs animate-sparkle" style={{ animationDelay: "0s" }}>✨</div>
      <div className="absolute -bottom-2 -left-3 text-xs animate-sparkle" style={{ animationDelay: "0.5s" }}>💖</div>
      <div className="absolute top-1/4 -left-5 text-xs animate-sparkle" style={{ animationDelay: "1s" }}> </div>
      <div className="absolute top-1/3 -right-5 text-xs animate-sparkle" style={{ animationDelay: "0.7s" }}>🌸</div>

      {/* Animated drop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2">
        <div className="w-2 h-3 rounded-full animate-flow-drop" style={{
          background: "linear-gradient(180deg, hsla(340, 80%, 55%, 0.6), hsla(340, 80%, 65%, 0.3))",
          animationDelay: "0.3s",
        }} />
      </div>
      <div className="absolute top-2 left-[40%]">
        <div className="w-1.5 h-2.5 rounded-full animate-flow-drop" style={{
          background: "linear-gradient(180deg, hsla(340, 80%, 55%, 0.5), hsla(340, 80%, 65%, 0.2))",
          animationDelay: "1.2s",
        }} />
      </div>
    </div>
  );
};

export default SanitaryPadAnimation;
