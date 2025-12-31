"use client";

import { useRouter } from "next/navigation";
import { PricingPage } from "@/components/pricingPage";
import "@/components/pricingPage/pricing.css";

export default function PricingRoute() {
  const router = useRouter();

  const handleSelectPlan = () => {
    // For now, just go to dashboard
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white">
      <PricingPage onSelectPlan={handleSelectPlan} />
    </div>
  );
}
