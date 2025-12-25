"use client"

import * as React from "react"
import {
  BadgeCheck,
  Bell,
  CreditCard,
  Users,
  X,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { AccountContent } from "@/components/settings/account-content"
import { BillingContent } from "@/components/settings/billing-content"
import { NotificationsContent } from "@/components/settings/notifications-content"
import { TeamContent } from "@/components/settings/team-content"
import { useTeam } from "@/contexts/TeamContext"

export type SettingsSection = "account" | "billing" | "notifications" | "team"

interface NavItem {
  id: SettingsSection
  name: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { id: "account", name: "Account", icon: BadgeCheck },
  { id: "billing", name: "Billing", icon: CreditCard },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "team", name: "Workspace", icon: Users },
]

interface SettingsDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultSection?: SettingsSection
}

export function SettingsDialog({ open, onOpenChange, defaultSection = "account" }: SettingsDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState<SettingsSection>(defaultSection)
  const { activeTeam } = useTeam()

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen

  // Update active section when defaultSection changes
  React.useEffect(() => {
    if (open) {
      setActiveSection(defaultSection)
    }
  }, [open, defaultSection])

  const activeNavItem = navItems.find(item => item.id === activeSection)

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return <AccountContent />
      case "billing":
        return <BillingContent />
      case "notifications":
        return <NotificationsContent />
      case "team":
        return activeTeam ? <TeamContent teamId={activeTeam._id} /> : null
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[600px] md:max-w-[700px] lg:max-w-[750px] rounded-2xl border-authBorder bg-authBackground">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>

        <div className="flex h-full flex-col md:flex-row md:h-[550px]">
          {/* Sidebar */}
          <div
            role="tablist"
            className="bg-black/20 flex shrink-0 flex-row flex-wrap select-none max-md:overflow-x-auto max-md:border-b max-md:border-authBorder max-md:p-1.5 md:w-[200px] md:flex-col"
          >
            {/* Close button in sidebar (desktop only) */}
            <div className="py-3 pl-2.5 max-md:hidden">
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/5 bg-transparent transition-colors"
                aria-label="Close"
              >
                <X size={20} className="text-textMuted" />
              </button>
            </div>

            {/* Tab buttons */}
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeSection === item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`group flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg mx-1.5 mb-0.5 transition-colors w-[calc(100%-12px)] text-left ${
                    activeSection === item.id
                      ? 'bg-authPrimary/15 text-authPrimary'
                      : 'text-textMuted hover:bg-white/5 hover:text-textMain'
                  }`}
                >
                  <Icon size={18} className={activeSection === item.id ? 'text-authPrimary' : ''} />
                  <span className="truncate">{item.name}</span>
                </button>
              )
            })}
          </div>

          {/* Content area */}
          <div
            role="tabpanel"
            className="relative flex w-full flex-1 flex-col overflow-y-auto text-sm max-md:max-h-[calc(100vh-150px)]"
          >
            {/* Section header */}
            <div className="sticky top-0 z-10 bg-authBackground border-b border-authBorder px-6 py-4">
              <h3 className="text-lg font-medium text-textMain">
                {activeNavItem?.name}
              </h3>
            </div>

            {/* Section content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {renderContent()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
