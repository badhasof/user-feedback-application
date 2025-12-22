"use client"

import * as React from "react"
import {
  BadgeCheck,
  Bell,
  CreditCard,
  Users,
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AccountContent } from "@/components/settings/account-content"
import { BillingContent } from "@/components/settings/billing-content"
import { NotificationsContent } from "@/components/settings/notifications-content"
import { TeamContent } from "@/components/settings/team-content"

export type SettingsSection = "account" | "billing" | "notifications" | "team"

const navItems = [
  { id: "account" as const, name: "Account", icon: BadgeCheck },
  { id: "billing" as const, name: "Billing", icon: CreditCard },
  { id: "notifications" as const, name: "Notifications", icon: Bell },
  { id: "team" as const, name: "Workspace", icon: Users },
]

const sectionContent: Record<SettingsSection, React.ReactNode> = {
  account: <AccountContent />,
  billing: <BillingContent />,
  notifications: <NotificationsContent />,
  team: <TeamContent />,
}

interface SettingsDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultSection?: SettingsSection
}

export function SettingsDialog({ open, onOpenChange, defaultSection = "account" }: SettingsDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState<SettingsSection>(defaultSection)

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[800px] lg:max-w-[900px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navItems.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={item.id === activeSection}
                          onClick={() => setActiveSection(item.id)}
                        >
                          <item.icon />
                          <span>{item.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activeNavItem?.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              <div className="w-full max-w-4xl">
                {sectionContent[activeSection]}
              </div>
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
