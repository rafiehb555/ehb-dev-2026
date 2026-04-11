"use client";

/**
 * Hero background: subtle floating particles + connection feel.
 * GPU-friendly: transform + opacity only.
 */
export function HeroParticles() {
  const dots = [
    { left: "10%", top: "20%", delay: "0s", duration: "8s" },
    { left: "85%", top: "15%", delay: "1s", duration: "10s" },
    { left: "20%", top: "70%", delay: "2s", duration: "9s" },
    { left: "75%", top: "65%", delay: "0.5s", duration: "11s" },
    { left: "50%", top: "40%", delay: "1.5s", duration: "7s" },
    { left: "90%", top: "50%", delay: "0.8s", duration: "9s" },
    { left: "5%", top: "50%", delay: "2.2s", duration: "8s" },
    { left: "60%", top: "25%", delay: "1.2s", duration: "10s" },
    { left: "35%", top: "80%", delay: "0.3s", duration: "8s" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {dots.map((d, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#33C3FF]/30 animate-float"
          style={{
            left: d.left,
            top: d.top,
            animationDuration: d.duration,
            animationDelay: d.delay,
          }}
        />
      ))}
      {/* Subtle horizontal line accents */}
      <div
        className="absolute left-0 right-0 h-px top-1/3 bg-gradient-to-r from-transparent via-[#33C3FF]/20 to-transparent"
        style={{ transform: "translateY(-50%)" }}
      />
      <div
        className="absolute left-0 right-0 h-px top-2/3 bg-gradient-to-r from-transparent via-[#8b5cf6]/15 to-transparent"
        style={{ transform: "translateY(-50%)" }}
      />
    </div>
  );
}
