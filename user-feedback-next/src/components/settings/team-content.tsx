"use client"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function TeamContent() {
  return (
    <FieldGroup>
      <Field orientation="responsive">
        <FieldContent>
          <FieldLabel htmlFor="team-name">Workspace Name</FieldLabel>
          <FieldDescription>The display name for your workspace</FieldDescription>
        </FieldContent>
        <Input id="team-name" placeholder="Acme Inc" />
      </Field>

      <Field orientation="responsive">
        <FieldContent>
          <FieldLabel htmlFor="team-slug">Workspace URL</FieldLabel>
          <FieldDescription>
            Used in your public feedback page URL
          </FieldDescription>
        </FieldContent>
        <Input id="team-slug" placeholder="acme-inc" />
      </Field>

      <Field orientation="responsive">
        <FieldContent>
          <FieldLabel htmlFor="brand-color">Brand Primary Color</FieldLabel>
          <FieldDescription>
            Primary brand color for your feedback page
          </FieldDescription>
        </FieldContent>
        <Input id="brand-color" type="color" defaultValue="#000000" />
      </Field>

      <FieldSeparator />

      <Field orientation="responsive">
        <FieldContent>
          <FieldLabel htmlFor="invite-email">Invite Members</FieldLabel>
          <FieldDescription>
            Send an invitation to join your workspace
          </FieldDescription>
        </FieldContent>
        <div className="flex gap-2">
          <Input
            id="invite-email"
            type="email"
            placeholder="colleague@example.com"
          />
          <Button>Invite</Button>
        </div>
      </Field>
    </FieldGroup>
  )
}
