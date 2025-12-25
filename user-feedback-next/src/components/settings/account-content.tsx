"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SettingRowProps {
  label: string
  description: string
  children: React.ReactNode
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
          <div className="sm:w-[260px]">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function AccountContent() {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Implement save logic
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
  }

  return (
    <div className="w-full">
      <SettingRow
        label="Name"
        description="Your display name visible to team members"
      >
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="bg-white/5 border-authBorder text-textMain placeholder:text-textMuted"
        />
      </SettingRow>

      <SettingRow
        label="Email"
        description="Your email address for notifications and sign in"
      >
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          className="bg-white/5 border-authBorder text-textMain placeholder:text-textMuted"
        />
      </SettingRow>

      <SettingRow
        label="Password"
        description="Change your account password"
        isLast
      >
        <Button
          variant="outline"
          className="w-full sm:w-auto border-authBorder text-textMain hover:bg-white/5"
        >
          Change Password
        </Button>
      </SettingRow>

      <div className="flex gap-3 pt-6 border-t border-authBorder mt-2">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-authPrimary hover:bg-authPrimaryHover text-white"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-authBorder text-textMain hover:bg-white/5"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
