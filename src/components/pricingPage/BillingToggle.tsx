import type { BillingToggleProps } from "./types";

export function BillingToggle({
  interval,
  onToggle,
  savingsPercent = 33,
  savingsText = "on a yearly subscription",
}: BillingToggleProps) {
  const isYearly = interval === "yearly";

  return (
    <div className="flex flex-col items-center gap-[16px]">
      <div
        role="radiogroup"
        className="relative isolate w-fit select-none rounded-full bg-background-tertiary p-[4px] flex gap-[2px] h-[44px]"
      >
        <button
          type="button"
          role="radio"
          aria-checked={isYearly}
          data-state={isYearly ? "checked" : "unchecked"}
          onClick={() => onToggle("yearly")}
          className={`rounded-full flex items-center justify-center px-[12px] text-body-bold transition-colors duration-200 focus-visible:ring-4 focus-visible:ring-[hsl(var(--blue-60)/50%)] ${
            isYearly
              ? "text-text-primary bg-background-primary shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]"
              : "text-text-tertiary"
          }`}
        >
          Yearly
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={!isYearly}
          data-state={!isYearly ? "checked" : "unchecked"}
          onClick={() => onToggle("monthly")}
          className={`rounded-full flex items-center justify-center px-[12px] text-body-bold transition-colors duration-200 focus-visible:ring-4 focus-visible:ring-[hsl(var(--blue-60)/50%)] ${
            !isYearly
              ? "text-text-primary bg-background-primary shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]"
              : "text-text-tertiary"
          }`}
        >
          Monthly
        </button>
      </div>
      <p className="text-text-secondary">
        <strong className="text-body-bold text-[hsl(var(--blue-60))]">
          Save {savingsPercent}%
        </strong>{" "}
        {savingsText}
      </p>
    </div>
  );
}
