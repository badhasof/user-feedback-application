"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Id } from "../../../convex/_generated/dataModel"
import { toast } from "sonner"
import { RotateCcw } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ColorPicker } from "@/components/ui/color-picker"
import { ImageUpload } from "@/components/ui/image-upload"
import { cn } from "@/lib/utils"

interface SettingRowProps {
  label: string
  description: string
  children: React.ReactNode
  isLast?: boolean
  orientation?: "horizontal" | "vertical"
}

function SettingRow({ label, description, children, isLast, orientation = "horizontal" }: SettingRowProps) {
  return (
    <div
      className={cn(
        "py-4",
        !isLast && "border-b border-authBorder"
      )}
    >
      <div className={cn(
        "w-full",
        orientation === "horizontal"
          ? "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          : "space-y-3"
      )}>
        <div className="flex-1">
          <span className="text-textMain font-medium">{label}</span>
          <div className="text-xs text-textMuted mt-1">{description}</div>
        </div>
        <div className={orientation === "horizontal" ? "sm:w-[260px]" : ""}>{children}</div>
      </div>
    </div>
  )
}

interface TeamContentProps {
  teamId: Id<"teams">
}

export function TeamContent({ teamId }: TeamContentProps) {
  // Fetch team data
  const team = useQuery(api.teams.getTeam, { teamId })

  // Form state
  const [name, setName] = useState("")
  const [brandColor, setBrandColor] = useState("#3B82F6")
  const [tagline, setTagline] = useState("")
  const [description, setDescription] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Mutations
  const updateTeam = useMutation(api.teams.updateTeam)
  const generateUploadUrl = useMutation(api.teams.generateTeamUploadUrl)
  const removeImage = useMutation(api.teams.removeTeamImage)

  // Initialize form with team data when loaded
  useEffect(() => {
    if (team) {
      setName(team.name)
      setBrandColor(team.brandColor || "#3B82F6")
      setTagline(team.tagline || "")
      setDescription(team.description || "")
    }
  }, [team])

  // Upload a file and return its storage ID
  const uploadFile = async (file: File): Promise<Id<"_storage">> => {
    const uploadUrl = await generateUploadUrl({ teamId })
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    })
    const { storageId } = await response.json()
    return storageId
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updates: {
        teamId: Id<"teams">
        name?: string
        brandColor?: string
        tagline?: string
        description?: string
        logoStorageId?: Id<"_storage">
        bannerStorageId?: Id<"_storage">
      } = {
        teamId,
        name,
        brandColor,
        tagline,
        description,
      }

      // Upload logo if changed
      if (logoFile) {
        updates.logoStorageId = await uploadFile(logoFile)
      }

      // Upload banner if changed
      if (bannerFile) {
        updates.bannerStorageId = await uploadFile(bannerFile)
      }

      await updateTeam(updates)

      // Clear file state after successful upload
      setLogoFile(null)
      setBannerFile(null)

      toast.success("Portal settings saved")
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveLogo = async () => {
    try {
      await removeImage({ teamId, imageType: "logo" })
      toast.success("Logo removed")
    } catch (error) {
      toast.error("Failed to remove logo")
    }
  }

  const handleRemoveBanner = async () => {
    try {
      await removeImage({ teamId, imageType: "banner" })
      toast.success("Banner removed")
    } catch (error) {
      toast.error("Failed to remove banner")
    }
  }

  const handleResetToDefaults = async () => {
    setIsSaving(true)
    try {
      // Remove images first
      if (team?.logoUrl) {
        await removeImage({ teamId, imageType: "logo" })
      }
      if (team?.bannerUrl) {
        await removeImage({ teamId, imageType: "banner" })
      }

      // Reset all customization fields to defaults
      await updateTeam({
        teamId,
        brandColor: "",
        tagline: "",
        description: "",
      })

      // Reset form state
      setBrandColor("#3B82F6")
      setTagline("")
      setDescription("")
      setLogoFile(null)
      setBannerFile(null)

      toast.success("Reset to defaults")
    } catch (error) {
      console.error("Failed to reset:", error)
      toast.error("Failed to reset to defaults")
    } finally {
      setIsSaving(false)
    }
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-sm text-textMuted">Loading workspace settings...</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <SettingRow
        label="Workspace Name"
        description="The display name for your workspace"
      >
        <Input
          id="team-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Acme Inc"
          className="bg-white/5 border-authBorder text-textMain placeholder:text-textMuted"
        />
      </SettingRow>

      <SettingRow
        label="Brand Primary Color"
        description="Primary brand color for your public feedback portal"
        orientation="vertical"
      >
        <div className="mt-2">
          <ColorPicker value={brandColor} onChange={setBrandColor} />
        </div>
      </SettingRow>

      <SettingRow
        label="Logo"
        description="Your company logo displayed in the portal header (square, max 2MB)"
        orientation="vertical"
      >
        <div className="w-32 mt-2">
          <ImageUpload
            value={team.logoUrl}
            onChange={setLogoFile}
            onRemove={handleRemoveLogo}
            aspectRatio="square"
            maxSizeMB={2}
            label="Upload logo"
          />
        </div>
      </SettingRow>

      <SettingRow
        label="Banner Image"
        description="Hero banner at the top of your portal (16:9 recommended, max 5MB)"
        orientation="vertical"
      >
        <div className="max-w-md mt-2">
          <ImageUpload
            value={team.bannerUrl}
            onChange={setBannerFile}
            onRemove={handleRemoveBanner}
            aspectRatio="wide"
            maxSizeMB={5}
            label="Upload banner"
          />
        </div>
      </SettingRow>

      <SettingRow
        label="Tagline"
        description="Short headline shown in the portal hero section"
      >
        <Input
          id="tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Help us build a better product"
          maxLength={100}
          className="bg-white/5 border-authBorder text-textMain placeholder:text-textMuted"
        />
      </SettingRow>

      <SettingRow
        label="Description"
        description="Longer description text below the tagline"
        orientation="vertical"
        isLast
      >
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Vote on existing requests or suggest a new feature. We read every piece of feedback."
          rows={3}
          maxLength={500}
          className="bg-white/5 border-authBorder text-textMain placeholder:text-textMuted mt-2"
        />
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
          disabled={isSaving}
          onClick={handleResetToDefaults}
          className="border-authBorder text-textMain hover:bg-white/5"
        >
          <RotateCcw size={16} className="mr-1.5" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}
