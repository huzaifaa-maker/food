type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
};

export function SectionHeader({ eyebrow, title, description, align = "left", tone = "light" }: SectionHeaderProps) {
  const titleClass = tone === "dark" ? "text-white" : "text-charcoal";
  const descriptionClass = tone === "dark" ? "text-orange-100" : "text-stone-600";

  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-ember">{eyebrow}</p>
      ) : null}
      <h2 className={`mt-3 font-display text-[clamp(1.7rem,3vw,2.6rem)] font-black leading-[1.06] ${titleClass}`}>{title}</h2>
      {description ? <p className={`mt-3 max-w-2xl text-[0.95rem] leading-7 sm:text-base ${descriptionClass}`}>{description}</p> : null}
    </div>
  );
}
