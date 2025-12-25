"use client"

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"

interface NotificationSetting {
  id: string
  label: string
  description: string
  pushEnabled: boolean
  emailEnabled: boolean
}

const defaultNotificationSettings: NotificationSetting[] = [
  {
    id: "new-feedback",
    label: "New Feedback",
    description: "Get notified when new feedback is submitted to your team.",
    pushEnabled: true,
    emailEnabled: true,
  },
  {
    id: "feature-requests",
    label: "Feature Requests",
    description: "Get notified when feature requests are created or updated.",
    pushEnabled: false,
    emailEnabled: false,
  },
  {
    id: "status-updates",
    label: "Status Updates",
    description: "Get notified when feedback or feature request status changes.",
    pushEnabled: true,
    emailEnabled: false,
  },
  {
    id: "comments",
    label: "Comments",
    description: "Get notified when someone comments on feedback you're involved with.",
    pushEnabled: true,
    emailEnabled: true,
  },
  {
    id: "mentions",
    label: "Mentions",
    description: "Get notified when someone mentions you in a comment or feedback.",
    pushEnabled: true,
    emailEnabled: true,
  },
]

function getNotificationLabel(pushEnabled: boolean, emailEnabled: boolean): string {
  if (pushEnabled && emailEnabled) return "Push, Email"
  if (pushEnabled) return "Push"
  if (emailEnabled) return "Email"
  return "Off"
}

interface NotificationDropdownProps {
  setting: NotificationSetting
  onUpdate: (id: string, updates: Partial<NotificationSetting>) => void
}

function NotificationDropdown({ setting, onUpdate }: NotificationDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const label = getNotificationLabel(setting.pushEnabled, setting.emailEnabled)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="text-textMain border border-transparent inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-white/5 px-3 text-sm leading-none outline-none cursor-pointer hover:bg-white/10 transition-colors"
        >
          <span>{label}</span>
          <ChevronDown size={16} className="text-textMuted" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-authBackground border-authBorder p-2"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-textMain">Push notifications</span>
            <Switch
              checked={setting.pushEnabled}
              onCheckedChange={(checked) =>
                onUpdate(setting.id, { pushEnabled: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-textMain">Email notifications</span>
            <Switch
              checked={setting.emailEnabled}
              onCheckedChange={(checked) =>
                onUpdate(setting.id, { emailEnabled: checked })
              }
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function NotificationsContent() {
  const [settings, setSettings] = React.useState<NotificationSetting[]>(
    defaultNotificationSettings
  )

  const handleUpdate = (id: string, updates: Partial<NotificationSetting>) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, ...updates } : setting
      )
    )
  }

  return (
    <div className="w-full">
      {settings.map((setting, index) => (
        <div
          key={setting.id}
          className={cn(
            "flex min-h-[60px] items-center py-3",
            index !== settings.length - 1 && "border-b border-authBorder"
          )}
        >
          <div className="w-full">
            <div className="flex items-center justify-between">
              <span className="text-textMain font-medium">{setting.label}</span>
              <NotificationDropdown
                setting={setting}
                onUpdate={handleUpdate}
              />
            </div>
            <div className="text-xs text-textMuted pr-12 mt-1">
              {setting.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
