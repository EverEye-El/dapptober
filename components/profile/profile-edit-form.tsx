"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { updateUserProfile } from "@/lib/web3/auth"
import type { Profile } from "@/lib/supabase/profile"

interface ProfileEditFormProps {
  profile: Profile
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    display_name: profile.display_name || "",
    bio: profile.bio || "",
    twitter_handle: profile.twitter_handle || "",
    github_handle: profile.github_handle || "",
    website_url: profile.website_url || "",
    avatar_url: profile.avatar_url || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateUserProfile(formData)

      if (result.success) {
        router.push(`/profile/${profile.wallet_address}`)
        router.refresh()
      } else {
        alert(result.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("[v0] Profile update error:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Card className="glass-card border-primary/30 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="display_name">Display Name</Label>
          <Input
            id="display_name"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            placeholder="Your display name"
            className="bg-slate-900/90 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows={4}
            className="bg-slate-900/90 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar_url">Avatar URL</Label>
          <Input
            id="avatar_url"
            name="avatar_url"
            value={formData.avatar_url}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
            className="bg-slate-900/90 border-border"
          />
          <p className="text-xs text-muted-foreground">Leave empty to use default avatar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="twitter_handle">Twitter Handle</Label>
            <Input
              id="twitter_handle"
              name="twitter_handle"
              value={formData.twitter_handle}
              onChange={handleChange}
              placeholder="username"
              className="bg-slate-900/90 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_handle">GitHub Handle</Label>
            <Input
              id="github_handle"
              name="github_handle"
              value={formData.github_handle}
              onChange={handleChange}
              placeholder="username"
              className="bg-slate-900/90 border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website_url">Website URL</Label>
          <Input
            id="website_url"
            name="website_url"
            value={formData.website_url}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
            className="bg-slate-900/90 border-border"
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="neon-glow-orange bg-primary/80 hover:bg-primary border border-primary/50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="glass-card border-primary/30"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
