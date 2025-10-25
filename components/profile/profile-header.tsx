"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useActiveAccount } from "thirdweb/react"
import { updateProfile } from "@/app/actions/profiles"
import { Pencil, Check, X } from "lucide-react"

interface ProfileHeaderProps {
  profile: {
    wallet_address: string
    display_name: string | null
    bio: string | null
    avatar_url: string | null
  }
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const account = useActiveAccount()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(profile.display_name || "")
  const [bio, setBio] = useState(profile.bio || "")
  const [isSaving, setIsSaving] = useState(false)

  const isOwnProfile = account?.address.toLowerCase() === profile.wallet_address.toLowerCase()

  const formatWalletAddress = (address: string) => {
    const cleanAddress = address.replace("@wallet.local", "")
    return `${cleanAddress.slice(0, 6)}...${cleanAddress.slice(-4)}`
  }

  const handleSave = async () => {
    if (!account) return

    setIsSaving(true)
    const result = await updateProfile(account.address, {
      display_name: displayName.trim() || null,
      bio: bio.trim() || null,
    })

    if (result.success) {
      setIsEditing(false)
    }
    setIsSaving(false)
  }

  const handleCancel = () => {
    setDisplayName(profile.display_name || "")
    setBio(profile.bio || "")
    setIsEditing(false)
  }

  return (
    <Card className="glass-card border-primary/30 p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-4 flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Display Name</label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  className="bg-slate-900/90 border-primary/50 text-white"
                  maxLength={50}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Bio</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="bg-slate-900/90 border-primary/50 text-white min-h-[100px]"
                  maxLength={500}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-neon-purple to-neon-orange"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button onClick={handleCancel} variant="outline" className="border-primary/50 bg-transparent">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold gradient-text">
                  {profile.display_name || formatWalletAddress(profile.wallet_address)}
                </h1>
                <p className="text-sm text-gray-400 font-mono">{profile.wallet_address.replace("@wallet.local", "")}</p>
              </div>

              {profile.bio && <p className="text-white leading-relaxed">{profile.bio}</p>}
            </>
          )}
        </div>

        {isOwnProfile && !isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="border-primary/50">
            <Pencil className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>
    </Card>
  )
}
