"use client"

import * as React from "react"
import { Sparkles, CreditCard, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SettingRowProps {
  label: string
  description: string
  children?: React.ReactNode
  isLast?: boolean
}

function SettingRow({ label, description, children, isLast }: SettingRowProps) {
  return (
    <div
      className={cn(
        "flex min-h-[70px] items-center py-4",
        !isLast && "border-b border-authBorder"
      )}
    >
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <span className="text-textMain font-medium">{label}</span>
            <div className="text-xs text-textMuted mt-1">{description}</div>
          </div>
          {children && <div>{children}</div>}
        </div>
      </div>
    </div>
  )
}

export function BillingContent() {
  return (
    <div className="w-full">
      <SettingRow
        label="Current Plan"
        description="Basic features for small teams getting started with feedback management."
      >
        <div className="flex items-center gap-3">
          <span className="text-sm text-textMuted bg-white/5 px-3 py-1.5 rounded-lg">
            Free Plan
          </span>
          <Button className="bg-authPrimary hover:bg-authPrimaryHover text-white">
            <Sparkles size={16} className="mr-1.5" />
            Upgrade to Pro
          </Button>
        </div>
      </SettingRow>

      <SettingRow
        label="Payment Method"
        description="No payment method on file"
      >
        <Button
          variant="outline"
          className="border-authBorder text-textMain hover:bg-white/5"
        >
          <CreditCard size={16} className="mr-1.5" />
          Add Payment Method
        </Button>
      </SettingRow>

      <SettingRow
        label="Billing History"
        description="View and download your past invoices"
        isLast
      >
        <Button
          variant="outline"
          className="border-authBorder text-textMain hover:bg-white/5"
        >
          <Receipt size={16} className="mr-1.5" />
          View Invoices
        </Button>
      </SettingRow>

      {/* Empty state for invoices */}
      <div className="mt-6 p-6 rounded-lg bg-white/5 border border-authBorder text-center">
        <Receipt size={32} className="mx-auto text-textMuted mb-3" />
        <p className="text-sm text-textMuted">No invoices yet</p>
        <p className="text-xs text-textMuted mt-1">
          Invoices will appear here once you upgrade to a paid plan
        </p>
      </div>
    </div>
  )
}
