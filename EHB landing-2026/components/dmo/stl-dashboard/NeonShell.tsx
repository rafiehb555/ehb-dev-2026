"use client";

export function NeonShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#05080f]/80 shadow-[0_0_80px_rgba(8,145,178,0.12)] backdrop-blur-xl">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 120% 80% at 50% -20%, rgba(56,189,248,0.25), transparent 50%),
            radial-gradient(ellipse 90% 60% at 80% 100%, rgba(139,92,246,0.15), transparent 45%),
            radial-gradient(ellipse 70% 50% at 10% 90%, rgba(34,211,238,0.12), transparent 40%),
            linear-gradient(180deg, #020617 0%, #0a0f1a 35%, #020617 100%)
          `,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2032%2032%22%20width%3D%2232%22%20height%3D%2232%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.03)%22%2F%3E%3C%2Fsvg%3E')] opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      {children}
    </div>
  );
}
