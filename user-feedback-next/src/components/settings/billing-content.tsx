"use client"

import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"

export function BillingContent() {
  return (
    <FieldSet>
      <FieldGroup>
        <FieldLegend>Current Plan</FieldLegend>
        <Field orientation="responsive">
          <FieldContent>
            <FieldLabel>Free Plan</FieldLabel>
            <FieldDescription>
              Basic features for small teams getting started with feedback management.
            </FieldDescription>
          </FieldContent>
          <Button>
            <Sparkles />
            Upgrade to Pro
          </Button>
        </Field>
      </FieldGroup>

      <FieldSeparator />

      <FieldGroup>
        <FieldLegend>Payment Method</FieldLegend>
        <Field orientation="responsive">
          <FieldContent>
            <FieldDescription>
              No payment method on file
            </FieldDescription>
          </FieldContent>
          <Button variant="outline">Add Payment Method</Button>
        </Field>
      </FieldGroup>

      <FieldSeparator />

      <FieldGroup>
        <FieldLegend>Billing History</FieldLegend>
        <FieldDescription>
          No invoices yet
        </FieldDescription>
      </FieldGroup>
    </FieldSet>
  )
}
