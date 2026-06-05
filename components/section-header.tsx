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
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-ember">{eyebrow}</p>
      ) : null}
      <h2 className={`mt-3 font-display text-3xl font-bold sm:text-4xl ${titleClass}`}>{title}</h2>
      {description ? <p className={`mt-4 text-sm leading-6 sm:text-base ${descriptionClass}`}>{description}</p> : null}
    </div>
  );
}
