import type { InfoCardProps } from "./types";

export function InfoCard({
  icon,
  title,
  description,
  linkText,
  linkHref,
  external,
}: InfoCardProps) {
  return (
    <article className="flex flex-1 flex-col items-center gap-y-8">
      {icon}
      <h3 className="text-center text-feature-bold text-text-primary">{title}</h3>
      <p className="text-balance text-center text-body text-text-secondary">{description}</p>
      <a
        className="text-body text-text-secondary underline"
        href={linkHref}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {linkText}
      </a>
    </article>
  );
}
