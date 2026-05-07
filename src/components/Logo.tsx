import logo from "@/assets/kingsley-hub-logo.png";

export function Logo({ size = 36, withText = true, tagline = false }: { size?: number; withText?: boolean; tagline?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logo}
        alt="Kingsley Hub"
        width={size}
        height={size}
        className="rounded-md object-contain shrink-0"
        style={{ width: size, height: size }}
      />
      {withText && (
        <div className="leading-tight">
          <div className="font-bold tracking-wide text-gradient-gold text-base">KINGSLEY HUB</div>
          <div className="text-[10px] text-muted-foreground font-mono">CYBERTASK<span className="text-cyber-cyan">OPS</span></div>
          {tagline && <div className="text-[10px] italic text-gold/70 mt-0.5">Get Connected…</div>}
        </div>
      )}
    </div>
  );
}
