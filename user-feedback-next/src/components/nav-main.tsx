"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { toast } from "sonner"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useNavigation, type View } from "@/contexts/NavigationContext"
import { useTeam } from "@/contexts/TeamContext"

// Map nav item titles to views
const viewMap: Record<string, View> = {
  "Dashboard": "dashboard",
  "Feature Requests": "features",
  "Bug Reports": "bugs",
  "Improvements": "improvements",
  "All Feedback": "all",
  "Roadmap": "roadmap",
  "Changelog": "changelog",
}

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { activeView, setActiveView, setQuickFilter } = useNavigation()
  const { activeTeam } = useTeam()

  const handleNavClick = (title: string) => {
    // Handle special cases
    if (title === "Public Page") {
      if (activeTeam?.slug) {
        window.open(`https://${activeTeam.slug}.votivy.com`, "_blank")
      } else {
        toast.error("No team selected")
      }
      return
    }
    if (title === "Customize") {
      toast("Portal customization coming soon!", { icon: "🎨" })
      return
    }
    if (title === "Changelog") {
      toast("Changelog coming soon!", { icon: "📝" })
      return
    }

    // Handle view navigation
    const view = viewMap[title]
    if (view) {
      setActiveView(view)
      setQuickFilter(null) // Clear any active quick filter
    }
  }

  // Check if a sub-item is currently active
  const isSubItemActive = (title: string) => {
    const view = viewMap[title]
    return view === activeView
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.items && item.items.length > 0 ? (
                // Has sub-items: show collapsible
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubItemActive(subItem.title)}
                          >
                            <button
                              onClick={() => handleNavClick(subItem.title)}
                              className="w-full text-left"
                            >
                              <span>{subItem.title}</span>
                            </button>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                // No sub-items: direct navigation
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={viewMap[item.title] === activeView}
                  onClick={() => handleNavClick(item.title)}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
