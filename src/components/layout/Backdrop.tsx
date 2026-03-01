export function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute -left-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.45),transparent_60%)] blur-3xl opacity-70 animate-[pulse_18s_ease-in-out_infinite]" />
      <div className="absolute -right-24 bottom-[-18rem] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,_rgba(244,114,182,0.32),transparent_65%)] blur-3xl opacity-70 animate-[pulse_24s_ease-in-out_infinite]" />
      <div className="absolute inset-x-0 top-10 h-[28rem] opacity-60 lg:top-20">
        <div className="mx-auto h-full w-[120%] max-w-6xl rotate-3 rounded-[3rem] bg-[radial-gradient(circle,_rgba(14,165,233,0.25),transparent_60%)] blur-3xl" />
      </div>
      <div
        className="absolute inset-0 opacity-35 mix-blend-screen"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(137, 180, 255, 0.25) 0%, rgba(19, 78, 194, 0) 55%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          maskImage:
            "radial-gradient(circle at center, rgba(0,0,0,0.75), transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, rgba(0,0,0,0.75), transparent 70%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </div>
  );
}
