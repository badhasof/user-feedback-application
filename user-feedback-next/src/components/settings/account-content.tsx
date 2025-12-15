"use client"

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
import { Input } from "@/components/ui/input"

export function AccountContent() {
  return (
    <form>
      <FieldSet>
        <FieldLegend>Profile</FieldLegend>
        <FieldDescription>Manage your account information.</FieldDescription>
        <FieldSeparator />
        <FieldGroup>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <FieldDescription>
                Your display name visible to team members
              </FieldDescription>
            </FieldContent>
            <Input id="name" placeholder="John Doe" required />
          </Field>
          <FieldSeparator />
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldDescription>
                Your email address for notifications and sign in
              </FieldDescription>
            </FieldContent>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              required
            />
          </Field>
          <FieldSeparator />
          <Field orientation="responsive">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
