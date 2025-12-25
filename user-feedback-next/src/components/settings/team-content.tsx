"use client"

import { useState, useEffect } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Id } from "../../../convex/_generated/dataModel"
import { toast } from "sonner"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ColorPicker } from "@/components/ui/color-picker"
import { ImageUpload } from "@/components/ui/image-upload"

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

  if (!team) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-sm text-neutral-500">Loading team settings...</div>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSave()
      }}
    >
      <FieldGroup>
        {/* Workspace Name */}
        <Field orientation="responsive">
          <FieldContent>
            <FieldLabel htmlFor="team-name">Workspace Name</FieldLabel>
            <FieldDescription>The display name for your workspace</FieldDescription>
          </FieldContent>
          <Input
            id="team-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Inc"
          />
        </Field>

        <FieldSeparator />

        {/* Brand Color */}
        <Field orientation="vertical">
          <FieldContent>
            <FieldLabel>Brand Primary Color</FieldLabel>
            <FieldDescription>
              Primary brand color for your public feedback portal
            </FieldDescription>
          </FieldContent>
          <div className="mt-3">
            <ColorPicker value={brandColor} onChange={setBrandColor} />
          </div>
        </Field>

        <FieldSeparator />

        {/* Logo Upload */}
        <Field orientation="vertical">
          <FieldContent>
            <FieldLabel>Logo</FieldLabel>
            <FieldDescription>
              Your company logo displayed in the portal header (square, max 2MB)
            </FieldDescription>
          </FieldContent>
          <div className="mt-3 w-32">
            <ImageUpload
              value={team.logoUrl}
              onChange={setLogoFile}
              onRemove={handleRemoveLogo}
              aspectRatio="square"
              maxSizeMB={2}
              label="Upload logo"
            />
          </div>
        </Field>

        <FieldSeparator />

        {/* Banner Upload */}
        <Field orientation="vertical">
          <FieldContent>
            <FieldLabel>Banner Image</FieldLabel>
            <FieldDescription>
              Hero banner at the top of your portal (16:9 recommended, max 5MB)
            </FieldDescription>
          </FieldContent>
          <div className="mt-3 max-w-md">
            <ImageUpload
              value={team.bannerUrl}
              onChange={setBannerFile}
              onRemove={handleRemoveBanner}
              aspectRatio="wide"
              maxSizeMB={5}
              label="Upload banner"
            />
          </div>
        </Field>

        <FieldSeparator />

        {/* Tagline */}
        <Field orientation="responsive">
          <FieldContent>
            <FieldLabel htmlFor="tagline">Tagline</FieldLabel>
            <FieldDescription>
              Short headline shown in the portal hero section
            </FieldDescription>
          </FieldContent>
          <Input
            id="tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Help us build a better product"
            maxLength={100}
          />
        </Field>

        <FieldSeparator />

        {/* Description */}
        <Field orientation="responsive">
          <FieldContent>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <FieldDescription>
              Longer description text below the tagline
            </FieldDescription>
          </FieldContent>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Vote on existing requests or suggest a new feature. We read every piece of feedback."
            rows={3}
            maxLength={500}
          />
        </Field>

        <FieldSeparator />

        {/* Save Button */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
