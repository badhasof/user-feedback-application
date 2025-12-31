"use client"

import {
  Filter,
  Pin,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useNavigation, type QuickFilter } from "@/contexts/NavigationContext"

// Map filter names to quick filter values
const filterMap: Record<string, QuickFilter> = {
  "Most Voted": "voted",
  "Recently Added": "recent",
  "My Submissions": "mine",
}

export function NavQuickFilters({
  filters,
}: {
  filters: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()
  const { quickFilter, setQuickFilter } = useNavigation()

  const handleFilterClick = (filterName: string) => {
    const filter = filterMap[filterName]
    if (filter) {
      // Toggle filter: if already active, clear it; otherwise set it
      if (quickFilter === filter) {
        setQuickFilter(null)
      } else {
        setQuickFilter(filter)
      }
    }
  }

  const handleApplyFilter = (filterName: string) => {
    const filter = filterMap[filterName]
    if (filter) {
      setQuickFilter(filter)
      toast.success(`Applied "${filterName}" filter`)
    }
  }

  const handlePinToTop = (filterName: string) => {
    toast("Pinning filters coming soon!", { icon: "📌" })
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Quick Filters</SidebarGroupLabel>
      <SidebarMenu>
        {filters.map((item) => {
          const isActive = quickFilter === filterMap[item.name]
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                isActive={isActive}
                onClick={() => handleFilterClick(item.name)}
              >
                <item.icon />
                <span>{item.name}</span>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem onClick={() => handleApplyFilter(item.name)}>
                    <Filter className="text-muted-foreground" />
                    <span>Apply Filter</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handlePinToTop(item.name)}>
                    <Pin className="text-muted-foreground" />
                    <span>Pin to Top</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
