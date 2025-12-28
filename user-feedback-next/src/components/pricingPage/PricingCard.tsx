import type { PricingCardProps } from "./types";

export function PricingCard({
  title,
  badge,
  subtitle,
  price,
  priceSubtext,
  billingText,
  buttonVariant,
  buttonText = "Get started",
  features,
  showMoreLink,
  moreLink = "#comparison",
  onButtonClick,
}: PricingCardProps) {
  const isPrimary = buttonVariant === "primary";
  const cardClass = isPrimary
    ? "bg-background-secondary"
    : "border border-border-secondary bg-background-primary";

  return (
    <article className={`flex w-full flex-col gap-y-[16px] rounded-[24px] p-[24px] ${cardClass}`}>
      <header className="flex flex-col gap-y-1">
        <h2 className="flex flex-row items-center gap-[8px] text-title-3 text-text-primary">
          {title}
          {badge && (
            <div className="inline-flex items-center justify-center rounded-[8px] px-[8px] py-1 text-caption-bold bg-background-brand text-text-on-brand">
              {badge}
            </div>
          )}
        </h2>
        <h3 className="text-body text-text-secondary">{subtitle}</h3>
      </header>

      <section className="flex gap-x-[8px]">
        <h2 className="text-title-1 flex gap-x-[8px] text-text-primary">{price}</h2>
        <div className="gap-y-[2px] flex flex-col justify-center">
          <h3 className="text-caption text-text-secondary">{priceSubtext}</h3>
          <h3 className="text-caption text-text-secondary">{billingText}</h3>
        </div>
      </section>

      <button
        onClick={onButtonClick}
        className={`relative rounded-[12px] h-[44px] text-body-bold px-[16px] cursor-pointer transition-colors ease-out focus-visible:ring-4 focus-visible:ring-[hsl(var(--blue-60)/50%)] ${
          isPrimary
            ? "bg-background-inverse text-text-inverse hover:bg-background-inverse-hover active:bg-background-inverse-hover"
            : "bg-transparent text-text-primary shadow-inset-1 shadow-border-tertiary hover:bg-background-primary-hover active:bg-background-primary-hover hover:shadow-border-tertiary-hover active:shadow-border-tertiary-hover"
        }`}
      >
        <span className="flex items-center justify-center gap-x-[8px]">
          <span className="truncate">{buttonText}</span>
        </span>
      </button>

      <ul className="flex flex-col">
        {features.map((feature, idx) => (
          <li key={idx} className="text-body flex items-center gap-x-[8px] py-1 text-text-secondary">
            {feature.icon}
            {feature.text}
          </li>
        ))}
        {showMoreLink && (
          <li className="py-1">
            <a className="text-body text-text-secondary" href={moreLink}>
              ...<span className="cursor-pointer underline">and more</span>
            </a>
          </li>
        )}
      </ul>
    </article>
  );
}
